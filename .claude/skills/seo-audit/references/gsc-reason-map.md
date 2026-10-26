# GSC 미색인 사유 매핑

`seo-audit.ts` 가 리포트에 남기는 검사 prefix 와 GSC "페이지 색인 생성" 미색인 사유 6종의 대응표.
`seo-auditor` 는 FAIL 을 분류할 때 이 문서를 단일 진실 소스로 쓴다.

## 검사 → GSC 사유

| 리포트 prefix                            | 의미                                                | GSC 사유                                | 1차 의심 파일                                      |
| ---------------------------------------- | --------------------------------------------------- | --------------------------------------- | -------------------------------------------------- |
| `[sitemap] self-canonical`               | canonical 부재 또는 자기 URL 과 불일치              | 사용자가 선택한 표준이 없는 중복 페이지 | 각 `page.tsx` 의 `generateMetadata`                |
| `[sitemap] hreflang 경로 일치`           | hreflang 이 다른 페이지(홈 등)를 가리킴             | 적절한 표준 태그가 포함된 대체 페이지   | `app/[locale]/layout.tsx` 의 `alternates`          |
| `[sitemap] Link 헤더/head hreflang 중복` | next-intl 헤더와 `<head>` 가 이중으로 hreflang 선언 | 적절한 표준 태그가 포함된 대체 페이지   | `proxy.ts`, `i18n/routing.ts` (`alternateLinks`)   |
| `[query]`                                | 쿼리 변형의 canonical 이 쿼리 없는 URL 이 아님      | 대체 페이지 / 표준 없는 중복            | `app/[locale]/{page,tech/page,life/page}.tsx`      |
| `[redirect]`                             | 접두사 없음·trailing slash 가 정규 URL 로 안 감     | 리디렉션이 포함된 페이지                | `proxy.ts`, `next.config.mjs`                      |
| `[404]`                                  | 없는 경로가 404 가 아님 (200 이면 soft 404)         | 찾을 수 없음(404) / Soft 404            | `app/[locale]/not-found.tsx`, `[...rest]/page.tsx` |
| `[sitemap] 200`                          | 사이트맵 URL 이 200 이 아님                         | 404 / 리디렉션이 포함된 페이지          | `app/sitemap.ts`, `projects/[id]/page.tsx`         |

## 스크립트로 판정할 수 없는 사유

- **크롤링됨 - 현재 색인이 생성되지 않음**: 콘텐츠 품질·내부 링크·중복 신호의 결과다. FAIL 로 단정하지 말고
  "GSC URL 검사에서 확인 필요"로 적는다.

## 해석 원칙

- `[redirect]` 가 PASS 여도 GSC 의 "리디렉션이 포함된 페이지" 건수는 0 이 되지 않는다. 정상 동작이다.
- 쿼리 변형 정책은 **canonical 통일**(noindex 아님)로 확정되어 있다.
- 로컬 실행에서는 요청 origin(`localhost`)과 canonical origin(`SITE_URL`)이 다르다.
  검사기는 사이트맵의 origin 으로 비교하므로 origin 불일치 자체는 FAIL 사유가 아니다.
