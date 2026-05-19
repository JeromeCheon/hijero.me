import { Client, isFullBlock } from '@notionhq/client'
import type { BlockObjectResponse } from '@notionhq/client/build/src/api-endpoints'

type BlockWithChildren = BlockObjectResponse & {
  _children?: BlockWithChildren[]
}

async function getAllBlockChildren(
  notion: Client,
  blockId: string
): Promise<BlockObjectResponse[]> {
  const blocks: BlockObjectResponse[] = []
  let cursor: string | undefined

  while (true) {
    const response = await notion.blocks.children.list({
      block_id: blockId,
      start_cursor: cursor,
    })

    blocks.push(...response.results.filter(isFullBlock))

    if (!response.has_more) break
    cursor = response.next_cursor ?? undefined
  }

  return blocks
}

export async function fetchBlocksRecursive(
  notion: Client,
  blockId: string
): Promise<BlockWithChildren[]> {
  const blocks = await getAllBlockChildren(notion, blockId)

  const childrenMap = new Map<string, BlockWithChildren[]>()
  const childPromises = blocks.map(async (block) => {
    if (block.type === 'synced_block') {
      const syncedFrom = block.synced_block.synced_from
      const targetId = syncedFrom !== null ? syncedFrom.block_id : block.id
      const children = await fetchBlocksRecursive(notion, targetId)
      childrenMap.set(block.id, children)
      return
    }

    if (block.has_children) {
      const children = await fetchBlocksRecursive(notion, block.id)
      childrenMap.set(block.id, children)
    }
  })

  await Promise.all(childPromises)

  return blocks.map((block): BlockWithChildren => {
    const children = childrenMap.get(block.id)
    if (children) return { ...block, _children: children }
    return block
  })
}

export function blocksToMarkdown(blocks: BlockWithChildren[]): string {
  const lines: string[] = []

  for (const block of blocks) {
    const line = blockToMarkdown(block)
    if (line) lines.push(line)

    if (block._children && block._children.length > 0) {
      const childMarkdown = blocksToMarkdown(block._children)
      if (childMarkdown) lines.push(childMarkdown)
    }
  }

  return lines.join('\n')
}

function blockToMarkdown(block: BlockObjectResponse): string {
  if (!block) return ''

  switch (block.type) {
    case 'heading_1':
      return `# ${extractText(block.heading_1)}`
    case 'heading_2':
      return `## ${extractText(block.heading_2)}`
    case 'heading_3':
      return `### ${extractText(block.heading_3)}`
    case 'paragraph':
      return extractText(block.paragraph)
    case 'bulleted_list_item':
      return `- ${extractText(block.bulleted_list_item)}`
    case 'numbered_list_item':
      return `1. ${extractText(block.numbered_list_item)}`
    case 'code': {
      const lang = block.code.language || ''
      return `\`\`\`${lang}\n${extractText(block.code)}\n\`\`\``
    }
    case 'quote':
      return `> ${extractText(block.quote)}`
    case 'divider':
      return '---'
    case 'image': {
      const imgUrl = extractMediaUrl(block.image)
      return imgUrl ? `![image](${imgUrl})` : ''
    }
    case 'toggle':
      return `<details>\n<summary>${extractText(block.toggle)}</summary>\n</details>`
    case 'callout': {
      const icon =
        block.callout.icon?.type === 'emoji' ? block.callout.icon.emoji : 'ℹ️'
      return `> **${icon}** ${extractText(block.callout)}`
    }
    case 'table_row': {
      const cells = block.table_row.cells
        .map((cell) => cell.map((rt) => rt.plain_text).join(''))
        .join(' | ')
      return `| ${cells} |`
    }
    case 'synced_block':
    case 'column_list':
    case 'column':
    case 'table':
      return ''
    default:
      return ''
  }
}

function extractText(richTextBlock: {
  rich_text: Array<{
    plain_text: string
    annotations: {
      bold: boolean
      italic: boolean
      code: boolean
      strikethrough: boolean
    }
    href: string | null
  }>
}): string {
  if (!richTextBlock?.rich_text) return ''

  return richTextBlock.rich_text
    .map((text) => {
      let content = text.plain_text || ''

      if (text.annotations) {
        if (text.annotations.code) content = `\`${content}\``
        if (text.annotations.bold) content = `**${content}**`
        if (text.annotations.italic) content = `*${content}*`
        if (text.annotations.strikethrough) content = `~~${content}~~`
      }

      if (text.href) content = `[${content}](${text.href})`

      return content
    })
    .join('')
}

function extractMediaUrl(
  block:
    | { type: 'external'; external: { url: string } }
    | { type: 'file'; file: { url: string } }
    | { type: string }
): string | null {
  if (!block) return null
  if (block.type === 'external')
    return (
      (block as { type: 'external'; external: { url: string } }).external
        ?.url || null
    )
  if (block.type === 'file')
    return (block as { type: 'file'; file: { url: string } }).file?.url || null
  return null
}
