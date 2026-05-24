# Supabase

조회수 카운팅 및 서버 액션용 DB 클라이언트.

## 클라이언트 선택 규칙

| 파일                | 사용 위치                       | 키                          |
| ------------------- | ------------------------------- | --------------------------- |
| `client.ts`         | `'use client'` 컴포넌트         | `NEXT_PUBLIC_*`             |
| `server.ts`         | Server Component, Route Handler | 쿠키 기반 JWT               |
| `admin.ts`          | Server Action (서비스 롤 전용)  | `SUPABASE_SERVICE_ROLE_KEY` |
| `database.types.ts` | TypeScript 타입 (자동 생성)     | —                           |

## 조회수 구조

Server Action: `app/actions/incrementViewCount.ts`
테이블: `post_views(slug, view_count, updated_at)`
중복 방지: SHA-256(IP + User-Agent + Accept-Language) 핑거프린팅, 24시간 유효.
