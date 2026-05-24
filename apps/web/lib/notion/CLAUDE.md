# Notion CMS

Notion API 연동 레이어. Resume 페이지 Project 섹션 데이터 전용.

| 파일          | 역할                                                                                     |
| ------------- | ---------------------------------------------------------------------------------------- |
| `client.ts`   | 싱글턴 클라이언트 (`getNotionClient()`)                                                  |
| `mappers.ts`  | 프로퍼티 추출기 (`extractTitle`, `extractRichText`, `extractMultiSelect`, `extractDate`) |
| `blocks.ts`   | 블록 재귀 fetch + Markdown 변환 (`fetchBlocksRecursive`, `blocksToMarkdown`)             |
| `projects.ts` | `getProjects()`, `getProjectById()` — React cache 래핑, 지수 백오프 재시도               |

`lib/resume/` — Notion API 실패 시 자동 사용되는 정적 fallback 데이터.

환경변수: `NOTION_API_KEY`, `NOTION_PORTFOLIO_DB_ID`
ISR: `/resume` 페이지 `revalidate=1800` (30분)
