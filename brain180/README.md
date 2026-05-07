# Brain180 — 뇌인지구조 시각화 프로그램

> **브레인OS연구소** | Install the author's brain  
> 천재 저자의 뇌인지구조를 4차원으로 시각화하여 글을 역방향으로 이해하는 혁신적 학습 시스템

---

## 핵심 개념

### 기존 독서 방식 (1차원)
```
텍스트 → 읽기 → 내용 이해
```

### Brain180 방식 (4차원)
```
텍스트 ──→ [LENS AI] ──→ 뇌인지구조 추출
                                 ↓
                       4차원 시각화 맵 생성
                                 ↓
               학생이 시각화 맵을 통해 저자의 마음 이해
                                 ↓
                    시각화 → 역방향으로 텍스트 재해석
```

### 4차원 해석 레이어

| 차원 | 내용 | IQ 수준 |
|------|------|---------|
| 1차원 | 내용 이해 (What) | IQ 90 (평재) |
| 2차원 | 구조 인식 (How) | IQ 120 |
| 3차원 | 관계망 파악 (Why) | IQ 150 (영재) |
| **4차원** | **저자의 시공간적 사고 패턴 (Who thinks like this)** | **IQ 180 (천재)** |

---

## 브레인샷 프로젝트 — 3단계 업그레이드

```
[뇌인지구조]
      ↓
  IQ 90 (평재)  ─→ 뇌인지구조 인식 가능
      ↓
  IQ 150 (영재) ─→ 고난도 텍스트/문제 처리 가능
      ↓
  IQ 180 (천재) ─→ 초고난도 텍스트/문제 처리 가능
                   저자처럼 생각하며 4차원 해석
```

---

## 핵심 기술 3가지

| 기술 | 설명 |
|------|------|
| **저자의 렌즈 시각화** | 텍스트 내용이 아닌, 저자의 뇌인지구조를 추출하여 노드 그래프로 시각화 |
| **인지 프로세스 커플링** | 저자의 생각하는 방식을 그대로 따라하며 아이의 뇌에서 재현 |
| **뇌인지역량 업그레이드** | 천재들의 머리 쓰는 방식을 따라하는 과정에서 천재성 획득 |

---

## 4단계 LENS-Coupling-Speech-Feedback 사이클

```
[1] LENS      텍스트 → 저자 뇌인지구조 추출 → 4차원 시각화 맵
                    ↓
[2] Coupling  학생이 저자의 렌즈로 텍스트를 설명 (인지 커플링 스피치)
                    ↓
[3] Speech    문장 단위 실시간 검증 (✓ correct / △ partial / ✗ incorrect / ↗ off_lens)
                    ↓
[4] Feedback  저자 구조 vs 학생 구조 비교 → 업그레이드된 뇌인지 처방
                    ↓
              반복 → IQ 90 → 150 → 180
```

### 셀프 피드백 시스템

| 단계 | 기능 |
|------|------|
| **LENS** | 저자 렌즈 모델링 — 텍스트로부터 저자의 뇌인지구조를 추출 |
| **Coupling** | 인지 커플링 스피치 — 모델링한 저자의 렌즈를 통해 텍스트 설명 |
| **Speech** | 즉각적 검증 — 스피치 과정에서 이해도가 즉시 검증 |
| **Feedback** | 모델 개선 — 저자의 실제 뇌인지구조에 가까워지도록 처방 |

---

## 기술 스택

- **AI**: Claude API (`claude-sonnet-4-6`)
- **Backend**: Python 3.11+ + FastAPI
- **Frontend**: HTML/CSS/JS + D3.js (인터랙티브 4차원 노드 그래프)
- **시각화**: JSON 기반 노드-엣지 그래프 (force-directed layout)

---

## 폴더 구조

```
brain180/
├── prompts/                    # AI 시스템 프롬프트 (핵심)
│   ├── 01_lens.md              # LENS: 저자 뇌인지구조 추출 + 4차원 시각화 데이터
│   ├── 02_coupling.md          # Coupling: 인지 커플링 스피치 평가
│   ├── 03_speech.md            # Speech: 실시간 문장 검증
│   └── 04_feedback.md          # Feedback: 종합 피드백 + 브레인샷 처방
├── docs/
│   ├── system_design.md        # 시스템 아키텍처 설계
│   └── visualization_spec.md   # 4차원 시각화 명세 (D3.js)
├── src/
│   ├── app.py                  # FastAPI 백엔드
│   ├── brain_analyzer.py       # Claude API 통합
│   └── static/
│       └── index.html          # 프론트엔드 (D3.js 4차원 시각화)
├── examples/
│   └── sample_lens_output.json # LENS 출력 예시
└── requirements.txt
```

---

## 빠른 시작

```bash
pip install -r requirements.txt
export ANTHROPIC_API_KEY=your_key_here
python src/app.py
# → http://localhost:8000
```

---

## 8,192가지 뇌인지 행동 유형

13가지 이진 축의 조합 (2¹³ = 8,192)으로 각 아이의 고유한 뇌인지 행동 유형을 분류.  
진로적성검사 결과가 13자리 이진수로 표현되며, 이를 기반으로 어떤 천재의 렌즈가 가장 잘 맞는지 매칭합니다.  
상세: `docs/system_design.md` 참조.
