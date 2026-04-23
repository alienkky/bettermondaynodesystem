# BetterMonday Demo — Godot 4.x

F5 누르면 실행되는 디자인 시스템 시뮬레이션.

## 실행 방법
1. Godot 4.3+ 에디터 열기
2. Import → 이 폴더의 `project.godot` 선택
3. F5 (또는 ▶) 누르기

## 포함된 것
- **디자인 시스템 전체 적용** — `DesignTokens.gd` 색/타이포/간격/반경/모션 토큰
- **4개 탭**: 카페 · 작업실 · 도감 · 설정
- **카페**: 주문 시스템 (타이머, 랜덤 원소 손님), 원소 배달 버튼 5개
- **작업실**: 7×7 머지 보드, 드래그&드롭으로 같은 원소+같은 등급 합성
- **도감**: 오행 5종 카드
- **설정**: 저장/초기화
- **모달**: 레벨업 다이얼로그
- **Autoload 싱글턴**: GameState, SaveLoad, DesignTokens
- **자동 저장**: 30초마다 `user://save.json`

## 플레이 흐름
1. 카페에서 "🔔 손님 받기" → 랜덤 원소 주문 생성
2. 작업실에서 "+ 슬라임 소환" (⚡1 소모) 또는 기존 슬라임 드래그해서 합성
3. 카페로 돌아와 해당 원소 배달 버튼 → 주문 완료 → 💰+12, EXP+8
4. 레벨업 시 모달 → 💰+50, 💎+1

## 파일 구조
```
project.godot                 — F5 진입점 (Main.tscn 자동 실행)
autoload/
  GameState.gd                — 중앙 상태 + 시그널 허브
  SaveLoad.gd                 — user://save.json
scripts/
  ui/DesignTokens.gd          — ⭐ 모든 토큰 단일 출처
  Main.gd, HUD.gd
  CafeScene.gd, WorkshopScene.gd, DexScene.gd, SettingsScene.gd
scenes/Main.tscn              — 유일한 씬 (4개 탭이 모두 들어있음)
CLAUDE.md                     — VSCode Claude Code 규칙
docs/design/                  — 토큰 레퍼런스 (참조용)
```

## 검증 포인트
- **F5 실행** → 세로 540×960 크림색 화면, 상단 HUD 칩 4개
- **탭 전환** → 선택된 탭이 로스트 색으로 하이라이트
- **합성** → 같은 원소+같은 등급 드래그시 글리프에 숫자 뱃지 (🔥2 등)
- **원소 색** → 각 오행이 정확히 다른 색으로 구분 (목=녹색, 화=단청 레드, 토=점토, 금=금색, 수=청색)
