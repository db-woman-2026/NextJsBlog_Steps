# Step 18. Not Found와 Error UI 개선

이 문서는 `step-17`에서 시작해 `step-18`를 완성하는 실습 자료입니다.
원본 개요는 [docs/overview/step-18.md](../overview/step-18.md)에 보존되어 있습니다.
실제 완성 코드는 [step-18 브랜치](https://github.com/db-woman-2026/NextJsBlog_Steps/tree/step-18) 기준입니다.

## 이번 단계 목표

전역 404, 상세 전용 404, 전역 Error UI를 추가해 오류 상황의 사용자 경험을 개선합니다.

이번 단계에서 집중할 내용은 다음과 같습니다.

- 전역 404 페이지를 만듭니다.
- 상세 게시글 전용 404 페이지를 따로 만듭니다.
- error.js에서 reset으로 다시 시도할 수 있는 화면을 만듭니다.

## 시작 기준

이전 단계인 `step-17` 브랜치까지 완료된 상태에서 시작합니다.

```bash
git switch step-17
# 실습용 브랜치를 직접 만들 경우
git switch -c practice-step-18
```

수업 저장소의 정답 브랜치를 바로 확인하려면 다음 명령을 사용할 수 있습니다.

```bash
git switch step-18
```

## 수정 파일

| 상태 | 파일 | 확인 링크 |
| --- | --- | --- |
| 생성 | `app/detail/[id]/not-found.js` | [app/detail/[id]/not-found.js](https://github.com/db-woman-2026/NextJsBlog_Steps/blob/step-18/app/detail/%5Bid%5D/not-found.js) |
| 생성 | `app/error.js` | [app/error.js](https://github.com/db-woman-2026/NextJsBlog_Steps/blob/step-18/app/error.js) |
| 생성 | `app/not-found.js` | [app/not-found.js](https://github.com/db-woman-2026/NextJsBlog_Steps/blob/step-18/app/not-found.js) |

문서 파일은 이 강의 자료에서 별도로 관리하므로 위 표에는 기능 구현에 필요한 코드와 설정 파일만 넣었습니다.

## 코드 작성

아래 순서대로 파일을 만들거나 수정합니다. 각 코드 블록은 해당 단계 브랜치의 실제 파일 내용을 기준으로 합니다.

### 1. app/detail/[id]/not-found.js

새 파일 `app/detail/[id]/not-found.js`을 만들고 아래 내용을 입력합니다.

게시글 상세 읽기 화면입니다. URL의 id로 게시글 하나를 조회하고, 없는 글은 404로 보냅니다.

```jsx
import Link from "next/link";

export default function PostNotFound() {
  return (
    <main>
      <h1>Post Not Found</h1>
      <p>This post does not exist or may have been deleted.</p>
      <Link href="/">Back to post list</Link>
    </main>
  );
}
```

### 2. app/error.js

새 파일 `app/error.js`을 만들고 아래 내용을 입력합니다.

렌더링 중 오류가 발생했을 때 보여주는 Error UI입니다.

```jsx
"use client";

export default function Error({ error, reset }) {
  return (
    <main>
      <h1>Something went wrong</h1>
      <p>{error.message || "An unexpected error occurred."}</p>
      <button type="button" onClick={reset}>
        Try again
      </button>
    </main>
  );
}
```

### 3. app/not-found.js

새 파일 `app/not-found.js`을 만들고 아래 내용을 입력합니다.

Next.js가 404 상황에서 자동으로 보여주는 화면입니다.

```jsx
import Link from "next/link";

export default function NotFound() {
  return (
    <main>
      <h1>Page Not Found</h1>
      <p>The page you are looking for does not exist.</p>
      <Link href="/">Back to post list</Link>
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

- 존재하지 않는 주소를 열어 전역 404를 확인합니다.
- 존재하지 않는 게시글 id로 /detail/[id]를 열어 상세 전용 404를 확인합니다.

## 자주 확인할 부분

- 파일 이름과 폴더 이름을 정확히 입력합니다. App Router에서는 `page.js`, `layout.js`, `route.js`, `not-found.js`, `error.js` 같은 파일명이 특별한 의미를 가집니다.
- 클라이언트 상태나 이벤트를 쓰는 파일에는 필요한 경우에만 `"use client";`를 둡니다. 서버에서 실행되어야 하는 MongoDB 코드는 클라이언트 컴포넌트로 가져오지 않습니다.
- API 응답은 가능한 한 `{ success, message, data }` 구조를 유지합니다. 화면 코드는 이 구조를 기준으로 `message`와 `data`를 읽습니다.
- 실습 중 막히면 먼저 이 문서의 코드 블록과 브랜치 링크의 실제 파일을 비교합니다.

## 개념 정리

아래 내용은 기존 단계 개요를 강의 문서 안에서도 바로 볼 수 있도록 가져온 것입니다. 코드 작성 후 다시 읽으면 각 변경의 이유를 확인하기 쉽습니다.

## 이 단계의 목표

`step-18`은 오류 상황에서 사용자에게 더 친절한 화면을 보여주는 단계입니다.

이전 단계까지는 잘못된 주소나 삭제된 게시글에 접근하면 Next.js 기본 오류 화면이 보일 수 있습니다. 이번 단계에서는 프로젝트에 맞는 오류 화면을 직접 만듭니다.

이 단계에서는 다음을 구현합니다.

- 전역 404 화면 `app/not-found.js`를 만든다.
- 예상치 못한 렌더링 오류를 처리하는 `app/error.js`를 만든다.
- 게시글 상세 전용 404 화면 `app/detail/[id]/not-found.js`를 만든다.
- 삭제된 글 상세 주소로 접근했을 때 목록으로 돌아갈 수 있게 한다.

## 왜 이 단계가 삭제 이후에 오는가

`step-13`에서 삭제 기능을 추가했습니다.

삭제 기능이 생기면 다음 상황이 자연스럽게 발생합니다.

```txt
1. 게시글 상세 화면을 연다.
2. 글을 삭제한다.
3. 이전 상세 주소로 다시 접속한다.
```

이때 게시글은 이미 없으므로 상세 화면은 `notFound()`를 호출합니다.

사용자에게 기본 404 화면만 보여주기보다, 게시글이 없거나 삭제되었을 수 있다는 안내를 보여주는 편이 좋습니다.

## 전역 not-found.js

`app/not-found.js`는 존재하지 않는 페이지에 접근했을 때 보여줄 화면입니다.

```jsx
import Link from "next/link";

export default function NotFound() {
  return (
    <main>
      <h1>Page Not Found</h1>
      <p>The page you are looking for does not exist.</p>
      <Link href="/">Back to post list</Link>
    </main>
  );
}
```

예를 들어 `/wrong-url` 같은 주소로 접속하면 이 화면이 보입니다.

## 게시글 상세 전용 not-found.js

상세 페이지에는 더 구체적인 404 화면을 둘 수 있습니다.

```txt
app/detail/[id]/not-found.js
```

```jsx
import Link from "next/link";

export default function PostNotFound() {
  return (
    <main>
      <h1>Post Not Found</h1>
      <p>This post does not exist or may have been deleted.</p>
      <Link href="/">Back to post list</Link>
    </main>
  );
}
```

`app/detail/[id]/page.js`는 게시글을 찾지 못하면 이미 `notFound()`를 호출합니다.

```js
if (!post) {
  notFound();
}
```

이때 같은 라우트 근처에 있는 `not-found.js`가 사용됩니다.

## error.js

`app/error.js`는 렌더링 중 예상치 못한 오류가 발생했을 때 보여줄 화면입니다.

```jsx
"use client";

export default function Error({ error, reset }) {
  return (
    <main>
      <h1>Something went wrong</h1>
      <p>{error.message || "An unexpected error occurred."}</p>
      <button type="button" onClick={reset}>
        Try again
      </button>
    </main>
  );
}
```

`error.js`는 클라이언트 컴포넌트여야 합니다. 그래서 `"use client"`가 필요합니다.

`reset`은 오류가 난 라우트를 다시 렌더링하려고 시도하는 함수입니다.

## API 오류와 페이지 오류의 차이

API Route에서 게시글을 찾지 못하면 JSON 오류를 반환합니다.

```json
{
  "success": false,
  "message": "Post not found",
  "data": null
}
```

페이지에서 게시글을 찾지 못하면 HTML 화면이 필요합니다.

```js
notFound();
```

API는 데이터 응답을 반환하고, 페이지는 사용자 화면을 보여준다는 차이를 기억해야 합니다.

## 직접 실습 순서

1. `app/not-found.js`를 만든다.
2. 존재하지 않는 전체 페이지에 대한 안내와 홈 링크를 작성한다.
3. `app/detail/[id]/not-found.js`를 만든다.
4. 게시글이 없거나 삭제되었을 수 있다는 안내를 작성한다.
5. `app/error.js`를 만든다.
6. `"use client"`를 추가한다.
7. 오류 메시지와 `Try again` 버튼을 작성한다.

## 확인 방법

없는 페이지로 접속합니다.

```txt
http://localhost:3000/no-page
```

전역 404 화면이 보여야 합니다.

존재하지 않는 게시글 상세 주소로 접속합니다.

```txt
http://localhost:3000/detail/000000000000000000000000
```

게시글 전용 404 화면이 보여야 합니다.

## 검증 명령

```bash
npm run lint
npm run build
```

## 이 단계의 핵심

오류 처리는 기능의 부속물이 아니라 사용자 경험의 일부입니다. 특히 삭제 기능이 생긴 뒤에는 “없는 데이터에 접근하는 상황”을 자연스럽게 처리해야 합니다.
