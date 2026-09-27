---
name: write-book-review
description: 책 제목(+선택적으로 독서 노트·하이라이트 경로)을 입력받아, 책의 줄거리·핵심 요약과 필자의 경험 대입, 리뷰를 엮은 hijero.me 블로그 포스트(category tech 또는 life)를 생성한다. 웹으로 서지만 보강하고, 비어 있는 경험은 사용자 인터뷰로 채운 뒤 book-review-writer(opus) / book-review-reviewer(sonnet) 쌍이 생성-검증하고, 확인 후 apps/web/content/posts/ko/ 에 .mdx 를 만든다. "책 리뷰 써줘", "독후감 포스트", "이 책 읽고 글 쓰고 싶어", "북 리뷰 포스트 생성", "life 글로 책 후기" 같은 요청 시 반드시 사용. 책이 아닌 일반 기술 글은 write-tech-post, 이미 작성된 .mdx 수정만은 대상 아님.
allowed-tools: Bash, Read, Write, Glob, Grep, AskUserQuestion, Agent, WebSearch, WebFetch
---

# Write Book Review Orchestrator

책 한 권을 재료로 **요약 + 경험 대입 + 리뷰** 포스트를 만든다.
`book-review-writer`(opus)와 `book-review-reviewer`(sonnet)가 생성-검증하고,
사용자 확인을 거쳐 `apps/web/content/posts/ko/<slug>.mdx` 를 생성한다. `write-tech-post` 와 같은 패턴이다.

- 경로: 모든 경로는 저장소 루트(`/Users/jaehongcheon/Documents/hijero.me/`) 기준.
- 생성 언어: **한국어(`ko`)만**. 영어본은 사용자가 별도로 요청할 때만.
- 커밋하지 않는다 (커밋은 사용자가 직접).
- **최우선 원칙: 경험·인용은 사용자에게서만 나온다.** 오케스트레이터도 writer 도 지어내지 않는다.

## 참고 자산

| 파일                                                               | 역할                                                       |
| ------------------------------------------------------------------ | ---------------------------------------------------------- |
| `.claude/skills/write-tech-post/references/style-guide.md`         | **공통 화법** (§1·2·4·7·8) — tech 하네스와 공유            |
| `.claude/skills/write-book-review/references/book-review-guide.md` | 책 리뷰 전용 전개·균형·출처·category·메타·길이 규칙        |
| `.claude/skills/write-tech-post/references/frontmatter-schema.md`  | frontmatter 스키마 미러 (이 스킬은 `category: tech\|life`) |
| `.claude/skills/write-book-review/references/corpus-map.md`        | 책 리뷰 코퍼스 2편(life/tech 모델)                         |
| `.claude/agents/content/book-review-writer.md`                     | writer 정의 (opus)                                         |
| `.claude/agents/content/book-review-reviewer.md`                   | reviewer 정의 (sonnet)                                     |
| `.claude/agent-memory/book-review-writer/MEMORY.md`                | 세션 간 누적 교정                                          |
| `.claude/_workspace/book-review-{brief.md,draft.mdx,review.md}`    | 실행 중 중간 산출물 (tech 하네스와 파일명 분리)            |

## Workflow

### Phase 0: 재료 수집 & 브리프

#### 0-1. 입력 파싱

- **책 제목**(필수)과 **노트 경로**(선택: `.md` 파일 또는 디렉토리, `/`·`~`·`.md` 포함 토큰)를 추출한다.
- 추가 앵글(예: "이직 고민과 엮어서")이 있으면 메모한다.
- **category 키워드**(`테크`/`tech` → tech, `일상`/`life` → life)를 `book-review-guide.md` §5 대로 확인한다.
  책 제목 안의 단어는 키워드로 치지 않는다(예: 「테크 리더의 …」). 두 계열이 함께 나오면 모호한 것으로 본다.
- 제목이 없으면 묻고 대기한다.
- 노트 경로가 있으면 `test -e` 확인 후 전문 Read (디렉토리면 `Glob` 으로 `*.md` 수집).
  없으면 "경로를 찾을 수 없습니다" 안내 후 경로 없이 진행할지 묻는다.

