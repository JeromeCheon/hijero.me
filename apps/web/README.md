# web

hijero.me의 Next.js 웹 애플리케이션입니다.

## 기술 스택

| 항목                    | 버전               |
| ----------------------- | ------------------ |
| Next.js                 | 16.1.6 (Turbopack) |
| React                   | 19                 |
| Tailwind CSS            | v4                 |
| shadcn/ui               | radix-luma         |
| TypeScript              | 5.9.3              |
| next-intl               | 4.12.0             |
| @supabase/supabase-js   | 2.105.4            |
| @notionhq/client        | 5.21.0             |
| @giscus/react           | 3.1.0              |
| @vercel/analytics       | 2.0.1              |
| rehype-pretty-code      | 0.14.3             |
| react-markdown          | 10.1.0             |
| @tailwindcss/typography | 0.5.19             |

## 실행

루트에서 실행 (권장):

```bash
pnpm dev
```

앱 단독 실행:

```bash
cd apps/web
pnpm dev
```

## 디렉토리 구조

```
apps/web/
├── app/                  # Next.js App Router
│   └── actions/          # Server Actions (incrementViewCount)
├── components/           # 앱 전용 컴포넌트
├── content/posts/{ko,en}/ # MDX 포스트
├── hooks/                # 앱 전용 훅
├── i18n/                 # next-intl 라우팅 설정
├── messages/             # UI 번역 파일 {ko,en}.json
├── scripts/              # 빌드 스크립트 (build-search-index.ts)
└── lib/
    ├── notion/           # Notion CMS 연동
    ├── supabase/         # client / server / admin / database.types.ts
    ├── posts/            # MDX 파싱 유틸
    └── resume/           # 정적 이력서 데이터 (Notion API 실패 시 fallback)
```

## UI 컴포넌트

`@workspace/ui`에서 공유 컴포넌트를 import합니다:

```tsx
import { Button } from '@workspace/ui/components/button'
```

컴포넌트 추가는 [루트 README](../../README.md)를 참고하세요.
