# 16. 블로그 코드 흐름 읽기

## 배울 내용

- 앞 장의 개념을 실제 블로그 기능 흐름에 연결합니다.
- 목록, 상세, 작성, 수정, 삭제에서 데이터가 이동하는 방향을 설명합니다.
- 실습을 시작할 준비가 되었는지 확인합니다.

새 문법을 추가하지 않습니다. 지금까지 본 문법이 한 기능 안에서 어떻게 이어지는지 읽습니다.

## 1. 공통 화면 구조

```txt
app/layout.js
├── Header
├── children  <- 현재 route의 page
└── Footer
```

1. 사용자가 `/about`을 엽니다.
2. App Router가 `app/about/page.js`를 선택합니다.
3. About page가 root layout의 `{children}` 자리에 들어갑니다.
4. Header와 Footer를 포함한 HTML이 렌더링됩니다.

여기에서 확인할 개념은 파일 기반 route, 컴포넌트, props의 `children`입니다.

## 2. 게시글 목록 읽기

```txt
브라우저의 Home 컴포넌트
  -> GET /api/post
  -> API route의 GET 함수
  -> listPosts()
  -> MongoDB posts collection
  <- { success, message, data }
  <- posts state 변경
  <- posts.map(...)으로 목록 렌더링
```

코드의 기본 형태입니다.

```js
const response = await fetch("/api/post");
const result = await response.json();
setPosts(result.data);
```

```jsx
{posts.map((post) => (
  <Link key={post._id} href={`/detail/${post._id}`}>
    {post.title}
  </Link>
))}
```

여기에서 확인할 개념은 effect, 비동기 요청, API, state, 배열 `map`, 동적 링크입니다.

## 3. 게시글 상세 읽기

```txt
/detail/abc123 요청
  -> app/detail/[id]/page.js
  -> params에서 id 읽기
  -> getPostById(id)
  -> MongoDB에서 document 하나 조회
  -> 없으면 notFound()
  -> 있으면 제목과 본문 렌더링
```

서버 컴포넌트의 기본 형태입니다.

```jsx
export default async function DetailPage({ params }) {
  const { id } = await params;
  const post = await getPostById(id);

  if (!post) {
    notFound();
  }

  return <h1>{post.title}</h1>;
}
```

여기에서 확인할 개념은 서버 컴포넌트, async/await, 동적 params, MongoDB, 조건문, 404입니다.

## 4. 게시글 작성

```txt
사용자가 form 입력
  -> onChange
  -> title/content state 변경
  -> form submit
  -> POST /api/post + JSON body
  -> 서버에서 문자열/필수값 검증
  -> createPost()
  -> MongoDB insertOne()
  -> 생성된 postId 응답
  -> /detail/postId로 이동
```

클라이언트 form의 기본 형태입니다.

```js
const response = await fetch("/api/post", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ title, content }),
});
```

서버 검증의 기본 형태입니다.

```js
const postData = await request.json();
const title =
  typeof postData.title === "string" ? postData.title.trim() : "";

if (!title) {
  return apiError("Title is required", 400);
}
```

여기에서 확인할 개념은 controlled form, 이벤트, JSON, POST, 서버 검증, insert, router 이동입니다.

## 5. 게시글 수정

수정은 읽기와 저장이 함께 있습니다.

```txt
/post/abc123 열기
  -> useParams()로 id 읽기
  -> GET /api/post/abc123
  -> 기존 값을 state에 넣기
  -> 사용자가 form 수정
  -> PUT /api/post/abc123
  -> MongoDB updateOne()
  -> 상세 화면으로 이동
```

```js
setTitle(post.title);
setContent(post.content);
```

기존 데이터를 state에 넣기 때문에 controlled input에 현재 값이 보입니다.

```js
await fetch(`/api/post/${id}`, {
  method: "PUT",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ title, content }),
});
```

여기에서 확인할 개념은 params, effect, state 초기화, PUT, template literal입니다.

## 6. 게시글 삭제

```txt
삭제 button 클릭
  -> confirm으로 확인
  -> DELETE /api/post/abc123
  -> ObjectId 유효성 검사
  -> MongoDB deleteOne()
  -> 목록 화면으로 이동
```

```js
if (!confirm("Delete this post?")) {
  return;
}

await fetch(`/api/post/${id}`, {
  method: "DELETE",
});
```

삭제는 되돌리기 어려운 행동이므로 사용자 확인을 받고, button은 처리 중에 비활성화합니다.

여기에서 확인할 개념은 이벤트, 빠른 return, DELETE, ObjectId, 오류/제출 상태입니다.

## 7. 검색, 페이지, 정렬

여러 선택값을 query string으로 보냅니다.

```js
const params = new URLSearchParams({
  keyword,
  page: String(page),
  limit: String(5),
  sort,
});

const url = `/api/post?${params.toString()}`;
```

서버는 값을 읽어 MongoDB query에 연결합니다.

```js
const keyword = searchParams.get("keyword") || "";
const page = searchParams.get("page") || "1";
```

```js
collection.find(query).sort(sortOption).skip(skip).limit(pageSize);
```

여기에서 확인할 개념은 객체, 문자열 변환, query string, 기본값, MongoDB query chain입니다.

## 8. 오류가 이동하는 방향

```txt
MongoDB 또는 데이터 함수 오류
  -> API route catch
  -> 상태 코드와 안전한 message 응답
  -> 클라이언트 response.ok 검사
  -> throw new Error(message)
  -> 클라이언트 catch
  -> error state
  -> role="alert" UI
```

오류를 무시하지 않고 각 경계에서 다음 계층이 처리할 수 있는 형태로 전달합니다.

## 9. 실습 전 최종 확인

다음 문장을 말로 설명할 수 있는지 확인합니다.

- `const`는 이름을 다시 대입하지 않을 때 사용합니다.
- 배열 `map`은 각 데이터로 JSX 목록을 만들 수 있습니다.
- props는 부모가 자식에게 전달하는 값이고 state는 컴포넌트가 기억하는 값입니다.
- `await`는 Promise 결과를 기다립니다.
- `fetch` 응답은 `response.ok`와 `response.json()`을 각각 확인합니다.
- `page.js`는 화면 route, `route.js`는 HTTP 요청 처리에 사용합니다.
- `"use client";`는 state, effect, 이벤트가 필요한 경계를 표시합니다.
- URL의 `[id]` 값과 `?keyword=...` 값은 서로 다른 위치에서 읽습니다.
- 클라이언트 form 검증이 있어도 서버에서 다시 검증합니다.
- 클라이언트 컴포넌트는 MongoDB에 직접 연결하지 않습니다.

모두 외울 필요는 없습니다. 설명이 막히는 항목의 링크를 [기초 강의](./index.md)에서 찾아 한 번 더 읽습니다.

## 다음 학습

이제 [실습 강의 목록](../lecture/index.md)으로 이동해 `step-1`부터 프로젝트를 직접 작성합니다. 실습 중 문법이 낯설면 해당 basic 장으로 돌아와 예제를 다시 확인합니다.
