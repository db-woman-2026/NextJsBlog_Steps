# Step 17. 정렬 기능 추가하기

## 이번 단계에서 할 일

sort query string과 정렬 select를 추가해 최신순, 오래된순, 제목순 정렬을 서버에서 처리합니다.

- API가 `sort` query string을 받아 정렬 방식을 선택합니다.
- MongoDB query에서 최신순, 오래된순, 제목순 정렬을 처리합니다.
- 홈 화면에 정렬 select를 추가하고 정렬 변경 시 1페이지부터 다시 조회합니다.

## 작업 1. 데이터 함수에 sort 옵션 추가

정렬은 화면에서 배열을 다시 정렬하기보다 DB 조회 조건에 넣어 처리합니다. `sort` 값에 따라 MongoDB sort 객체를 선택합니다.

### 수정할 파일

- 수정: [lib/posts.js](../../lib/posts.js)

### 코드 변경

아래 diff에서 `+`로 시작하는 줄을 추가하고, `-`로 시작하는 줄을 제거합니다. 새 파일은 diff에 보이는 전체 내용을 새로 입력합니다.

~~~diff
diff --git a/lib/posts.js b/lib/posts.js
index e4b99b6..2013802 100644
--- a/lib/posts.js
+++ b/lib/posts.js
@@ -43,7 +43,26 @@ function buildPostQuery(keyword) {
   };
 }

