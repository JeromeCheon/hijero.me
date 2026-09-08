---
name: write-tech-post
description: 자연어 주제 또는 경로(다른 프로젝트/레포 디렉토리, TIL 노트·마크다운)를 입력받아, 그 안의 학습 내용·인사이트·코드 스니펫을 재료로 hijero.me 기존 포스트의 화법·전개·사고를 재현한 tech 카테고리 블로그 포스트를 생성한다. writer/style-reviewer 서브에이전트 쌍이 생성-검증하고, 확인 후 apps/web/content/posts/ko/ 에 .mdx 를 직접 만든다. "tech 블로그 포스트 생성", "블로그 글 써줘", "이 경로로 포스트 만들어줘", "기술 포스트 작성", "TIL로 포스트 써줘" 같은 요청 시 반드시 사용. 단, 이미 작성된 .mdx 를 리뷰·수정만 하는 요청은 대상이 아니다.
allowed-tools: Bash, Read, Write, Glob, Grep, AskUserQuestion, Agent
---

# Write Tech Post Orchestrator

입력(자연어 주제 또는 경로)을 재료로, `tech-post-writer` 와 `tech-post-style-reviewer` 서브에이전트가
생성-검증한 뒤, 사용자 확인을 거쳐 `apps/web/content/posts/ko/<slug>.mdx` 를 직접 생성한다.
TIL 레포의 commit-message / pr-create 오케스트레이터 패턴을 따른다.

- 경로: 이 문서의 모든 경로는 저장소 루트(`/Users/jaehongcheon/Documents/hijero.me/`) 기준.
- 생성 언어: **한국어(`ko`)만**. 영어본은 범위 밖 — 사용자가 별도로 요청할 때만.
- 커밋하지 않는다 (전역 규칙: 커밋은 사용자가 직접).

## 참고 자산

| 파일                                                              | 역할                                             |
| ----------------------------------------------------------------- | ------------------------------------------------ |
| `.claude/skills/write-tech-post/references/style-guide.md`        | 화법·전개·서식·화자 목소리 규칙 (단일 진실 소스) |
| `.claude/skills/write-tech-post/references/frontmatter-schema.md` | frontmatter Zod 스키마 미러 + 체크리스트         |
| `.claude/skills/write-tech-post/references/corpus-map.md`         | 기존 ko 포스트 5편 유형 인덱스                   |
| `.claude/agents/content/tech-post-writer.md`                      | writer 에이전트 정의                             |
| `.claude/agents/content/tech-post-style-reviewer.md`              | style-reviewer 에이전트 정의                     |
| `.claude/agent-memory/tech-post-writer/MEMORY.md`                 | 세션 간 누적 교정                                |
| `.claude/_workspace/`                                             | 실행 중 중간 산출물                              |

## Workflow

### Phase 0: 입력 분류 & 브리프 작성

1. 사용자 입력에서 **주제/경로**와 옵션을 추출한다.
   - 경로처럼 보이는 토큰(`/`, `~`, `.md` 포함)이 있으면 경로 모드, 아니면 자연어 모드. 둘 다면 혼합.
2. **경로 모드 — 디렉토리**: `test -d <path>` 확인 후 수집
   - `Glob` 로 트리 파악(`<path>/**/*` 상위 2~3 depth), `README*` / `CLAUDE.md` / `package.json` 읽기
   - `git -C <path> log --oneline -30` (git 레포면), 주요 소스 파일 3~7개 Read
   - 인사이트가 될 지점 3~5개 식별, 본문에 인용할 코드 스니펫 선별(경로·라인 메모)
3. **경로 모드 — `.md` 노트**: `test -f <path>` 확인 후 전문 Read. 노트 내용을 원재료로 삼되,
   블로그 전개에 맞게 재구성할 계획을 세운다.
4. **자연어 모드**: 입력을 논지로 사용. 근거가 얇으면(참고할 코드/노트가 없으면)
   사용자에게 "참고할 경로나 더 구체적인 내용이 있나요?" 를 물어보고 **대기**.
