# 단계별 개요

Windows 11에서는 [Windows 11 환경 준비](../windows-11.md)를 마친 뒤 시작합니다.

전체 일정과 단계별 산출물은 [강의 운영안](../course-plan.md), 막혔을 때의 복구 순서는 [문제 해결](../troubleshooting.md)에서 확인합니다.

`step-23`까지의 기능 설명과 변경 이유를 정리했습니다. 입력 순서와 diff는 `docs/lecture/`에서 확인합니다.

## 전체 흐름

| 단계 | 개요 | 강의 자료 | 한 줄 요약 |
| --- | --- | --- | --- |
| 시작 | - | - | `create-next-app` 직후의 Next.js 기본 프로젝트 상태입니다. |
| `step-1` | [overview/step-1.md](./step-1.md) | [lecture/step-1.md](../lecture/step-1.md) | App Router의 기본 라우팅을 익히기 위해 Home, About, Post, Contact 페이지와 공통 Header/Footer를 만듭니다. |
| `step-2` | [overview/step-2.md](./step-2.md) | [lecture/step-2.md](../lecture/step-2.md) | simpledotcss와 next/image를 적용해 기본 화면을 정돈하고 외부 이미지 도메인 설정을 추가합니다. |
| `step-3` | [overview/step-3.md](./step-3.md) | [lecture/step-3.md](../lecture/step-3.md) | MongoDB 연결, 환경 변수, 게시글 데이터 함수를 만들어 서버 데이터 계층을 준비합니다. |
| `step-4` | [overview/step-4.md](./step-4.md) | [lecture/step-4.md](../lecture/step-4.md) | 게시글 목록/작성/단건조회/수정 API Route를 만들고 { success, message, data } 응답 형식을 통일합니다. |
| `step-5` | [overview/step-5.md](./step-5.md) | [lecture/step-5.md](../lecture/step-5.md) | 홈 목록에서 게시글을 불러오고 제목 클릭으로 상세 화면까지 이동하는 읽기 흐름을 완성합니다. |
| `step-6` | [overview/step-6.md](./step-6.md) | [lecture/step-6.md](../lecture/step-6.md) | 새 게시글 작성 form을 만들고 POST /api/post 요청으로 MongoDB에 글을 저장합니다. |
| `step-7` | [overview/step-7.md](./step-7.md) | [lecture/step-7.md](../lecture/step-7.md) | 상세 화면에서 수정 화면으로 이동하고 기존 글을 불러와 PUT /api/post/[id]로 수정합니다. |
| `step-8` | [overview/step-8.md](./step-8.md) | [lecture/step-8.md](../lecture/step-8.md) | Contact 페이지를 mockup form으로 바꾸고 controlled input과 submit 이벤트를 복습합니다. |
| `step-9` | [overview/step-9.md](./step-9.md) | [lecture/step-9.md](../lecture/step-9.md) | README, 불필요한 기본 자산, 최종 라우트/API 설명을 정리해 기본 블로그 단계를 마무리합니다. |
| `step-10` | [overview/step-10.md](./step-10.md) | [lecture/step-10.md](../lecture/step-10.md) | 작성/수정 API에 서버 검증을 추가하고 공백 입력 오류 메시지를 화면에 표시합니다. |
| `step-11` | [overview/step-11.md](./step-11.md) | [lecture/step-11.md](../lecture/step-11.md) | 제출 중 상태를 추가하고 작성/수정 성공 후 해당 게시글 상세 페이지로 이동합니다. |
| `step-12` | [overview/step-12.md](./step-12.md) | [lecture/step-12.md](../lecture/step-12.md) | 홈 목록과 상세 화면에 작성일과 수정일을 표시합니다. |
| `step-13` | [overview/step-13.md](./step-13.md) | [lecture/step-13.md](../lecture/step-13.md) | MongoDB 삭제 함수, DELETE /api/post/[id], 상세 화면 삭제 버튼으로 삭제 흐름을 완성합니다. |
| `step-14` | [overview/step-14.md](./step-14.md) | [lecture/step-14.md](../lecture/step-14.md) | 브라우저가 이미 가진 목록 배열을 기준으로 클라이언트 필터 검색을 추가합니다. |
| `step-15` | [overview/step-15.md](./step-15.md) | [lecture/step-15.md](../lecture/step-15.md) | keyword query string을 API로 보내 MongoDB에서 직접 검색하는 서버 검색을 추가합니다. |
| `step-16` | [overview/step-16.md](./step-16.md) | [lecture/step-16.md](../lecture/step-16.md) | page와 limit query string, MongoDB skip/limit, Previous/Next 버튼으로 페이지네이션을 구현합니다. |
| `step-17` | [overview/step-17.md](./step-17.md) | [lecture/step-17.md](../lecture/step-17.md) | sort query string과 정렬 select를 추가해 최신순, 오래된순, 제목순 정렬을 서버에서 처리합니다. |
| `step-18` | [overview/step-18.md](./step-18.md) | [lecture/step-18.md](../lecture/step-18.md) | 전역 404, 상세 전용 404, 전역 Error UI를 추가해 오류 상황의 사용자 경험을 개선합니다. |
| `step-19` | [overview/step-19.md](./step-19.md) | [lecture/step-19.md](../lecture/step-19.md) | 게시글 카테고리를 데이터, 작성/수정 form, 목록 필터, 상세 표시까지 전체 흐름에 연결합니다. |
| `step-20` | [overview/step-20.md](./step-20.md) | [lecture/step-20.md](../lecture/step-20.md) | simpledotcss를 제거하고 Tailwind CSS v4를 설치한 뒤 공통 layout, nav, footer에 기본 utility class를 적용합니다. |
| `step-21` | [overview/step-21.md](./step-21.md) | [lecture/step-21.md](../lecture/step-21.md) | 홈 목록, 상세 읽기 화면, About 페이지를 Tailwind utility class로 정리해 카드형 읽기 UI를 만듭니다. |
| `step-22` | [overview/step-22.md](./step-22.md) | [lecture/step-22.md](../lecture/step-22.md) | 게시글 작성/수정 form과 Contact form에 같은 Tailwind 입력/버튼 패턴을 적용합니다. |
| `step-23` | [overview/step-23.md](./step-23.md) | [lecture/step-23.md](../lecture/step-23.md) | 삭제 버튼, 전역 404, 상세 404, Error 화면을 Tailwind로 정리해 기본 UI 전환을 마무리합니다. |

