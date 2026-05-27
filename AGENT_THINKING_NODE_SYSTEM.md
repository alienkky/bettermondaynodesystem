# Agent Thinking Node System

BetterMonday Node System을 "생각 정리 + 에이전트 협업" 도구로 사용할 때의 전체 구조 정리.

## 현재 있는 노드

현재 캔버스는 시각 기획 도구로는 기본 골격이 좋다.

- Reference Image: 이미지, 캡처, 시각 레퍼런스
- Sticky Note: 자유 메모, 감상, 임시 생각
- Screen: 화면, 페이지, 장면
- System: 시스템 구성요소, 기능 단위
- Decision: 선택지, 분기, 판단
- Group: 묶음, 영역, 챕터
- Icon: 빠른 시각 표시

하지만 에이전트와 대화하려면 "무엇을 만들까"뿐 아니라 "왜, 어떤 근거로, 무엇이 막혔고, 다음 행동은 무엇인가"가 저장되어야 한다.

## 추가하면 좋은 핵심 노드

### 1. Goal

내가 이루려는 최종 목적.

예:
- 나의 생각을 구조화해서 에이전트와 반복 대화한다.
- 아이디어를 잃어버리지 않고 실행 가능한 프로그램 설계로 바꾼다.
- 디자인/기획/개발 에이전트가 같은 맥락을 보게 만든다.

### 2. Question

아직 답이 없는 질문.

예:
- 이 기능은 누구에게 가장 먼저 필요한가?
- 에이전트가 어느 수준까지 자동으로 정리해야 하는가?
- 저장된 생각을 어떤 형식으로 다시 불러와야 하는가?

### 3. Assumption

내가 현재 사실처럼 두고 있는 가정.

예:
- 사용자는 글보다 노드로 생각할 때 더 빨리 정리한다.
- 에이전트는 잘 정리된 구조 데이터를 받으면 더 좋은 답을 한다.
- 로컬 저장만으로 시작해도 초기 제품 검증은 가능하다.

### 4. Evidence

근거, 사례, 캡처, 대화 기록, 사용자 반응.

예:
- 내가 실제로 에이전트와 대화하다가 맥락을 잃은 사례
- 기존 캔버스에서 유용했던 작업 방식
- 사용자가 반복해서 원하는 기능

### 5. Constraint

제약 조건.

예:
- 처음에는 서버 저장 없이 로컬 저장 중심
- 단일 HTML로 실행 가능해야 함
- 에이전트가 읽기 쉬운 JSON/Markdown export 필요

### 6. User / Persona

이 도구를 쓰는 사람 또는 역할.

예:
- 나: 생각을 빠르게 외부화하고 싶은 창작자
- 기획 에이전트: 구조를 보고 질문을 던지는 역할
- 개발 에이전트: 노드 구조를 기능 명세로 바꾸는 역할
- 리뷰 에이전트: 빠진 전제와 위험을 찾는 역할

### 7. Agent

대화할 에이전트의 역할 노드.

예:
- Strategist Agent: 방향과 우선순위
- Product Agent: 기능 정의
- Design Agent: 화면/사용성
- Dev Agent: 구현 계획
- Memory Agent: 저장된 생각 요약과 회수

### 8. Prompt

에이전트에게 보낼 지시문.

예:
- 이 노드 구조를 보고 빠진 전제를 질문해줘.
- Goal과 Constraint를 기준으로 MVP 범위를 줄여줘.
- Decision 노드들을 비교해서 추천안을 만들어줘.

### 9. Task / Action

다음에 실제로 할 일.

예:
- 노드 타입을 Goal/Question/Assumption으로 확장
- Generate Brief를 Agent Brief로 변경
- 저장 JSON에 node.type과 node.intent 추가

### 10. Output / Artifact

생각의 결과물.

예:
- 에이전트에게 보낼 브리프
- 제품 요구사항 문서
- 구현 체크리스트
- 회의/대화 요약

### 11. Risk

위험, 불확실성, 망할 수 있는 지점.

예:
- 노드가 많아져서 오히려 정리가 어려워짐
- 저장은 되지만 나중에 다시 찾기 어려움
- 에이전트가 시각 구조를 충분히 이해하지 못함

### 12. Metric

잘 되고 있는지 판단하는 기준.

예:
- 10분 안에 생각을 브리프로 변환할 수 있는가
- 에이전트가 같은 질문을 반복하지 않는가
- 이전 대화의 맥락을 다시 불러올 수 있는가

