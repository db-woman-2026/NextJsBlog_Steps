# Lecture Index

이 폴더는 `step-10` 브랜치에서 사용할 수 있는 실습형 강의 자료입니다.
각 문서는 이전 단계에서 시작해 해당 단계 브랜치의 실제 코드와 같아지도록 파일 단위로 안내합니다.

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

## 실습 방식

1. 현재 브랜치에서 제공하는 마지막 단계까지 순서대로 읽습니다.
2. 각 문서의 시작 기준 브랜치를 확인합니다.
3. 수정 파일 표를 보고 파일을 하나씩 엽니다.
4. 코드 작성 섹션의 최종 코드를 기준으로 직접 입력하거나 비교합니다.
5. 실행 확인 섹션의 명령과 브라우저 확인을 끝낸 뒤 다음 단계로 넘어갑니다.
