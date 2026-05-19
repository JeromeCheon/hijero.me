# hijero.me

hijero.me 웹사이트를 위한 Next.js 모노레포입니다.

## 구조

```
.
├── apps/
│   └── web               # Next.js 웹 애플리케이션
└── packages/
    ├── ui                # 공유 UI 컴포넌트 (@workspace/ui)
    ├── eslint-config     # 공유 ESLint 설정 (@workspace/eslint-config)
    └── typescript-config # 공유 TypeScript 설정 (@workspace/typescript-config)
```

## 요구사항

- Node.js >= 20
- pnpm 9.15.9

## 시작하기

```bash
pnpm install
pnpm dev
```

## 스크립트

| 명령어           | 설명                   |
| ---------------- | ---------------------- |
| `pnpm dev`       | 모든 앱 개발 서버 실행 |
| `pnpm build`     | 모든 앱 빌드           |
| `pnpm lint`      | 전체 린팅              |
| `pnpm format`    | Prettier 포매팅        |
| `pnpm typecheck` | TypeScript 타입 체크   |

## UI 컴포넌트 추가

```bash
pnpm dlx shadcn@latest add <component> -c apps/web
```

`packages/ui/src/components/`에 컴포넌트가 추가됩니다.

```tsx
import { Button } from '@workspace/ui/components/button'
```

## 주요 기능

- **블로그 (tech / life)** — MDX 기반 포스트, Giscus 댓글, 조회수 카운터
- **이력서 (`/resume`)** — Notion CMS 연동 프로젝트 카드, 클릭 시 상세 페이지 (`/projects/[id]`)
- **다국어 (i18n)** — next-intl 기반 한국어 / 영어 지원
- **다크/라이트 테마** — `d` 키 단축키, next-themes

## 패키지

- **[apps/web](./apps/web/README.md)** — Next.js 웹 애플리케이션
- **@workspace/ui** — shadcn/ui 기반 공유 컴포넌트 라이브러리
- **@workspace/eslint-config** — 공유 ESLint 설정 (base, next-js, react-internal)
- **@workspace/typescript-config** — 공유 TypeScript 설정 (base, nextjs, react-library)
