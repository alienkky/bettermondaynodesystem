# AlienNode — 프로젝트 노드 시스템

목표·근거·구조·결정·에이전트·작업을 노드로 연결하고, 실행 가능한 브리프로 전달하는 ALIEN AGENTIC의 범용 기획 도구입니다.

원본: [alienkky/bettermondaynodesystem](https://github.com/alienkky/bettermondaynodesystem), 기준 커밋 `77e074470e41e08a020f92ba594377395b76faaa`.

## 실행

```sh
npm ci
npm start
```

`http://localhost:3000`에서 AlienNode 시작 화면을 엽니다. 프로젝트 ID를 정하고 원하는 캔버스를 선택합니다. 같은 origin 안에서도 프로젝트별 작업을 분리합니다.

| 캔버스 | 용도 |
|---|---|
| Reference Canvas | 레퍼런스·사고·에이전트·실행 노드와 Agent Brief |
| Flow Editor | 단계·분기·화면 흐름 편집 |
| Flow Diagrams | 플로우 검토 |
| Structure + Flow | 구조 트리와 흐름 검토 |

Reference Canvas에서 `templates/project-starter.json`을 Load하면 바로 시작할 수 있습니다. Load는 현재 작업을 대체하므로 기존 작업은 먼저 Export JSON으로 보관하세요.

## 다른 프로젝트에서 재사용

```sh
npm run package:portable
```

생성된 `dist/aliennode/`를 대상 프로젝트의 `tools/aliennode/` 등에 복사합니다. HTML·JS·CSS·fonts를 함께 유지하세요. 서버 없이 HTML을 직접 열 수도 있지만 저장소·파일 API의 일관성을 위해 로컬 서버 사용을 권장합니다.

- [구조·노드·저장 계약](docs/ARCHITECTURE.md)
- [프로젝트 적용 방법과 스킬 설치](docs/REUSE.md)
- [프로젝트 에이전트 지침](templates/AGENTS.aliennode.md)
- [시작 그래프](templates/project-starter.json)

`$aliennode` 사용자 전역 스킬을 설치하면 다른 프로젝트에서도 같은 노드 체계를 요청할 수 있습니다. 스킬은 명시적으로 호출하거나 해당 작업에 맞을 때 선택됩니다. 모든 대화가 자동으로 이 내용을 기억한다고 보장하지는 않습니다.

## 호환성과 검증

프로젝트 ID 생략 또는 `default`는 기존 BetterMonday 브라우저 저장 키를 유지합니다. 다른 ID는 별도 localStorage/IndexedDB 공간을 사용합니다. 도메인·포트·기기 변경 시에는 Export JSON / Load로 옮깁니다. Drive 업로드는 파일 스냅샷이며 자동 동기화가 아닙니다.

`npm test`로 프로젝트 저장 분리, 기본 데이터 호환성, HTML 스크립트 문법, 템플릿 관계와 서버 진입점을 확인합니다.

기존 `BetterMonday 노드 디자인 시스템.html` 생성 번들과 게임/미리보기 자료는 보존합니다. 새 진입점은 `AlienNode.html`이며 번들 JSON을 직접 편집하지 않습니다. 기존 Railway 연결과 저장소 이름은 유지되며, main push는 이전 배포를 갱신할 수 있습니다.
