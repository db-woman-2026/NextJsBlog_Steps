# Step 19. 게시글 카테고리 추가하기

## 이번 단계에서 할 일

게시글 카테고리를 데이터, 작성/수정 form, 목록 필터, 상세 표시까지 전체 흐름에 연결합니다.

- 게시글 데이터에 category 필드를 추가하고 기본값을 둡니다.
- 작성/수정 form에서 카테고리를 선택할 수 있게 합니다.
- 목록 API와 홈 화면에 카테고리 필터를 연결하고 상세 화면에 카테고리를 표시합니다.

## 작업 1. 데이터 계층에 category 필드 반영

새 글, 샘플 글, 수정 글 모두 같은 category 규칙을 가져야 합니다. 이전 단계에서 만든 기존 게시글에는 아직 category가 없을 수 있으므로, 목록을 조회할 때 누락된 값을 `general`로 보정해 화면과 필터가 안정적으로 동작하게 합니다.

### 수정할 파일

- 수정: [lib/posts.js](../../lib/posts.js)

### 코드 변경

아래 diff에서 `+`로 시작하는 줄을 추가하고, `-`로 시작하는 줄을 제거합니다. 새 파일은 diff에 보이는 전체 내용을 새로 입력합니다.

~~~diff
diff --git a/lib/posts.js b/lib/posts.js
index 2013802..f62257a 100644
--- a/lib/posts.js
+++ b/lib/posts.js
@@ -3,6 +3,13 @@ import getMongoClient from "./mongodb";

 const dbName = process.env.MONGODB_DB || "blog";
 const collectionName = "posts";
