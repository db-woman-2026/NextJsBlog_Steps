# NextJsBlog_Steps

초급 개발자 교육용 Next.js 블로그 프로젝트를 단계별 브랜치로 나눈 저장소입니다.

`main`은 `create-next-app` 직후의 기본 프로젝트 상태입니다. `step-1`부터는 이전 단계 위에 코드를 누적해서 실습합니다. `step-9`는 기본 블로그 기능의 마무리이고, `step-10`부터는 기능 확장 단계입니다.

## Learning Order

프로젝트 실습 전에 [Basic Course](./docs/basic/index.md)에서 JavaScript, React, Next.js, HTTP, MongoDB의 필수 구조와 문법을 쉬운 예제로 먼저 익힙니다. 그다음 [Lecture](./docs/lecture/index.md)를 `step-1`부터 순서대로 따라 하며 블로그를 직접 완성합니다.

```txt
docs/basic/   코드 구조와 문법을 눈으로 익히는 선수 학습
      ↓
docs/lecture/ 단계별 diff를 직접 입력하는 프로젝트 실습
```

## Branch Hierarchy

이 저장소의 브랜치는 독립적인 예제 복사본이 아니라 부모-자식 관계를 가진 학습 이력입니다. 기본 흐름은 `main -> step-1 -> step-2 -> ... -> step-N`이며, 각 `step-N`은 바로 이전 단계 위에 기능과 문서를 누적합니다.

향후 작업 시 이 계층을 기준으로 수정해야 합니다. 특정 단계부터 필요한 변경은 가장 이른 affected step에서 먼저 커밋하고, 그 다음 step으로 순서대로 merge해서 전파합니다. 같은 변경을 여러 step 브랜치에 각각 따로 커밋하면 교육용 브랜치의 ancestry가 깨져 수강생과 강의자가 서로 다른 기준을 보게 됩니다.

브랜치 관계는 아래 명령이 성공하는 상태를 목표로 유지합니다.

```powershell
git merge-base --is-ancestor step-N step-(N+1)
```

## Recreate Starter

`main`과 같은 starter를 새로 만들어야 한다면 `create-next-app`도 현재 프로젝트의 Next.js 버전에 맞춰 고정합니다. `latest`를 사용하면 생성되는 기본 코드나 의존성 버전이 달라질 수 있습니다.

```powershell
npx.cmd create-next-app@16.2.10 nextjsblog-steps --js --eslint --app --no-tailwind --no-src-dir --import-alias "@/*" --use-npm --disable-git --no-agents-md
```

이 명령은 `next@16.2.10`, `react@19.2.4`, `react-dom@19.2.4`, `eslint-config-next@16.2.10` 조합으로 생성되는 것을 확인했습니다. 생성 후 `npm.cmd run lint`와 `npm.cmd run build`도 통과합니다.

생성 폴더 이름에 따라 `package.json`의 `name`은 달라질 수 있고, 시간이 지나면 lockfile의 하위 의존성 patch 버전은 달라질 수 있습니다. 수업 기준 starter를 정확히 맞출 때는 이 저장소의 `main` 브랜치를 기준으로 사용합니다.

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
| `step-9` | README 정리, 불필요한 기본 파일 제거, 최종 기본 기능 |
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

전체 단계 개요는 `/docs/overview/index.md`에 있고, 실습형 강의 자료는 `/docs/lecture/index.md`와 `/docs/lecture/step-N.md`에 있습니다.

## Stack

- Next.js 16
- React 19
- MongoDB Node.js Driver 7
- ESLint 9 flat config
- Tailwind CSS v4

## Getting Started

Windows 11에서는 먼저 [Windows 11 환경 준비](./docs/windows-11.md)를 확인합니다.

의존성을 설치합니다.

```powershell
npm.cmd ci
```

환경 변수 예시 파일을 복사합니다.

```powershell
Copy-Item -LiteralPath .env.example -Destination .env.local
```

로컬 MongoDB를 사용한다면 `.env.local`을 다음처럼 둡니다.

```txt
MONGODB_URI=mongodb://localhost:27017/next_blog_practice
MONGODB_DB=next_blog_practice
```

개발 서버를 실행합니다.

```powershell
npm.cmd run dev
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

```powershell
npm.cmd run lint
npm.cmd run build
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
