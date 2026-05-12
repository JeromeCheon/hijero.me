# web

hijero.me의 Next.js 웹 애플리케이션입니다.

## 기술 스택

| 항목         | 버전               |
| ------------ | ------------------ |
| Next.js      | 16.1.6 (Turbopack) |
| React        | 19                 |
| Tailwind CSS | v4                 |
| shadcn/ui    | radix-luma         |
| TypeScript   | 5.9.3              |

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
├── app/          # Next.js App Router (layout, page)
├── components/   # 앱 전용 컴포넌트
├── hooks/        # 앱 전용 훅
└── lib/          # 유틸리티
```

## UI 컴포넌트

`@workspace/ui`에서 공유 컴포넌트를 import합니다:

```tsx
import { Button } from "@workspace/ui/components/button"
```

컴포넌트 추가는 [루트 README](../../README.md)를 참고하세요.
