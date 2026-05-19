import { Client } from '@notionhq/client'

let notionInstance: Client | null = null

export function getNotionClient(): Client {
  if (!notionInstance) {
    notionInstance = new Client({ auth: process.env.NOTION_API_KEY })
  }
  return notionInstance
}
