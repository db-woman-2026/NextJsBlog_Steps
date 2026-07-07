# NextJsBlog_Steps

초급 개발자 교육용 Next.js 블로그 프로젝트를 단계별 브랜치로 나눈 저장소입니다.

`main`은 `create-next-app` 직후의 기본 프로젝트 상태입니다. `step-1`부터는 이전 단계 위에 코드를 누적해서 실습합니다. `step-9`는 기본 블로그 기능의 마무리이고, `step-10`부터는 기능 확장 단계입니다. `step-20`부터는 `simpledotcss`를 제거하고 Tailwind CSS v4로 기본 UI를 정리합니다.

## Teaching Model

이 저장소는 하나의 완성 앱을 한 번에 제공하기보다, 수강생이 `main`에서 시작해 각 단계 문서를 보며 직접 코드를 입력하도록 설계된 교육용 reference 저장소입니다.

- 수강생에게는 보통 `main` 기반의 starter만 제공합니다.
- 강의자는 `step-N` 브랜치를 정답/비교용으로 열어 설명합니다.
- 실습형 문서는 `docs/lecture/`를 기준으로 진행합니다.
- 기존 개요 문서는 `docs/overview/`에 참고용으로 보존되어 있습니다.

## Branch Maintenance

브랜치는 누적형 계단 구조를 유지해야 합니다. 어떤 수정이 특정 단계에 속한다면 가장 이른 affected step에서 고치고, 그 브랜치를 다음 단계로 순차 병합합니다.

```bash
git switch step-N
# 수정, 검증, commit, push

git switch step-(N+1)
git merge step-N
# 검증, push
```

같은 수정 내용을 여러 step 브랜치에 각각 따로 커밋하지 않습니다. 파일 내용은 비슷해 보여도 교육용 브랜치 히스토리와 부모-자식 관계가 깨질 수 있기 때문입니다. 인접 단계의 ancestry는 다음 명령이 성공하는 상태를 목표로 합니다.

```bash
git merge-base --is-ancestor step-N step-(N+1)
```

## Branch Flow

| 브랜치 | 내용 |
| --- | --- |
| `main` | Next.js 기본 프로젝트 생성 상태 |
| `step-1` | App Router 기본 페이지, Header, Footer, nav 구성 |
| `step-2` | `simpledotcss`, 전역 스타일, About 이미지, 이미지 도메인 설정 |
| `step-3` | MongoDB 연결, 환경 변수 예시, 게시글 데이터 함수 |
| `step-4` | 게시글 목록/작성/단건조회/수정 API Route와 통일된 응답 형식 |
| `step-5` | 홈 화면 게시글 목록과 `/detail/[id]` 상세 읽기 화면 |
| `step-6` | 새 게시글 작성 form과 POST 요청 |
| `step-7` | 상세 화면에서 진입하는 게시글 수정 form과 PUT 요청 |
| `step-8` | Contact mockup form |
| `step-9` | README 정리, 불필요한 기본 파일 제거, 기본 블로그 흐름 점검 |
| `step-10` | 입력값 검증 강화와 서버 오류 메시지 표시 |
| `step-11` | 제출 중 상태와 작성/수정 후 상세 페이지 이동 |
| `step-12` | 작성일과 수정일 표시 |
| `step-13` | 삭제 기능 |
| `step-14` | 클라이언트 필터 검색 |
| `step-15` | 서버 검색 |
| `step-16` | 페이지네이션 |
| `step-17` | 정렬 기능 |
| `step-18` | Not Found와 Error UI 개선 |
| `step-19` | 카테고리 |
| `step-20` | `simpledotcss` 제거, Tailwind CSS v4 설치, 공통 layout/nav/footer 정리 |
| `step-21` | 홈 목록, 상세 읽기 화면, About 페이지의 기본 카드 UI |
| `step-22` | 게시글 작성/수정 form과 Contact form의 Tailwind UI |
| `step-23` | 삭제 버튼, Not Found, Error 화면 정리와 Tailwind 전환 마무리 |

전체 단계 개요는 `/docs/overview/index.md`에 있고, 실습형 강의 자료는 `/docs/lecture/index.md`와 `/docs/lecture/step-N.md`에 있습니다.

