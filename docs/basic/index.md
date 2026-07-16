# Next.js 기초

`docs/lecture/` 실습 전에 읽을 기초 자료입니다. 프로젝트에서 반복해서 사용할 구조와 문법을 짧은 예제로 익힙니다.

Windows 11에서 실습한다면 먼저 [Windows 11 환경 준비](../windows-11.md)를 확인합니다.

여기의 예제 코드는 프로젝트 파일에 그대로 입력하는 diff가 아닙니다. 각 코드 블록은 특별한 안내가 없다면 서로 독립된 읽기 예제입니다. 코드를 한 줄씩 읽고 값이 어떻게 바뀌는지 말로 설명할 수 있으면 충분합니다.

## 배울 내용

전체 과정을 마치면 다음 내용을 알아볼 수 있어야 합니다.

- JavaScript의 변수, 함수, 배열, 객체 문법
- `import`, `export`, `async`, `await`, `fetch`의 역할
- HTML, CSS, JSX의 모양과 차이
- React 컴포넌트, props, state, 이벤트, form의 흐름
- Next.js App Router의 폴더 구조와 서버/클라이언트 컴포넌트
- URL, HTTP method, API, JSON, 상태 코드의 의미
- 환경 변수와 MongoDB 문서/컬렉션/CRUD의 기본 개념
- Tailwind CSS utility class를 읽는 방법

## 권장 순서

| 부 | 문서 | 내용 | 연결되는 실습 |
| --- | --- | --- | --- |
| 1. 준비 | [00. 학습 지도와 개발 환경](./00-learning-map.md) | 터미널, npm, `node_modules`, 실행 확인 | 모든 단계 |
| 1. 준비 | [01. 웹과 프로젝트 용어](./01-web-and-project-terms.md) | 브라우저, 서버, 요청, 응답, 경로 | `step-1` 이후 |
| 1. 언어 | [02. 값, 변수, 자료형, 연산자](./02-values-variables-types.md) | `const`, `let`, 문자열, 숫자, boolean | 모든 단계 |
| 1. 언어 | [03. 조건, 반복, 함수](./03-control-flow-functions.md) | `if`, 삼항 연산자, 함수, scope | 모든 단계 |
| 1. 언어 | [04. 배열과 객체](./04-arrays-and-objects.md) | `map`, `filter`, 구조 분해, spread | `step-1`, `step-3` 이후 |
| 1. 언어 | [05. 모듈, 문자열, 날짜](./05-modules-strings-dates.md) | `import`, `export`, template literal, `Date` | `step-1`, `step-12` 이후 |
| 1. 언어 | [06. 비동기와 오류 처리](./06-async-fetch-errors.md) | Promise, `async/await`, `fetch`, `try/catch` | `step-3` 이후 |
| 2. 화면 | [07. HTML, form, CSS](./07-html-forms-css.md) | 시맨틱 태그, 입력 요소, selector | `step-1`, `step-2` |
| 2. 화면 | [08. JSX와 컴포넌트](./08-jsx-components-props.md) | JSX, props, children, 조건/목록 렌더링 | `step-1` 이후 |
| 2. 화면 | [09. state, 이벤트, controlled form](./09-state-events-forms.md) | `useState`, 이벤트 객체, 입력 상태 | `step-6` 이후 |
| 2. 화면 | [10. effect와 데이터 로딩](./10-effects-data-loading.md) | `useEffect`, 의존성 배열, 로딩/오류 상태 | `step-5` 이후 |
| 3. Next.js | [11. App Router와 컴포넌트 경계](./11-nextjs-app-router.md) | `app`, `page.js`, `layout.js`, 서버/클라이언트 | `step-1` 이후 |
| 3. Next.js | [12. 경로, params, 이동, 특수 화면](./12-routes-navigation-errors.md) | 동적 경로, query string, `Link`, 404/Error | `step-4` 이후 |
| 3. 서버 | [13. HTTP, API, JSON, 검증](./13-http-api-json.md) | GET/POST/PUT/DELETE, 상태 코드, 응답 구조 | `step-4` 이후 |
| 3. 데이터 | [14. Node.js, 환경 변수, MongoDB](./14-node-env-mongodb.md) | 런타임, 비밀값, DB/collection/document, CRUD | `step-3` 이후 |
| 4. 스타일 | [15. Tailwind CSS 읽기](./15-tailwind-basics.md) | utility class, 상태/반응형 prefix | `step-20` 이후 |
| 4. 연결 | [16. 블로그 코드 흐름 읽기](./16-project-walkthrough.md) | 목록, 상세, 작성, 수정, 삭제 흐름 종합 | 실습 시작 전 |

## 장별 학습 방법

1. 각 장의 목표를 먼저 읽습니다.
2. 예제에서 입력값, 처리, 결과를 찾습니다.
3. 코드를 가리고 결과를 말해 봅니다.
4. `프로젝트에서 다시 만나기`에서 실제 실습 단계와 연결합니다.
5. 마지막 확인 문제를 말로 답할 수 있으면 다음 장으로 이동합니다.

문법을 전부 암기할 필요는 없습니다. 코드에서 본 적 있는 모양을 알아보고, 모르는 부분을 어느 장에서 다시 찾아야 하는지 알면 선수 학습의 목적을 달성한 것입니다.
