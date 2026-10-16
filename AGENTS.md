# AlienNode 유지보수

`README.md`와 `docs/ARCHITECTURE.md`를 먼저 읽는다. 다른 프로젝트 적용은 `docs/REUSE.md`를 따른다.

- 실제 실행 소스는 네 개의 루트 캔버스 HTML과 공통 JS/CSS다. `/`는 `AlienNode.html`을 제공한다.
- 이전 BetterMonday 생성 번들은 보존 자료다. 직접 편집하거나 현재 배포본으로 설명하지 않는다.
- 캔버스에서 저장소 접근은 `aliennode-storage.js`의 API를 사용한다. default 프로젝트의 기존 저장 키를 유지한다.
- Reference Canvas와 다른 캔버스의 데이터 모델을 혼동하지 않는다. 필드 추가 시 기존 JSON과 저장 데이터 호환성을 확인한다.
- 기본 토큰과 테마 재정의 파일을 함께 확인한다. 프로젝트 도메인에 종속된 샘플을 범용 런타임에 추가하지 않는다.
- 검증: `npm test`. 패키징: `npm run package:portable`.
- main에 대한 push는 기존 Railway 배포를 촉발할 수 있다. 검토 가능한 브랜치/PR로 변경을 전달한다.