## Learning Path

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

## Documentation Guide

| 문서 | 역할 |
| --- | --- |
| [docs/lecture/index.md](./docs/lecture/index.md) | 수강생이 따라 입력하는 강의 문서 목록 |
| [docs/lecture/step-N.md](./docs/lecture/step-1.md) | 이전 단계에서 현재 단계로 넘어가며 직접 수정할 내용 |
| [docs/overview/index.md](./docs/overview/index.md) | 단계별 개요와 참고 문서 목록 |
| [docs/overview/step-N.md](./docs/overview/step-1.md) | 기존 단계 개요 보존본 |

강의 문서는 다음 순서로 읽습니다.

1. 현재 단계 문서의 Overview로 이번에 완성할 기능을 파악합니다.
2. 각 작업 단위의 설명을 읽고, `직접 수정할 파일` 링크로 프로젝트 내부 파일을 엽니다.
3. `이전 단계와 달라지는 코드` diff에서 `+` 줄은 추가하고 `-` 줄은 제거합니다.
4. npm 명령으로 자동 변경되는 파일은 직접 타이핑하지 말고 결과만 확인합니다.
5. 실행 확인 명령과 브라우저 체크를 마친 뒤 다음 단계로 넘어갑니다.

## Stack

- Next.js 16
- React 19
- MongoDB Node.js Driver 7
- ESLint 9 flat config
- Tailwind CSS v4

## Getting Started

의존성을 설치합니다.

```bash
npm ci
```

환경 변수 예시 파일을 복사합니다.

```bash
cp .env.example .env.local
```

로컬 MongoDB를 사용한다면 `.env.local`을 다음처럼 둡니다.

```txt
MONGODB_URI=mongodb://localhost:27017/blog
MONGODB_DB=blog
```

개발 서버를 실행합니다.

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 엽니다.

## Routes

| 주소 | 역할 |
| --- | --- |
| `/` | 게시글 목록 |
| `/detail/[id]` | 게시글 상세 |
| `/post` | 게시글 작성 |
| `/post/[id]` | 게시글 수정 |
| `/about` | 소개 페이지 |
| `/contact` | Contact mockup form |
| `/api/post` | 게시글 목록/작성 API |
| `/api/post/[id]` | 게시글 단건 조회/수정/삭제 API |

## API Response Format

모든 API 응답은 같은 최상위 필드를 사용합니다.

```json
{
  "success": true,
  "message": "Posts fetched successfully",
  "data": []
}
```

오류도 같은 형식으로 반환합니다.

```json
{
  "success": false,
  "message": "Post not found",
  "data": null
}
```

| Method | 주소 | 요청 데이터 | 성공 시 `data` |
| --- | --- | --- | --- |
| `GET` | `/api/post` | query string: `keyword`, `page`, `limit`, `sort`, `category` | `{ posts, pagination }` |
| `POST` | `/api/post` | `{ title, content, image?, category? }` | `{ postId }` |
| `GET` | `/api/post/[id]` | URL의 `id` | 게시글 하나 |
| `PUT` | `/api/post/[id]` | URL의 `id`, `{ title, content, category? }` | `{ postId }` |
| `DELETE` | `/api/post/[id]` | URL의 `id` | `{ postId }` |

## Useful Commands

```bash
npm run lint
npm run build
```

`lint`는 코드 규칙을 확인하고, `build`는 실제 배포용 빌드가 가능한지 확인합니다.

## Notes For Beginners

- 페이지 라우트는 `app` 폴더의 `page.js` 파일로 만듭니다.
- API 라우트는 `app/api` 폴더의 `route.js` 파일로 만듭니다.
- API 응답은 `lib/apiResponse.js`의 `apiSuccess`, `apiError`로 통일합니다.
- MongoDB 연결은 `lib/mongodb.js`에 있습니다.
- 게시글 데이터 함수는 `lib/posts.js`에 있습니다.
- 클라이언트 컴포넌트에서 MongoDB를 직접 import하지 않습니다.
- 첫 `/api/post` 요청은 `posts` 컬렉션이 비어 있으면 샘플 게시글 10개를 넣습니다.
- Contact form은 실제 메일을 보내지 않는 mockup입니다.
