# BetterMonday — 노드 디자인 시스템 (기획용 캔버스 툴)

> 디자이너가 AI 작업에 앞서 **구조와 디자인 레퍼런스를 시각적으로 기획**하기 위한 단일 HTML 캔버스 툴.
> Claude Code가 이 프로젝트에서 작업할 때 항상 읽어야 할 규칙과 컨텍스트.

---

## 이 프로젝트의 정체

**노드 디자인 시스템** — AI에게 무언가를 요청하기 전에, 만들고 싶은 것의 **구조·관계·레퍼런스·플로우**를 캔버스 위에서 먼저 정리하는 디자이너 전용 **사전 기획 도구**.

### 핵심 사용 흐름

1. 디자이너가 머릿속의 아이디어를 캔버스 위에서 시각화 (노드 + 연결선 + 레퍼런스)
2. 구조가 명확해지면 그것을 근거로 AI(Claude, GPT 등)에게 정제된 프롬프트로 요청
3. AI 결과가 캔버스의 기획 의도와 맞는지 다시 캔버스에서 검증

> "AI에게 잘 시키려면, 먼저 내가 뭘 만들고 싶은지 시각적으로 알아야 한다."

### 왜 캔버스인가

- **선형 텍스트로는 표현 안 되는 것이 많다** — 노드 간 관계, 화면 흐름, 레퍼런스 군집
- **AI는 잘 구조화된 프롬프트일수록 잘 답한다** — 캔버스가 그 구조의 단초
- **사고 정리 자체가 디자이너의 일** — 캔버스 작성이 곧 기획 행위

---

## 도구 구성

| 캔버스 | 역할 |
|---|---|
| `Reference Canvas` | 자유 노드 배치 — 레퍼런스 이미지·텍스트·아이디어를 시각적으로 군집화 |
| `Flow Editor` (`Flow Editor.html`) | 화면/상태 플로우 작성 — 단계와 분기를 다이어그램으로 |
| `Flow Diagrams` (`Flow Diagrams.html`) | 작성된 플로우의 뷰어 (읽기 중심) |
| `Structure + Flow Dashboard` (`Structure + Flow Dashboard.html`) | 구조 트리와 플로우를 한 화면에서 검토 |

> 파일명은 범용 키워드로 통일됨 (`Flow Editor`, `Flow Diagrams`, `Structure + Flow Dashboard`). 초기에는 `Game Flow ...` / `Scene Tree ...`로 명명돼 있었음.

### 통합 진입점

`BetterMonday 노드 디자인 시스템.html` — 위 네 가지를 묶은 단일 HTML 번들. Railway 배포로 브라우저에서 바로 접근.

---

## 기술 스택

- **단일 HTML 번들**: 커스텀 번들러로 자산을 JSON 매니페스트에 인라인 후 base64+gzip 압축
- **서버**: Express.js 정적 서빙 (`server.js`)
- **배포**: Railway (`railway.json`)
- **개별 캔버스**: 각각 `.html` 단일 파일, 외부 빌드 없이 작동
- **저장**: 브라우저 `localStorage` / `IndexedDB`
- **디자인 토큰**: `colors_and_type.css` 단일 출처

---

## 폴더 구조

```
bettermondaynodesystem/
├── BetterMonday 노드 디자인 시스템.html   # 메인 번들 (배포용 단일 파일)
├── Reference Canvas.html                   # 노드 캔버스 (소스)
├── Flow Editor.html                        # 플로우 에디터 (소스)
├── Flow Diagrams.html                      # 플로우 뷰어 (소스)
├── Structure + Flow Dashboard.html         # 구조+플로우 통합 (소스)
├── canvas-interact.js                      # 캔버스 공통 인터랙션
├── colors_and_type.css                     # 디자인 토큰
├── server.js                               # Express 서버
├── package.json / railway.json
└── final/                                  # 보존된 산출물 / 아카이브
```

---

## 🔒 작업 원칙 (절대 준수)

### 1. 캔버스의 단순함을 지킨다
- 디자이너의 사고 흐름이 항상 우선. UI는 최소한.
- 자동화·AI 통합은 **선택적**으로만 — 핵심은 사용자가 직접 정리하는 행위.

### 2. 단일 파일 원칙
- 각 캔버스 `.html`은 **외부 빌드/설치 없이 더블클릭만으로 작동**해야 한다.
- 라이브러리는 CDN 의존이 아닌 인라인 임베드.

### 3. 번들 파일은 직접 편집 금지
- `BetterMonday 노드 디자인 시스템.html`은 커스텀 번들러로 생성된 13MB 단일 파일.
- 직접 텍스트 수정 시 `<script type="__bundler/template">` 안의 JSON 문자열이 깨질 위험 — 실제로 `Unterminated string in JSON at position 83477` 사고 발생 이력 있음.
- **수정 필요 시**: 소스 캔버스(`Reference Canvas.html` 등)를 먼저 고치고 → 재번들 → 배포.

### 4. 데이터는 사용자 로컬에
- 작업물은 모두 `localStorage` / `IndexedDB`로 보존.
- 키 충돌 방지를 위해 캔버스별 prefix 사용 (예: `bm-ref-canvas`).
- 클라우드 동기화는 향후 옵션.

### 5. 디자인 토큰만 사용
- 색·폰트 크기·간격·반경은 `colors_and_type.css`의 CSS 변수만 참조.
- raw 값(hex, px 매직 넘버) 직접 사용 금지.

