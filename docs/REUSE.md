# 다른 프로젝트에 AlienNode 적용하기

## 빠른 시작

1. AlienNode 저장소에서 `npm ci`, `npm start`를 실행하고 `http://localhost:3000`을 연다.
2. 프로젝트 ID를 예: `alien-website`, `client-brand-a`처럼 고유하게 정한다.
3. Reference Canvas에서 `templates/project-starter.json`을 Load한다. 이미 작업 중이면 먼저 Export JSON으로 백업한다.
4. 목표 → 제약·근거 → 구조 → 결정 → 작업 → 결과물을 연결한다. 필요한 노드만 사용한다.
5. Agent Brief를 생성해 프로젝트 에이전트에 전달한다. JSON 원본과 브리프를 해당 프로젝트의 `docs/aliennode/` 같은 위치에 보관한다.
6. 실제 결과·피드백을 캔버스에 반영하고 다시 내보낸다.

`AlienNode.html`을 폴더에서 직접 열 수도 있지만, 브라우저마다 file URL 저장소와 파일 API 지원이 다르므로 로컬 서버 실행을 권장한다. CSS·JS·fonts를 HTML과 함께 유지해야 한다. 현재 소스는 파일 하나로 완결되는 번들이 아니다.

## 프로젝트 폴더에 도구까지 복사

원본에서 `npm run package:portable`을 실행하면 `dist/aliennode/`에 필요한 파일만 모인다. 이 폴더를 대상 프로젝트의 `tools/aliennode/`로 복사한다. 기존 경로가 있으면 차이를 확인하고 합친다. `node_modules`, 과거 번들, 게임 사례와 기존 업로드는 포함하지 않는다.

복사본 안에서 `npm ci`, `npm start`를 실행한다. 다른 서버와 포트가 겹치면 PowerShell에서 `$env:PORT=3100; npm start`를 사용한다. 포트 변경 전 JSON을 내보내야 기존 브라우저 작업을 옮길 수 있다.

## 에이전트에게 전달

대상 프로젝트의 기존 `AGENTS.md`에 `templates/AGENTS.aliennode.md`의 내용을 필요한 만큼 병합한다. 기존 규칙을 덮어쓰지 않는다. 사용자 전역 스킬 `$aliennode`를 설치하면 해당 프로젝트에서 "AlienNode로 목표와 작업 흐름을 정리해줘"라고 요청할 수 있다.

스킬 설치는 저장소의 `SKILL.md`를 `~/.codex/skills/aliennode/SKILL.md`로 복사하고, `docs/`를 `references/`로, `dist/aliennode/`를 `assets/aliennode/`로 복사하는 방식이다. 설치된 스킬에는 코드와 설명 스냅샷이 있으므로 원본을 이동해도 사용할 수 있다. 최신 소스로 갱신할 때는 패키지와 스킬 자산을 함께 갱신한다.

## 적용 예

- 웹: 방문자 목표 → 화면 → 이동 흐름 → 구현 작업 → 검증 결과.
- 브랜딩: 브랜드 목표 → 레퍼런스 → 근거 → 결정 → 납품물.
- 서비스: 문제 → 가정 → 근거 → 시스템 → 위험 → 실행 작업.

다른 프로젝트의 디자인 토큰·프레임워크를 바꾸는 것은 별도의 작업이다. 기획 노드 체계를 활용하는 것만으로 대상 제품의 UI를 교체하지 않는다.
