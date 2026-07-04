# Step 7. 게시글 수정 화면 만들기

이 문서는 `step-6`에서 시작해 `step-7`를 완성하는 실습 자료입니다.
원본 개요는 [docs/overview/step-7.md](../overview/step-7.md)에 보존되어 있습니다.
실제 완성 코드는 [step-7 브랜치](https://github.com/db-woman-2026/NextJsBlog_Steps/tree/step-7) 기준입니다.

## 이번 단계 목표

상세 화면에서 수정 화면으로 이동하고 기존 글을 불러와 PUT /api/post/[id]로 수정합니다.

이번 단계에서 집중할 내용은 다음과 같습니다.

- useParams로 URL의 id를 읽습니다.
- 기존 게시글을 불러와 input과 textarea에 채웁니다.
- PUT /api/post/[id]로 수정 요청을 보냅니다.

## 시작 기준

이전 단계인 `step-6` 브랜치까지 완료된 상태에서 시작합니다.

```bash
git switch step-6
# 실습용 브랜치를 직접 만들 경우
git switch -c practice-step-7
```

수업 저장소의 정답 브랜치를 바로 확인하려면 다음 명령을 사용할 수 있습니다.

```bash
git switch step-7
```

## 수정 파일

| 상태 | 파일 | 확인 링크 |
| --- | --- | --- |
| 수정 | `app/detail/[id]/page.js` | [app/detail/[id]/page.js](https://github.com/db-woman-2026/NextJsBlog_Steps/blob/step-7/app/detail/%5Bid%5D/page.js) |
| 생성 | `app/post/[id]/page.js` | [app/post/[id]/page.js](https://github.com/db-woman-2026/NextJsBlog_Steps/blob/step-7/app/post/%5Bid%5D/page.js) |

문서 파일은 이 강의 자료에서 별도로 관리하므로 위 표에는 기능 구현에 필요한 코드와 설정 파일만 넣었습니다.

## 코드 작성

아래 순서대로 파일을 만들거나 수정합니다. 각 코드 블록은 해당 단계 브랜치의 실제 파일 내용을 기준으로 합니다.

### 1. app/detail/[id]/page.js

기존 `app/detail/[id]/page.js` 파일을 열고 아래 최종 코드와 같게 수정합니다.

게시글 상세 읽기 화면입니다. URL의 id로 게시글 하나를 조회하고, 없는 글은 404로 보냅니다.

```jsx
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPostById } from "@/lib/posts";
import styles from "./page.module.css";

export default async function BlogDetail({ params }) {
  const { id } = await params;
  const post = await getPostById(id);

  if (!post) {
    notFound();
  }

  return (
    <main className={styles.container}>
      <article>
        <h1>{post.title}</h1>
        <pre className={styles.content}>{post.content}</pre>
      </article>
      <Link href={`/post/${id}`}>Edit</Link>
    </main>
  );
}
```

### 2. app/post/[id]/page.js

새 파일 `app/post/[id]/page.js`을 만들고 아래 내용을 입력합니다.

게시글 작성 또는 수정 화면입니다. form 상태와 API 요청 흐름을 집중해서 봅니다.

```jsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import styles from "../page.module.css";

export default function EditPost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const { id } = useParams();
  const router = useRouter();

  useEffect(() => {
    async function loadPost() {
      try {
        const response = await fetch(`/api/post/${id}`);
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Failed to fetch post data");
        }

        const post = result.data;
        setTitle(post.title);
        setContent(post.content);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch post");
      }
    }

    if (id) {
      loadPost();
    }
  }, [id]);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    try {
      const response = await fetch(`/api/post/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, content }),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to update post");
      }

      router.replace("/");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update post");
    }
  }

  return (
    <main className={styles.container}>
      <h1>Edit Post</h1>
      {error && <p role="alert">{error}</p>}
      <form onSubmit={handleSubmit}>
        <label htmlFor="title">Title:</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          required
        />

        <label htmlFor="content">Content:</label>
        <textarea
          id="content"
          value={content}
          onChange={(event) => setContent(event.target.value)}
          required
        />

        <button type="submit">Update Post</button>
      </form>
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

- 상세 화면에서 Edit 링크를 누릅니다.
- 기존 제목과 본문이 form에 채워지는지 확인하고 수정 후 홈으로 돌아오는지 확인합니다.

## 자주 확인할 부분

- 파일 이름과 폴더 이름을 정확히 입력합니다. App Router에서는 `page.js`, `layout.js`, `route.js`, `not-found.js`, `error.js` 같은 파일명이 특별한 의미를 가집니다.
- 클라이언트 상태나 이벤트를 쓰는 파일에는 필요한 경우에만 `"use client";`를 둡니다. 서버에서 실행되어야 하는 MongoDB 코드는 클라이언트 컴포넌트로 가져오지 않습니다.
- API 응답은 가능한 한 `{ success, message, data }` 구조를 유지합니다. 화면 코드는 이 구조를 기준으로 `message`와 `data`를 읽습니다.
- 실습 중 막히면 먼저 이 문서의 코드 블록과 브랜치 링크의 실제 파일을 비교합니다.

## 개념 정리

아래 내용은 기존 단계 개요를 강의 문서 안에서도 바로 볼 수 있도록 가져온 것입니다. 코드 작성 후 다시 읽으면 각 변경의 이유를 확인하기 쉽습니다.

## 이 단계의 목표

`step-7` 브랜치는 게시글 수정 화면을 추가하는 단계입니다.

이 단계에서 만드는 주소는 다음과 같습니다.

```txt
/post/[id]
```

실제 브라우저 주소는 다음처럼 됩니다.

```txt
/post/64f...
```

이 단계에서 배우는 내용은 다음과 같습니다.

- 동적 라우트 `[id]` 폴더를 만든다.
- `useParams`로 URL의 id를 읽는다.
- 기존 게시글 데이터를 먼저 불러와 form에 채운다.
- `PUT /api/post/[id]` 요청으로 게시글을 수정한다.
- 상세 화면에서 `Edit` 링크로 수정 화면에 진입한다.
- `router.replace`와 `router.push`의 차이를 이해한다.
- 작성 화면과 수정 화면의 공통점과 차이를 비교한다.

## 작성 화면과 수정 화면의 차이

작성 화면은 빈 form에서 시작합니다.

```txt
title: ""
content: ""
```

수정 화면은 기존 게시글을 먼저 불러와야 합니다.

```txt
GET /api/post/[id]
-> title, content를 상태에 저장
-> 사용자가 수정
-> PUT /api/post/[id]
```

그래서 수정 화면은 작성 화면보다 API 호출이 하나 더 많습니다.

`step-5`에서 이미 상세 화면을 만들었기 때문에, 이번 단계에서는 상세 화면 하단의 링크를 수정 화면으로 연결합니다.

```jsx
<Link href={`/post/${id}`}>Edit</Link>
```

이렇게 하면 학습자는 게시글을 읽는 화면에서 자연스럽게 수정 화면으로 이동할 수 있습니다.

## 파일 위치

수정 화면 파일은 다음 위치에 만듭니다.

```txt
app/post/[id]/page.js
```

`[id]`는 동적 라우트 세그먼트입니다. 폴더 이름에 대괄호를 사용하면 그 위치에 들어오는 URL 값을 코드에서 읽을 수 있습니다.

예를 들어 다음 주소로 접속하면

```txt
/post/abc123
```

`id` 값은 `"abc123"`입니다.

## 상세 화면에서 수정 화면으로 연결하기

`step-5`의 상세 화면에는 목록으로 돌아가는 링크가 있었습니다.

```jsx
<Link href="/">Back to list</Link>
```

이번 단계에서는 수정 화면이 생기므로 이 링크를 다음처럼 바꿉니다.

```jsx
<Link href={`/post/${id}`}>Edit</Link>
```

흐름은 다음과 같습니다.

```txt
홈 목록
-> 게시글 제목 클릭
-> /detail/[id] 상세 화면
-> Edit 클릭
-> /post/[id] 수정 화면
```

## useParams로 id 읽기

클라이언트 컴포넌트에서는 `useParams`를 사용해 동적 라우트 값을 읽습니다.

```js
import { useParams, useRouter } from "next/navigation";
```

컴포넌트 안에서는 다음처럼 사용합니다.

```js
const { id } = useParams();
```

이 `id`를 API 주소에 넣습니다.

```js
fetch(`/api/post/${id}`)
```

## 기존 게시글 불러오기

수정 화면이 열리면 기존 게시글 데이터를 불러와야 합니다.

```js
useEffect(() => {
  async function loadPost() {
    try {
      const response = await fetch(`/api/post/${id}`);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to fetch post data");
      }

      const post = result.data;
      setTitle(post.title);
      setContent(post.content);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch post");
    }
  }

  if (id) {
    loadPost();
  }
}, [id]);
```

`[id]`는 effect의 dependency입니다. id가 준비되거나 바뀌면 effect가 실행됩니다.

`if (id)` 조건은 id가 있을 때만 API를 호출하기 위한 방어 코드입니다.

`GET /api/post/[id]` 응답은 `{ success, message, data }` 형식이므로, form에 채울 게시글은 `result.data`에서 꺼냅니다.

## form에 기존 값 채우기

기존 게시글을 불러오면 다음 코드가 실행됩니다.

```js
setTitle(post.title);
setContent(post.content);
```

input과 textarea는 상태에 연결되어 있으므로, 상태가 바뀌면 form에 기존 값이 표시됩니다.

```jsx
<input
  value={title}
  onChange={(event) => setTitle(event.target.value)}
/>
```

## PUT 요청 보내기

수정 저장은 `PUT /api/post/[id]`로 보냅니다.

```js
const response = await fetch(`/api/post/${id}`, {
  method: "PUT",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ title, content }),
});
```

작성 화면은 `POST /api/post`였습니다.

수정 화면은 `PUT /api/post/${id}`입니다.

이 차이를 명확하게 기억해야 합니다.

```txt
POST /api/post       -> 새 글 생성
PUT /api/post/[id]   -> 기존 글 수정
```

수정 실패를 감지할 때도 응답 body의 `message`를 사용합니다.

```js
const result = await response.json();

if (!response.ok) {
  throw new Error(result.message || "Failed to update post");
}
```

## router.replace 사용

수정 성공 후에는 홈으로 이동합니다.

```js
router.replace("/");
router.refresh();
```

`router.push("/")`도 이동한다는 점에서는 비슷합니다. 하지만 `replace`는 현재 방문 기록을 새 주소로 대체합니다.

수정 화면에서 저장 후 뒤로 가기를 눌렀을 때 다시 수정 화면으로 돌아가는 흐름을 줄이고 싶다면 `replace`가 적합합니다.

## CSS Module 재사용

수정 페이지는 작성 페이지와 같은 form 레이아웃을 사용합니다.

그래서 새 CSS 파일을 만들지 않고 `app/post/page.module.css`를 재사용합니다.

```js
import styles from "../page.module.css";
```

수정 페이지 파일은 `app/post/[id]/page.js`에 있으므로, 한 단계 위 폴더의 CSS 파일을 가져오기 위해 `../page.module.css`를 사용합니다.

## 직접 실습 순서

1. `app/post/[id]` 폴더를 만든다.
2. `app/post/[id]/page.js` 파일을 만든다.
3. 파일 맨 위에 `"use client";`를 추가한다.
4. `useEffect`, `useState`, `useParams`, `useRouter`를 import한다.
5. 작성 화면과 같은 `title`, `content`, `error` 상태를 만든다.
6. `const { id } = useParams();`로 URL id를 읽는다.
7. `useEffect`에서 `GET /api/post/${id}`를 호출한다.
8. 응답의 `data.title`, `data.content`를 상태에 저장한다.
9. submit 시 `PUT /api/post/${id}` 요청을 보낸다.
10. 성공하면 `router.replace("/")`와 `router.refresh()`를 호출한다.
11. 작성 화면과 같은 form JSX를 만든다.

## 실행 확인

수정 화면은 기존 게시글 id가 있어야 확인할 수 있습니다.

1. MongoDB와 개발 서버를 실행합니다.
2. 홈 화면에서 게시글 목록을 확인합니다.
3. 게시글 제목을 클릭해 `/detail/[id]` 상세 화면으로 이동합니다.
4. 상세 화면의 `Edit` 링크를 클릭합니다.
5. `/post/[id]` 수정 화면으로 이동하는지 확인합니다.
6. 기존 제목과 본문이 form에 채워지는지 확인합니다.
7. 내용을 수정하고 저장합니다.
8. 홈 화면으로 이동하는지 확인합니다.

## 검증 명령

```bash
npm run lint
npm run build
```

실제 수정 동작까지 확인하려면 MongoDB와 `.env.local`이 필요합니다.

## 자주 발생하는 실수

### [id] 폴더 이름을 id로 만드는 경우

동적 라우트는 대괄호가 필요합니다.

```txt
app/post/[id]/page.js
```

`app/post/id/page.js`로 만들면 `/post/id`라는 고정 주소가 됩니다.

### useParams import 경로를 틀리는 경우

App Router에서는 다음 경로를 사용합니다.

```js
import { useParams, useRouter } from "next/navigation";
```

### dependency 배열에서 id를 빼는 경우

effect에서 id를 사용하므로 dependency 배열에도 넣습니다.

```js
}, [id]);
```

### PUT 대신 POST를 쓰는 경우

수정 API는 `PUT` 함수로 만들어져 있습니다. 클라이언트에서도 `method: "PUT"`을 사용해야 합니다.

### CSS Module 경로를 틀리는 경우

수정 페이지에서 작성 페이지 CSS를 가져오려면 다음 경로를 사용합니다.

```js
import styles from "../page.module.css";
```

## 이 단계에서 아직 하지 않는 것

게시글 읽기, 작성, 수정 흐름은 이제 연결됐습니다. 다음 단계에서는 핵심 CRUD 흐름과 별개인 Contact 페이지를 mockup form으로 바꿉니다.