#### 0-2. 서지 보강 (WebSearch)

- `WebSearch` 로 **저자, 출판사, 출간 연도, 알라딘 상품 링크, 목차(부/장 구성)** 만 확인한다.
  필요하면 `WebFetch` 로 알라딘 상품 페이지의 목차를 확인한다.
- **줄거리·인용구·서평 문장은 웹에서 가져오지 않는다.** 요약 재료는 오직 사용자 노트/인터뷰.
- 확인 실패 항목은 `(확인 필요)` 로 둔다.

#### 0-3. 파트 매핑

책의 부/장 구조(목차가 길면 부 단위, 3~6개 파트로 묶음)에 노트 내용을 매핑해 표로 만든다:

```
| 파트       | 요약 재료        | 인용(원문) | 경험          |
| 1부 자라기 | ✓ (노트 L12-30) | 1개        | ✗             |
| 2부 함께   | ✓               | 0개        | ✓ (노트 L41)  |
```

#### 0-4. 인터뷰 (빈 칸만)

- **경험 ✗ 파트**와 **요약 재료 ✗ 파트**만 `AskUserQuestion` 으로 묻는다. 한 호출에 최대 4문항.
  질문에는 그 파트의 핵심 개념 한 줄(노트나 목차 기반)을 넣어 기억을 끌어낸다.

  ```
  AskUserQuestion(questions: [{
    question: "「<책>」 2부 '<핵심 개념>' 을 읽으며 떠오른 경험이 있나요? (Other 에 시기·상황·느낀 점을 적어주세요)",
    header: "2부 경험",
    multiSelect: false,
    options: [
      { label: "요약만",   description: "이 파트는 경험 없이 요약 + 짧은 소감으로 씁니다." },
      { label: "파트 제외", description: "이 파트는 글에서 다루지 않습니다." }
    ]
  }])
  ```

  (사용자는 자동 제공되는 **Other** 로 경험을 서술한다.)

- 도입부 재료가 없으면 한 번 더 묻는다: "이 책을 읽게 된 계기/당시 고민", "읽은 시기".
- 답변은 **사용자 원문 그대로** 경험 뱅크에 옮긴다(요약하지 않는다).
- 모든 파트가 "요약만" 이 되면: 책 리뷰가 아닌 줄거리 정리가 된다고 알리고 계속할지 묻는다.

#### 0-5. category 확정 & 브리프 작성

0-1 에서 키워드로 category 가 정해지지 않았거나 모호하면, **추측하지 않고** 묻는다
(인터뷰 호출에 문항으로 합쳐도 된다):

```
AskUserQuestion(questions: [{
  question: "이 책 리뷰를 어느 섹션에 게시할까요?",
  header: "Category",
  multiSelect: false,
  options: [
    { label: "tech", description: "개념 정리 + 적용해보기 중심 (모델: harness-engineering-with-claude)" },
    { label: "life", description: "고민·성장·태도 중심 에세이 (모델: book-review-growing-together)" }
  ]
}])
```

확정한 category 로 `.claude/_workspace/book-review-brief.md` 를 쓴다:

```
# Book Review Brief

## 서지
- 제목: 「…」 / 저자: … / 출판사: … / 연도: … / 링크: <알라딘 URL>
- 목차(요약): 1부 … / 2부 … / 3부 …
- 노트 원본: <경로 또는 없음>

## 앵글
<한 문단 — 어떤 고민에서 이 책을 읽었고, 독자가 무엇을 얻어갈지>

## category
<tech|life> — 출처: <프롬프트 키워드 "…" | 사용자 선택>
주 모델: <corpus-map 파일>

## 도입 재료
- 계기: <사용자 원문>
- 읽은 시기: <사용자 원문>

## 파트별 재료
### 1부. <파트명>
- 요약 재료: <노트 발췌/정리 — 출처 줄 번호>
- 인용(원문):
  - "<노트의 문장 그대로>"
- 경험 뱅크:
  - <사용자 원문 그대로>
- 처리: 요약+경험 | 요약만

### 2부. …

## 제안 frontmatter
slug: <kebab-case>
title: '<book-review-guide §6 패턴>'
description: <1~2문장>
category: <tech|life>
tags: [<3~5개>]
publishedAt: '<오늘 YYYY-MM-DD>'
featured: false

## 섹션 개요
(도입) / ## 책 소개 / ## 책 리뷰 (### 1부 … ) / ## 끝으로

## 확인 필요 항목
- <서지 미확인 값 등>
```

