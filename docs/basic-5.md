# Basic 5. 홈 화면에서 게시글 목록 불러오기

## 이 단계의 목표

`basic-5` 브랜치는 홈 화면 `/`을 실제 게시글 목록 화면으로 바꾸는 단계입니다.

이 단계에서 배우는 내용은 다음과 같습니다.

- `"use client"`가 필요한 상황을 이해한다.
- React의 `useState`로 화면 상태를 관리한다.
- `useEffect`로 페이지가 열린 뒤 API를 호출한다.
- `fetch("/api/post")`로 API Route에서 JSON을 받아온다.
- 로딩, 오류, 빈 목록, 정상 목록 상태를 나누어 표시한다.
- CSS Module로 특정 페이지에만 적용되는 스타일을 작성한다.

## 왜 홈 화면은 클라이언트 컴포넌트인가

기본적으로 App Router의 `page.js`는 서버 컴포넌트입니다. 서버 컴포넌트는 서버에서 데이터를 가져와 HTML을 만들 때 유용합니다.

하지만 이번 단계에서는 React 상태와 effect를 사용합니다.

```js
import { useEffect, useState } from "react";
```

`useState`, `useEffect` 같은 React Hook은 브라우저에서 동작하는 클라이언트 컴포넌트에서 사용합니다. 그래서 파일 맨 위에 다음 지시문을 추가합니다.

```js
"use client";
```

이 줄은 반드시 파일의 가장 위에 있어야 합니다. import보다도 위에 있어야 합니다.

## 홈 화면의 전체 흐름

홈 화면은 다음 순서로 동작합니다.

```txt
1. 처음 화면이 열린다.
2. isLoading은 true이므로 "Loading posts..."가 보인다.
3. useEffect가 실행된다.
4. fetch("/api/post")로 게시글 목록 API를 호출한다.
5. 응답이 성공하면 posts 상태에 배열을 저장한다.
6. 응답이 실패하면 error 상태에 메시지를 저장한다.
7. 마지막에 isLoading을 false로 바꾼다.
8. 상태에 맞는 화면이 다시 렌더링된다.
```

이 흐름이 React에서 API 데이터를 화면에 보여주는 기본 패턴입니다.

## 상태 만들기

홈 화면에는 세 가지 상태가 있습니다.

```js
const [posts, setPosts] = useState([]);
const [error, setError] = useState("");
const [isLoading, setIsLoading] = useState(true);
```

각 상태의 역할은 다음과 같습니다.

| 상태 | 초기값 | 역할 |
| --- | --- | --- |
| `posts` | `[]` | API에서 받아온 게시글 배열 |
| `error` | `""` | 오류 메시지 |
| `isLoading` | `true` | 데이터를 불러오는 중인지 여부 |

처음에는 아직 API 응답을 받지 않았으므로 `posts`는 빈 배열입니다. 그리고 불러오는 중이므로 `isLoading`은 `true`입니다.

## useEffect로 API 호출하기

`useEffect`는 컴포넌트가 화면에 렌더링된 뒤 특정 작업을 실행할 때 사용합니다.

```js
useEffect(() => {
  async function loadPosts() {
    // API 호출
  }

  loadPosts();
}, []);
```

마지막의 빈 배열 `[]`은 이 effect를 처음 한 번만 실행하겠다는 의미입니다.

## fetch로 /api/post 호출하기

목록 API는 `basic-4`에서 만들었습니다.

```txt
GET /api/post
```

홈 화면에서는 다음처럼 호출합니다.

```js
const response = await fetch("/api/post", { cache: "no-store" });
```

`"/api/post"`처럼 상대 경로를 쓰면 현재 사이트의 API Route를 호출합니다.

`cache: "no-store"`는 매번 최신 데이터를 요청하겠다는 의미입니다. 게시글 작성/수정 후 목록이 오래된 데이터로 보이는 문제를 줄이기 위해 사용합니다.

## response.ok 확인

`fetch`는 서버가 400이나 500 응답을 보내도 JavaScript 오류를 자동으로 던지지 않습니다. 그래서 직접 확인합니다.

```js
if (!response.ok) {
  throw new Error("Failed to fetch posts");
}
```

`response.ok`는 상태 코드가 200번대일 때 `true`입니다.

## JSON 읽기

응답이 성공하면 JSON을 JavaScript 값으로 바꿉니다.

```js
const data = await response.json();
setPosts(data);
```

`data`는 게시글 배열입니다. 이 배열을 `posts` 상태에 저장하면 React가 화면을 다시 그립니다.

## 오류 처리

API 호출 중 문제가 생기면 `catch`가 실행됩니다.

```js
catch (err) {
  setError(err instanceof Error ? err.message : "Failed to fetch posts");
}
```

`err instanceof Error`는 잡힌 값이 JavaScript `Error` 객체인지 확인합니다. Error 객체라면 `err.message`를 화면에 보여줍니다.

## finally로 로딩 종료하기

