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