#### 게이트 A

브리프 요약(서지, category+근거, 파트별 처리, frontmatter, 개요)을 제시하고:

```
AskUserQuestion(questions: [{
  question: "이 브리프로 초안 작성을 진행할까요?",
  header: "Brief",
  multiSelect: false,
  options: [
    { label: "진행", description: "book-review-writer(opus)를 호출합니다." },
    { label: "수정", description: "category·제목·파트 구성·경험을 고친 뒤 진행합니다." },
    { label: "취소", description: "중단합니다." }
  ]
}])
```

수정 → 브리프 갱신 후 다시 게이트 A.

### Phase 1: Writer 호출

```
Agent(
  subagent_type: book-review-writer,   # 미등록 환경이면 general-purpose
  model: "opus",
  description: "book-review-writer 호출",
  prompt: """당신은 book-review-writer입니다.
1. .claude/agents/content/book-review-writer.md 의 규칙을 그대로 따릅니다.
2. 정의된 순서대로 style-guide(§1·2·4·7·8) → book-review-guide → frontmatter-schema → corpus-map → 코퍼스 → MEMORY 를 읽습니다.
3. .claude/_workspace/book-review-brief.md 를 재료로 완전한 .mdx 를 작성해
   .claude/_workspace/book-review-draft.mdx 에 저장합니다. 다른 파일은 건드리지 마세요.
4. 정의된 형식의 요약을 stdout 에 출력합니다.
[재호출이면 여기에 reviewer 의 Issues Found 전문 — PASS 축은 유지, 지적 항목만 수정]"""
)
```

### Phase 2: Reviewer 호출

```
Agent(
  subagent_type: book-review-reviewer,   # 미등록 환경이면 general-purpose
  model: "sonnet",
  description: "book-review-reviewer 호출",
  prompt: """당신은 book-review-reviewer입니다.
1. .claude/agents/content/book-review-reviewer.md 의 규칙을 그대로 따릅니다.
2. .claude/_workspace/book-review-draft.mdx 를 브리프·가이드·코퍼스와 대조해 7개 축으로 채점합니다.
   wc/grep 객관 확인과 인용의 브리프 대조(grep -F)를 실제로 실행합니다.
3. 판정을 .claude/_workspace/book-review-review.md 에 정의된 형식으로 기록합니다.
이번은 <n>번째 리뷰입니다. [재호출이면 직전 review.md 를 참조]"""
)
```

### Phase 3: 판정 분기

`book-review-review.md` 의 `Overall Verdict` 를 읽는다.

- **PASS** → Phase 4
- **REDO** (1~2회차) → Issues Found 전문을 넣어 Phase 1 재호출 → Phase 2. 재호출 상한 **2회**.
- **REDO** (3회차) →
  ```
  ⚠️ 자동 승인 한계 도달 — 검증이 3회 반복되었습니다.
  남은 이슈: <요약>  (출처 충실도 이슈가 남아 있으면 반드시 명시)
  ```
  `AskUserQuestion` 으로 진행 / 수정 / 취소.

### Phase 4: 최종 게이트

draft 의 frontmatter 전체 + `#`/`##`/`###` 헤딩 목록 + 본문 첫 ~15줄 + `(확인 필요)` 목록을 제시하고:

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

- `(확인 필요)` 가 남아 있으면 진행 전에 값을 받거나 해당 문장 제거에 동의받는다.

### Phase 5: Publish

