# 12. 경로, params, 이동, 특수 화면

## 배울 내용

- 정적 경로, 동적 경로, query string을 구분합니다.
- `params`와 `searchParams`에서 값을 읽습니다.
- `Link`, router, `notFound()`의 역할을 알아봅니다.

## 1. 정적 경로와 동적 경로

폴더 이름이 그대로 URL이 되면 정적 경로입니다.

```txt
app/about/page.js -> /about
```

대괄호 폴더는 위치는 같지만 값이 달라지는 동적 segment입니다.

```txt
app/detail/[id]/page.js

/detail/abc123
/detail/xyz789
```

두 URL은 같은 page 컴포넌트를 사용하고 `id` 값만 다릅니다.

## 2. 서버 page에서 params 읽기

현재 프로젝트의 Next.js 버전에서는 page의 `params`를 기다린 뒤 구조 분해합니다.

```jsx
export default async function DetailPage({ params }) {
  const { id } = await params;

  return <p>게시글 id: {id}</p>;
}
```

`/detail/abc123`을 열면 `id`는 `"abc123"`입니다.

API route의 동적 경로도 context에서 params를 받습니다.

```js
export async function GET(_request, { params }) {
  const { id } = await params;
  return Response.json({ id });
}
```

## 3. 클라이언트 컴포넌트에서 params 읽기

클라이언트 컴포넌트에서는 `useParams` hook을 사용할 수 있습니다.

```jsx
"use client";

import { useParams } from "next/navigation";

export default function EditPage() {
  const { id } = useParams();
  return <p>수정할 id: {id}</p>;
}
```

서버 page의 props와 클라이언트 hook이라는 실행 위치 차이를 구분합니다.

## 4. query string과 searchParams

query string은 경로 뒤에 `?`로 시작하는 추가 선택값입니다.

```txt
/api/post?keyword=next&page=2&sort=created-desc
```

API route에서는 request URL을 파싱합니다.

```js
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const keyword = searchParams.get("keyword") || "";
  const page = searchParams.get("page") || "1";

  return Response.json({ keyword, page });
}
```

query string 값은 기본적으로 문자열입니다. 숫자로 계산할 값은 `Number(page)`처럼 변환합니다.

## 5. URLSearchParams로 query string 만들기

문자열을 직접 이어 붙이기보다 전용 객체를 사용하면 encoding을 안전하게 처리할 수 있습니다.

```js
const params = new URLSearchParams({
  keyword: "next js",
  page: String(2),
});

const url = `/api/post?${params.toString()}`;
console.log(url); // /api/post?keyword=next+js&page=2
```

값을 나중에 추가할 수도 있습니다.

```js
params.set("category", "tech");
```

문자열을 직접 연결해야 한다면 동적 값은 encoding합니다.

```js
const keyword = "next js";
const url = `/api/post?keyword=${encodeURIComponent(keyword)}`;

console.log(url); // /api/post?keyword=next%20js
```

`encodeURIComponent`는 공백, `&`, `?`처럼 URL에서 특별한 뜻을 가진 문자를 query 값으로 안전하게 바꿉니다. 선택값이 여러 개면 `URLSearchParams`가 더 읽기 쉽습니다.

## 6. Link로 화면 이동

사용자가 누를 수 있는 화면 링크는 Next.js의 `Link`를 사용합니다.

```jsx
import Link from "next/link";

export default function Navigation() {
  return <Link href="/about">About</Link>;
}
```

동적 값은 template literal로 만듭니다.

```jsx
<Link href={`/detail/${post._id}`}>{post.title}</Link>
```

단순 이동은 일반 button보다 link가 의미에 맞습니다.

## 7. 코드로 이동하기

form 저장 성공처럼 코드 실행 결과에 따라 이동할 때 `useRouter`를 사용합니다.

```jsx
"use client";

import { useRouter } from "next/navigation";

export default function SaveButton() {
  const router = useRouter();

  function handleSuccess(postId) {
    router.push(`/detail/${postId}`);
  }

  return <button onClick={() => handleSuccess("abc123")}>Save</button>;
}
```

- `push`: 브라우저 방문 기록에 새 주소를 추가합니다.
- `replace`: 현재 방문 기록을 새 주소로 바꿉니다.
- `refresh`: 현재 route의 서버 데이터를 다시 요청합니다.

## 8. 찾을 수 없는 화면

`app/not-found.js`는 일치하는 route가 없거나 `notFound()`를 호출했을 때 표시됩니다.

```jsx
// app/not-found.js
export default function NotFound() {
  return <h1>Page Not Found</h1>;
}
```

데이터를 찾지 못한 서버 page에서 404 흐름을 시작할 수 있습니다.

```jsx
import { notFound } from "next/navigation";

export default async function DetailPage({ params }) {
  const { id } = await params;
  const post = await getPostById(id);

  if (!post) {
    notFound();
  }

  return <h1>{post.title}</h1>;
}
```

특정 route 폴더 안에 `not-found.js`를 두면 그 영역에 맞는 404 화면을 만들 수 있습니다.

## 9. 예상하지 못한 오류 화면

`app/error.js`는 렌더링 중 처리하지 못한 오류를 사용자에게 보여 주는 경계입니다. 오류 재시도 버튼 이벤트가 있으므로 클라이언트 컴포넌트입니다.

```jsx
"use client";

export default function Error({ error, reset }) {
  return (
    <main>
      <h1>Something went wrong</h1>
      <p>{error.message}</p>
      <button onClick={reset}>Try again</button>
    </main>
  );
}
```

404는 “요청한 자원이 없음”이고 Error 화면은 “처리 중 예상하지 못한 실패”입니다.

## 프로젝트 예시

- `/detail/[id]`, `/post/[id]`, `/api/post/[id]`에서 동적 id를 사용합니다.
- 검색, 페이지, 정렬, 카테고리를 query string으로 API에 전달합니다.
- 화면의 이동 링크는 `Link`, 저장 성공 뒤 이동은 router를 사용합니다.
- `step-18`에서 전역 404, 상세 전용 404, Error UI를 만듭니다.

## 확인하기

1. `/detail/[id]`의 `id`는 서버 page에서 어떻게 읽나요?
2. query string의 page 값은 숫자인가요, 문자열인가요?
3. 데이터가 존재하지 않는 경우와 예상하지 못한 실행 오류는 각각 어떤 화면으로 처리하나요?

정답: `const { id } = await params`로 읽습니다. query string 값은 문자열입니다. 존재하지 않는 자원은 Not Found, 예상하지 못한 실패는 Error 화면으로 처리합니다.
