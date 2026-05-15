// MDX 본문에서 h2/h3 헤딩을 추출하는 유틸리티
// rehype-slug와 동일한 id 생성 규칙 사용: 소문자, 공백→하이픈, 특수문자 제거

export interface Heading {
  id: string
  text: string
  level: 2 | 3
}

/**
 * rehype-slug와 동일한 규칙으로 slug id를 생성한다.
 * - 소문자 변환
 * - 공백 → 하이픈
 * - 영숫자/한글/하이픈 이외 특수문자 제거
 */
function toSlugId(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\wㄱ-힝가-힣-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

/**
 * MDX raw content 문자열에서 ## / ### 헤딩을 추출한다.
 * frontmatter가 제거된 content를 인자로 받는다.
 */
export function extractHeadings(content: string): Heading[] {
  const headings: Heading[] = []
  // ## 또는 ### 으로 시작하는 줄 매칭 (#### 이상 제외)
  const lines = content.split('\n')

  for (const line of lines) {
    const h2Match = line.match(/^##\s+(.+)$/)
    const h3Match = line.match(/^###\s+(.+)$/)

    if (h3Match && h3Match[1]) {
      const text = h3Match[1].trim()
      headings.push({ id: toSlugId(text), text, level: 3 })
    } else if (h2Match && h2Match[1]) {
      const text = h2Match[1].trim()
      headings.push({ id: toSlugId(text), text, level: 2 })
    }
  }

  return headings
}
