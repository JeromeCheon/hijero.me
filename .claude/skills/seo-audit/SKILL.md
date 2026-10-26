---
name: seo-audit
description: hijero.me 의 색인 신호(canonical, hreflang, 리디렉션, 404/soft 404, 쿼리 변형)를 `pnpm --filter web check:seo` 로 검사하고, FAIL 을 seo-auditor 에이전트가 GSC 미색인 사유 6종에 매핑해 최소 수정 지시서(_workspace/seo-fix-plan.md)로 만든다. 대상은 로컬(빌드 후 서버 기동) 또는 prod URL. "SEO 점검", "색인 문제 확인", "check:seo 돌려줘", "배포 전 SEO 검사", "GSC 미색인 원인", "prod SEO 재검사" 같은 요청이나 라우트·메타데이터·sitemap·proxy.ts 수정 직후에 사용. 코드 수정 자체는 대상 아님(수정은 사용자 확인 후 별도 진행).
allowed-tools: Bash, Read, Write, Glob, Grep, AskUserQuestion, Agent
---

# SEO Audit Orchestrator

실행 중인 서버에 HTTP 요청을 보내는 결정론적 검사기(`apps/web/scripts/seo-audit.ts`)를 돌리고,
FAIL 이 있으면 `seo-auditor` 가 원인과 최소 수정을 지시서로 만든다. 판정은 스크립트가, 해석은 에이전트가 한다.

- 경로: 모든 경로는 저장소 루트(`/Users/jaehongcheon/Documents/hijero.me/`) 기준.
- **`cd` 금지**: Bash 에서 작업 디렉터리를 옮기지 않는다. 절대경로, `pnpm --filter web`, `git -C` 를 쓴다.
  (`.claude/settings.json` 훅이 루트 상대경로라 cwd 가 옮겨지면 동작하지 않는다.)
- 커밋하지 않는다 (커밋은 사용자가 직접).
- 서버 기동은 `run_in_background: true` 로만 한다 (`&` 금지).
- **이 스킬은 코드를 수정하지 않는다.** FAIL 수정은 지시서를 근거로 사용자 확인 후 별도 진행한다.

## 참고 자산

| 파일                                                    | 역할                                                     |
| ------------------------------------------------------- | -------------------------------------------------------- |
| `apps/web/scripts/seo-audit.ts`                         | 검사기 (`pnpm --filter web check:seo [baseUrl]`)         |
| `.claude/skills/seo-audit/references/gsc-reason-map.md` | 검사 prefix → GSC 사유 → 의심 파일 매핑 (단일 진실 소스) |
| `.claude/agents/seo/seo-auditor.md`                     | FAIL 해석 에이전트 정의 (sonnet)                         |
| `.claude/agent-memory/seo-auditor/MEMORY.md`            | 세션 간 누적 교정                                        |
| `.claude/_workspace/seo-{report.md,fix-plan.md}`        | 실행 중 중간 산출물                                      |

## Workflow

### Phase 0: 입력 파싱

#### 0-1. 대상 결정

- **대상**: 프롬프트에 URL 이 있으면 그 URL, `prod` 면 `https://hijero.me`, 없으면 `local`(`http://localhost:3000`).
- `local` 이면 서버 준비(Phase 1)가 필요하다. URL/`prod` 면 Phase 1 을 건너뛴다.

#### 0-2. 게이트 A (local 만)

```
AskUserQuestion(questions: [{
  question: "로컬 검사를 위해 빌드 후 서버를 기동할까요?",
  header: "Server",
  multiSelect: false,
  options: [
    { label: "빌드·기동", description: "pnpm build:web 후 pnpm --filter web start 를 백그라운드로 실행합니다." },
    { label: "이미 기동됨", description: "localhost:3000 에서 서버가 떠 있습니다. 바로 검사합니다." },
    { label: "취소", description: "중단합니다." }
  ]
}])
```

### Phase 1: 서버 준비 (local 만)

1. `pnpm build:web` (장시간 — `run_in_background: true` 권장).
2. `pnpm --filter web start` 를 `run_in_background: true` 로 실행하고, `curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/ko` 로 200 을 확인한다.
3. 기동한 서버의 task ID 를 기억해 Phase 5 에서 종료한다.

### Phase 2: 검사 실행

```bash
pnpm --filter web check:seo [baseUrl]
```

- 종료코드 0 = 전체 PASS, 1 = FAIL 존재(정상 동작). 결과는 `.claude/_workspace/seo-report.md` 에 기록된다.
- 리포트가 생성되지 않았으면 에러 핸들링 표를 따른다.

