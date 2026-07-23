# Step 14. 클라이언트 필터 검색 추가하기

## 변경 내용

브라우저가 이미 가진 목록 배열을 기준으로 클라이언트 필터 검색을 추가합니다.

- 이미 클라이언트 컴포넌트인 홈 화면에 검색어 상태를 추가합니다.
- 처음 받은 게시글 배열에서 제목/본문을 기준으로 브라우저 안에서 필터링합니다.
- 검색 결과가 없을 때 안내 문구를 표시합니다.

## 시작 전 확인

개인 실습 저장소의 `main`에서 직전 단계까지 마친 상태로 시작합니다. 코드 블록은 복사해 붙이지 않고 직접 입력합니다.

수정 전에 `git status --short`의 출력이 없는지 확인합니다. 변경이 남아 있다면 원인을 확인하고 시작 상태를 정리합니다.

## 작업 1. 홈 화면에 브라우저 검색 상태 추가

검색할 때 서버에 다시 요청하지 않습니다. 브라우저가 이미 가지고 있는 posts 배열을 `filter`로 걸러서 보여주는 클라이언트 필터입니다.

### 수정할 파일

- 수정: `app/page.js`

### 입력할 코드

아래 파일 경로를 확인하고 각 파일의 전체 내용을 입력합니다. 삭제로 표시된 파일은 PowerShell에서 제거합니다.

#### `app/page.js`

`app/page.js`를 열고 파일 전체를 다음 내용으로 맞춥니다.

~~~js
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
~~~

### 설명과 확인

- 홈 화면은 이미 클라이언트 컴포넌트이므로, 기존 `/api/post` fetch 결과를 `allPosts`에 보관하고 버튼 클릭 시 필터링합니다.
- 검색어 비교는 `toLowerCase()`로 대소문자 차이를 줄입니다.
- 이 방식은 데이터가 많아지면 비효율적이므로 서버 검색이 더 적합합니다.

## 실행 확인

기본 정적 검사는 다음 명령으로 확인합니다.

> Windows 11에서는 [환경 준비](../windows-11.md)를 먼저 확인합니다. `git`, `node`, `npm.cmd` 명령은 PowerShell에서도 같습니다. `npm.ps1` 오류가 나면 `npm.cmd`를 사용합니다.

```powershell
npm.cmd run lint
npm.cmd run build
```

브라우저 확인이 필요하면 개발 서버를 켠 뒤 해당 화면을 확인합니다.

```powershell
npm.cmd run dev
```

체크할 내용은 다음과 같습니다.

- 홈에서 검색어를 입력한 뒤 `Client Filter` 버튼을 누르면 목록이 줄어든다.
- 검색 결과가 없으면 안내 문구가 보인다.

## 독립 확인

검색 결과 0건 화면과 검색어 초기화 동작을 확인합니다. 결과와 확인 방법을 한 문장으로 기록합니다. 실험값은 검사를 마치면 원래대로 복구합니다.

## 마무리 확인

- 각 작업 단위의 설명과 파일 경로를 먼저 확인합니다.
- 코드 블록은 해당 파일의 일부가 아니라 현재 단계에서 사용할 전체 내용입니다.

## 저장소에 기록하기

실험용 변경을 모두 복구한 뒤 검사 결과와 코드 변경을 함께 확인합니다.

```powershell
git branch --show-current
git status --short
npm.cmd run lint
npm.cmd run build
git add .
git commit -m "Complete Next.js step 14"
git push
git status --short --branch
```

현재 브랜치는 `main`이어야 합니다. 마지막 상태에서 `main...origin/main` 뒤에 `ahead`가 없고 작업 파일 목록도 비어 있어야 합니다.
