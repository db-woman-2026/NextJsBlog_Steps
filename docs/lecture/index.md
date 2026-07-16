# Next.js 단계별 실습

`step-5` 브랜치에서 사용할 수 있는 실습형 강의 자료입니다.
각 문서는 작업을 기능 단위로 나누고, 설명 아래에 수정할 파일과 diff를 함께 제시합니다.

Windows 11에서는 [Windows 11 환경 준비](../windows-11.md)를 마친 뒤 시작합니다.

강의 실습은 이 `docs/lecture/` 문서를 기준으로 진행합니다.

- [과정 계획](../course-plan.md): 권장 시간, 선수 단계, 단계별 독립 확인 과제
- [문제 해결](../troubleshooting.md): branch, 설치, MongoDB, API, Client Component 오류 진단

## 문서와 branch 사용법

따라 하기와 완성본 확인을 구분합니다.

- 따라 하기: `step-N.md`의 diff는 `step-(N-1)` 완료 코드에 적용합니다. `step-1`만 `main`에서 시작합니다.
- 완성본 확인: `step-N` branch에는 해당 diff가 이미 반영되어 있습니다. 파일 링크와 최종 실행 결과를 비교할 때 사용합니다.

강사용 누적 저장소에서 따라 한다면 현재 문서는 웹 또는 별도 배포본으로 열고 코드는 직전 branch에서 수정합니다. 현재 `step-N` branch를 checkout한 상태에서는 같은 diff를 다시 적용하지 않습니다.

## 실습 전 선수 학습

JavaScript, React, Next.js 구조와 용어가 아직 익숙하지 않다면 실습 전에 [Basic Course](../basic/index.md)를 순서대로 읽습니다. basic 문서의 코드는 프로젝트에 적용하는 diff가 아니라, 실습에서 만날 문법을 짧은 예제로 먼저 익히기 위한 자료입니다.

## 강의 목록

| 단계 | 강의 자료 | 요약 |
| --- | --- | --- |
| `step-1` | [lecture/step-1.md](./step-1.md) | App Router의 기본 라우팅을 익히기 위해 Home, About, Post, Contact 페이지와 공통 Header/Footer를 만듭니다. |
| `step-2` | [lecture/step-2.md](./step-2.md) | simpledotcss와 next/image를 적용해 기본 화면을 정돈하고 외부 이미지 도메인 설정을 추가합니다. |
| `step-3` | [lecture/step-3.md](./step-3.md) | MongoDB 연결, 환경 변수, 게시글 데이터 함수를 만들어 서버 데이터 계층을 준비합니다. |
| `step-4` | [lecture/step-4.md](./step-4.md) | 게시글 목록/작성/단건조회/수정 API Route를 만들고 { success, message, data } 응답 형식을 통일합니다. |
| `step-5` | [lecture/step-5.md](./step-5.md) | 홈 목록에서 게시글을 불러오고 제목 클릭으로 상세 화면까지 이동하는 읽기 흐름을 완성합니다. |

## 실습 방식

1. 첫 실습을 시작하기 전에 `npm ci`를 실행해 프로젝트 의존성을 설치합니다.
2. 현재 단계 문서의 Overview를 먼저 읽고 이번에 완성할 기능을 파악합니다.
3. 각 작업 단위의 설명을 읽은 뒤, `수정할 파일` 링크로 프로젝트 내부 파일을 엽니다.
4. `코드 변경` diff에서 `+` 줄은 추가하고 `-` 줄은 제거합니다.
5. npm 명령으로 자동 변경되는 파일은 직접 타이핑하지 말고 결과만 확인합니다.
6. 실행 확인 명령과 브라우저 체크를 마친 뒤 다음 단계로 넘어갑니다.
7. 과정 계획의 독립 확인 과제를 diff 없이 수행하고, 필요하면 원래 코드로 복구합니다.
