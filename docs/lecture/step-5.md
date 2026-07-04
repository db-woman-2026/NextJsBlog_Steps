# Step 5. 게시글 목록과 상세 읽기 화면 만들기

이 문서는 `step-4`에서 시작해 `step-5`를 완성하는 실습 자료입니다.
원본 개요는 [docs/overview/step-5.md](../overview/step-5.md)에 보존되어 있습니다.
실제 완성 코드는 [step-5 브랜치](https://github.com/db-woman-2026/NextJsBlog_Steps/tree/step-5) 기준입니다.

## 이번 단계 목표

홈 목록에서 게시글을 불러오고 제목 클릭으로 상세 화면까지 이동하는 읽기 흐름을 완성합니다.

이번 단계에서 집중할 내용은 다음과 같습니다.

- 홈 화면을 클라이언트 컴포넌트로 바꾸고 useEffect로 목록을 불러옵니다.
- 동적 라우트 /detail/[id]를 만들어 게시글 하나를 읽습니다.
- 게시글이 없을 때 notFound()로 404를 발생시킵니다.

## 시작 기준

이전 단계인 `step-4` 브랜치까지 완료된 상태에서 시작합니다.

```bash
git switch step-4
# 실습용 브랜치를 직접 만들 경우
git switch -c practice-step-5
```

수업 저장소의 정답 브랜치를 바로 확인하려면 다음 명령을 사용할 수 있습니다.

```bash
git switch step-5
```

## 수정 파일

| 상태 | 파일 | 확인 링크 |
| --- | --- | --- |
| 생성 | `app/detail/[id]/page.js` | [app/detail/[id]/page.js](https://github.com/db-woman-2026/NextJsBlog_Steps/blob/step-5/app/detail/%5Bid%5D/page.js) |
| 생성 | `app/detail/[id]/page.module.css` | [app/detail/[id]/page.module.css](https://github.com/db-woman-2026/NextJsBlog_Steps/blob/step-5/app/detail/%5Bid%5D/page.module.css) |
| 수정 | `app/page.js` | [app/page.js](https://github.com/db-woman-2026/NextJsBlog_Steps/blob/step-5/app/page.js) |
| 생성 | `app/page.module.css` | [app/page.module.css](https://github.com/db-woman-2026/NextJsBlog_Steps/blob/step-5/app/page.module.css) |

문서 파일은 이 강의 자료에서 별도로 관리하므로 위 표에는 기능 구현에 필요한 코드와 설정 파일만 넣었습니다.

## 코드 작성

아래 순서대로 파일을 만들거나 수정합니다. 각 코드 블록은 해당 단계 브랜치의 실제 파일 내용을 기준으로 합니다.

### 1. app/detail/[id]/page.js

새 파일 `app/detail/[id]/page.js`을 만들고 아래 내용을 입력합니다.

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
      <Link href="/">Back to list</Link>
    </main>
  );
}
```

### 2. app/detail/[id]/page.module.css

새 파일 `app/detail/[id]/page.module.css`을 만들고 아래 내용을 입력합니다.

게시글 상세 읽기 화면입니다. URL의 id로 게시글 하나를 조회하고, 없는 글은 404로 보냅니다.

```css
.container {
  display: grid;
  gap: 1rem;
}

.content {
  white-space: pre-wrap;
}
```

### 3. app/page.js

기존 `app/page.js` 파일을 열고 아래 최종 코드와 같게 수정합니다.

홈 화면입니다. 단계가 진행되면서 소개 화면에서 게시글 목록, 검색, 페이지네이션, 정렬 UI로 확장됩니다.

```jsx
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "./page.module.css";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadPosts() {
      try {
        const response = await fetch("/api/post", { cache: "no-store" });
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Failed to fetch posts");
        }

        setPosts(result.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch posts");
      } finally {
        setIsLoading(false);
      }
    }

    loadPosts();
  }, []);

  return (
    <main>
      {isLoading && <p>Loading posts...</p>}
      {error && <p role="alert">{error}</p>}
      {!isLoading && !error && posts.length === 0 && <p>No posts yet.</p>}
      {!isLoading && !error && (
        <section className={styles.articleList} aria-label="Blog posts">
          {posts.map((post) => (
            <article key={post._id} className={styles.article}>
              <Link href={`/detail/${post._id}`}>{post.title}</Link>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}
```

### 4. app/page.module.css

새 파일 `app/page.module.css`을 만들고 아래 내용을 입력합니다.

이 단계의 결과와 맞도록 파일 내용을 정리합니다.

```css
.articleList {
  display: grid;
  gap: 1rem;
}

.article {
  padding: 1rem 0;
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

- MongoDB에 샘플 데이터가 있는 상태에서 /를 엽니다.
- 게시글 제목을 클릭해 /detail/[id] 상세 화면으로 이동합니다.

## 자주 확인할 부분

- 파일 이름과 폴더 이름을 정확히 입력합니다. App Router에서는 `page.js`, `layout.js`, `route.js`, `not-found.js`, `error.js` 같은 파일명이 특별한 의미를 가집니다.
- 클라이언트 상태나 이벤트를 쓰는 파일에는 필요한 경우에만 `"use client";`를 둡니다. 서버에서 실행되어야 하는 MongoDB 코드는 클라이언트 컴포넌트로 가져오지 않습니다.
- API 응답은 가능한 한 `{ success, message, data }` 구조를 유지합니다. 화면 코드는 이 구조를 기준으로 `message`와 `data`를 읽습니다.
- 실습 중 막히면 먼저 이 문서의 코드 블록과 브랜치 링크의 실제 파일을 비교합니다.

## 개념 정리

아래 내용은 기존 단계 개요를 강의 문서 안에서도 바로 볼 수 있도록 가져온 것입니다. 코드 작성 후 다시 읽으면 각 변경의 이유를 확인하기 쉽습니다.

## 이 단계의 목표

`step-5` 브랜치는 사용자가 게시글을 읽을 수 있는 첫 번째 완성 흐름을 만드는 단계입니다.

이전 단계인 `step-4`에서는 API Route만 만들었습니다. 이번 단계에서는 그 API를 화면과 연결합니다.

이 단계가 끝나면 다음 흐름이 동작해야 합니다.

```txt
홈 화면 /
-> GET /api/post로 게시글 목록 불러오기
-> 게시글 제목 클릭
-> /detail/[id] 상세 화면 이동
-> getPostById(id)로 게시글 하나 조회
-> 제목과 본문 표시
```

이 단계에서 배우는 내용은 다음과 같습니다.

- `"use client"`가 필요한 상황을 이해한다.
- React의 `useState`로 화면 상태를 관리한다.
- `useEffect`로 페이지가 열린 뒤 API를 호출한다.
- `fetch("/api/post")`로 API Route에서 JSON을 받아온다.
- 로딩, 오류, 빈 목록, 정상 목록 상태를 나누어 표시한다.
- 게시글 제목을 `Link`로 만들어 상세 화면으로 이동한다.
- 서버 컴포넌트에서 `params`를 받아 상세 데이터를 조회한다.
- 게시글이 없을 때 `notFound()`를 사용한다.
- CSS Module로 특정 페이지에만 적용되는 스타일을 작성한다.

## 왜 상세 화면을 이 단계에 함께 만드는가

홈 목록에서 게시글 제목을 클릭할 수 있다면, 그 링크가 실제로 열려야 합니다.

깨진 링크를 남겨둔 채 다음 단계로 넘어가면 학습자는 다음 두 가지를 헷갈리기 쉽습니다.

- API가 잘못된 것인지
- 라우팅이 아직 구현되지 않은 것인지

따라서 목록 화면에서 `/detail/[id]` 링크를 만드는 이 단계에서 상세 화면도 함께 만듭니다.

`step-5`의 목표는 단순히 목록만 보여주는 것이 아니라, “게시글을 읽는 흐름”을 완성하는 것입니다.

## 홈 화면은 클라이언트 컴포넌트

홈 화면은 브라우저에서 API를 호출하고 React 상태를 바꿉니다.

그래서 `app/page.js` 맨 위에 다음 지시문이 필요합니다.

```js
"use client";
```

그리고 React Hook을 import합니다.

```js
import { useEffect, useState } from "react";
```

`useState`, `useEffect` 같은 Hook은 클라이언트 컴포넌트에서 사용합니다.

## 홈 화면의 상태

홈 화면에는 세 가지 상태가 있습니다.

```js
const [posts, setPosts] = useState([]);
const [error, setError] = useState("");
const [isLoading, setIsLoading] = useState(true);
```

| 상태 | 초기값 | 역할 |
| --- | --- | --- |
| `posts` | `[]` | API에서 받아온 게시글 배열 |
| `error` | `""` | 오류 메시지 |
| `isLoading` | `true` | 데이터를 불러오는 중인지 여부 |

처음에는 아직 API 응답을 받지 않았으므로 `posts`는 빈 배열입니다. 그리고 불러오는 중이므로 `isLoading`은 `true`입니다.

## useEffect로 게시글 목록 불러오기

`useEffect`는 컴포넌트가 화면에 렌더링된 뒤 특정 작업을 실행할 때 사용합니다.

```js
useEffect(() => {
  async function loadPosts() {
    try {
      const response = await fetch("/api/post", { cache: "no-store" });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to fetch posts");
      }

      setPosts(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch posts");
    } finally {
      setIsLoading(false);
    }
  }

  loadPosts();
}, []);
```

마지막의 빈 배열 `[]`은 이 effect를 처음 한 번만 실행하겠다는 의미입니다.

`cache: "no-store"`는 매번 최신 데이터를 요청하겠다는 의미입니다. 게시글 작성/수정 후 목록이 오래된 데이터로 보이는 문제를 줄이기 위해 사용합니다.

`step-4`에서 API 응답 형식을 `{ success, message, data }`로 통일했기 때문에, 목록 배열은 응답 객체 자체가 아니라 `result.data`에 들어 있습니다.

## response.ok 확인

`fetch`는 서버가 400이나 500 응답을 보내도 JavaScript 오류를 자동으로 던지지 않습니다. 그래서 직접 확인합니다.

```js
const result = await response.json();

if (!response.ok) {
  throw new Error(result.message || "Failed to fetch posts");
}
```

`response.ok`는 상태 코드가 200번대일 때 `true`입니다.
오류 응답도 `{ success, message, data }` 형식이므로, 화면에는 `result.message`를 보여줄 수 있습니다.

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

## 게시글 목록과 상세 링크

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

이번 단계에서 `/detail/[id]` 페이지도 함께 만들기 때문에 이 링크는 404로 깨지지 않아야 합니다.

## 상세 페이지는 서버 컴포넌트

상세 화면은 사용자가 입력하는 form이 없습니다. URL의 id로 게시글 하나를 조회해서 HTML로 보여주면 됩니다.

그래서 `"use client"`를 붙이지 않고 서버 컴포넌트로 둡니다.

서버 컴포넌트에서는 MongoDB를 사용하는 데이터 함수를 직접 호출할 수 있습니다.

```js
const post = await getPostById(id);
```

클라이언트 컴포넌트에서는 MongoDB 함수를 직접 import하지 않아야 합니다. 하지만 서버 컴포넌트에서는 가능합니다.

## 상세 페이지 파일 위치

상세 페이지 파일은 다음 위치에 만듭니다.

```txt
app/detail/[id]/page.js
```

예를 들어 다음 주소로 접속하면

```txt
/detail/abc123
```

`id` 값은 `"abc123"`입니다.

## params 읽기

App Router의 동적 라우트에서는 컴포넌트 인자로 `params`를 받을 수 있습니다.

```js
export default async function BlogDetail({ params }) {
  const { id } = await params;
}
```

최신 Next.js에서는 `params`를 비동기 값처럼 다루므로 `await params`를 사용합니다.

## 상세 데이터 조회

id를 얻은 뒤 데이터 함수를 호출합니다.

```js
const post = await getPostById(id);
```

`getPostById`는 `lib/posts.js`에 있습니다.

이 함수는 다음 일을 합니다.

1. id가 MongoDB ObjectId로 변환 가능한지 확인한다.
2. 가능하면 `new ObjectId(id)`로 변환한다.
3. `posts` 컬렉션에서 `_id`가 일치하는 문서를 찾는다.
4. 찾으면 게시글 객체를 반환한다.
5. 없으면 `null`을 반환한다.

## notFound 사용

게시글이 없으면 상세 화면을 정상적으로 그릴 수 없습니다.

```js
if (!post) {
  notFound();
}
```

`notFound()`는 Next.js의 404 페이지 흐름으로 이동시킵니다.

API Route에서는 게시글이 없을 때 JSON과 상태 코드 404를 반환했습니다.

```js
return apiError("Post not found", 404);
```

페이지 컴포넌트에서는 JSON이 아니라 화면 흐름이 필요하므로 `notFound()`를 사용합니다.

## 본문 줄바꿈 유지

게시글 본문에는 사용자가 textarea에서 입력한 줄바꿈이 들어갈 수 있습니다.

일반 `<p>` 태그는 줄바꿈을 그대로 보여주지 않습니다. 그래서 상세 화면에서는 `<pre>`를 사용합니다.

```jsx
<pre className={styles.content}>{post.content}</pre>
```

하지만 `<pre>`는 긴 줄이 화면 밖으로 넘칠 수 있습니다. 그래서 CSS에서 다음 규칙을 추가합니다.

```css
.content {
  white-space: pre-wrap;
}
```

`pre-wrap`은 줄바꿈은 유지하되, 긴 줄은 화면 너비에 맞게 감싸도록 합니다.

## 상세에서 목록으로 돌아가기

`step-5`에서는 아직 수정 화면이 없습니다. 그래서 상세 화면 아래에는 목록으로 돌아가는 링크를 둡니다.

```jsx
<Link href="/">Back to list</Link>
```

수정 화면은 `step-7`에서 만들고, 그때 이 링크를 수정 화면으로 가는 `Edit` 링크로 바꿉니다.

## CSS Module

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

상세 페이지 전용 스타일은 `app/detail/[id]/page.module.css`에 둡니다.

```css
.container {
  display: grid;
  gap: 1rem;
}

.content {
  white-space: pre-wrap;
}
```

CSS Module을 사용하면 클래스 이름이 해당 컴포넌트 범위 안에서 관리됩니다. 전역 CSS와 달리 다른 페이지에 의도치 않게 영향을 줄 가능성이 줄어듭니다.

## 직접 실습 순서

1. `app/page.js` 맨 위에 `"use client";`를 추가한다.
2. `Link`, `useEffect`, `useState`를 import한다.
3. `posts`, `error`, `isLoading` 상태를 만든다.
4. `useEffect` 안에 `loadPosts` async 함수를 만든다.
5. `fetch("/api/post", { cache: "no-store" })`로 API를 호출한다.
6. `response.ok`를 확인한다.
7. `response.json()` 결과에서 `data`를 꺼내 `posts`에 저장한다.
8. 오류가 나면 `error`에 메시지를 저장한다.
9. `finally`에서 `isLoading`을 `false`로 바꾼다.
10. 상태에 맞게 로딩/오류/빈 목록/목록 화면을 렌더링한다.
11. 게시글 제목을 `/detail/${post._id}` 링크로 만든다.
12. `app/page.module.css`를 만들고 목록 스타일을 작성한다.
13. `app/detail/[id]/page.js`를 만든다.
14. `params`에서 id를 읽고 `getPostById(id)`를 호출한다.
15. 게시글이 없으면 `notFound()`를 호출한다.
16. 제목과 본문을 렌더링한다.
17. `app/detail/[id]/page.module.css`를 만든다.

## 실행 전 준비

목록과 상세가 실제로 보이려면 다음이 필요합니다.

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

게시글 제목을 클릭했을 때 `/detail/[id]` 상세 화면으로 이동하면 성공입니다.

## 검증 명령

```bash
npm run lint
npm run build
```

빌드 출력에 다음 route가 보이면 목록과 상세 라우트가 함께 준비된 것입니다.

```txt
/
/detail/[id]
```

실제 데이터 표시까지 확인하려면 개발 서버와 MongoDB를 함께 실행해야 합니다.

## 자주 발생하는 실수

### "use client"를 빼먹는 경우

`useState`나 `useEffect`를 쓰는 홈 화면에는 `"use client";`가 필요합니다.

상세 화면에는 붙이지 않습니다. 상세 화면은 서버 컴포넌트로 두고 `getPostById`를 직접 호출합니다.

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

### Link만 만들고 상세 페이지를 만들지 않는 경우

`/detail/${post._id}` 링크를 만들었다면 `app/detail/[id]/page.js`도 같은 단계에서 만들어야 합니다. 그래야 학습자가 목록을 클릭했을 때 404를 만나지 않습니다.

### params를 await하지 않는 경우

이 프로젝트의 Next.js 버전에서는 다음처럼 작성합니다.

```js
const { id } = await params;
```

## 이 단계에서 아직 하지 않는 것

아직 새 글 작성 form은 동작하지 않습니다. `/post` 페이지는 여전히 껍데기입니다.

아직 수정 화면도 없습니다. 상세 화면의 링크는 목록으로 돌아가기만 합니다.

다음 단계에서 `/post` 화면에 form을 만들고, `POST /api/post`로 새 게시글을 저장합니다.
