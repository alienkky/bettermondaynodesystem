# BetterMonday — Final Deliverables

> 지금까지 작업한 결과물을 한 곳에 정리한 패키지.

---

## 📁 폴더 구조

```
final/
├── godot-project/              ⭐ Godot 프로젝트에 그대로 드롭인
│   ├── CLAUDE.md                  # VSCode Claude Code용 규칙 (루트에 둠)
│   ├── scripts/
│   │   └── ui/
│   │       └── DesignTokens.gd    # ⭐ 디자인 토큰 단일 출처
│   └── docs/
│       └── design/
│           ├── colors_and_type.css # 웹 프리뷰용 (참조)
│           └── tokens.md           # 사람이 읽는 토큰 레퍼런스
│
└── dashboards/                 🎨 참조용 웹 대시보드
    ├── Scene Tree + Flow Dashboard.html   # 3패널 씬트리+플로우+인스펙터
    ├── Game Flow Diagrams.html            # 전체 진행·상태머신·씬맵·데이터플로우
    ├── colors_and_type.css                # 대시보드가 참조하는 CSS
    └── DesignSystem-README.md             # 디자인 시스템 전체 README
```

---

## 🚀 적용 순서

### 1. Godot 프로젝트에 복사
`final/godot-project/` 안의 모든 파일을 실제 Godot 프로젝트 루트에 그대로 복사.
- `CLAUDE.md` → 프로젝트 루트
- `scripts/ui/DesignTokens.gd` → 같은 경로
- `docs/design/*` → 같은 경로 (참조용)

### 2. VSCode 열기
Godot 프로젝트 루트에서 VSCode 열면 Claude Code가 `CLAUDE.md`를 자동으로 읽음.

### 3. 첫 작업 지시
```
@scripts/ui/DesignTokens.gd 읽고 전체 토큰 구조 파악해줘.
그다음 씬 스켈레톤부터 만들자: Main.tscn, ShopScene.tscn, WorkshopScene.tscn
색·폰트·간격은 전부 DesignTokens 상수만 써.
```

### 4. 대시보드는 참조용
`final/dashboards/*.html`은 브라우저에서 직접 열어서 디자인 레퍼런스로만 사용.
Godot에 넣지 않음.

---

## 🔜 다음에 필요한 것

- [ ] **이미지 에셋** (로고, 12지신, 가구, 슬라임 등) — AI 생성 또는 외주
- [ ] **폰트 파일** (.ttf/.otf) — `assets/fonts/` 아래
- [ ] **오디오** — BGM / SFX
- [ ] **Theme 리소스** — `scripts/tools/build_theme.gd`에서 DesignTokens → `.tres` 변환