1. 대상: `apps/web/content/posts/ko/<slug>.mdx`. 이미 존재하면 덮어쓰기 / slug 변경 확인.
2. draft 내용을 Write.
3. 빌드 검증:
   ```bash
   pnpm --filter web lint
   pnpm --filter web build 2>&1 | tee /tmp/wbr-build.log
   grep -n "frontmatter 검증 실패" /tmp/wbr-build.log || echo "frontmatter OK"
   ```
   실패 시 원인(frontmatter / MDX 문법 — 깨진 JSX, `{` 이스케이프, 코드펜스) 보고 → draft 수정 → 재검증.
4. 예상 읽기 시간: `node -e "const rt=require('reading-time');const m=require('gray-matter');const fs=require('fs');console.log(Math.ceil(rt(m(fs.readFileSync('apps/web/content/posts/ko/<slug>.mdx','utf8')).content).minutes)+'분')"` (실패해도 무시).

### Phase 6: 결과 보고

```
✓ 생성 완료

파일: apps/web/content/posts/ko/<slug>.mdx
제목: <title>
카테고리: <tech|life>  태그: <tags>
예상 읽기 시간: <n>분
빌드 검증: 통과, frontmatter OK

다음 단계:
- 책 표지를 apps/web/public/images/posts/<slug>/cover.jpg 에 넣고 TODO 주석을 이미지 태그로 교체
- 로컬 확인: pnpm dev → http://localhost:3000/ko/<category>/<slug>
- 영어본은 별도로 요청하세요. 커밋은 직접 진행하세요.
```

### Phase 7: 개선 피드백

- 사용자 교정 → `book-review-writer` 에게 `.claude/agent-memory/book-review-writer/MEMORY.md` append 를 시킨다.
- 같은 지적 2회 이상 → 사용자 확인 후 규칙 승격:
  책 리뷰 고유 → `book-review-guide.md`, 공통 화법 → `write-tech-post/references/style-guide.md`.
- 리뷰어 누락 지적 → `.claude/agent-memory/book-review-reviewer/MEMORY.md`.

---

## 에러 핸들링

| 상황                                  | 처리                                                                  |
| ------------------------------------- | --------------------------------------------------------------------- |
| 책 제목 없음                          | 묻고 대기                                                             |
| 노트 경로 없음                        | 안내 후 경로 없이(인터뷰만으로) 진행할지 확인                         |
| WebSearch 로 책을 특정 못함 / 동명 책 | 후보를 제시해 사용자 선택, 실패 시 서지를 사용자 입력으로             |
| 모든 파트 경험 없음                   | 줄거리 정리가 된다고 알리고 계속 여부 확인                            |
| writer / reviewer 에이전트 에러       | writer: 재시도 확인 / reviewer: draft 그대로 Phase 4 (수동 검토 권고) |
| REDO 3회                              | 경고 + 사용자 결정 (Phase 3)                                          |
| slug 충돌                             | 덮어쓰기 / slug 변경 중 택1                                           |
| build 에서 frontmatter 검증 실패      | 원인 보고 → draft 수정 → 재빌드                                       |

## 테스트 시나리오

### 정상: 노트 + 인터뷰 → life

```
/write-book-review 「함께 자라기」 ~/Documents/notes/growing-together.md
→ 0-2 서지 확인 (인사이트, 2018, 알라딘 링크)
→ 0-3 매핑: 3부 경험 ✗ → 0-4 인터뷰 1문항
→ category: 키워드 없음 → AskUserQuestion → 사용자 선택 life
→ 게이트 A 진행 → writer(opus) → reviewer(sonnet) PASS
→ 게이트 진행 → build 통과 → ✓
```

### 가드: 창작 인용 탐지

```
reviewer: 출처 충실도 ✗ — '> …' 문장이 브리프 인용(원문)에 없음 → REDO
→ writer: 해당 인용 삭제, 간접 화법으로 전환 → reviewer PASS
```

## 참고

- 모델: writer **opus**(서사·경험 엮기 품질이 핵심), reviewer **sonnet**(체크리스트 대조).
- 최대 재호출 2회(총 3회 생성).
- 이미지는 생성하지 않는다. `{/* TODO: … */}` 주석만.
