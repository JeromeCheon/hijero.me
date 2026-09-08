# Frontmatter 스키마

> **SYNC 대상**: `apps/web/lib/posts/types.ts` 의 `frontmatterSchema` (Zod).
> 이 문서는 사람이 읽는 미러다. 실제 검증은 빌드 타임에 `apps/web/lib/posts/getAllPosts.ts` 가
> `frontmatterSchema.safeParse(data)` 로 수행하며, 실패 시 해당 포스트를 **조용히 건너뛴다**
> (`console.warn('[getAllPosts] frontmatter 검증 실패: <file>')`). `pnpm --filter web build` 로 확인.
> `types.ts` 가 바뀌면 이 파일도 갱신할 것.

## 필드 정의

| 필드          | 타입                                             | 필수 | 제약                                                               |
| ------------- | ------------------------------------------------ | ---- | ------------------------------------------------------------------ |
| `slug`        | string                                           | ✅   | 1자 이상. **파일명(`.mdx` 제외)과 정확히 일치해야 한다.**          |
| `title`       | string                                           | ✅   | 1자 이상. 콜론/따옴표 포함 시 전체를 `'...'` 로 감쌀 것.           |
| `description` | string                                           | ✅   | 1자 이상. 1~2문장. "~담았습니다 / 공유합니다 / 정리했습니다" 톤.   |
| `category`    | `'tech'` \| `'life'`                             | ✅   | 이 스킬은 항상 `tech`.                                             |
| `tags`        | string[]                                         | ❌   | 기본값 `[]`. 3~5개 권장. 고유명사 기술명은 원표기 유지(`Next.js`). |
| `publishedAt` | string                                           | ✅   | `YYYY-MM-DD` 로 시작. **작은따옴표로 감쌀 것** (`'2026-08-31'`).   |
| `featured`    | boolean                                          | ❌   | 생략 시 미노출. 시리즈 본편이 아니면 보통 `false`.                 |
| `series`      | `{ title: string, slug: string, order: number }` | ❌   | 연작일 때만. 단발 포스트는 생략.                                   |

## 예시 — series 있음 (`ko/custom-website-journey-001.mdx`)

```yaml
---
slug: custom-website-journey-001
title: 나만의 웹사이트 구축기 1. 개발 계기와 구현 방향
description: Next.js App router v16+, shadcn UI, tailwindcss v4, Supabase 기반의 웹사이트를 만들어 나가는 여정기, 그 첫번째 기록입니다.
category: tech
tags:
  - Next.js
  - Supabase
publishedAt: '2026-05-16'
featured: true
series:
  slug: custom-website-journey
  title: 나만의 웹사이트 구축기
  order: 1
---
```

## 예시 — series 없음 (`ko/cloudflare-domain-vercel.mdx`)

```yaml
---
slug: cloudflare-domain-vercel
title: Cloudflare로 도메인 구매하고 Vercel에 연동하기
description: GoDaddy, 가비아, Cloudflare 세 가지 도메인 호스팅 서비스를 비교하고 Cloudflare를 선택한 이유, 그리고 hijero.me 도메인 구매부터 Vercel 연동 완료까지의 전 과정을 담았습니다.
category: tech
tags:
  - Cloudflare
  - Vercel
  - Domain
publishedAt: '2026-05-23'
featured: false
---
```

## 검증 체크리스트 (style-reviewer 용)

- [ ] `slug` == 파일명(`<slug>.mdx`)
- [ ] `title` / `description` 비어있지 않음
- [ ] `category: tech`
- [ ] `publishedAt` 이 `'YYYY-MM-DD'` 형식이고 작은따옴표로 감싸짐
- [ ] `tags` 3~5개, 배열 표기(`- item`)
- [ ] `series` 를 넣었다면 `title`/`slug`/`order` 3개 키가 모두 있음
- [ ] frontmatter 블록이 `---` 로 열고 닫힘, YAML 파싱 가능
- [ ] 본문에 배포 URL 하드코딩 시 `https://hijero.me/ko/tech/<slug>` 형식 준수