5. `.claude/skills/write-tech-post/references/corpus-map.md` 를 읽어 이 글의 전개 유형을 판별한다.
6. `_workspace/tech-post-brief.md` 를 작성한다:

   ```
   # Tech Post Brief

   ## 입력
   - 모드: 경로(디렉토리) / 경로(노트) / 자연어 / 혼합
   - 원본: <path 또는 요약>

   ## 주제 / 앵글
   <한 문단 — 이 글이 다루는 것과 독자가 얻어갈 것>

   ## 전개 유형 (corpus-map 기준)
   주 모델: <파일> / 보조: <파일>

   ## 핵심 논점 (why 중심, 3~6개)
   1. …
   2. …

   ## 인용할 코드 스니펫
   - `<파일:라인>` — <무엇을 보여주는지>

   ## 제안 frontmatter
   slug: <kebab-case>
   title: <규칙에 맞는 제목>
   description: <1~2문장>
   tags: [<3~5개>]
   publishedAt: '<오늘 날짜 YYYY-MM-DD>'
   series: <있으면>

   ## 섹션 개요
   ## <계기/맥락>
   ## <…>
   ## 마치며

   ## 확인 필요 항목
   - <재료에 없어 사용자 확인이 필요한 사실/수치>
   ```

7. **게이트 A** — `AskUserQuestion` 으로 브리프를 제시하고 확인받는다.

   ```
   AskUserQuestion(questions: [{
     question: "이 브리프/개요로 초안 작성을 진행할까요?",
     header: "Brief",
     multiSelect: false,
     options: [
       { label: "진행", description: "이 브리프로 writer를 호출합니다." },
       { label: "수정", description: "주제·개요·frontmatter를 고친 뒤 진행합니다." },
       { label: "취소", description: "중단합니다." }
     ]
   }])
   ```

   - 진행 → Phase 1
   - 수정 → 사용자 입력 반영해 brief 갱신 후 다시 게이트 A
   - 취소 → 종료

### Phase 1: Writer 호출

> 전용 에이전트 타입 `tech-post-writer` 가 등록돼 있으면 그것을 쓴다. 없으면 `general-purpose`.

```
Agent(
  subagent_type: tech-post-writer,   # 미등록 환경이면 general-purpose
  model: "sonnet",
  description: "tech-post-writer 호출",
  prompt: """당신은 tech-post-writer입니다. 다음을 실행하세요:
1. .claude/agents/content/tech-post-writer.md 의 규칙을 그대로 따릅니다.
2. .claude/skills/write-tech-post/references/style-guide.md 를 전문 정독합니다 (§8 화자 목소리 포함).
3. .claude/skills/write-tech-post/references/frontmatter-schema.md 를 읽습니다.
4. .claude/skills/write-tech-post/references/corpus-map.md 를 읽고, _workspace/tech-post-brief.md 의
   '전개 유형'에 해당하는 주 모델 1편 + 보조 1~2편을 apps/web/content/posts/ko/ 에서 전문 정독합니다.
5. .claude/agent-memory/tech-post-writer/MEMORY.md 의 누적 교정을 반영합니다.
6. _workspace/tech-post-brief.md 를 재료로 완전한 .mdx(frontmatter + 본문)를 작성해
   _workspace/tech-post-draft.mdx 에 저장합니다. 다른 파일은 건드리지 마세요.
7. stdout 에 요약(선택한 코퍼스 편, 전개 유형, 대략 글자 수, '확인 필요' 표시 개수)을 출력합니다.
[재호출이면 여기에 reviewer 수정 지시 전문이 포함됨 — PASS 부분은 유지, REDO 항목만 재작성]"""
)
```

산출물: `_workspace/tech-post-draft.mdx`

### Phase 2: Style-reviewer 호출

> 전용 에이전트 타입 `tech-post-style-reviewer` 가 등록돼 있으면 그것을 쓴다. 없으면 `general-purpose`.

```
Agent(
  subagent_type: tech-post-style-reviewer,   # 미등록 환경이면 general-purpose
  model: "sonnet",
  description: "tech-post-style-reviewer 호출",
  prompt: """당신은 tech-post-style-reviewer입니다. 다음을 실행하세요:
1. .claude/agents/content/tech-post-style-reviewer.md 의 규칙을 그대로 따릅니다.
2. references/style-guide.md + references/frontmatter-schema.md + references/corpus-map.md 를 읽고,
   초안 주제에 해당하는 코퍼스 2~3편을 apps/web/content/posts/ko/ 에서 정독합니다.
3. _workspace/tech-post-draft.mdx 를 6개 축(화법 / 전개 / 사고 전개 / 서식 장치 / 메타데이터 / 스니펫·밀도)으로
   채점합니다. wc -m 으로 본문 글자 수, grep -c '^## ' 로 헤딩 수를 실제로 셉니다.
   frontmatter 는 frontmatter-schema.md 체크리스트를 눈으로 대조합니다.
4. PASS 또는 REDO 판정 + writer가 바로 적용할 구체적 수정 지시를
   _workspace/tech-post-review.md 에 지정된 형식으로 기록합니다.
   주관 축 지적은 반드시 코퍼스의 구체 구절을 근거로 인용합니다. 불확실하면 REDO.
[재호출이면 직전 _workspace/tech-post-review.md 를 참조]"""
)
```

