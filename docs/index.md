# Step Index

이 문서는 `NextJsBlog_Steps` 저장소의 전체 단계 흐름을 한눈에 보기 위한 인덱스입니다.

각 브랜치는 이전 브랜치 위에 기능과 설명을 누적합니다. 따라서 중간 단계에서 문제가 생기면 그 단계에서 고치고, 이후 단계로 순차 merge하는 방식으로 관리합니다.

## 전체 흐름

| 단계 | 한 줄 요약 |
| --- | --- |
| `main` | `create-next-app` 직후의 Next.js 기본 프로젝트 상태입니다. |
| `step-1` | App Router의 기본 라우팅을 익히기 위해 Home, About, Post, Contact 페이지와 공통 Header/Footer를 만듭니다. |
| `step-2` | `simpledotcss`와 `next/image`를 적용해 기본 화면을 정돈하고 외부 이미지 도메인 설정을 추가합니다. |
| `step-3` | MongoDB 연결, 환경 변수, 게시글 데이터 함수를 만들어 서버 데이터 계층을 준비합니다. |
| `step-4` | 게시글 목록/작성/단건조회/수정 API Route를 만들고 `{ success, message, data }` 응답 형식을 통일합니다. |
| `step-5` | 홈 목록에서 게시글을 불러오고 제목 클릭으로 상세 화면까지 이동하는 읽기 흐름을 완성합니다. |
| `step-6` | 새 게시글 작성 form을 만들고 `POST /api/post` 요청으로 MongoDB에 글을 저장합니다. |
| `step-7` | 상세 화면에서 수정 화면으로 이동하고 기존 글을 불러와 `PUT /api/post/[id]`로 수정합니다. |
| `step-8` | Contact 페이지를 mockup form으로 바꾸고 controlled input과 submit 이벤트를 복습합니다. |
| `step-9` | README, 불필요한 기본 자산, 최종 라우트/API 설명을 정리해 기본 블로그 단계를 마무리합니다. |
| `step-10` | 작성/수정 API에 서버 검증을 추가하고 공백 입력 오류 메시지를 화면에 표시합니다. |
| `step-11` | 제출 중 상태를 추가하고 작성/수정 성공 후 해당 게시글 상세 페이지로 이동합니다. |
| `step-12` | 홈 목록과 상세 화면에 작성일과 수정일을 표시합니다. |
| `step-13` | MongoDB 삭제 함수, `DELETE /api/post/[id]`, 상세 화면 삭제 버튼으로 삭제 흐름을 완성합니다. |
| `step-14` | 브라우저가 이미 가진 목록 배열을 기준으로 클라이언트 필터 검색을 추가합니다. |
| `step-15` | `keyword` query string을 API로 보내 MongoDB에서 직접 검색하는 서버 검색을 추가합니다. |
| `step-16` | `page`와 `limit` query string, MongoDB `skip`/`limit`, Previous/Next 버튼으로 페이지네이션을 구현합니다. |
| `step-17` | `sort` query string과 정렬 select를 추가해 최신순, 오래된순, 제목순 정렬을 서버에서 처리합니다. |
| `step-18` | 전역 404, 상세 전용 404, 전역 Error UI를 추가해 오류 상황의 사용자 경험을 개선합니다. |
| `step-19` | 게시글 카테고리를 데이터, 작성/수정 form, 목록 필터, 상세 표시까지 전체 흐름에 연결합니다. |
| `step-20` | `simpledotcss`를 제거하고 Tailwind CSS v4를 설치한 뒤 공통 layout, nav, footer에 기본 utility class를 적용합니다. |
| `step-21` | 홈 목록, 상세 읽기 화면, About 페이지를 Tailwind utility class로 정리해 카드형 읽기 UI를 만듭니다. |
| `step-22` | 게시글 작성/수정 form과 Contact form에 같은 Tailwind 입력/버튼 패턴을 적용합니다. |
| `step-23` | 삭제 버튼, 전역 404, 상세 404, Error 화면을 Tailwind로 정리해 기본 UI 전환을 마무리합니다. |

## 단계 묶음

| 범위 | 학습 초점 |
| --- | --- |
| `step-1` ~ `step-2` | Next.js App Router의 화면 구조와 기본 스타일 |
| `step-3` ~ `step-4` | MongoDB 데이터 계층과 API Route |
| `step-5` ~ `step-7` | 게시글 읽기, 작성, 수정 CRUD 흐름 |
| `step-8` ~ `step-9` | 부가 화면과 기본 프로젝트 정리 |
| `step-10` ~ `step-13` | 검증, 사용자 경험, 날짜 표시, 삭제 |
| `step-14` ~ `step-17` | 검색, 페이지네이션, 정렬 같은 목록 기능 확장 |
| `step-18` ~ `step-19` | 오류 화면 개선과 카테고리 데이터 모델 확장 |
| `step-20` ~ `step-23` | Tailwind CSS v4 설치와 기본 UI 정리 |

## 읽는 순서

처음 실습하는 경우에는 `main`에서 시작해 `step-1`, `step-2` 순서로 브랜치를 이동하며 확인합니다.

각 단계의 자세한 설명은 같은 폴더의 `step-N.md` 문서를 읽으면 됩니다.

예를 들어 `step-6`을 실습한다면 다음 순서가 좋습니다.

```txt
1. step-5까지의 기능이 무엇인지 확인한다.
2. docs/step-6.md를 읽는다.
3. step-6 브랜치의 변경 파일을 확인한다.
4. 브라우저에서 새 게시글 작성 흐름을 테스트한다.
```

이 저장소는 완성된 프로젝트를 한 번에 보는 용도보다, 기능이 어떤 순서로 누적되는지 확인하는 데 초점을 둔 실습용 저장소입니다.
