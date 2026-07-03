# Basic 6. 새 게시글 작성 화면 만들기

## 이 단계의 목표

`basic-6` 브랜치는 `/post` 페이지를 실제 게시글 작성 화면으로 바꾸는 단계입니다.

이 단계에서 배우는 내용은 다음과 같습니다.

- form 입력값을 React 상태로 관리한다.
- `onSubmit` 이벤트를 처리한다.
- `event.preventDefault()`가 왜 필요한지 이해한다.
- `fetch`로 `POST /api/post` 요청을 보낸다.
- `JSON.stringify`와 `Content-Type: application/json`의 역할을 이해한다.
- 작성 성공 후 `useRouter`로 홈 화면으로 이동한다.

## 작성 화면의 전체 흐름

사용자가 새 게시글을 작성하면 다음 순서로 동작합니다.

```txt
1. 사용자가 title input에 제목을 입력한다.
2. title 상태가 바뀐다.
3. 사용자가 content textarea에 본문을 입력한다.
4. content 상태가 바뀐다.
5. Submit 버튼을 누른다.
6. handleSubmit 함수가 실행된다.
7. POST /api/post 요청을 보낸다.
8. API가 MongoDB에 게시글을 저장한다.
9. 성공하면 홈 화면으로 이동한다.
10. 홈 화면에서 목록을 다시 불러온다.
```

## 클라이언트 컴포넌트로 바꾸기

작성 화면은 입력 상태와 이벤트를 사용합니다. 그래서 파일 맨 위에 `"use client";`가 필요합니다.

```js
"use client";
```

그리고 React 상태를 사용합니다.

```js
import { useState } from "react";
```

페이지 이동을 코드에서 처리하기 위해 `useRouter`도 import합니다.

```js
import { useRouter } from "next/navigation";
```

## 입력 상태 만들기

작성 화면에는 세 가지 상태가 있습니다.

```js
const [title, setTitle] = useState("");
const [content, setContent] = useState("");
const [error, setError] = useState("");
```

| 상태 | 역할 |
| --- | --- |
| `title` | 제목 input의 현재 값 |
| `content` | 본문 textarea의 현재 값 |
| `error` | 작성 실패 시 보여줄 오류 메시지 |

입력값을 상태로 관리하면 화면에 보이는 값과 JavaScript 값이 항상 연결됩니다.

## controlled input

다음 input은 React 상태와 연결되어 있습니다.

```jsx
<input
  type="text"
  id="title"
  value={title}
  onChange={(event) => setTitle(event.target.value)}
  required
/>
```

`value={title}`은 input에 표시할 값을 React 상태에서 가져온다는 의미입니다.

`onChange`는 사용자가 입력할 때마다 실행됩니다.

```js
(event) => setTitle(event.target.value)
```

이 코드는 사용자가 입력한 값을 `title` 상태에 저장합니다.

본문 textarea도 같은 방식입니다.

```jsx
<textarea
  id="content"
  value={content}
  onChange={(event) => setContent(event.target.value)}
  required
/>
```

## label과 htmlFor

label은 input이 어떤 값인지 설명합니다.

```jsx
<label htmlFor="title">Title:</label>
<input id="title" />
```

React에서는 HTML의 `for` 속성 대신 `htmlFor`를 사용합니다. `htmlFor` 값과 input의 `id` 값이 같아야 연결됩니다.

## form submit 처리

form에는 `onSubmit`을 연결합니다.

```jsx
<form onSubmit={handleSubmit}>
```

submit 버튼을 누르면 `handleSubmit` 함수가 실행됩니다.

```js
async function handleSubmit(event) {
  event.preventDefault();
  setError("");

  // API 요청
}
```

## event.preventDefault()

브라우저의 기본 form 동작은 페이지를 새로고침하며 데이터를 제출하는 것입니다.

React에서는 직접 API 요청을 보내고 화면 이동을 제어할 것이므로 기본 동작을 막습니다.

```js
event.preventDefault();
```

이 줄이 없으면 버튼을 눌렀을 때 페이지가 새로고침되어 React 상태와 오류 처리 흐름을 보기 어렵습니다.

## POST 요청 보내기

새 게시글은 `POST /api/post`로 보냅니다.

```js
const response = await fetch("/api/post", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    title,
    content,
    image: "https://picsum.photos/100",
  }),
});
```

중요한 부분은 세 가지입니다.

| 옵션 | 의미 |
| --- | --- |
| `method: "POST"` | 새 데이터를 생성하는 요청 |
| `Content-Type: application/json` | 요청 body가 JSON임을 서버에 알림 |
| `JSON.stringify(...)` | JavaScript 객체를 JSON 문자열로 변환 |

