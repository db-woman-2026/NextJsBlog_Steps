# Step 14. 클라이언트 필터 검색 추가하기

## 이번 스텝 주요 기능 Overview

브라우저가 이미 가진 목록 배열을 기준으로 클라이언트 필터 검색을 추가합니다.

- 이미 클라이언트 컴포넌트인 홈 화면에 검색어 상태를 추가합니다.
- 처음 받은 게시글 배열에서 제목/본문을 기준으로 브라우저 안에서 필터링합니다.
- 검색 결과가 없을 때 안내 문구를 표시합니다.

## 작업 1. 홈 화면에 브라우저 검색 상태 추가

이 단계의 검색은 서버에 다시 요청하지 않습니다. 브라우저가 이미 가지고 있는 posts 배열을 `filter`로 걸러서 보여주는 클라이언트 필터입니다.

### 직접 수정할 파일

- 수정: [app/page.js](../../app/page.js)

### 이전 단계와 달라지는 코드

아래 diff에서 `+`로 시작하는 줄을 추가하고, `-`로 시작하는 줄을 제거합니다. 새 파일은 diff에 보이는 전체 내용을 새로 입력합니다.

~~~diff
diff --git a/app/page.js b/app/page.js
index 7f21c51..3c36f22 100644
--- a/app/page.js
+++ b/app/page.js
@@ -12,10 +12,24 @@ function formatDate(dateValue) {
   return new Date(dateValue).toLocaleString("ko-KR");
 }

+function postMatchesKeyword(post, keyword) {
+  const title = post.title || "";
+  const content = post.content || "";
+  const lowerKeyword = keyword.toLowerCase();
+
+  return (
+    title.toLowerCase().includes(lowerKeyword) ||
+    content.toLowerCase().includes(lowerKeyword)
+  );
+}
+
 export default function Home() {
+  const [allPosts, setAllPosts] = useState([]);
   const [posts, setPosts] = useState([]);
   const [error, setError] = useState("");
   const [isLoading, setIsLoading] = useState(true);
+  const [keyword, setKeyword] = useState("");
+  const [searchMessage, setSearchMessage] = useState("");

   useEffect(() => {
     async function loadPosts() {
@@ -27,6 +41,7 @@ export default function Home() {
           throw new Error(result.message || "Failed to fetch posts");
         }

+        setAllPosts(result.data);
         setPosts(result.data);
       } catch (err) {
         setError(err instanceof Error ? err.message : "Failed to fetch posts");
@@ -38,11 +53,56 @@ export default function Home() {
     loadPosts();
   }, []);

+  function handleClientFilter() {
+    const searchKeyword = keyword.trim();
+
+    setError("");
+
+    if (!searchKeyword) {
+      setPosts(allPosts);
+      setSearchMessage("Showing all posts because the search keyword is empty.");
+      return;
+    }
+
+    const filteredPosts = allPosts.filter((post) =>
+      postMatchesKeyword(post, searchKeyword),
+    );
+
+    setPosts(filteredPosts);
+    setSearchMessage(`Client filter result: ${filteredPosts.length} posts`);
+  }
+
+  function handleShowAll() {
+    setError("");
+    setKeyword("");
+    setPosts(allPosts);
+    setSearchMessage("");
+  }
+
   return (
     <main>
+      <form onSubmit={(event) => event.preventDefault()}>
+        <label htmlFor="keyword">Search posts:</label>
+        <input
+          type="search"
+          id="keyword"
+          value={keyword}
+          onChange={(event) => setKeyword(event.target.value)}
+          disabled={isLoading}
+        />
+
+        <button type="button" onClick={handleClientFilter} disabled={isLoading}>
+          Client Filter
+        </button>
+        <button type="button" onClick={handleShowAll} disabled={isLoading}>
+          Show All
+        </button>
+      </form>
+
+      {searchMessage && <p>{searchMessage}</p>}
       {isLoading && <p>Loading posts...</p>}
       {error && <p role="alert">{error}</p>}
-      {!isLoading && !error && posts.length === 0 && <p>No posts yet.</p>}
+      {!isLoading && !error && posts.length === 0 && <p>No posts found.</p>}
       {!isLoading && !error && (
         <section className={styles.articleList} aria-label="Blog posts">
           {posts.map((post) => (
~~~

### 설명/확인 포인트

- 홈 화면은 이미 클라이언트 컴포넌트이므로, 기존 `/api/post` fetch 결과를 `allPosts`에 보관하고 버튼 클릭 시 필터링합니다.
- 검색어 비교는 `toLowerCase()`로 대소문자 차이를 줄입니다.
- 이 방식은 데이터가 많아지면 비효율적이며 step-15에서 서버 검색으로 바꿉니다.

## 실행 확인

기본 정적 검사는 다음 명령으로 확인합니다.

```bash
npm run lint
npm run build
```

브라우저 확인이 필요하면 개발 서버를 켠 뒤 해당 화면을 확인합니다.

```bash
npm run dev
```

체크할 내용은 다음과 같습니다.

- 홈에서 검색어를 입력한 뒤 `Client Filter` 버튼을 누르면 목록이 줄어든다.
- 검색 결과가 없으면 안내 문구가 보인다.

## 다음 단계로 넘어가기 전

- 이 문서의 각 작업 단위에서 설명을 먼저 읽고, 바로 아래 diff를 기준으로 파일을 수정합니다.
- 새 파일은 diff에 나온 전체 내용을 입력하고, 기존 파일은 diff의 `+`/`-` 줄만 비교하면서 수정합니다.
- 링크된 프로젝트 내부 파일을 열어 현재 단계의 완성본과 직접 비교할 수 있습니다.
