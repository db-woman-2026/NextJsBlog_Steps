# Step 23. 남은 UI 조각 정리와 Tailwind 전환 마무리

이 문서는 `step-22`에서 시작해 `step-23`를 완성하는 실습 자료입니다.
원본 개요는 [docs/overview/step-23.md](../overview/step-23.md)에 보존되어 있습니다.
실제 완성 코드는 [step-23 브랜치](https://github.com/db-woman-2026/NextJsBlog_Steps/tree/step-23) 기준입니다.

## 이번 단계 목표

삭제 버튼, 전역 404, 상세 404, Error 화면을 Tailwind로 정리해 기본 UI 전환을 마무리합니다.

이번 단계에서 집중할 내용은 다음과 같습니다.

- 삭제 버튼의 위험 동작 UI를 정리합니다.
- 전역 404, 상세 404, Error 화면을 Tailwind로 맞춥니다.
- 남아 있던 기본 UI 조각을 정리해 Tailwind 전환을 마무리합니다.

## 시작 기준

이전 단계인 `step-22` 브랜치까지 완료된 상태에서 시작합니다.

```bash
git switch step-22
# 실습용 브랜치를 직접 만들 경우
git switch -c practice-step-23
```

수업 저장소의 정답 브랜치를 바로 확인하려면 다음 명령을 사용할 수 있습니다.

```bash
git switch step-23
```

## 수정 파일

| 상태 | 파일 | 확인 링크 |
| --- | --- | --- |
| 수정 | `README.md` | [README.md](https://github.com/db-woman-2026/NextJsBlog_Steps/blob/step-23/README.md) |
| 수정 | `app/detail/[id]/DeletePostButton.js` | [app/detail/[id]/DeletePostButton.js](https://github.com/db-woman-2026/NextJsBlog_Steps/blob/step-23/app/detail/%5Bid%5D/DeletePostButton.js) |
| 수정 | `app/detail/[id]/not-found.js` | [app/detail/[id]/not-found.js](https://github.com/db-woman-2026/NextJsBlog_Steps/blob/step-23/app/detail/%5Bid%5D/not-found.js) |
| 수정 | `app/error.js` | [app/error.js](https://github.com/db-woman-2026/NextJsBlog_Steps/blob/step-23/app/error.js) |
| 수정 | `app/not-found.js` | [app/not-found.js](https://github.com/db-woman-2026/NextJsBlog_Steps/blob/step-23/app/not-found.js) |

문서 파일은 이 강의 자료에서 별도로 관리하므로 위 표에는 기능 구현에 필요한 코드와 설정 파일만 넣었습니다.

## 코드 작성

아래 순서대로 파일을 만들거나 수정합니다. 각 코드 블록은 해당 단계 브랜치의 실제 파일 내용을 기준으로 합니다.

### 1. README.md

기존 `README.md` 파일을 열고 아래 최종 코드와 같게 수정합니다.

저장소 첫 화면에서 프로젝트 목적, 실행 방법, 단계 흐름을 설명하는 문서입니다.

````markdown
# NextJsBlog_Steps

초급 개발자 교육용 Next.js 블로그 프로젝트를 단계별 브랜치로 나눈 저장소입니다.

`main`은 `create-next-app` 직후의 기본 프로젝트 상태입니다. `step-1`부터는 이전 단계 위에 코드를 누적해서 실습합니다. `step-9`는 기본 블로그 기능의 마무리이고, `step-10`부터는 기능 확장 단계입니다. `step-20`부터는 `simpledotcss`를 제거하고 Tailwind CSS v4로 기본 UI를 정리합니다.

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
| `step-22` | 게시글 작성/수정 form과 Contact form의 Tailwind UI |
| `step-23` | 삭제 버튼, Not Found, Error 화면 정리와 Tailwind 전환 마무리 |

전체 단계 개요는 `/docs/overview/index.md`에 있고, 실습형 강의 자료는 `/docs/lecture/index.md`와 `/docs/lecture/step-N.md`에 있습니다.

## Stack

- Next.js 16
- React 19
- MongoDB Node.js Driver 7
- ESLint 9 flat config
- Tailwind CSS v4

## Getting Started

의존성을 설치합니다.

```bash
npm install
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
````

### 2. app/detail/[id]/DeletePostButton.js

기존 `app/detail/[id]/DeletePostButton.js` 파일을 열고 아래 최종 코드와 같게 수정합니다.

삭제 클릭, 확인창, 삭제 요청, 삭제 중 상태를 담당하는 클라이언트 컴포넌트입니다.

```jsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DeletePostButton({ id }) {
  const [error, setError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  async function handleDelete() {
    const shouldDelete = window.confirm("Delete this post?");

    if (!shouldDelete) {
      return;
    }

    setError("");
    setIsDeleting(true);

    try {
      const response = await fetch(`/api/post/${id}`, {
        method: "DELETE",
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to delete post");
      }

      router.push("/");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete post");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="space-y-2">
      <button
        className="rounded-md border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
        type="button"
        onClick={handleDelete}
        disabled={isDeleting}
      >
        {isDeleting ? "Deleting..." : "Delete"}
      </button>
      {error && (
        <p
          className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
}
```

### 3. app/detail/[id]/not-found.js

기존 `app/detail/[id]/not-found.js` 파일을 열고 아래 최종 코드와 같게 수정합니다.

게시글 상세 읽기 화면입니다. URL의 id로 게시글 하나를 조회하고, 없는 글은 404로 보냅니다.

```jsx
import Link from "next/link";

export default function PostNotFound() {
  return (
    <main className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
      <div className="space-y-4">
        <p className="text-sm font-semibold uppercase text-zinc-500">404</p>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-950">
          Post Not Found
        </h1>
        <p className="text-sm leading-6 text-zinc-600">
          This post does not exist or may have been deleted.
        </p>
        <Link
          className="inline-flex rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700"
          href="/"
        >
          Back to post list
        </Link>
      </div>
    </main>
  );
}
```

### 4. app/error.js

기존 `app/error.js` 파일을 열고 아래 최종 코드와 같게 수정합니다.

렌더링 중 오류가 발생했을 때 보여주는 Error UI입니다.

```jsx
"use client";

export default function Error({ error, reset }) {
  return (
    <main className="rounded-lg border border-red-200 bg-white p-6 shadow-sm">
      <div className="space-y-4">
        <p className="text-sm font-semibold uppercase text-red-600">Error</p>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-950">
          Something went wrong
        </h1>
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {error.message || "An unexpected error occurred."}
        </p>
        <button
          className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700"
          type="button"
          onClick={reset}
        >
          Try again
        </button>
      </div>
    </main>
  );
}
```

### 5. app/not-found.js

기존 `app/not-found.js` 파일을 열고 아래 최종 코드와 같게 수정합니다.

Next.js가 404 상황에서 자동으로 보여주는 화면입니다.

```jsx
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
      <div className="space-y-4">
        <p className="text-sm font-semibold uppercase text-zinc-500">404</p>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-950">
          Page Not Found
        </h1>
        <p className="text-sm leading-6 text-zinc-600">
          The page you are looking for does not exist.
        </p>
        <Link
          className="inline-flex rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700"
          href="/"
        >
          Back to post list
        </Link>
      </div>
    </main>
  );
}
```

## 실행 확인

기본 확인 명령은 다음과 같습니다.

```bash
npm run lint
npm run build
npm run dev
```

화면과 기능은 다음 순서로 확인합니다.

- 삭제 버튼의 confirm, 삭제 중, 오류 상태를 확인합니다.
- 전역 404, 상세 404, Error 화면의 Tailwind UI를 확인합니다.

## 자주 확인할 부분

- 파일 이름과 폴더 이름을 정확히 입력합니다. App Router에서는 `page.js`, `layout.js`, `route.js`, `not-found.js`, `error.js` 같은 파일명이 특별한 의미를 가집니다.
- 클라이언트 상태나 이벤트를 쓰는 파일에는 필요한 경우에만 `"use client";`를 둡니다. 서버에서 실행되어야 하는 MongoDB 코드는 클라이언트 컴포넌트로 가져오지 않습니다.
- API 응답은 가능한 한 `{ success, message, data }` 구조를 유지합니다. 화면 코드는 이 구조를 기준으로 `message`와 `data`를 읽습니다.
- 실습 중 막히면 먼저 이 문서의 코드 블록과 브랜치 링크의 실제 파일을 비교합니다.

## 개념 정리

아래 내용은 기존 단계 개요를 강의 문서 안에서도 바로 볼 수 있도록 가져온 것입니다. 코드 작성 후 다시 읽으면 각 변경의 이유를 확인하기 쉽습니다.

이번 단계는 Tailwind CSS v4 전환의 마무리입니다.

새 기능을 추가하지 않고, 이전 단계에서 남겨둔 작은 UI 조각들을 정리합니다.

## 이번 단계에서 하는 일

- 상세 페이지의 삭제 버튼을 danger button 형태로 정리한다.
- 삭제 실패 오류 메시지를 alert 형태로 표시한다.
- 전역 Not Found 화면을 카드 UI로 정리한다.
- 상세 페이지 전용 Not Found 화면을 카드 UI로 정리한다.
- 전역 Error 화면을 카드 UI로 정리한다.
- README와 `docs/overview/index.md`에 Tailwind 전환 마지막 단계를 추가한다.

## 왜 마지막 단계가 필요한가

`step-20`에서 Tailwind를 설치했고, `step-21`에서 읽기 화면을 정리했으며, `step-22`에서 form 화면을 정리했습니다.

하지만 실제 앱에는 자주 보이지 않는 화면도 있습니다.

- 삭제 버튼
- 삭제 실패 메시지
- 없는 페이지
- 없는 게시글
- 예외 발생 화면

이런 화면은 평소에는 덜 보이지만, 사용자가 문제 상황을 만났을 때 앱의 완성도를 크게 좌우합니다. 따라서 Tailwind 전환의 마지막 단계로 작은 UI 조각을 한 번 더 정리합니다.

## 삭제 버튼

상세 페이지의 Edit 버튼은 일반적인 주요 동작입니다. 반면 Delete 버튼은 데이터가 사라지는 위험한 동작입니다.

그래서 삭제 버튼에는 빨간색 계열을 사용합니다.

```jsx
<button className="rounded-md border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50">
  Delete
</button>
```

여기서 중요한 점은 빨간 배경을 강하게 쓰지 않았다는 것입니다. 삭제는 위험한 동작이지만, 화면 전체에서 너무 강하게 튀면 사용자가 다른 내용을 읽기 어렵습니다. 얇은 빨간 border와 글자색만으로도 충분히 danger 동작임을 알릴 수 있습니다.

## 삭제 오류 메시지

삭제 요청이 실패하면 기존처럼 `role="alert"`를 유지합니다.

```jsx
{error && (
  <p
    className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
    role="alert"
  >
    {error}
  </p>
)}
```

시각적인 스타일을 추가하더라도 기존의 의미 있는 HTML 속성은 유지합니다.

## Not Found 화면

전역 Not Found와 상세 페이지 전용 Not Found는 같은 패턴을 사용합니다.

```jsx
<main className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
  <div className="space-y-4">
    <p className="text-sm font-semibold uppercase text-zinc-500">404</p>
    <h1 className="text-3xl font-bold tracking-tight text-zinc-950">
      Page Not Found
    </h1>
    ...
  </div>
</main>
```

404 화면은 복잡할 필요가 없습니다. 사용자가 무엇이 잘못됐는지 알고, 홈 목록으로 돌아갈 수 있으면 충분합니다.

## Error 화면

Error 화면은 빨간색 계열을 조금 더 사용합니다.

```jsx
<main className="rounded-lg border border-red-200 bg-white p-6 shadow-sm">
  ...
</main>
```

다만 버튼은 다른 화면과 같은 검정색 primary button을 사용합니다. 이렇게 하면 "문제 상황"은 빨간색으로 알리고, "다시 시도" 동작은 기존 버튼 패턴과 일관되게 유지할 수 있습니다.

## Tailwind 전환 단계 정리

Tailwind 전환은 총 네 단계로 나눴습니다.

| 단계 | 내용 |
| --- | --- |
| `step-20` | Tailwind CSS v4 설치와 공통 layout/nav/footer 정리 |
| `step-21` | 홈 목록, 상세 읽기 화면, About 페이지 UI 정리 |
| `step-22` | 게시글 작성/수정 form과 Contact form UI 정리 |
| `step-23` | 삭제 버튼, Not Found, Error 화면 정리 |

각 단계는 이전 단계 위에서 동작 가능한 상태여야 합니다. 중간 단계에서 문제가 발생하면 해당 브랜치에서 수정하고, 이후 단계 브랜치로 순서대로 merge하면 됩니다.

## 확인 방법

```bash
npm run lint
npm run build
```

브라우저에서는 다음 화면을 확인합니다.

```txt
/detail/[id]
/없는주소
/detail/없는ID
```

Error 화면은 일반적인 사용 흐름에서 쉽게 발생하지 않을 수 있습니다. 그래도 `npm run build`가 통과하면 최소한 컴포넌트 문법과 빌드 가능성은 확인할 수 있습니다.

## 체크리스트

1. 상세 페이지의 Delete 버튼이 danger button으로 보인다.
2. 삭제 실패 메시지가 alert 스타일로 보인다.
3. 없는 주소의 404 화면이 카드 형태로 보인다.
4. 없는 게시글의 404 화면이 카드 형태로 보인다.
5. Error 화면이 카드 형태로 보인다.
6. README와 `docs/overview/index.md`에 `step-23`이 추가되어 있다.

이 단계까지 완료하면 `simpledotcss` 기반 화면에서 Tailwind CSS v4 기반의 기본 UI로 전환하는 흐름이 마무리됩니다.
