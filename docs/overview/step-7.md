# Step 7. 게시글 수정 화면 만들기

## 배울 내용

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

`step-5`에서 만든 상세 화면 하단의 링크를 수정 화면으로 연결합니다.

```jsx
<Link href={`/post/${id}`}>Edit</Link>
```

이렇게 하면 학습자는 게시글을 읽는 화면에서 수정 화면으로 이동할 수 있습니다.

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

수정 화면이 생기므로 이 링크를 다음처럼 바꿉니다.

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

## 실습 순서

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

> Windows 11에서는 [환경 준비](../windows-11.md)를 먼저 확인합니다. `git`, `node`, `npm` 명령은 PowerShell에서도 같습니다. `npm.ps1` 오류가 나면 `npm.cmd`를 사용합니다.

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