API Route에서는 이 body를 다음처럼 읽습니다.

```js
const postData = await request.json();
```

## response.ok 확인

작성 실패를 감지하기 위해 응답 상태를 확인합니다.

```js
if (!response.ok) {
  throw new Error("Failed to create post");
}
```

API가 400 또는 500 응답을 보내면 오류 메시지를 화면에 보여줍니다.

```js
catch (err) {
  setError(err instanceof Error ? err.message : "Failed to create post");
}
```

## 작성 후 홈으로 이동하기

작성 성공 후에는 홈 화면으로 이동합니다.

```js
router.push("/");
router.refresh();
```

`router.push("/")`는 `/` 주소로 이동합니다.

`router.refresh()`는 현재 라우트 데이터를 새로고침합니다. 이 프로젝트의 홈 화면은 클라이언트에서 다시 목록을 불러오지만, 작성 직후 최신 상태를 보장하는 의도를 코드에 드러내기 위해 함께 둡니다.

## CSS Module

작성 페이지에만 필요한 레이아웃은 `app/post/page.module.css`에 둡니다.

```css
.container {
  display: grid;
  gap: 1rem;
}
```

그리고 페이지에서 import합니다.

```js
import styles from "./page.module.css";
```

## 전역 form 스타일

`app/globals.css`에는 form과 textarea의 기본 크기를 추가합니다.

```css
form {
  max-width: 42rem;
}

textarea {
  min-height: 12rem;
}
```

form은 여러 페이지에서 다시 사용할 수 있으므로 전역 스타일에 둡니다. 나중에 수정 화면과 Contact form도 이 기본 스타일을 함께 사용합니다.

## 직접 실습 순서

1. `app/post/page.js` 맨 위에 `"use client";`를 추가한다.
2. `useState`, `useRouter`, CSS Module을 import한다.
3. `title`, `content`, `error` 상태를 만든다.
4. `useRouter()`로 router 객체를 만든다.
5. `handleSubmit` async 함수를 만든다.
6. 함수 안에서 `event.preventDefault()`를 호출한다.
7. `fetch("/api/post", { method: "POST", ... })` 요청을 작성한다.
8. `response.ok`를 확인한다.
9. 성공하면 `router.push("/")`와 `router.refresh()`를 호출한다.
10. 실패하면 error 상태에 메시지를 저장한다.
11. form JSX를 작성하고 input/textarea를 상태와 연결한다.
12. `app/post/page.module.css`를 만든다.
13. `app/globals.css`에 form/textarea 기본 스타일을 추가한다.

## 실행 확인

MongoDB와 개발 서버가 실행 중이어야 작성 기능을 확인할 수 있습니다.

```bash
cp .env.example .env.local
npm run dev
```

브라우저에서 다음 주소로 이동합니다.

```txt
http://localhost:3000/post
```

제목과 본문을 입력하고 `Create Post` 버튼을 누릅니다. 성공하면 홈 화면으로 이동하고, 작성한 글이 목록에 보여야 합니다.

## 검증 명령

```bash
npm run lint
npm run build
```

실제 저장 동작까지 확인하려면 MongoDB가 필요합니다.

## 자주 발생하는 실수

### Content-Type을 빼먹는 경우

서버가 요청 body를 JSON으로 해석해야 하므로 다음 header를 넣습니다.

```js
headers: {
  "Content-Type": "application/json",
}
```

### JSON.stringify를 빼먹는 경우

fetch의 body에는 객체를 그대로 넣지 않고 JSON 문자열로 바꿔 넣습니다.

```js
body: JSON.stringify({ title, content })
```

### required만 믿고 서버 검증을 하지 않는 경우

input의 `required`는 브라우저에서만 동작합니다. API에도 제목과 본문 검증이 있어야 합니다. 이 프로젝트는 `basic-4`에서 API 유효성 검사를 이미 추가했습니다.

### 작성 후 목록이 안 보이는 경우

확인할 순서는 다음과 같습니다.

1. 브라우저 개발자 도구 Network 탭에서 POST 요청이 성공했는지 본다.
2. 서버 터미널에 MongoDB 오류가 있는지 본다.
3. 홈 화면의 GET `/api/post` 요청이 성공하는지 본다.
4. `.env.local`이 있는지 확인한다.

## 이 단계에서 아직 하지 않는 것

아직 게시글 수정 화면은 없습니다. 홈 목록의 링크도 `/detail/[id]`로 이동하지만 상세 페이지는 아직 만들지 않았습니다.

다음 단계에서는 `/post/[id]` 수정 화면을 만들고 `PUT /api/post/[id]` 요청을 연결합니다.