산출물: `_workspace/tech-post-review.md`

### Phase 3: 판정 분기

`_workspace/tech-post-review.md` 의 `Overall Verdict` 를 읽는다.

- **PASS** → Phase 4
- **REDO** (1~2회차) → Phase 3-1
- **REDO** (3회차 이상) → Phase 3-2

#### Phase 3-1: Writer 재호출 (최대 2회)

reviewer 의 `Issues Found` 전문을 프롬프트에 넣어 Phase 1 형식으로 `tech-post-writer` 를 재호출한다.
PASS 축은 유지, REDO 항목만 수정하도록 지시. 이후 Phase 2 로 복귀.
루프 상한: **2회 재호출**(초호출 + 2회 = 총 3회).

#### Phase 3-2: 상한 도달

```
⚠️ 자동 승인 한계 도달 — 스타일 검증이 3회 반복되었습니다.
마지막 초안(_workspace/tech-post-draft.mdx)을 그대로 게시할지, 직접 수정할지 결정해주세요.
남은 이슈: [review-report의 잔여 항목 요약]
```

`AskUserQuestion` 으로 진행 / 수정 / 취소를 받는다.

### Phase 4: 최종 게이트

`_workspace/tech-post-draft.mdx` 에서 frontmatter 전체 + `## ` 헤딩 목록 + 본문 첫 ~15줄을 발췌해 제시하고:

```
AskUserQuestion(questions: [{
  question: "이 내용으로 apps/web/content/posts/ko/<slug>.mdx 를 생성할까요?",
  header: "Publish",
  multiSelect: false,
  options: [
    { label: "진행", description: "content/posts/ko/ 에 .mdx 를 생성하고 빌드 검증합니다." },
    { label: "수정", description: "제목·태그·본문 일부를 고친 뒤 생성합니다." },
    { label: "취소", description: "생성하지 않고 초안만 _workspace 에 남깁니다." }
  ]
}])
```

- 진행 → Phase 5
- 수정 → 사용자 입력 반영해 draft 수정 후 다시 Phase 4
- 취소 → "초안은 `_workspace/tech-post-draft.mdx` 에 있습니다." 안내 후 종료

### Phase 5: Publish

1. `slug` 로 대상 경로 확정: `apps/web/content/posts/ko/<slug>.mdx`
   - 이미 존재하면 → 사용자에게 덮어쓸지 / slug 를 바꿀지 확인.
2. `_workspace/tech-post-draft.mdx` 내용을 그 경로에 Write.
3. 빌드 검증:

   ```bash
   pnpm --filter web lint
   pnpm --filter web build 2>&1 | tee /tmp/wtp-build.log
   grep -n "frontmatter 검증 실패" /tmp/wtp-build.log || echo "frontmatter OK"
   ```

   - `frontmatter 검증 실패: <slug>.mdx` 가 나오면 → frontmatter 문제. 원인 보고 후 draft 수정 → 재검증.
   - lint/build 실패 → 에러 원문 보고 후 사용자 확인 (MDX 문법 오류일 가능성 — 깨진 JSX, 닫히지 않은 코드펜스 등).

4. 예상 읽기 시간 산출: `node -e "const rt=require('reading-time');const m=require('gray-matter');const fs=require('fs');console.log(Math.ceil(rt(m(fs.readFileSync('apps/web/content/posts/ko/<slug>.mdx','utf8')).content).minutes)+'분')"` (실패해도 무시 가능 — 참고값).

### Phase 6: 결과 보고

```
✓ 생성 완료

파일: apps/web/content/posts/ko/<slug>.mdx
제목: <title>
태그: <tags>
예상 읽기 시간: <n>분
빌드 검증: pnpm --filter web build 통과, frontmatter OK

다음 단계 (선택):
- 로컬 확인: pnpm dev → http://localhost:3000/ko/tech/<slug>
- 스크린샷이 필요한 자리에 {/* TODO: 스크린샷 */} 주석 <n>개 — 이미지 추가 필요
- 영어본 생성은 별도로 요청하세요.
- 커밋은 직접 진행하세요.
```

### Phase 7: 개선 피드백 수집 (사용자가 교정을 준 경우)

