# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# 전체 워크스페이스 (루트에서 실행)
pnpm dev          # 모든 앱 개발 서버 실행 (Turbo)
pnpm build        # 모든 앱 빌드
pnpm lint         # 전체 린팅
pnpm typecheck    # 전체 타입 체크
pnpm format       # Prettier 포매팅
```

## Dev 서버 실행 규칙

`pnpm dev`는 장시간 실행되는 프로세스다. Bash 도구로 실행할 때 반드시 `run_in_background: true` 파라미터를 사용한다.

- **금지**: `pnpm dev &` 또는 `pnpm dev > log 2>&1 &` (shell background — 프로세스 추적 불가)
- **필수**: Bash 도구의 `run_in_background: true` 파라미터 사용 (task ID 부여, 출력 파일로 모니터링 가능)

shadcn 컴포넌트 추가 시 `-c apps/web`을 지정해야 하지만, 실제 생성 위치는 `packages/ui/src/components/`다:

```bash
pnpm dlx shadcn@latest add <component> -c apps/web
```

## 모노레포 구조

| 패키지                                                        | 역할                        |
| ------------------------------------------------------------- | --------------------------- |
| `apps/web`                                                    | Next.js 웹 앱               |
| `packages/ui` (`@workspace/ui`)                               | 공유 UI 컴포넌트 라이브러리 |
| `packages/eslint-config` (`@workspace/eslint-config`)         | 공유 ESLint 설정            |
| `packages/typescript-config` (`@workspace/typescript-config`) | 공유 TypeScript 설정        |

Turbo가 `^build` 의존성으로 빌드 순서를 토폴로지 정렬로 결정한다. `dev` 태스크는 캐시 없이 persistent 실행된다.

## 공유 설정 매핑

| 설정 파일                                         | 사용처        |
| ------------------------------------------------- | ------------- |
| `@workspace/typescript-config/nextjs.json`        | `apps/web`    |
| `@workspace/typescript-config/react-library.json` | `packages/ui` |
| `@workspace/eslint-config/next-js`                | `apps/web`    |
| `@workspace/eslint-config/react-internal`         | `packages/ui` |

PostCSS 설정은 `packages/ui/postcss.config.mjs`에서 중앙화되며, `apps/web`은 이를 re-export한다.

## 코드 스타일

`.prettierrc` 비자명 항목:

- 세미콜론 없음 (`semi: false`)
- 싱글 따옴표 (`singleQuote: true`)
- `cn`, `cva` 함수 내 Tailwind 클래스 자동 정렬 (`prettier-plugin-tailwindcss`)

## Workspace 컨벤션

- 모든 내부 패키지는 `@workspace/` 네임스페이스 사용
- 패키지 간 참조는 `workspace:*` 프로토콜 사용