❌ **금지**
```html
<div style="background: #6B3F2A; padding: 16px; font-size: 14px;">
```

✅ **올바름**
```html
<div style="background: var(--roast); padding: var(--sp-3); font-size: var(--ts-body);">
```

### 6. 캔버스 간 데이터 모델 분리
- 각 캔버스는 독립된 저장 키와 데이터 스키마를 가짐.
- 캔버스 간 직접 의존 없이 export/import 인터페이스로만 통신.

---

## 🛠 커밋 전 체크리스트

```bash
# 1. 번들 JSON 무결성 (가장 중요)
python3 -c "
import json
with open('BetterMonday 노드 디자인 시스템.html', encoding='utf-8') as f:
    c = f.read()
for tag in ['__bundler/manifest', '__bundler/template', '__bundler/ext_resources']:
    s = c.find(f'<script type=\"{tag}\">')
    e = c.find('</script>', s)
    body = c[s + len(f'<script type=\"{tag}\">'):e].strip()
    try: json.loads(body); print(f'{tag}: OK')
    except Exception as ex: print(f'{tag}: BROKEN — {ex}')
"

# 2. 외부 CDN 의존성 검사 (단일 파일 원칙 위반)
grep -n 'src="https://' *.html

# 3. 하드코딩된 색상값 검사
grep -n '#[0-9a-fA-F]\{3,6\}' *.html | grep -v colors_and_type.css

# 4. 매직 넘버 폰트 크기 검사
grep -n 'font-size:[^v;]*[0-9]\+px' *.html
```

---

## 📋 작업 패턴

### 패턴 A — 새 캔버스 추가
1. 가장 가까운 기존 캔버스 HTML 복제 (예: `Reference Canvas.html`)
2. `colors_and_type.css` 인라인 또는 `<link>` 참조
3. `canvas-interact.js`의 공통 인터랙션(드래그·확대·연결) 재사용
4. localStorage 키에 새 prefix 부여
5. `file://`로 직접 열어 작동 검증

### 패턴 B — 기존 캔버스 기능 추가
1. 해당 소스 `.html`만 수정 (번들은 건드리지 않음)
2. 데이터 스키마 변경 시 마이그레이션 코드 포함 (`if (legacy) { ...migrate... }`)
3. 변경 후 번들 재생성이 필요한지 명시적으로 결정

### 패턴 C — 디자인 토큰 변경
1. `colors_and_type.css`만 수정
2. 모든 캔버스에서 시각적 회귀 확인
3. 번들 재생성

### 패턴 D — 번들 재생성
1. 소스 캔버스 수정 완료
2. 번들러 스크립트로 재생성 (스크립트 위치/명령은 향후 추가 예정)
3. 재생성 직후 커밋 전 체크리스트 1번 (JSON 무결성) 필수 실행
4. 배포는 Railway 자동 (`git push origin main`)

---

## 🚫 자주 하는 실수

| 실수 | 올바른 방법 |
|---|---|
| 번들 HTML을 직접 텍스트 편집 | 소스 HTML 수정 후 재번들 |
| 외부 CDN 라이브러리 의존성 추가 | 인라인 임베드 |
| raw 색상/폰트 크기 사용 | `colors_and_type.css` 변수 |
| 자동 저장 없이 새로고침 가정 | localStorage 즉시 저장 보장 |
| "이 도구는 게임용"이라 가정 | 범용 기획 도구로 다룬다 |
| 캔버스 간 데이터를 직접 공유 | export/import로만 통신 |

---

## 🎯 Claude Code에게 작업 지시할 때 좋은 프롬프트 예시

```
Reference Canvas에 "그룹 라벨" 기능을 추가해줘.
- 여러 노드를 드래그로 묶고, 라벨 + 색상을 부여
- 색상은 colors_and_type.css의 element 토큰 중에서만 선택
- 저장은 기존 localStorage 키 bm-ref-canvas에 group[] 필드 추가
- 기존 데이터와의 마이그레이션 코드 포함
- 단일 HTML 파일만 수정 (번들은 건드리지 말 것)
```

```
모든 캔버스를 훑어서 colors_and_type.css 변수가 아닌
raw 색상값/폰트크기가 쓰인 곳을 목록으로 보여줘.
파일명:줄번호:원본값 형식으로.
```

```
번들 재생성용 Python 스크립트를 만들어줘.
- 입력: 소스 캔버스 .html 파일 목록
- 출력: BetterMonday 노드 디자인 시스템.html
- </script>는 반드시 <\/script>로 이스케이프
- 매니페스트/템플릿/외부리소스 3개 JSON 블록을 정확히 생성
- 생성 후 JSON.parse가 모두 통과하는지 자체 검증
```

---

## 명명 유래

- **BetterMonday** — 사용자(디자이너 alienkky)의 작업 브랜드명.
- **노드 디자인 시스템** — 노드 기반 캔버스 + 디자인 토큰 시스템.
- 초기 파일명에 `Game` 접두가 있었으나 범용 도구로 자리잡으며 제거됨 (히스토리는 git에 보존).

---

_도구는 기획을 위한 보조 수단이며, 사고의 명확성이 항상 우선한다._
_이 문서는 도구의 컨셉이 진화함에 따라 지속 업데이트._
