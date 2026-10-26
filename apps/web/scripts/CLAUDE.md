# 빌드 스크립트

## build-search-index.ts

`pnpm prebuild` 훅에 등록 — `next build` 실행 전 자동으로 실행된다.

출력: `public/search-index.ko.json`, `public/search-index.en.json`
→ CDN 직서빙, 별도 API 엔드포인트 없음.

인덱스 항목 스키마:

```ts
{
  ;(type, slug, title, description, tags, url, locale)
}
```

런타임: Command Palette(`Cmd/Ctrl+K` 또는 `/`)가 JSON을 한 번 fetch → cmdk 클라이언트 필터링.
현재 메타데이터 기준 필터링만 지원 (본문 전문 검색 미지원).

## seo-audit.ts

`pnpm --filter web check:seo [baseUrl]` — 실행 중인 서버(기본 `http://localhost:3000`, prod는 URL 지정)에 HTTP 요청을 보내 색인 신호를 검사한다.
`pnpm build:web` → `pnpm --filter web start` 후 실행하며, 빌드 훅에는 등록하지 않는다.

검사: 사이트맵 URL 전수(200 · self-canonical · hreflang), 접두사 없음/trailing slash 리다이렉트, 쿼리 변형 canonical, 없는 경로의 404 상태코드(soft 404), `/opengraph-image` 200.
출력: `.claude/_workspace/seo-report.md` (PASS/FAIL 표). FAIL이 있으면 종료코드 1.
실행 순서와 해석: `.claude/skills/seo-audit/SKILL.md`, GSC 미색인 사유 매핑: `.claude/skills/seo-audit/references/gsc-reason-map.md`.
