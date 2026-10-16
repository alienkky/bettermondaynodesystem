# AlienNode 구조와 데이터 계약

기준: 2026-10-16, 원본 `alienkky/bettermondaynodesystem`, 커밋 `77e074470e41e08a020f92ba594377395b76faaa`.

## 실행 구조

`AlienNode.html` 프로젝트 선택 → `?project=<고유 ID>`를 포함한 캔버스 → JSON 내보내기 / Agent Brief → 프로젝트 구현 → 캔버스 기준 검토.

- `Reference Canvas.html`: 이미지·메모·구조·사고·에이전트 노드와 관계를 작성한다.
- `Flow Editor.html`: 흐름과 분기를 편집한다.
- `Flow Diagrams.html`, `Structure + Flow Dashboard.html`: 각각 흐름과 구조를 검토한다. 기존 편집 기능도 유지한다.
- `canvas-interact.js`, `touch-input.js`: 공통 상호작용, 터치 지원.
- `colors_and_type.css`: 기본 디자인 토큰. `figma-theme.css`: 실제 캔버스 테마 재정의. `settings.js`: 테마·밀도·힌트 설정.
- `aliennode-storage.js`: 프로젝트별 localStorage / IndexedDB 이름을 결정한다.
- `server.js`: Express 정적 서버. `/`는 AlienNode 시작 화면, `/__version`은 앱 이름과 제공 파일을 반환한다.

## 실제 지원 노드

| 층 | 지원 kind |
|---|---|
| 목적 | goal, metric |
| 사고 | note, question, assumption, evidence, constraint, risk, feedback |
| 구조 | ref, screen, system, group, icon |
| 판단 | decision |
| 에이전트 | agent, prompt |
| 실행 | task, output, status |

Reference Canvas는 위 20개 kind를 지원한다. 다른 세 캔버스는 별도 모델이므로 Reference Canvas의 모든 kind를 지원한다고 가정하지 않는다.

## Reference Canvas JSON

최상위는 `{ "nodes": [], "edges": [] }`다. 노드는 `id`, `kind`, `title`, `sub`, `x`, `y`를 사용한다. note 본문은 `body`, 이미지 데이터는 `src`, 크기는 `w`/`h`, 아이콘은 `glyph`다. `id`는 그래프 안에서 고유해야 한다. 템플릿 ID는 `starter-` 접두를 사용해 UI의 `n100`, `e100` 생성기와 충돌하지 않는다.

엣지는 `id`, `from`, `to`, `label`을 사용한다. `from`/`to`는 실제 노드 ID여야 한다. 관계의 의미는 `label`에 `supports`, `requires`, `blocks`, `produces`, `decides` 등으로 기록할 수 있다. 별도 `relation` 필드와 confidence/status/tags 전용 편집기는 아직 공통 구현 계약이 아니다. 필요하면 노드의 설명이나 별도 status 노드를 활용한다.

Agent Brief는 이미지 설명, 메모, 화면, 시스템, 결정, 사고 노드, 에이전트·요청·작업·결과물, 연결 관계를 Markdown으로 모은다. 이미지를 실제로 업로드하거나 AI를 호출하지 않는다. 에이전트 노드는 역할 기록이며 에이전트 실행 기능이 아니다.

## 저장과 호환성

- `project=default` 또는 project 생략: 기존 `bm-*` localStorage 키와 `bm-ref-canvas-db`를 그대로 사용한다. 이전 작업을 이름 변경 때문에 잃지 않는다.
- 다른 프로젝트: 키와 DB 이름 앞에 `aliennode:<URL 인코딩한 프로젝트 ID>:`를 붙인다. 프로젝트 ID는 대소문자와 공백을 구분한다.
- 같은 프로젝트에서도 캔버스별 키는 분리된다. 캔버스 간 자동 동기화는 없다.
- Reference Canvas의 주 저장소는 IndexedDB다. 기존 localStorage 데이터 이동 로직과 파일 연결 기능을 유지한다.
- 브라우저 저장소는 origin별이다. 도메인·포트·브라우저를 변경하거나 `file://`로 이동하면 기존 저장소가 따라오지 않는다. Export JSON → 새 위치의 Load로 이전한다.
- 프로젝트 ID는 저장 충돌 방지용이며 권한·인증 경계가 아니다. JSON 가져오기는 현재 캔버스를 대체하므로 먼저 내보낸다.
- Drive 복사본은 문서·코드의 스냅샷이다. 현재 브라우저의 작업이나 이후 수정이 자동 동기화되지는 않는다.

## 이전 자료

`BetterMonday 노드 디자인 시스템.html`은 이전 생성 번들로 보존한다. 신규 AlienNode 진입점과 별개이며 직접 문자열을 치환하지 않는다. `final/`, `godot-*`, `merge/`, `ui_kits/`, `preview/`, `uploads/`는 기존 사례·자료로 보존하고 범용 배포 패키지에서 제외한다.

원본에 저장소 수준 LICENSE가 없으므로 제3자 재배포 권리를 새로 선언하지 않는다. 포함된 폰트 등 외부 자산의 사용 조건은 별도 확인한다.