### 13. Feedback

에이전트 또는 사용자가 남긴 반응.

예:
- 이 노드는 더 구체화 필요
- 이 결정은 근거가 약함
- 이 흐름은 구현 가능성이 높음

### 14. Status

진행 상태.

예:
- Idea
- Draft
- Confirmed
- In Progress
- Blocked
- Done

## 추천 노드 체계

프로그램을 만들 때는 노드를 크게 6개 층으로 나누면 좋다.

### A. Intent Layer

왜 하는가.

- Goal
- Problem
- User / Persona
- Success Metric

### B. Thinking Layer

생각의 재료.

- Note
- Question
- Assumption
- Evidence
- Constraint

### C. Structure Layer

무엇으로 구성되는가.

- System
- Screen
- Data / Memory
- Flow / State
- Group

### D. Decision Layer

어떤 선택을 했는가.

- Decision
- Option
- Tradeoff
- Risk

### E. Agent Layer

누구와 어떤 대화를 할 것인가.

- Agent
- Prompt
- Context Package
- Feedback

### F. Execution Layer

이제 무엇을 할 것인가.

- Task / Action
- Output / Artifact
- Status
- Next Review

## 에이전트와 대화하기 위한 저장 구조

노드는 단순히 제목과 설명만 있으면 부족하다. 최소한 아래 필드가 있으면 좋다.

```json
{
  "id": "n123",
  "kind": "thought",
  "type": "goal",
  "title": "에이전트와 대화 가능한 생각 저장소 만들기",
  "body": "내 생각을 노드로 정리하고, 그 구조를 브리프로 변환해서 에이전트에게 전달한다.",
  "status": "draft",
  "confidence": 0.7,
  "tags": ["agent", "memory", "planning"],
  "createdAt": "2026-05-27T00:00:00.000Z",
  "updatedAt": "2026-05-27T00:00:00.000Z"
}
```

엣지는 관계의 의미가 중요하다.

```json
{
  "id": "e123",
  "from": "goal-1",
  "to": "task-1",
  "relation": "requires",
  "label": "실행하려면 필요"
}
```

추천 관계:

- supports: 근거가 된다
- contradicts: 반대된다
- requires: 필요하다
- produces: 결과로 만든다
- asks: 질문한다
- answers: 답한다
- blocks: 막는다
- decides: 결정한다
- delegates_to: 에이전트에게 맡긴다
- updates: 갱신한다

## Agent Brief 생성 형식

Generate Brief는 앞으로 일반 기획 문서보다 "에이전트 대화용 브리프"가 되어야 한다.

권장 출력:

```md
# Agent Brief

## Goal
- 최종 목표

## Current Context
- 지금까지 정리한 핵심 생각

## Key Nodes
- Goal / Question / Decision / Risk / Task 중심 요약

## Open Questions
- 아직 답이 없는 질문

## Constraints
- 지켜야 할 조건

## Decisions Made
- 이미 선택한 것

## Tasks
- 다음 행동

## Request To Agent
- 에이전트에게 원하는 일
```

## 프로그램으로 만들 때 우선순위

### 1단계: 노드 타입 확장

현재 팔레트에 아래 노드를 먼저 추가한다.

- Goal
- Question
- Assumption
- Evidence
- Constraint
- Agent
- Prompt
- Task
- Risk
- Output
- Metric
- Feedback
- Status

### 2단계: Inspector 확장

노드를 선택했을 때 오른쪽 패널에서 아래를 편집한다.

- Type
- Title
- Body
- Status
- Confidence
- Tags

### 3단계: 관계 라벨 확장

엣지에 단순 라벨뿐 아니라 relation 값을 둔다.

- supports
- requires
- blocks
- produces
- delegates_to

### 4단계: Agent Brief 생성

현재 Generate Brief를 다음 기준으로 개선한다.

- Goal 먼저
- Question과 Risk를 따로 모음
- Decision과 Task를 명확히 분리
- Agent에게 보낼 요청문을 자동 생성

### 5단계: 저장/불러오기 강화

에이전트와 반복 대화를 하려면 저장 단위가 필요하다.

- Project
- Session
- Conversation
- Brief Snapshot
- Agent Response

## 한 줄 방향

이 도구는 단순 노드 캔버스가 아니라, "내 생각을 구조화하고, 그 구조를 에이전트가 읽을 수 있는 대화 재료로 바꾸는 사고 운영체제"가 되어야 한다.
