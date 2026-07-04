# Step 16. 페이지네이션 추가하기

이 문서는 `step-15`에서 시작해 `step-16`를 완성하는 실습 자료입니다.
원본 개요는 [docs/overview/step-16.md](../overview/step-16.md)에 보존되어 있습니다.
아래 파일 링크는 GitHub가 아니라 이 프로젝트 안의 현재 단계 파일을 여는 경로입니다.

## 이번 스텝 주요 기능 Overview

page와 limit query string, MongoDB skip/limit, Previous/Next 버튼으로 페이지네이션을 구현합니다.

- API가 `page`와 `limit` query string을 받아 일부 게시글만 반환합니다.
- MongoDB에서 `skip`과 `limit`으로 페이지 단위 조회를 수행합니다.
- 홈 화면에 Previous/Next 버튼과 현재 페이지 정보를 표시합니다.

## 시작 기준

이전 단계인 `step-15` 브랜치까지 완료된 상태에서 시작합니다.

```bash
git switch step-15
git switch -c practice-step-16
```

정답 브랜치는 확인용으로만 사용합니다.

```bash
git switch step-16
```

## 작업 1. 데이터 함수에 페이지네이션 계산 추가

전체 게시글을 매번 가져오지 않고 현재 페이지에 필요한 개수만 읽습니다. 총 개수를 함께 계산해 마지막 페이지 여부를 판단할 수 있게 합니다.

### 수정할 파일

- 수정: [lib/posts.js](../../lib/posts.js)

### 이전 단계와 달라지는 코드

아래 diff에서 `+`로 시작하는 줄을 추가하고, `-`로 시작하는 줄을 제거합니다. 새 파일은 diff에 보이는 전체 내용을 새로 입력합니다.

~~~diff
diff --git a/lib/posts.js b/lib/posts.js
index 4bbab9c..e4b99b6 100644
--- a/lib/posts.js
+++ b/lib/posts.js
@@ -28,25 +28,50 @@ export async function seedPostsIfEmpty() {
   }
 }

