# Lecture Index

이 폴더는 `step-17` 브랜치에서 사용할 수 있는 실습형 강의 자료입니다.
각 문서는 이전 단계에서 현재 단계로 넘어오며 바뀌는 기능을 작업 단위로 나누고, 설명 바로 아래에 프로젝트 내부 파일 링크와 실제 diff를 제공합니다.

원본 개요 문서는 `docs/overview/`에 보존되어 있습니다. 강의 실습은 이 `docs/lecture/` 문서를 기준으로 진행합니다.

## 강의 목록

| 단계 | 강의 자료 | 원본 개요 | 요약 |
| --- | --- | --- | --- |
| `step-1` | [lecture/step-1.md](./step-1.md) | [overview/step-1.md](../overview/step-1.md) | App Router의 기본 라우팅을 익히기 위해 Home, About, Post, Contact 페이지와 공통 Header/Footer를 만듭니다. |
| `step-2` | [lecture/step-2.md](./step-2.md) | [overview/step-2.md](../overview/step-2.md) | simpledotcss와 next/image를 적용해 기본 화면을 정돈하고 외부 이미지 도메인 설정을 추가합니다. |
| `step-3` | [lecture/step-3.md](./step-3.md) | [overview/step-3.md](../overview/step-3.md) | MongoDB 연결, 환경 변수, 게시글 데이터 함수를 만들어 서버 데이터 계층을 준비합니다. |
| `step-4` | [lecture/step-4.md](./step-4.md) | [overview/step-4.md](../overview/step-4.md) | 게시글 목록/작성/단건조회/수정 API Route를 만들고 { success, message, data } 응답 형식을 통일합니다. |
| `step-5` | [lecture/step-5.md](./step-5.md) | [overview/step-5.md](../overview/step-5.md) | 홈 목록에서 게시글을 불러오고 제목 클릭으로 상세 화면까지 이동하는 읽기 흐름을 완성합니다. |
| `step-6` | [lecture/step-6.md](./step-6.md) | [overview/step-6.md](../overview/step-6.md) | 새 게시글 작성 form을 만들고 POST /api/post 요청으로 MongoDB에 글을 저장합니다. |
| `step-7` | [lecture/step-7.md](./step-7.md) | [overview/step-7.md](../overview/step-7.md) | 상세 화면에서 수정 화면으로 이동하고 기존 글을 불러와 PUT /api/post/[id]로 수정합니다. |
| `step-8` | [lecture/step-8.md](./step-8.md) | [overview/step-8.md](../overview/step-8.md) | Contact 페이지를 mockup form으로 바꾸고 controlled input과 submit 이벤트를 복습합니다. |
| `step-9` | [lecture/step-9.md](./step-9.md) | [overview/step-9.md](../overview/step-9.md) | README, 불필요한 기본 자산, 최종 라우트/API 설명을 정리해 기본 블로그 단계를 마무리합니다. |
| `step-10` | [lecture/step-10.md](./step-10.md) | [overview/step-10.md](../overview/step-10.md) | 작성/수정 API에 서버 검증을 추가하고 공백 입력 오류 메시지를 화면에 표시합니다. |
| `step-11` | [lecture/step-11.md](./step-11.md) | [overview/step-11.md](../overview/step-11.md) | 제출 중 상태를 추가하고 작성/수정 성공 후 해당 게시글 상세 페이지로 이동합니다. |
| `step-12` | [lecture/step-12.md](./step-12.md) | [overview/step-12.md](../overview/step-12.md) | 홈 목록과 상세 화면에 작성일과 수정일을 표시합니다. |
| `step-13` | [lecture/step-13.md](./step-13.md) | [overview/step-13.md](../overview/step-13.md) | MongoDB 삭제 함수, DELETE /api/post/[id], 상세 화면 삭제 버튼으로 삭제 흐름을 완성합니다. |
| `step-14` | [lecture/step-14.md](./step-14.md) | [overview/step-14.md](../overview/step-14.md) | 브라우저가 이미 가진 목록 배열을 기준으로 클라이언트 필터 검색을 추가합니다. |
| `step-15` | [lecture/step-15.md](./step-15.md) | [overview/step-15.md](../overview/step-15.md) | keyword query string을 API로 보내 MongoDB에서 직접 검색하는 서버 검색을 추가합니다. |
| `step-16` | [lecture/step-16.md](./step-16.md) | [overview/step-16.md](../overview/step-16.md) | page와 limit query string, MongoDB skip/limit, Previous/Next 버튼으로 페이지네이션을 구현합니다. |
| `step-17` | [lecture/step-17.md](./step-17.md) | [overview/step-17.md](../overview/step-17.md) | sort query string과 정렬 select를 추가해 최신순, 오래된순, 제목순 정렬을 서버에서 처리합니다. |

## 실습 방식

1. 현재 단계 문서의 Overview를 먼저 읽고 이번에 완성할 기능을 파악합니다.
2. 각 작업 단위의 설명을 읽은 뒤, `수정할 파일` 링크로 프로젝트 내부 파일을 엽니다.
3. `이전 단계와 달라지는 코드` diff에서 `+` 줄은 추가하고 `-` 줄은 제거합니다.
4. 새 파일은 diff에 표시된 전체 내용을 입력하고, 삭제 파일은 문서의 명령으로 제거합니다.
5. 실행 확인 명령과 브라우저 체크를 마친 뒤 다음 단계로 넘어갑니다.