-export async function listPosts({ keyword = "", page = 1, limit = 5 } = {}) {
+function buildPostSort(sort) {
+  switch (sort) {
+    case "created-asc":
+      return { createdAt: 1 };
+    case "title-asc":
+      return { title: 1 };
+    case "title-desc":
+      return { title: -1 };
+    case "created-desc":
+    default:
+      return { createdAt: -1 };
+  }
+}
+
+export async function listPosts({
+  keyword = "",
+  page = 1,
+  limit = 5,
+  sort = "created-desc",
+} = {}) {
   await seedPostsIfEmpty();

   const collection = await getPostsCollection();
@@ -56,7 +75,7 @@ export async function listPosts({ keyword = "", page = 1, limit = 5 } = {}) {

   const posts = await collection
     .find(query)
-    .sort({ createdAt: -1 })
+    .sort(buildPostSort(sort))
     .skip(skip)
     .limit(pageSize)
     .toArray();
~~~

### 설명과 확인

- 기본값은 최신순입니다.
- 제목순은 `{ title: 1 }`로 오름차순 정렬합니다.

## 작업 2. API에서 sort query string 전달

`GET /api/post`가 URL의 sort 값을 읽어 `listPosts`에 넘깁니다. keyword/page/limit/sort가 모두 목록 조회 조건이 됩니다.

### 수정할 파일

- 수정: [app/api/post/route.js](../../app/api/post/route.js)

### 코드 변경

아래 diff에서 `+`로 시작하는 줄을 추가하고, `-`로 시작하는 줄을 제거합니다. 새 파일은 diff에 보이는 전체 내용을 새로 입력합니다.

~~~diff
diff --git a/app/api/post/route.js b/app/api/post/route.js
index fef4bd9..2c15606 100644
--- a/app/api/post/route.js
+++ b/app/api/post/route.js
@@ -7,7 +7,8 @@ export async function GET(request) {
     const keyword = searchParams.get("keyword") || "";
     const page = searchParams.get("page") || "1";
     const limit = searchParams.get("limit") || "5";
-    const posts = await listPosts({ keyword, page, limit });
+    const sort = searchParams.get("sort") || "created-desc";
+    const posts = await listPosts({ keyword, page, limit, sort });

     return apiSuccess(posts, "Posts fetched successfully");
   } catch (error) {
~~~

### 설명과 확인

- 지원하지 않는 값은 데이터 함수에서 기본 정렬로 처리합니다.
- query string이 늘어나도 응답 구조는 그대로 유지합니다.

## 작업 3. 홈 화면에 정렬 select 추가

사용자가 최신순, 오래된순, 제목순을 선택할 수 있도록 select를 추가합니다. 정렬이 바뀌면 결과 순서가 바뀌므로 첫 페이지부터 다시 조회합니다.

### 수정할 파일

- 수정: [app/page.js](../../app/page.js)

### 코드 변경

아래 diff에서 `+`로 시작하는 줄을 추가하고, `-`로 시작하는 줄을 제거합니다. 새 파일은 diff에 보이는 전체 내용을 새로 입력합니다.

~~~diff
diff --git a/app/page.js b/app/page.js
index 46ade6c..07af3cf 100644
--- a/app/page.js
+++ b/app/page.js
@@ -5,6 +5,7 @@ import { useEffect, useState } from "react";
 import styles from "./page.module.css";

 const PAGE_SIZE = 5;
+const DEFAULT_SORT = "created-desc";

 function formatDate(dateValue) {
   if (!dateValue) {
@@ -36,10 +37,11 @@ async function fetchPosts(url) {
   return result.data;
 }

-function buildPostsUrl({ keyword, page }) {
+function buildPostsUrl({ keyword, page, sort }) {
   const params = new URLSearchParams({
     page: String(page),
     limit: String(PAGE_SIZE),
+    sort,
   });

   if (keyword) {
@@ -58,14 +60,19 @@ export default function Home() {
   const [keyword, setKeyword] = useState("");
   const [searchMessage, setSearchMessage] = useState("");
   const [serverKeyword, setServerKeyword] = useState("");
+  const [sortOrder, setSortOrder] = useState(DEFAULT_SORT);

-  async function loadPosts({ page = 1, searchKeyword = serverKeyword } = {}) {
+  async function loadPosts({
+    page = 1,
+    searchKeyword = serverKeyword,
+    sortValue = sortOrder,
+  } = {}) {
     setError("");
     setIsLoading(true);

     try {
       const data = await fetchPosts(
-        buildPostsUrl({ keyword: searchKeyword, page }),
+        buildPostsUrl({ keyword: searchKeyword, page, sort: sortValue }),
       );
       setAllPosts(data.posts);
       setPosts(data.posts);
@@ -81,7 +88,7 @@ export default function Home() {
     async function loadInitialPosts() {
       try {
         const data = await fetchPosts(
-          buildPostsUrl({ keyword: "", page: 1 }),
+          buildPostsUrl({ keyword: "", page: 1, sort: DEFAULT_SORT }),
         );
         setAllPosts(data.posts);
         setPosts(data.posts);
@@ -142,6 +149,18 @@ export default function Home() {
     await loadPosts({ page: nextPage, searchKeyword: serverKeyword });
   }

+  async function handleSortChange(event) {
+    const nextSortOrder = event.target.value;
+
+    setSortOrder(nextSortOrder);
+    setSearchMessage("Sorted posts from the server.");
+    await loadPosts({
+      page: 1,
+      searchKeyword: serverKeyword,
+      sortValue: nextSortOrder,
+    });
+  }
+
   return (
     <main>
       <form onSubmit={(event) => event.preventDefault()}>
@@ -154,6 +173,19 @@ export default function Home() {
           disabled={isLoading}
         />

+        <label htmlFor="sortOrder">Sort posts:</label>
+        <select
+          id="sortOrder"
+          value={sortOrder}
+          onChange={handleSortChange}
+          disabled={isLoading}
+        >
+          <option value="created-desc">Newest first</option>
+          <option value="created-asc">Oldest first</option>
+          <option value="title-asc">Title A-Z</option>
+          <option value="title-desc">Title Z-A</option>
+        </select>
+
         <button type="button" onClick={handleClientFilter} disabled={isLoading}>
           Client Filter
         </button>
~~~

### 설명과 확인

- 정렬 상태도 `URLSearchParams`에 포함합니다.
- 정렬을 바꾸면 `loadPosts({ page: 1, ... })`로 첫 페이지를 다시 조회합니다.

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

- 정렬 select가 보인다.
- Oldest를 선택하면 오래된 글이 먼저 보인다.
- Title A-Z를 선택하면 제목순으로 보인다.

## 마무리 확인

- 이 문서의 각 작업 단위에서 설명을 먼저 읽고, 바로 아래 diff를 기준으로 파일을 수정합니다.
- 새 파일은 diff에 나온 전체 내용을 입력하고, 기존 파일은 diff의 `+`/`-` 줄만 비교하면서 수정합니다.
- 링크된 프로젝트 내부 파일을 열어 현재 단계의 완성본과 직접 비교할 수 있습니다.