-export async function listPosts(keyword = "") {
-  await seedPostsIfEmpty();
-
-  const collection = await getPostsCollection();
+function buildPostQuery(keyword) {
   const searchKeyword = keyword.trim();

   if (!searchKeyword) {
-    return collection.find({}).sort({ createdAt: -1 }).toArray();
+    return {};
   }

-  return collection
-    .find({
-      $or: [
-        { title: { $regex: searchKeyword, $options: "i" } },
-        { content: { $regex: searchKeyword, $options: "i" } },
-      ],
-    })
+  return {
+    $or: [
+      { title: { $regex: searchKeyword, $options: "i" } },
+      { content: { $regex: searchKeyword, $options: "i" } },
+    ],
+  };
+}
+
+export async function listPosts({ keyword = "", page = 1, limit = 5 } = {}) {
+  await seedPostsIfEmpty();
+
+  const collection = await getPostsCollection();
+  const query = buildPostQuery(keyword);
+  const currentPage = Math.max(Number(page) || 1, 1);
+  const pageSize = Math.min(Math.max(Number(limit) || 5, 1), 20);
+  const skip = (currentPage - 1) * pageSize;
+  const totalPosts = await collection.countDocuments(query);
+  const totalPages = Math.max(Math.ceil(totalPosts / pageSize), 1);
+
+  const posts = await collection
+    .find(query)
     .sort({ createdAt: -1 })
+    .skip(skip)
+    .limit(pageSize)
     .toArray();
+
+  return {
+    posts,
+    pagination: {
+      page: currentPage,
+      limit: pageSize,
+      totalPosts,
+      totalPages,
+      hasPreviousPage: currentPage > 1,
+      hasNextPage: currentPage < totalPages,
+    },
+  };
 }

 export async function createPost(postData) {
~~~

### 설명/확인 포인트

- `skip`은 앞 페이지의 게시글 수만큼 건너뜁니다.
- 반환값이 단순 배열에서 `{ posts, pagination }` 구조로 바뀝니다.

## 작업 2. API에서 page와 limit 읽기

`GET /api/post`가 keyword와 함께 page/limit도 읽습니다. 잘못된 값이 들어와도 기본값을 사용해 API가 안정적으로 동작하게 합니다.

### 수정할 파일

- 수정: [app/api/post/route.js](../../app/api/post/route.js)

### 이전 단계와 달라지는 코드

아래 diff에서 `+`로 시작하는 줄을 추가하고, `-`로 시작하는 줄을 제거합니다. 새 파일은 diff에 보이는 전체 내용을 새로 입력합니다.

~~~diff
diff --git a/app/api/post/route.js b/app/api/post/route.js
index ef88194..fef4bd9 100644
--- a/app/api/post/route.js
+++ b/app/api/post/route.js
@@ -5,7 +5,9 @@ export async function GET(request) {
   try {
     const { searchParams } = new URL(request.url);
     const keyword = searchParams.get("keyword") || "";
-    const posts = await listPosts(keyword);
+    const page = searchParams.get("page") || "1";
+    const limit = searchParams.get("limit") || "5";
+    const posts = await listPosts({ keyword, page, limit });

     return apiSuccess(posts, "Posts fetched successfully");
   } catch (error) {
~~~

### 설명/확인 포인트

- 숫자 query string은 `Number()`로 변환한 뒤 기본값과 함께 처리합니다.
- 응답의 `data` 구조가 바뀌므로 화면 코드도 같이 수정해야 합니다.

## 작업 3. 홈 화면에 페이지 상태와 이동 버튼 추가

홈 화면은 현재 page, pagination metadata를 상태로 들고 있습니다. 검색어가 바뀌면 첫 페이지부터 다시 보도록 page를 1로 되돌립니다.

### 수정할 파일

- 수정: [app/page.js](../../app/page.js)

### 이전 단계와 달라지는 코드

아래 diff에서 `+`로 시작하는 줄을 추가하고, `-`로 시작하는 줄을 제거합니다. 새 파일은 diff에 보이는 전체 내용을 새로 입력합니다.

~~~diff
diff --git a/app/page.js b/app/page.js
index 56808c0..46ade6c 100644
--- a/app/page.js
+++ b/app/page.js
@@ -4,6 +4,8 @@ import Link from "next/link";
 import { useEffect, useState } from "react";
 import styles from "./page.module.css";

+const PAGE_SIZE = 5;
+
 function formatDate(dateValue) {
   if (!dateValue) {
     return "";
@@ -34,20 +36,56 @@ async function fetchPosts(url) {
   return result.data;
 }

+function buildPostsUrl({ keyword, page }) {
+  const params = new URLSearchParams({
+    page: String(page),
+    limit: String(PAGE_SIZE),
+  });
+
+  if (keyword) {
+    params.set("keyword", keyword);
+  }
+
+  return `/api/post?${params.toString()}`;
+}
+
 export default function Home() {
   const [allPosts, setAllPosts] = useState([]);
   const [posts, setPosts] = useState([]);
+  const [pagination, setPagination] = useState(null);
   const [error, setError] = useState("");
   const [isLoading, setIsLoading] = useState(true);
   const [keyword, setKeyword] = useState("");
   const [searchMessage, setSearchMessage] = useState("");
+  const [serverKeyword, setServerKeyword] = useState("");
+
+  async function loadPosts({ page = 1, searchKeyword = serverKeyword } = {}) {
+    setError("");
+    setIsLoading(true);
+
+    try {
+      const data = await fetchPosts(
+        buildPostsUrl({ keyword: searchKeyword, page }),
+      );
+      setAllPosts(data.posts);
+      setPosts(data.posts);
+      setPagination(data.pagination);
+    } catch (err) {
+      setError(err instanceof Error ? err.message : "Failed to fetch posts");
+    } finally {
+      setIsLoading(false);
+    }
+  }

   useEffect(() => {
-    async function loadPosts() {
+    async function loadInitialPosts() {
       try {
-        const data = await fetchPosts("/api/post");
-        setAllPosts(data);
-        setPosts(data);
+        const data = await fetchPosts(
+          buildPostsUrl({ keyword: "", page: 1 }),
+        );
+        setAllPosts(data.posts);
+        setPosts(data.posts);
+        setPagination(data.pagination);
       } catch (err) {
         setError(err instanceof Error ? err.message : "Failed to fetch posts");
       } finally {
@@ -55,7 +93,7 @@ export default function Home() {
       }
     }

-    loadPosts();
+    loadInitialPosts();
   }, []);

   function handleClientFilter() {
@@ -65,7 +103,9 @@ export default function Home() {

     if (!searchKeyword) {
       setPosts(allPosts);
-      setSearchMessage("Showing all posts because the search keyword is empty.");
+      setSearchMessage(
+        "Showing current page posts because the search keyword is empty.",
+      );
       return;
     }

@@ -74,44 +114,32 @@ export default function Home() {
     );

     setPosts(filteredPosts);
-    setSearchMessage(`Client filter result: ${filteredPosts.length} posts`);
+    setSearchMessage(
+      `Client filter result on this page: ${filteredPosts.length} posts`,
+    );
   }

   async function handleServerSearch() {
     const searchKeyword = keyword.trim();
-    const url = searchKeyword
-      ? `/api/post?keyword=${encodeURIComponent(searchKeyword)}`
-      : "/api/post";

-    setError("");
-    setIsLoading(true);
-
-    try {
-      const data = await fetchPosts(url);
-      setPosts(data);
-      setSearchMessage(`Server search result: ${data.length} posts`);
-    } catch (err) {
-      setError(err instanceof Error ? err.message : "Failed to fetch posts");
-    } finally {
-      setIsLoading(false);
-    }
+    setServerKeyword(searchKeyword);
+    setSearchMessage(
+      searchKeyword
+        ? `Server search result for "${searchKeyword}"`
+        : "Server search with empty keyword shows all posts.",
+    );
+    await loadPosts({ page: 1, searchKeyword });
   }

   async function handleShowAll() {
-    setError("");
-    setIsLoading(true);
+    setKeyword("");
+    setServerKeyword("");
+    setSearchMessage("");
+    await loadPosts({ page: 1, searchKeyword: "" });
+  }

-    try {
-      const data = await fetchPosts("/api/post");
-      setAllPosts(data);
-      setPosts(data);
-      setKeyword("");
-      setSearchMessage("");
-    } catch (err) {
-      setError(err instanceof Error ? err.message : "Failed to fetch posts");
-    } finally {
-      setIsLoading(false);
-    }
+  async function handlePageChange(nextPage) {
+    await loadPosts({ page: nextPage, searchKeyword: serverKeyword });
   }

   return (
@@ -142,15 +170,42 @@ export default function Home() {
       {error && <p role="alert">{error}</p>}
       {!isLoading && !error && posts.length === 0 && <p>No posts found.</p>}
       {!isLoading && !error && (
-        <section className={styles.articleList} aria-label="Blog posts">
-          {posts.map((post) => (
-            <article key={post._id} className={styles.article}>
-              <Link href={`/detail/${post._id}`}>{post.title}</Link>
-              <p>Created: {formatDate(post.createdAt)}</p>
-              {post.updatedAt && <p>Updated: {formatDate(post.updatedAt)}</p>}
-            </article>
-          ))}
-        </section>
+        <>
+          <section className={styles.articleList} aria-label="Blog posts">
+            {posts.map((post) => (
+              <article key={post._id} className={styles.article}>
+                <Link href={`/detail/${post._id}`}>{post.title}</Link>
+                <p>Created: {formatDate(post.createdAt)}</p>
+                {post.updatedAt && (
+                  <p>Updated: {formatDate(post.updatedAt)}</p>
+                )}
+              </article>
+            ))}
+          </section>
+
+          {pagination && (
+            <nav aria-label="Pagination">
+              <button
+                type="button"
+                onClick={() => handlePageChange(pagination.page - 1)}
+                disabled={isLoading || !pagination.hasPreviousPage}
+              >
+                Previous
+              </button>
+              <span>
+                Page {pagination.page} of {pagination.totalPages} (
+                {pagination.totalPosts} posts)
+              </span>
+              <button
+                type="button"
+                onClick={() => handlePageChange(pagination.page + 1)}
+                disabled={isLoading || !pagination.hasNextPage}
+              >
+                Next
+              </button>
+            </nav>
+          )}
+        </>
       )}
     </main>
   );
~~~

### 설명/확인 포인트

- Previous 버튼은 1페이지에서 disabled 됩니다.
- Next 버튼은 `pagination.hasNextPage`가 false일 때 disabled 됩니다.
- 검색어와 페이지가 모두 API 요청 조건이 됩니다.

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

- 홈 목록에 페이지 정보가 보인다.
- Next/Previous 버튼으로 페이지가 이동한다.
- 검색어 변경 시 1페이지로 돌아간다.

## 다음 단계로 넘어가기 전

- 이 문서의 각 작업 단위에서 설명을 먼저 읽고, 바로 아래 diff를 기준으로 파일을 수정합니다.
- 새 파일은 diff에 나온 전체 내용을 입력하고, 기존 파일은 diff의 `+`/`-` 줄만 비교하면서 수정합니다.
- 링크된 프로젝트 내부 파일을 열어 현재 단계의 완성본과 직접 비교할 수 있습니다.