성공하든 실패하든 요청은 끝납니다. 그래서 `finally`에서 로딩 상태를 종료합니다.

```js
finally {
  setIsLoading(false);
}
```

이 코드가 없으면 오류가 나도 화면이 계속 "Loading posts..."에 머무를 수 있습니다.

## 조건부 렌더링

상태에 따라 다른 UI를 보여주는 것을 조건부 렌더링이라고 합니다.

```jsx
{isLoading && <p>Loading posts...</p>}
{error && <p role="alert">{error}</p>}
{!isLoading && !error && posts.length === 0 && <p>No posts yet.</p>}
```

각 줄은 다음 의미입니다.

- 로딩 중이면 로딩 문구를 보여준다.
- 오류 메시지가 있으면 오류를 보여준다.
- 로딩이 끝났고 오류가 없고 게시글이 없으면 빈 목록 문구를 보여준다.

## 게시글 목록 렌더링

게시글이 있으면 `map`으로 반복 렌더링합니다.

```jsx
{posts.map((post) => (
  <article key={post._id} className={styles.article}>
    <Link href={`/detail/${post._id}`}>{post.title}</Link>
  </article>
))}
```

`key`는 React가 배열 항목을 구분하기 위해 필요합니다. MongoDB 게시글에는 `_id`가 있으므로 이것을 key로 사용합니다.

링크 주소는 템플릿 문자열로 만듭니다.

```js
`/detail/${post._id}`
```

아직 `/detail/[id]` 페이지는 만들지 않았습니다. 이 링크는 `basic-8`에서 실제 상세 화면과 연결됩니다.

## CSS Module 추가

홈 화면에만 필요한 스타일은 `app/page.module.css`에 둡니다.

```css
.articleList {
  display: grid;
  gap: 1rem;
}

.article {
  padding: 1rem 0;
}
```

그리고 `app/page.js`에서 import합니다.

```js
import styles from "./page.module.css";
```

CSS Module을 사용하면 클래스 이름이 해당 컴포넌트 범위 안에서 관리됩니다. 전역 CSS와 달리 다른 페이지에 의도치 않게 영향을 줄 가능성이 줄어듭니다.

## 직접 실습 순서

1. `app/page.js` 맨 위에 `"use client";`를 추가한다.
2. `Link`, `useEffect`, `useState`를 import한다.
3. `posts`, `error`, `isLoading` 상태를 만든다.
4. `useEffect` 안에 `loadPosts` async 함수를 만든다.
5. `fetch("/api/post", { cache: "no-store" })`로 API를 호출한다.
6. `response.ok`를 확인한다.
7. `response.json()` 결과를 `posts`에 저장한다.
8. 오류가 나면 `error`에 메시지를 저장한다.
9. `finally`에서 `isLoading`을 `false`로 바꾼다.
10. 상태에 맞게 로딩/오류/빈 목록/목록 화면을 렌더링한다.
11. `app/page.module.css`를 만들고 목록 스타일을 작성한다.

## 실행 전 준비

목록이 실제로 보이려면 다음이 필요합니다.

- MongoDB 실행
- `.env.local` 생성
- 개발 서버 실행

```bash
cp .env.example .env.local
npm run dev
```

브라우저에서 다음 주소를 엽니다.

```txt
http://localhost:3000/
```

처음 API 호출 시 `posts` 컬렉션이 비어 있으면 샘플 게시글 10개가 자동으로 들어갑니다.

## 검증 명령

```bash
npm run lint
npm run build
```

이 명령은 코드 문법과 빌드 가능 여부를 확인합니다. API가 실제 데이터를 반환하는지까지 확인하려면 개발 서버와 MongoDB를 함께 실행해야 합니다.

## 자주 발생하는 실수

### "use client"를 빼먹는 경우

`useState`나 `useEffect`를 쓰는 파일에는 `"use client";`가 필요합니다.

### useEffect 안의 async 함수를 바로 넘기는 경우

다음처럼 쓰지 않는 편이 좋습니다.

```js
useEffect(async () => {
  // ...
}, []);
```

대신 effect 안에서 async 함수를 만들고 호출합니다.

```js
useEffect(() => {
  async function loadPosts() {
    // ...
  }

  loadPosts();
}, []);
```

### response.ok를 확인하지 않는 경우

서버가 500 응답을 보내도 `fetch` 자체는 성공한 Promise로 처리될 수 있습니다. 그래서 `response.ok`를 확인해야 오류 상태를 제대로 보여줄 수 있습니다.

### posts가 배열이라고 가정하지 못하는 경우

`posts.map`은 `posts`가 배열일 때만 사용할 수 있습니다. 그래서 초기값을 `[]`로 둡니다.

```js
const [posts, setPosts] = useState([]);
```

## 이 단계에서 아직 하지 않는 것

아직 새 글 작성 form은 동작하지 않습니다. `/post` 페이지는 여전히 껍데기입니다.

다음 단계에서 `/post` 화면에 form을 만들고, `POST /api/post`로 새 게시글을 저장합니다.