+const seedCategories = ["general", "notice", "daily", "tech"];
+
+function normalizeCategory(category) {
+  return typeof category === "string" && category.trim()
+    ? category.trim()
+    : "general";
+}

 function createSeedPosts() {
   return Array.from({ length: 10 }, (_, index) => ({
@@ -11,6 +18,7 @@ function createSeedPosts() {
     content:
       "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
     image: "https://picsum.photos/100",
+    category: seedCategories[index % seedCategories.length],
   }));
 }

@@ -19,6 +27,19 @@ async function getPostsCollection() {
   return client.db(dbName).collection(collectionName);
 }
 
+async function ensurePostCategories(collection) {
+  await collection.updateMany(
+    {
+      $or: [
+        { category: { $exists: false } },
+        { category: null },
+        { category: "" },
+      ],
+    },
+    { $set: { category: "general" } },
+  );
+}
+
 export async function seedPostsIfEmpty() {
   const collection = await getPostsCollection();
   const count = await collection.countDocuments();

@@ -28,19 +49,23 @@ export async function seedPostsIfEmpty() {
   }
 }

-function buildPostQuery(keyword) {
+function buildPostQuery(keyword, category) {
   const searchKeyword = keyword.trim();
+  const selectedCategory = category.trim();
+  const query = {};

-  if (!searchKeyword) {
-    return {};
-  }
-
-  return {
-    $or: [
+  if (searchKeyword) {
+    query.$or = [
       { title: { $regex: searchKeyword, $options: "i" } },
       { content: { $regex: searchKeyword, $options: "i" } },
-    ],
-  };
+    ];
+  }
+
+  if (selectedCategory && selectedCategory !== "all") {
+    query.category = selectedCategory;
+  }
+
+  return query;
 }

 function buildPostSort(sort) {
@@ -62,11 +87,14 @@ export async function listPosts({
   page = 1,
   limit = 5,
   sort = "created-desc",
+  category = "all",
 } = {}) {
   await seedPostsIfEmpty();

   const collection = await getPostsCollection();
-  const query = buildPostQuery(keyword);
+  await ensurePostCategories(collection);
+
+  const query = buildPostQuery(keyword, category);
   const currentPage = Math.max(Number(page) || 1, 1);
   const pageSize = Math.min(Math.max(Number(limit) || 5, 1), 20);
   const skip = (currentPage - 1) * pageSize;
@@ -99,6 +127,7 @@ export async function createPost(postData) {
     title: postData.title,
     content: postData.content,
     image: postData.image || "https://picsum.photos/100",
+    category: normalizeCategory(postData.category),
     createdAt: new Date(),
   });

@@ -135,6 +164,7 @@ export async function updatePost(id, postData) {
       $set: {
         title: postData.title,
         content: postData.content,
+        category: normalizeCategory(postData.category),
         updatedAt: new Date(),
       },
     },
~~~

### 설명과 확인

- 샘플 데이터에도 category가 들어가야 필터를 바로 테스트할 수 있습니다.
- 이전 단계에서 이미 만든 게시글은 category가 없을 수 있으므로 목록 조회 전에 `general`로 보정합니다.
- 검색 조건과 카테고리 조건은 동시에 적용됩니다.

## 작업 2. API 요청/응답에 category 연결

작성, 수정, 목록 API가 category를 이해하도록 route handler를 수정합니다. 목록 API는 `category` query string을 받아 필터링합니다.

### 수정할 파일

- 수정: [app/api/post/route.js](../../app/api/post/route.js)
- 수정: [app/api/post/[id]/route.js](../../app/api/post/%5Bid%5D/route.js)

### 코드 변경

아래 diff에서 `+`로 시작하는 줄을 추가하고, `-`로 시작하는 줄을 제거합니다. 새 파일은 diff에 보이는 전체 내용을 새로 입력합니다.

~~~diff
diff --git a/app/api/post/[id]/route.js b/app/api/post/[id]/route.js
index 8a4a070..05ec45f 100644
--- a/app/api/post/[id]/route.js
+++ b/app/api/post/[id]/route.js
@@ -30,7 +30,11 @@ export async function PUT(request, { params }) {
       return apiError("Title and content are required", 400);
     }

-    const result = await updatePost(id, { title, content });
+    const result = await updatePost(id, {
+      title,
+      content,
+      category: postData.category,
+    });

     if (!result || result.matchedCount === 0) {
       return apiError("Post not found", 404);
diff --git a/app/api/post/route.js b/app/api/post/route.js
index 2c15606..2d8ac9d 100644
--- a/app/api/post/route.js
+++ b/app/api/post/route.js
@@ -8,7 +8,8 @@ export async function GET(request) {
     const page = searchParams.get("page") || "1";
     const limit = searchParams.get("limit") || "5";
     const sort = searchParams.get("sort") || "created-desc";
-    const posts = await listPosts({ keyword, page, limit, sort });
+    const category = searchParams.get("category") || "all";
+    const posts = await listPosts({ keyword, page, limit, sort, category });

     return apiSuccess(posts, "Posts fetched successfully");
   } catch (error) {
@@ -33,6 +34,7 @@ export async function POST(request) {
       title,
       content,
       image: postData.image,
+      category: postData.category,
     });

     return apiSuccess(
~~~

### 설명과 확인

- 작성/수정 요청 body의 category가 문자열이면 사용하고 아니면 `general`을 사용합니다.
- 목록 API는 `category=all` 또는 빈 값이면 전체를 보여줍니다.

## 작업 3. 홈 목록에 카테고리 필터와 표시 추가

홈 화면에서 카테고리 select를 추가하고 query string에 포함합니다. 게시글 카드에도 현재 글의 카테고리를 표시합니다.

### 수정할 파일

- 수정: [app/page.js](../../app/page.js)

### 코드 변경

아래 diff에서 `+`로 시작하는 줄을 추가하고, `-`로 시작하는 줄을 제거합니다. 새 파일은 diff에 보이는 전체 내용을 새로 입력합니다.

~~~diff
diff --git a/app/page.js b/app/page.js
index 07af3cf..75cfa57 100644
--- a/app/page.js
+++ b/app/page.js
@@ -6,6 +6,13 @@ import styles from "./page.module.css";

 const PAGE_SIZE = 5;
 const DEFAULT_SORT = "created-desc";
+const CATEGORY_FILTERS = [
+  { value: "all", label: "All categories" },
+  { value: "general", label: "General" },
+  { value: "notice", label: "Notice" },
+  { value: "daily", label: "Daily" },
+  { value: "tech", label: "Tech" },
+];

 function formatDate(dateValue) {
   if (!dateValue) {
@@ -37,7 +44,7 @@ async function fetchPosts(url) {
   return result.data;
 }

-function buildPostsUrl({ keyword, page, sort }) {
+function buildPostsUrl({ keyword, page, sort, category }) {
   const params = new URLSearchParams({
     page: String(page),
     limit: String(PAGE_SIZE),
@@ -48,6 +55,10 @@ function buildPostsUrl({ keyword, page, sort }) {
     params.set("keyword", keyword);
   }

+  if (category && category !== "all") {
+    params.set("category", category);
+  }
+
   return `/api/post?${params.toString()}`;
 }

@@ -61,18 +72,25 @@ export default function Home() {
   const [searchMessage, setSearchMessage] = useState("");
   const [serverKeyword, setServerKeyword] = useState("");
   const [sortOrder, setSortOrder] = useState(DEFAULT_SORT);
+  const [categoryFilter, setCategoryFilter] = useState("all");

   async function loadPosts({
     page = 1,
     searchKeyword = serverKeyword,
     sortValue = sortOrder,
+    categoryValue = categoryFilter,
   } = {}) {
     setError("");
     setIsLoading(true);

     try {
       const data = await fetchPosts(
-        buildPostsUrl({ keyword: searchKeyword, page, sort: sortValue }),
+        buildPostsUrl({
+          keyword: searchKeyword,
+          page,
+          sort: sortValue,
+          category: categoryValue,
+        }),
       );
       setAllPosts(data.posts);
       setPosts(data.posts);
@@ -88,7 +106,12 @@ export default function Home() {
     async function loadInitialPosts() {
       try {
         const data = await fetchPosts(
-          buildPostsUrl({ keyword: "", page: 1, sort: DEFAULT_SORT }),
+          buildPostsUrl({
+            keyword: "",
+            page: 1,
+            sort: DEFAULT_SORT,
+            category: "all",
+          }),
         );
         setAllPosts(data.posts);
         setPosts(data.posts);
@@ -141,8 +164,9 @@ export default function Home() {
   async function handleShowAll() {
     setKeyword("");
     setServerKeyword("");
+    setCategoryFilter("all");
     setSearchMessage("");
-    await loadPosts({ page: 1, searchKeyword: "" });
+    await loadPosts({ page: 1, searchKeyword: "", categoryValue: "all" });
   }

   async function handlePageChange(nextPage) {
@@ -161,6 +185,22 @@ export default function Home() {
     });
   }

+  async function handleCategoryChange(event) {
+    const nextCategory = event.target.value;
+
+    setCategoryFilter(nextCategory);
+    setSearchMessage(
+      nextCategory === "all"
+        ? "Showing all categories."
+        : `Showing ${nextCategory} posts.`,
+    );
+    await loadPosts({
+      page: 1,
+      searchKeyword: serverKeyword,
+      categoryValue: nextCategory,
+    });
+  }
+
   return (
     <main>
       <form onSubmit={(event) => event.preventDefault()}>
@@ -173,6 +213,20 @@ export default function Home() {
           disabled={isLoading}
         />

+        <label htmlFor="categoryFilter">Category:</label>
+        <select
+          id="categoryFilter"
+          value={categoryFilter}
+          onChange={handleCategoryChange}
+          disabled={isLoading}
+        >
+          {CATEGORY_FILTERS.map((option) => (
+            <option key={option.value} value={option.value}>
+              {option.label}
+            </option>
+          ))}
+        </select>
+
         <label htmlFor="sortOrder">Sort posts:</label>
         <select
           id="sortOrder"
@@ -207,6 +261,7 @@ export default function Home() {
             {posts.map((post) => (
               <article key={post._id} className={styles.article}>
                 <Link href={`/detail/${post._id}`}>{post.title}</Link>
+                <p>Category: {post.category || "general"}</p>
                 <p>Created: {formatDate(post.createdAt)}</p>
                 {post.updatedAt && (
                   <p>Updated: {formatDate(post.updatedAt)}</p>
~~~

### 설명과 확인

- 카테고리 변경 시 검색/정렬 변경과 마찬가지로 1페이지로 돌아갑니다.
- 필터 조건이 늘어나도 API 요청 구성은 `URLSearchParams`로 관리합니다.

## 작업 4. 작성/수정/상세 화면에 category 반영

사용자가 글을 만들거나 수정할 때 category를 선택하고, 상세 화면에서 저장된 category를 확인할 수 있게 합니다.

### 수정할 파일

- 수정: [app/post/page.js](../../app/post/page.js)
- 수정: [app/post/[id]/page.js](../../app/post/%5Bid%5D/page.js)
- 수정: [app/detail/[id]/page.js](../../app/detail/%5Bid%5D/page.js)

### 코드 변경

아래 diff에서 `+`로 시작하는 줄을 추가하고, `-`로 시작하는 줄을 제거합니다. 새 파일은 diff에 보이는 전체 내용을 새로 입력합니다.

~~~diff
diff --git a/app/detail/[id]/page.js b/app/detail/[id]/page.js
index 3e7ae22..9018c18 100644
--- a/app/detail/[id]/page.js
+++ b/app/detail/[id]/page.js
@@ -24,6 +24,7 @@ export default async function BlogDetail({ params }) {
     <main className={styles.container}>
       <article>
         <h1>{post.title}</h1>
+        <p>Category: {post.category || "general"}</p>
         <p>Created: {formatDate(post.createdAt)}</p>
         {post.updatedAt && <p>Updated: {formatDate(post.updatedAt)}</p>}
         <pre className={styles.content}>{post.content}</pre>
diff --git a/app/post/[id]/page.js b/app/post/[id]/page.js
index ca96d6a..9fa480c 100644
--- a/app/post/[id]/page.js
+++ b/app/post/[id]/page.js
@@ -4,9 +4,17 @@ import { useEffect, useState } from "react";
 import { useParams, useRouter } from "next/navigation";
 import styles from "../page.module.css";

+const CATEGORY_OPTIONS = [
+  { value: "general", label: "General" },
+  { value: "notice", label: "Notice" },
+  { value: "daily", label: "Daily" },
+  { value: "tech", label: "Tech" },
+];
+
 export default function EditPost() {
   const [title, setTitle] = useState("");
   const [content, setContent] = useState("");
+  const [category, setCategory] = useState("general");
   const [error, setError] = useState("");
   const [isSubmitting, setIsSubmitting] = useState(false);
   const { id } = useParams();
@@ -25,6 +33,7 @@ export default function EditPost() {
         const post = result.data;
         setTitle(post.title);
         setContent(post.content);
+        setCategory(post.category || "general");
       } catch (err) {
         setError(err instanceof Error ? err.message : "Failed to fetch post");
       }
@@ -46,7 +55,7 @@ export default function EditPost() {
         headers: {
           "Content-Type": "application/json",
         },
-        body: JSON.stringify({ title, content }),
+        body: JSON.stringify({ title, content, category }),
       });
       const result = await response.json();

@@ -87,6 +96,20 @@ export default function EditPost() {
           required
         />

+        <label htmlFor="category">Category:</label>
+        <select
+          id="category"
+          value={category}
+          onChange={(event) => setCategory(event.target.value)}
+          disabled={isSubmitting}
+        >
+          {CATEGORY_OPTIONS.map((option) => (
+            <option key={option.value} value={option.value}>
+              {option.label}
+            </option>
+          ))}
+        </select>
+
         <button type="submit" disabled={isSubmitting}>
           {isSubmitting ? "Updating..." : "Update Post"}
         </button>
diff --git a/app/post/page.js b/app/post/page.js
index b6d7668..952f1b7 100644
--- a/app/post/page.js
+++ b/app/post/page.js
@@ -4,9 +4,17 @@ import { useState } from "react";
 import { useRouter } from "next/navigation";
 import styles from "./page.module.css";

+const CATEGORY_OPTIONS = [
+  { value: "general", label: "General" },
+  { value: "notice", label: "Notice" },
+  { value: "daily", label: "Daily" },
+  { value: "tech", label: "Tech" },
+];
+
 export default function NewPost() {
   const [title, setTitle] = useState("");
   const [content, setContent] = useState("");
+  const [category, setCategory] = useState("general");
   const [error, setError] = useState("");
   const [isSubmitting, setIsSubmitting] = useState(false);
   const router = useRouter();
@@ -25,6 +33,7 @@ export default function NewPost() {
         body: JSON.stringify({
           title,
           content,
+          category,
           image: "https://picsum.photos/100",
         }),
       });
@@ -67,6 +76,20 @@ export default function NewPost() {
           required
         />

+        <label htmlFor="category">Category:</label>
+        <select
+          id="category"
+          value={category}
+          onChange={(event) => setCategory(event.target.value)}
+          disabled={isSubmitting}
+        >
+          {CATEGORY_OPTIONS.map((option) => (
+            <option key={option.value} value={option.value}>
+              {option.label}
+            </option>
+          ))}
+        </select>
+
         <button type="submit" disabled={isSubmitting}>
           {isSubmitting ? "Creating..." : "Create Post"}
         </button>
~~~

### 설명과 확인

- 작성 화면은 category 초기값을 `general`로 둡니다.
- 수정 화면은 기존 게시글의 category를 불러와 select 값으로 사용합니다.
- 상세 화면은 제목 주변에 category를 표시합니다.

## 실행 확인

기본 정적 검사는 다음 명령으로 확인합니다.

> Windows 11에서는 [환경 준비](../windows-11.md)를 먼저 확인합니다. `git`, `node`, `npm` 명령은 PowerShell에서도 같습니다. `npm.ps1` 오류가 나면 `npm.cmd`를 사용합니다.

```bash
npm run lint
npm run build
```

브라우저 확인이 필요하면 개발 서버를 켠 뒤 해당 화면을 확인합니다.

```bash
npm run dev
```

체크할 내용은 다음과 같습니다.

- 작성 화면에서 category를 선택해 저장한다.
- 홈에서 category 필터를 바꾸면 목록이 바뀐다.
- 상세 화면에 category가 보인다.

## 마무리 확인

- 이 문서의 각 작업 단위에서 설명을 먼저 읽고, 바로 아래 diff를 기준으로 파일을 수정합니다.
- 새 파일은 diff에 나온 전체 내용을 입력하고, 기존 파일은 diff의 `+`/`-` 줄만 비교하면서 수정합니다.
- 링크된 프로젝트 내부 파일을 열어 현재 단계의 완성본과 직접 비교할 수 있습니다.
