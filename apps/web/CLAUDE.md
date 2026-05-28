# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 실행

루트에서 `pnpm dev` 실행을 권장한다. 앱 단독으로 실행하면 `@workspace/ui`가 미빌드 상태이므로 Turbo를 통해 의존성을 먼저 처리해야 한다.

## Path Aliases

| 별칭                         | 용도                           |
| ---------------------------- | ------------------------------ |
| `@/*`                        | 이 앱 전용 파일 (`apps/web/*`) |
| `@workspace/ui/components/*` | 공유 UI 컴포넌트               |
| `@workspace/ui/lib/*`        | 공유 유틸리티 (`cn` 등)        |
| `@workspace/ui/hooks/*`      | 공유 훅                        |

## 컴포넌트 배치 기준

- 재사용 가능한 UI → `packages/ui/src/components/` (shadcn CLI로 추가)
- 이 앱 전용 컴포넌트 → `apps/web/components/`
- 이 앱 전용 훅 → `apps/web/hooks/`

## UI 컴포넌트 패턴

`packages/ui` 컴포넌트는 다음 패턴을 따른다:

- **CVA**: `buttonVariants = cva(baseStyles, { variants: {...} })` — 타입 안전한 변형 스타일
- **asChild**: `asChild ? Slot.Root : 'button'` — Radix Slot으로 다형적 렌더링
- **data 속성**: `data-slot`, `data-variant`, `data-size` — CSS 타겟팅 및 디버깅용
- **클래스 병합**: `cn(buttonVariants({ variant, size, className }))` 패턴

## 테마 시스템

- `d` 키로 다크/라이트 전환 (ThemeHotkey 컴포넌트, 입력 필드에서는 무시됨)
- `html`에 `suppressHydrationWarning` — next-themes 하이드레이션 불일치 방지
- CSS 변수(`--color-*`, `--radius`)가 Tailwind 토큰으로 매핑됨 (`packages/ui/src/styles/globals.css`)

## transpilePackages

`next.config.mjs`에서 `@workspace/ui`를 `transpilePackages`에 포함시킨다. 로컬 패키지가 pre-build되지 않으므로 Next.js가 직접 트랜스파일한다.

## Notion CMS

`lib/notion/` — 상세: `lib/notion/CLAUDE.md`

## Supabase

`lib/supabase/` — 상세 (클라이언트 3종 분리, 조회수 구조): `lib/supabase/CLAUDE.md`

## SITE_URL

`lib/config/site.ts` — `NEXT_PUBLIC_SITE_URL`을 읽어 `SITE_URL` 상수로 export.
`sitemap.ts`, `robots.ts`, 각 페이지 `generateMetadata`에서 공통 참조하는 사이트 기준 URL.

## 검색 인덱스

`scripts/build-search-index.ts` — 상세 (prebuild 훅, CDN 서빙, 인덱스 스키마): `scripts/CLAUDE.md`

## i18n

`i18n/` — next-intl 설정. 번역: `messages/{ko,en}.json`. MDX: `content/posts/{ko,en}/`.

## 정적 프로젝트 데이터

`content/projects.ts` — 코드로 관리하는 정적 프로젝트 목록. `getAllProjects()` / `getProjectBySlug(id)` 유틸리티 제공.
Notion 기반 프로젝트와 슬러그가 겹치지 않도록 주의한다.

## 라우트

| 경로                          | 설명                                                 |
| ----------------------------- | ---------------------------------------------------- |
| `/[locale]/`                  | 홈 (HeroBio)                                         |
| `/[locale]/tech`              | Tech 포스트 목록                                     |
| `/[locale]/life`              | Life 포스트 목록                                     |
| `/[locale]/[category]/[slug]` | 포스트 상세                                          |
| `/[locale]/resume`            | 이력서 (ISR revalidate=1800)                         |
| `/[locale]/projects`          | 프로젝트 목록 (정적 + 직장 프로젝트)                 |
| `/[locale]/projects/[id]`     | 프로젝트 상세 (정적 슬러그 우선, 없으면 Notion UUID) |