## 단계 묶음

| 범위 | 학습 초점 |
| --- | --- |
| `step-1 ~ step-2` | Next.js App Router의 화면 구조와 기본 스타일 |
| `step-3 ~ step-4` | MongoDB 데이터 계층과 API Route |
| `step-5 ~ step-7` | 게시글 읽기, 작성, 수정 CRUD 흐름 |
| `step-8 ~ step-9` | 부가 화면과 기본 프로젝트 정리 |
| `step-10 ~ step-13` | 검증, 사용자 경험, 날짜 표시, 삭제 |
| `step-14 ~ step-17` | 검색, 페이지네이션, 정렬 같은 목록 기능 확장 |
| `step-18 ~ step-19` | 오류 화면 개선과 카테고리 데이터 모델 확장 |
| `step-20 ~ step-23` | Tailwind CSS v4 설치와 기본 UI 정리 |

## 읽는 순서

개인 저장소의 `main`에서 Step 1, Step 2 순서로 코드를 이어서 입력합니다.

각 단계의 짧은 개요는 `docs/overview/step-N.md`에서 읽습니다. 실제로 따라 치는 강의 자료는 `docs/lecture/step-N.md`에서 읽습니다.

예를 들어 `step-6`을 실습한다면 다음 순서가 좋습니다.

```txt
1. Step 5까지 직접 만든 기능을 실행한다.
2. docs/overview/step-6.md로 목표를 빠르게 읽는다.
3. docs/lecture/step-6.md를 보며 파일을 직접 수정한다.
4. 브라우저에서 새 게시글 작성 흐름을 테스트한다.
```