- 사용자가 게시본에 화법·전개 관련 교정을 주면:
  - 일회성 교정 → `tech-post-writer` 를 시켜 `.claude/agent-memory/tech-post-writer/MEMORY.md` 에 append.
  - **같은 지적이 2회 이상** 누적됐으면 → `references/style-guide.md` 의 해당 섹션(§1~§9)에
    규칙 한 줄을 추가한다. 추가 전 사용자에게 문구를 확인받는다.

---

## 에러 핸들링

| 상황                           | 처리                                                                       |
| ------------------------------ | -------------------------------------------------------------------------- |
| 경로가 존재하지 않음           | "경로를 찾을 수 없습니다: <path>" 안내 후 종료                             |
| 디렉토리가 비었음/읽을 게 없음 | 사용자에게 다른 경로나 자연어 설명 요청 후 대기                            |
| 자연어 입력이 너무 얇음        | 참고 경로·구체 내용을 물어보고 대기 (억지로 쓰지 않음)                     |
| writer 에이전트 에러           | 에러 보고, Phase 1 부터 재시도 여부 사용자 확인                            |
| reviewer 에이전트 에러         | writer 초안 그대로 Phase 4 로 진행 (수동 검토 권고)                        |
| REDO 3회 이상                  | 경고 + 사용자 확인 후 진행 또는 중단 (Phase 3-2)                           |
| slug 충돌 (파일 이미 존재)     | 덮어쓰기 / slug 변경 중 택1 확인                                           |
| `frontmatter 검증 실패` 감지   | frontmatter 문제 원인 보고 → draft 수정 → `pnpm --filter web build` 재검증 |
| lint/build 실패 (MDX 문법)     | 에러 원문 보고, draft 의 JSX·코드펜스 점검 후 재시도                       |

---

## 테스트 시나리오

### 정상 흐름 1: TIL 노트 → 포스트

```
/write-tech-post ~/Documents/TIL/2026-08/some-note.md
→ Phase 0: 노트 전문 읽고 brief 작성, 전개 유형 = 구현 상세형(002 모델)
→ 게이트 A: 진행
→ writer: 초안 생성 (본문 4,500자, ## 6개)
→ reviewer: PASS
→ 게이트: 진행
→ Phase 5: content/posts/ko/<slug>.mdx 생성, pnpm --filter web build 통과, frontmatter OK
→ ✓ 완료 보고
```

### 정상 흐름 2: 레포 디렉토리 + 자연어 앵글

```
/write-tech-post ~/Documents/my-lib "제네릭 타입 추론으로 삽질한 이야기"
→ Phase 0: git log + 소스 파일 읽고 스니펫 선별, 전개 유형 = 비교·의사결정형 요소 포함
→ 게이트 A: 수정 (제목 톤 조정) → 다시 게이트 A: 진행
→ writer → reviewer: REDO (사고 전개 — 결정 근거가 감상 위주)
→ writer 재호출 (해당 문단만) → reviewer: PASS
→ 게이트: 진행 → Phase 5 통과 → ✓ 완료
```

### 에러 흐름 1: 경로 없음

```
/write-tech-post ~/Documents/nope
→ "경로를 찾을 수 없습니다: ~/Documents/nope"
→ 종료
```

### 에러 흐름 2: REDO 3회

```
writer 초안1 → reviewer REDO → 초안2 → REDO → 초안3 → REDO (3회차)
→ ⚠️ "자동 승인 한계 도달" + 잔여 이슈 요약
→ 사용자: 진행 / 수정 / 취소
```

### 에러 흐름 3: frontmatter 검증 실패

```
Phase 5: pnpm --filter web build 로그에 "frontmatter 검증 실패: foo.mdx"
→ 원인 확인 (예: publishedAt 따옴표 누락) → draft 수정 → 재빌드 → 통과 → ✓ 완료
```

---

## 참고

- writer/reviewer 는 `sonnet` 모델 사용 (포스트 생성마다 반복되는 작업).
- Workspace: `.claude/_workspace/` — `tech-post-brief.md`, `tech-post-draft.mdx`, `tech-post-review.md`.
- 최대 재호출: 2회 (초호출 + 2회 = 총 3회).
- 이 스킬은 **이미지를 생성하지 않는다.** 필요한 자리에 `{/* TODO: 스크린샷 — 설명 */}` 주석만 남긴다.
- 지속 개선의 축: `style-guide.md`(규칙, 수동 승격) + `agent-memory/tech-post-writer/MEMORY.md`(교정, 자동 누적).
