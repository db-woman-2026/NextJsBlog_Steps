# Step 14. 클라이언트 필터 검색

이 문서는 `step-13`에서 시작해 `step-14`를 완성하는 실습 자료입니다.
원본 개요는 [docs/overview/step-14.md](../overview/step-14.md)에 보존되어 있습니다.
실제 완성 코드는 [step-14 브랜치](https://github.com/db-woman-2026/NextJsBlog_Steps/tree/step-14) 기준입니다.

## 이번 단계 목표

브라우저가 이미 가진 목록 배열을 기준으로 클라이언트 필터 검색을 추가합니다.

이번 단계에서 집중할 내용은 다음과 같습니다.

- 서버 요청 없이 브라우저에 있는 배열을 filter로 거릅니다.
- 전체 목록 allPosts와 화면 목록 posts를 분리합니다.
- Client Filter와 Show All 버튼으로 상태 변화를 확인합니다.

## 시작 기준

이전 단계인 `step-13` 브랜치까지 완료된 상태에서 시작합니다.

```bash
git switch step-13
# 실습용 브랜치를 직접 만들 경우
git switch -c practice-step-14
```

수업 저장소의 정답 브랜치를 바로 확인하려면 다음 명령을 사용할 수 있습니다.

```bash
git switch step-14
```

## 수정 파일

| 상태 | 파일 | 확인 링크 |
| --- | --- | --- |
| 수정 | `app/page.js` | [app/page.js](https://github.com/db-woman-2026/NextJsBlog_Steps/blob/step-14/app/page.js) |

문서 파일은 이 강의 자료에서 별도로 관리하므로 위 표에는 기능 구현에 필요한 코드와 설정 파일만 넣었습니다.

## 코드 작성

아래 순서대로 파일을 만들거나 수정합니다. 각 코드 블록은 해당 단계 브랜치의 실제 파일 내용을 기준으로 합니다.

### 1. app/page.js

기존 `app/page.js` 파일을 열고 아래 최종 코드와 같게 수정합니다.

홈 화면입니다. 단계가 진행되면서 소개 화면에서 게시글 목록, 검색, 페이지네이션, 정렬 UI로 확장됩니다.

```jsx
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "./page.module.css";

function formatDate(dateValue) {
  if (!dateValue) {
    return "";
  }

  return new Date(dateValue).toLocaleString("ko-KR");
}

function postMatchesKeyword(post, keyword) {
  const title = post.title || "";
  const content = post.content || "";
  const lowerKeyword = keyword.toLowerCase();

  return (
    title.toLowerCase().includes(lowerKeyword) ||
    content.toLowerCase().includes(lowerKeyword)
  );
}

export default function Home() {
  const [allPosts, setAllPosts] = useState([]);
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [keyword, setKeyword] = useState("");
  const [searchMessage, setSearchMessage] = useState("");

  useEffect(() => {
    async function loadPosts() {
      try {
        const response = await fetch("/api/post", { cache: "no-store" });
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Failed to fetch posts");
        }

        setAllPosts(result.data);
        setPosts(result.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch posts");
      } finally {
        setIsLoading(false);
      }
    }

    loadPosts();
  }, []);

  function handleClientFilter() {
    const searchKeyword = keyword.trim();

    setError("");

    if (!searchKeyword) {
      setPosts(allPosts);
      setSearchMessage("Showing all posts because the search keyword is empty.");
      return;
    }

    const filteredPosts = allPosts.filter((post) =>
      postMatchesKeyword(post, searchKeyword),
    );

    setPosts(filteredPosts);
    setSearchMessage(`Client filter result: ${filteredPosts.length} posts`);
  }

  function handleShowAll() {
    setError("");
    setKeyword("");
    setPosts(allPosts);
    setSearchMessage("");
  }

  return (
    <main>
      <form onSubmit={(event) => event.preventDefault()}>
        <label htmlFor="keyword">Search posts:</label>
        <input
          type="search"
          id="keyword"
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
          disabled={isLoading}
        />

        <button type="button" onClick={handleClientFilter} disabled={isLoading}>
          Client Filter
        </button>
        <button type="button" onClick={handleShowAll} disabled={isLoading}>
          Show All
        </button>
      </form>

      {searchMessage && <p>{searchMessage}</p>}
      {isLoading && <p>Loading posts...</p>}
      {error && <p role="alert">{error}</p>}
      {!isLoading && !error && posts.length === 0 && <p>No posts found.</p>}
      {!isLoading && !error && (
        <section className={styles.articleList} aria-label="Blog posts">
          {posts.map((post) => (
            <article key={post._id} className={styles.article}>
              <Link href={`/detail/${post._id}`}>{post.title}</Link>
              <p>Created: {formatDate(post.createdAt)}</p>
              {post.updatedAt && <p>Updated: {formatDate(post.updatedAt)}</p>}
            </article>
          ))}
        </section>
      )}
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

- 홈에서 검색어를 입력하고 Client Filter를 누릅니다.
- Show All을 눌렀을 때 전체 목록이 다시 보이는지 확인합니다.

## 자주 확인할 부분

- 파일 이름과 폴더 이름을 정확히 입력합니다. App Router에서는 `page.js`, `layout.js`, `route.js`, `not-found.js`, `error.js` 같은 파일명이 특별한 의미를 가집니다.
- 클라이언트 상태나 이벤트를 쓰는 파일에는 필요한 경우에만 `"use client";`를 둡니다. 서버에서 실행되어야 하는 MongoDB 코드는 클라이언트 컴포넌트로 가져오지 않습니다.
- API 응답은 가능한 한 `{ success, message, data }` 구조를 유지합니다. 화면 코드는 이 구조를 기준으로 `message`와 `data`를 읽습니다.
- 실습 중 막히면 먼저 이 문서의 코드 블록과 브랜치 링크의 실제 파일을 비교합니다.

## 개념 정리

아래 내용은 기존 단계 개요를 강의 문서 안에서도 바로 볼 수 있도록 가져온 것입니다. 코드 작성 후 다시 읽으면 각 변경의 이유를 확인하기 쉽습니다.

## 이 단계의 목표

`step-14`는 홈 화면에 클라이언트 필터 검색을 추가하는 단계입니다.

이 단계의 검색은 서버에 다시 요청하지 않습니다. 처음 홈 화면에서 받아온 게시글 배열을 브라우저 메모리에 보관해두고, 그 배열 안에서 검색어와 일치하는 글만 보여줍니다.

이 단계에서는 다음을 구현합니다.

- 전체 게시글 배열을 저장하는 `allPosts` 상태를 만든다.
- 현재 화면에 보여줄 게시글 배열을 `posts` 상태로 분리한다.
- 검색어를 저장하는 `keyword` 상태를 만든다.
- 검색 결과 안내 문구를 저장하는 `searchMessage` 상태를 만든다.
- 제목 또는 본문에 검색어가 포함되어 있는지 확인한다.
- `Client Filter` 버튼으로 브라우저 안에서 필터링한다.
- `Show All` 버튼으로 전체 목록을 다시 보여준다.

## 클라이언트 필터란 무엇인가

클라이언트 필터는 이미 브라우저가 가지고 있는 데이터에서 원하는 항목만 골라 보여주는 방식입니다.

```txt
GET /api/post로 목록을 한 번 받음
-> 브라우저에 배열 저장
-> 검색어 입력
-> 배열에서 일치하는 글만 필터링
```

서버나 MongoDB에 다시 요청하지 않기 때문에 빠르고 단순합니다.

하지만 브라우저가 이미 가지고 있는 데이터 안에서만 검색할 수 있습니다. 데이터가 아주 많거나 페이지네이션이 있는 경우에는 서버 검색이 더 적합할 수 있습니다.

## allPosts와 posts 분리

기존에는 `posts` 상태 하나만 있었습니다.

```js
const [posts, setPosts] = useState([]);
```

이 단계에서는 상태를 둘로 나눕니다.

```js
const [allPosts, setAllPosts] = useState([]);
const [posts, setPosts] = useState([]);
```

`allPosts`는 API에서 처음 받아온 원본 배열입니다.

`posts`는 현재 화면에 보여줄 배열입니다.

처음 데이터를 불러올 때는 둘 다 같은 값으로 채웁니다.

```js
setAllPosts(result.data);
setPosts(result.data);
```

검색을 하면 `posts`만 바꿉니다. `allPosts`는 원본으로 남겨둡니다.

## 검색어 상태

검색 input은 `keyword` 상태와 연결합니다.

```js
const [keyword, setKeyword] = useState("");
```

```jsx
<input
  type="search"
  id="keyword"
  value={keyword}
  onChange={(event) => setKeyword(event.target.value)}
  disabled={isLoading}
/>
```

`type="search"`는 검색어 입력에 의미상 어울리는 input 타입입니다.

## postMatchesKeyword 함수

게시글 하나가 검색어와 맞는지 확인하는 함수를 만듭니다.

```js
function postMatchesKeyword(post, keyword) {
  const title = post.title || "";
  const content = post.content || "";
  const lowerKeyword = keyword.toLowerCase();

  return (
    title.toLowerCase().includes(lowerKeyword) ||
    content.toLowerCase().includes(lowerKeyword)
  );
}
```

제목이나 본문 중 하나라도 검색어를 포함하면 `true`를 반환합니다.

`toLowerCase()`를 사용하면 대소문자를 구분하지 않고 검색할 수 있습니다.

## Client Filter 버튼

검색 버튼은 form 제출이 아니라 버튼 클릭으로 처리합니다.

```jsx
<button type="button" onClick={handleClientFilter} disabled={isLoading}>
  Client Filter
</button>
```

`type="button"`을 쓰지 않으면 form 안의 버튼은 기본적으로 submit 버튼처럼 동작할 수 있습니다.

## handleClientFilter

검색어를 정리하고, 비어 있으면 전체 목록을 보여줍니다.

```js
const searchKeyword = keyword.trim();

if (!searchKeyword) {
  setPosts(allPosts);
  setSearchMessage("Showing all posts because the search keyword is empty.");
  return;
}
```

검색어가 있으면 `filter`를 사용합니다.

```js
const filteredPosts = allPosts.filter((post) =>
  postMatchesKeyword(post, searchKeyword),
);
```

그리고 결과를 화면용 상태에 넣습니다.

```js
setPosts(filteredPosts);
setSearchMessage(`Client filter result: ${filteredPosts.length} posts`);
```

## Show All 버튼

전체 목록으로 돌아가는 버튼도 만듭니다.

```js
function handleShowAll() {
  setError("");
  setKeyword("");
  setPosts(allPosts);
  setSearchMessage("");
}
```

검색어와 검색 메시지를 지우고, `posts`를 `allPosts`로 되돌립니다.

## 직접 실습 순서

1. `allPosts`, `keyword`, `searchMessage` 상태를 추가한다.
2. API 목록을 불러올 때 `allPosts`와 `posts`를 함께 채운다.
3. `postMatchesKeyword` 함수를 만든다.
4. 검색 form을 추가한다.
5. 검색 input을 `keyword` 상태와 연결한다.
6. `handleClientFilter` 함수를 만든다.
7. `Client Filter` 버튼을 연결한다.
8. `handleShowAll` 함수를 만든다.
9. `Show All` 버튼을 연결한다.
10. 검색 결과가 없을 때 `No posts found.`를 표시한다.

## 확인 방법

홈 화면에서 검색어를 입력합니다.

```txt
http://localhost:3000/
```

`Client Filter`를 누르면 현재 브라우저가 가지고 있는 게시글 배열에서 제목 또는 본문이 검색됩니다.

`Show All`을 누르면 전체 목록으로 돌아옵니다.

## 검증 명령

```bash
npm run lint
npm run build
```

## 이 단계의 핵심

클라이언트 필터는 서버 변경 없이 구현할 수 있습니다. 대신 브라우저가 이미 가지고 있는 데이터 안에서만 검색한다는 한계가 있습니다.