### Phase 3: seo-auditor 호출 (FAIL 이 있을 때만)

```
Agent(
  subagent_type: seo-auditor,   # 미등록 환경이면 general-purpose
  model: "sonnet",
  description: "seo-auditor 호출",
  prompt: """당신은 seo-auditor입니다.
1. .claude/agents/seo/seo-auditor.md 의 규칙을 그대로 따릅니다.
2. 정의된 순서대로 gsc-reason-map.md → .claude/_workspace/seo-report.md → MEMORY 를 읽습니다.
3. FAIL 을 GSC 사유별로 분류하고 원인 파일을 직접 확인해
   .claude/_workspace/seo-fix-plan.md 에 정의된 형식으로 저장합니다. 코드는 수정하지 마세요.
4. 정의된 형식의 요약을 stdout 에 출력합니다.
[재호출이면 새 seo-report.md 기준으로 남은 FAIL 만 다시 분류]"""
)
```

### Phase 4: 판정 분기

`seo-report.md` 의 결과 줄(`N/M PASS`)을 읽는다.

- **전체 PASS** → Phase 5 (지시서 없음).
- **FAIL 존재** → `seo-fix-plan.md` 의 사유별 요약과 수정 순서를 사용자에게 제시한다.
  수정은 이 스킬 범위 밖이다. 사용자가 진행을 원하면 수정 → Phase 2 재검사로 돌아온다.
- `(확인 필요)` 항목이 있으면 그대로 사용자에게 알린다.

### Phase 5: 결과 보고

local 이면 Phase 1 에서 띄운 서버를 종료한다.

```
✓ SEO 검사 완료

대상: <baseUrl>
결과: <N>/<M> PASS  (FAIL <k>건)
사유별: <GSC 사유 — n건, …>
리포트: .claude/_workspace/seo-report.md
지시서: .claude/_workspace/seo-fix-plan.md   (FAIL 시)

다음 단계:
- FAIL 이 있으면 지시서의 수정 순서대로 진행 후 재검사
- 리디렉션 건수는 0 이 되지 않는다 (정상 동작)
- "크롤링됨 - 현재 색인 미생성"은 GSC URL 검사로 직접 확인
```

### Phase 6: 개선 피드백

- 사용자 교정 → `seo-auditor` 에게 `.claude/agent-memory/seo-auditor/MEMORY.md` append 를 시킨다.
- 같은 지적 2회 이상 → 사용자 확인 후 `gsc-reason-map.md` 로 규칙 승격.

---

## 에러 핸들링

| 상황                             | 처리                                                                  |
| -------------------------------- | --------------------------------------------------------------------- |
| `pnpm build:web` 실패            | 에러 로그 요약 보고 후 중단 (검사 불가)                               |
| 서버 기동 실패 / 3000 포트 점유  | 점유 프로세스를 알리고 사용자에게 종료 또는 "이미 기동됨" 선택을 요청 |
| 사이트맵 요청 실패 (검사기 예외) | 서버 기동 여부·baseUrl 재확인 후 재시도 한 번, 실패 시 보고           |
| Notion 키 없음                   | 프로젝트 URL 이 사이트맵에서 빠질 수 있음을 리포트 요약에 명시        |
| prod 접속 불가                   | 네트워크/도메인 상태 보고, 로컬 검사로 대체할지 확인                  |
| `seo-report.md` 미생성           | 검사기 출력(stdout) 확인 후 원인 보고                                 |
| seo-auditor 에이전트 에러        | 재시도 확인 / 불가 시 리포트 FAIL 원문을 그대로 사용자에게 제시       |

## 테스트 시나리오

### 정상: 로컬 베이스라인

```
/seo-audit
→ 대상 local → 게이트 A "빌드·기동" → build:web → start(백그라운드)
→ check:seo → FAIL 다수 (exit 1, 정상) → seo-auditor → seo-fix-plan.md
→ 사유별 요약 제시 → 서버 종료 → 보고
```

### 가드: soft 404 탐지

```
/seo-audit prod
→ [404] /ko/foo/bar status 200 → FAIL
→ seo-auditor: "Soft 404" 로 분류, not-found/[...rest] 를 파일:라인 근거로 확인
→ 지시서에 수정 한 줄 기록 (코드 수정은 하지 않음)
```

## 참고

- 모델: seo-auditor **sonnet**(리포트 대조·파일 확인이 중심이라 충분).
- 쿼리 변형 정책은 **canonical 통일**로 확정(noindex 아님).
- 이미지·콘텐츠는 생성하지 않는다. 이 스킬은 읽기·분석 전용이다.
