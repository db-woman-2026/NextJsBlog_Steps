# Step 21. 홈 목록과 상세 읽기 화면 UI 정리

이 문서는 `step-20`에서 시작해 `step-21`를 완성하는 실습 자료입니다.
원본 개요는 [docs/overview/step-21.md](../overview/step-21.md)에 보존되어 있습니다.
아래 파일 링크는 GitHub가 아니라 이 프로젝트 안의 현재 단계 파일을 여는 경로입니다.

## 이번 스텝 주요 기능 Overview

홈 목록, 상세 읽기 화면, About 페이지를 Tailwind utility class로 정리해 카드형 읽기 UI를 만듭니다.

- 홈 화면에 제목 영역, 필터 패널, 게시글 카드 UI를 적용합니다.
- 상세 화면을 article 카드 형태로 정리합니다.
- About 페이지를 텍스트와 이미지가 있는 반응형 레이아웃으로 바꾸고 기존 CSS module을 제거합니다.

## 시작 기준

이전 단계인 `step-20` 브랜치까지 완료된 상태에서 시작합니다.

```bash
git switch step-20
git switch -c practice-step-21
```

정답 브랜치는 확인용으로만 사용합니다.

```bash
git switch step-21
```

## 작업 1. 홈 목록을 카드형 Tailwind UI로 변경

step-20에서 공통 shell을 바꿨으므로, 이제 사용자가 가장 먼저 보는 홈 목록을 Tailwind class로 정리합니다. 검색/정렬/카테고리 controls는 하나의 패널 안에 묶습니다.

### 수정할 파일

- 수정: [app/page.js](../../app/page.js)
- 삭제: `app/page.module.css`

### 먼저 실행하거나 삭제할 명령

```bash
rm app/page.module.css
```

### 이전 단계와 달라지는 코드

아래 diff에서 `+`로 시작하는 줄을 추가하고, `-`로 시작하는 줄을 제거합니다. 새 파일은 diff에 보이는 전체 내용을 새로 입력합니다.

~~~diff
diff --git a/app/page.js b/app/page.js
index 75cfa57..9a83e5d 100644
--- a/app/page.js
+++ b/app/page.js
@@ -2,10 +2,13 @@

 import Link from "next/link";
 import { useEffect, useState } from "react";
-import styles from "./page.module.css";

 const PAGE_SIZE = 5;
 const DEFAULT_SORT = "created-desc";
+const inputClassName =
+  "rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm outline-none focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200 disabled:bg-zinc-100";
+const secondaryButtonClassName =
+  "rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-50";
 const CATEGORY_FILTERS = [
   { value: "all", label: "All categories" },
   { value: "general", label: "General" },
@@ -202,88 +205,179 @@ export default function Home() {
   }

   return (
-    <main>
-      <form onSubmit={(event) => event.preventDefault()}>
-        <label htmlFor="keyword">Search posts:</label>
-        <input
-          type="search"
-          id="keyword"
-          value={keyword}
-          onChange={(event) => setKeyword(event.target.value)}
-          disabled={isLoading}
-        />
-
-        <label htmlFor="categoryFilter">Category:</label>
-        <select
-          id="categoryFilter"
-          value={categoryFilter}
-          onChange={handleCategoryChange}
-          disabled={isLoading}
-        >
-          {CATEGORY_FILTERS.map((option) => (
-            <option key={option.value} value={option.value}>
-              {option.label}
-            </option>
-          ))}
-        </select>
-
-        <label htmlFor="sortOrder">Sort posts:</label>
-        <select
-          id="sortOrder"
-          value={sortOrder}
-          onChange={handleSortChange}
-          disabled={isLoading}
-        >
-          <option value="created-desc">Newest first</option>
-          <option value="created-asc">Oldest first</option>
-          <option value="title-asc">Title A-Z</option>
-          <option value="title-desc">Title Z-A</option>
-        </select>
-
-        <button type="button" onClick={handleClientFilter} disabled={isLoading}>
-          Client Filter
-        </button>
-        <button type="button" onClick={handleServerSearch} disabled={isLoading}>
-          Server Search
-        </button>
-        <button type="button" onClick={handleShowAll} disabled={isLoading}>
-          Show All
-        </button>
+    <main className="space-y-6">
+      <section className="space-y-2">
+        <p className="text-sm font-semibold uppercase text-zinc-500">
+          Next.js Blog
+        </p>
+        <h1 className="text-3xl font-bold tracking-tight text-zinc-950">
+          Blog Posts
+        </h1>
+        <p className="max-w-2xl text-sm leading-6 text-zinc-600">
+          MongoDB에 저장된 게시글을 검색, 정렬, 카테고리 필터와 함께
+          확인합니다.
+        </p>
+      </section>
+
+      <form
+        className="grid gap-4 rounded-lg border border-zinc-200 bg-white p-4 shadow-sm sm:grid-cols-2 lg:grid-cols-3"
+        onSubmit={(event) => event.preventDefault()}
+      >
+        <div className="grid gap-1.5">
+          <label
+            className="text-sm font-medium text-zinc-700"
+            htmlFor="keyword"
+          >
+            Search posts
+          </label>
+          <input
+            className={inputClassName}
+            type="search"
+            id="keyword"
+            value={keyword}
+            onChange={(event) => setKeyword(event.target.value)}
+            disabled={isLoading}
+          />
+        </div>
+
+        <div className="grid gap-1.5">
+          <label
+            className="text-sm font-medium text-zinc-700"
+            htmlFor="categoryFilter"
+          >
+            Category
+          </label>
+          <select
+            className={inputClassName}
+            id="categoryFilter"
+            value={categoryFilter}
+            onChange={handleCategoryChange}
+            disabled={isLoading}
+          >
+            {CATEGORY_FILTERS.map((option) => (
+              <option key={option.value} value={option.value}>
+                {option.label}
+              </option>
+            ))}
+          </select>
+        </div>
+
+        <div className="grid gap-1.5">
+          <label
+            className="text-sm font-medium text-zinc-700"
+            htmlFor="sortOrder"
+          >
+            Sort posts
+          </label>
+          <select
+            className={inputClassName}
+            id="sortOrder"
+            value={sortOrder}
+            onChange={handleSortChange}
+            disabled={isLoading}
+          >
+            <option value="created-desc">Newest first</option>
+            <option value="created-asc">Oldest first</option>
+            <option value="title-asc">Title A-Z</option>
+            <option value="title-desc">Title Z-A</option>
+          </select>
+        </div>
+
+        <div className="flex flex-wrap gap-2 sm:col-span-2 lg:col-span-3">
+          <button
+            className={secondaryButtonClassName}
+            type="button"
+            onClick={handleClientFilter}
+            disabled={isLoading}
+          >
+            Client Filter
+          </button>
+          <button
+            className={secondaryButtonClassName}
+            type="button"
+            onClick={handleServerSearch}
+            disabled={isLoading}
+          >
+            Server Search
+          </button>
+          <button
+            className={secondaryButtonClassName}
+            type="button"
+            onClick={handleShowAll}
+            disabled={isLoading}
+          >
+            Show All
+          </button>
+        </div>
       </form>

-      {searchMessage && <p>{searchMessage}</p>}
-      {isLoading && <p>Loading posts...</p>}
-      {error && <p role="alert">{error}</p>}
-      {!isLoading && !error && posts.length === 0 && <p>No posts found.</p>}
+      {searchMessage && (
+        <p className="rounded-md bg-zinc-100 px-3 py-2 text-sm text-zinc-600">
+          {searchMessage}
+        </p>
+      )}
+      {isLoading && <p className="text-sm text-zinc-600">Loading posts...</p>}
+      {error && (
+        <p
+          className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
+          role="alert"
+        >
+          {error}
+        </p>
+      )}
+      {!isLoading && !error && posts.length === 0 && (
+        <p className="rounded-md border border-dashed border-zinc-300 bg-white px-4 py-8 text-center text-sm text-zinc-500">
+          No posts found.
+        </p>
+      )}
       {!isLoading && !error && (
         <>
-          <section className={styles.articleList} aria-label="Blog posts">
+          <section className="grid gap-4" aria-label="Blog posts">
             {posts.map((post) => (
-              <article key={post._id} className={styles.article}>
-                <Link href={`/detail/${post._id}`}>{post.title}</Link>
-                <p>Category: {post.category || "general"}</p>
-                <p>Created: {formatDate(post.createdAt)}</p>
+              <article
+                key={post._id}
+                className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm transition hover:border-zinc-300"
+              >
+                <Link
+                  className="text-xl font-semibold text-zinc-950 hover:text-zinc-700"
+                  href={`/detail/${post._id}`}
+                >
+                  {post.title}
+                </Link>
+                <div className="mt-3 flex flex-wrap gap-2 text-xs text-zinc-500">
+                  <span className="rounded-full bg-zinc-100 px-2.5 py-1 font-medium text-zinc-700">
+                    {post.category || "general"}
+                  </span>
+                  <span>Created: {formatDate(post.createdAt)}</span>
+                </div>
                 {post.updatedAt && (
-                  <p>Updated: {formatDate(post.updatedAt)}</p>
+                  <p className="mt-2 text-xs text-zinc-500">
+                    Updated: {formatDate(post.updatedAt)}
+                  </p>
                 )}
               </article>
             ))}
           </section>

           {pagination && (
-            <nav aria-label="Pagination">
+            <nav
+              className="flex flex-wrap items-center gap-3 rounded-lg border border-zinc-200 bg-white p-4 text-sm text-zinc-600"
+              aria-label="Pagination"
+            >
               <button
+                className={secondaryButtonClassName}
                 type="button"
                 onClick={() => handlePageChange(pagination.page - 1)}
                 disabled={isLoading || !pagination.hasPreviousPage}
               >
                 Previous
               </button>
-              <span>
+              <span className="font-medium text-zinc-700">
                 Page {pagination.page} of {pagination.totalPages} (
                 {pagination.totalPosts} posts)
               </span>
               <button
+                className={secondaryButtonClassName}
                 type="button"
                 onClick={() => handlePageChange(pagination.page + 1)}
                 disabled={isLoading || !pagination.hasNextPage}
diff --git a/app/page.module.css b/app/page.module.css
deleted file mode 100644
index 4418093..0000000
--- a/app/page.module.css
+++ /dev/null
@@ -1,8 +0,0 @@
-.articleList {
-  display: grid;
-  gap: 1rem;
-}
-
-.article {
-  padding: 1rem 0;
-}
~~~

### 설명/확인 포인트

- CSS module import를 제거하고 JSX에 utility class를 직접 작성합니다.
- 필터 controls와 목록 카드는 서로 다른 영역으로 보여야 스캔하기 쉽습니다.

## 작업 2. 상세 읽기 화면을 article 카드로 정리

게시글 하나를 읽는 화면은 제목, 카테고리, 날짜, 본문, 액션 버튼이 한 덩어리로 보여야 합니다. 기존 CSS module을 제거하고 Tailwind class만 사용합니다.

### 수정할 파일

- 수정: [app/detail/[id]/page.js](../../app/detail/%5Bid%5D/page.js)
- 삭제: `app/detail/[id]/page.module.css`

### 먼저 실행하거나 삭제할 명령

```bash
rm app/detail/[id]/page.module.css
```

### 이전 단계와 달라지는 코드

아래 diff에서 `+`로 시작하는 줄을 추가하고, `-`로 시작하는 줄을 제거합니다. 새 파일은 diff에 보이는 전체 내용을 새로 입력합니다.

~~~diff
diff --git a/app/detail/[id]/page.js b/app/detail/[id]/page.js
index 9018c18..576ea79 100644
--- a/app/detail/[id]/page.js
+++ b/app/detail/[id]/page.js
@@ -2,7 +2,6 @@ import Link from "next/link";
 import { notFound } from "next/navigation";
 import { getPostById } from "@/lib/posts";
 import DeletePostButton from "./DeletePostButton";
-import styles from "./page.module.css";

 function formatDate(dateValue) {
   if (!dateValue) {
@@ -21,16 +20,33 @@ export default async function BlogDetail({ params }) {
   }

   return (
-    <main className={styles.container}>
-      <article>
-        <h1>{post.title}</h1>
-        <p>Category: {post.category || "general"}</p>
-        <p>Created: {formatDate(post.createdAt)}</p>
-        {post.updatedAt && <p>Updated: {formatDate(post.updatedAt)}</p>}
-        <pre className={styles.content}>{post.content}</pre>
+    <main className="space-y-6">
+      <article className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
+        <div className="space-y-3">
+          <span className="inline-flex rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium uppercase text-zinc-600">
+            {post.category || "general"}
+          </span>
+          <h1 className="text-3xl font-bold tracking-tight text-zinc-950">
+            {post.title}
+          </h1>
+          <div className="flex flex-wrap gap-3 text-sm text-zinc-500">
+            <span>Created: {formatDate(post.createdAt)}</span>
+            {post.updatedAt && <span>Updated: {formatDate(post.updatedAt)}</span>}
+          </div>
+        </div>
+        <pre className="mt-6 whitespace-pre-wrap rounded-md bg-zinc-50 p-4 text-sm leading-7 text-zinc-700">
+          {post.content}
+        </pre>
       </article>
-      <Link href={`/post/${id}`}>Edit</Link>
-      <DeletePostButton id={id} />
+      <div className="flex flex-wrap items-center gap-2">
+        <Link
+          className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700"
+          href={`/post/${id}`}
+        >
+          Edit
+        </Link>
+        <DeletePostButton id={id} />
+      </div>
     </main>
   );
 }
diff --git a/app/detail/[id]/page.module.css b/app/detail/[id]/page.module.css
deleted file mode 100644
index c52da0a..0000000
--- a/app/detail/[id]/page.module.css
+++ /dev/null
@@ -1,8 +0,0 @@
-.container {
-  display: grid;
-  gap: 1rem;
-}
-
-.content {
-  white-space: pre-wrap;
-}
~~~

### 설명/확인 포인트

- 본문은 기존처럼 `pre`를 유지하되 `whitespace-pre-wrap`으로 긴 줄을 처리합니다.
- Edit/Delete 액션은 본문 아래에서 같은 줄 그룹으로 정리합니다.

## 작업 3. About 페이지 반응형 레이아웃 적용

소개 페이지는 텍스트와 이미지가 함께 보이는 정적 페이지입니다. 모바일에서는 1열, 큰 화면에서는 2열로 보이도록 Tailwind grid를 적용합니다.

### 수정할 파일

- 수정: [app/about/page.js](../../app/about/page.js)

### 이전 단계와 달라지는 코드

아래 diff에서 `+`로 시작하는 줄을 추가하고, `-`로 시작하는 줄을 제거합니다. 새 파일은 diff에 보이는 전체 내용을 새로 입력합니다.

~~~diff
diff --git a/app/about/page.js b/app/about/page.js
index c6e3f14..c05557c 100644
--- a/app/about/page.js
+++ b/app/about/page.js
@@ -2,28 +2,38 @@ import Image from "next/image";

 export default function AboutPage() {
   return (
-    <main>
-      <h1>About Me</h1>
+    <main className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
+      <section className="space-y-4">
+        <p className="text-sm font-semibold uppercase text-zinc-500">About</p>
+        <h1 className="text-3xl font-bold tracking-tight text-zinc-950">
+          About Me
+        </h1>
+        <div className="space-y-4 text-sm leading-7 text-zinc-600">
+          <p>
+            Hello! My name is [Your Name]. I&apos;m a professional working in
+            [Your Industry] based in [Your Location].
+          </p>
+          <p>
+            Here&apos;s a photo of our office building where I spend most of my
+            working hours.
+          </p>
+          <p>
+            I am passionate about [Your Passion], and I enjoy [Your Hobbies].
+          </p>
+          <p>
+            If you wish to reach out, please contact me at [Your Contact
+            Information].
+          </p>
+        </div>
+      </section>
       <Image
+        className="rounded-lg border border-zinc-200 object-cover shadow-sm"
         src="https://picsum.photos/id/1047/600/500"
         alt="Office building"
         width={600}
         height={500}
         priority
       />
-      <p>
-        Hello! My name is [Your Name]. I&apos;m a professional working in [Your
-        Industry] based in [Your Location].
-      </p>
-      <p>
-        Here&apos;s a photo of our office building where I spend most of my
-        working hours.
-      </p>
-      <p>I am passionate about [Your Passion], and I enjoy [Your Hobbies].</p>
-      <p>
-        If you wish to reach out, please contact me at [Your Contact
-        Information].
-      </p>
     </main>
   );
 }
~~~

### 설명/확인 포인트

- 이미지는 `rounded-lg`와 border로 카드처럼 보이게 합니다.
- `lg:` 접두사는 큰 화면에서만 2열 레이아웃을 적용합니다.

## 작업 4. README 단계 목록 갱신

Tailwind UI 정리 단계가 추가됐으므로 README의 Branch Flow를 최신 상태로 맞춥니다.

### 수정할 파일

- 수정: [README.md](../../README.md)

### 이전 단계와 달라지는 코드

아래 diff에서 `+`로 시작하는 줄을 추가하고, `-`로 시작하는 줄을 제거합니다. 새 파일은 diff에 보이는 전체 내용을 새로 입력합니다.

~~~diff
diff --git a/README.md b/README.md
index f78803b..f5f5c43 100644
--- a/README.md
+++ b/README.md
@@ -29,6 +29,7 @@
 | `step-18` | Not Found와 Error UI 개선 |
 | `step-19` | 카테고리 |
 | `step-20` | `simpledotcss` 제거, Tailwind CSS v4 설치, 공통 layout/nav/footer 정리 |
+| `step-21` | 홈 목록, 상세 읽기 화면, About 페이지의 기본 카드 UI |

 전체 단계 개요는 `/docs/overview/index.md`에 있고, 실습형 강의 자료는 `/docs/lecture/index.md`와 `/docs/lecture/step-N.md`에 있습니다.

~~~

### 설명/확인 포인트

- 문서 변경은 강의자가 브랜치 흐름을 설명할 때 기준이 됩니다.

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

- 홈 목록이 카드 형태로 보인다.
- 상세 화면이 하나의 article 카드로 보인다.
- About 페이지가 모바일 1열, 큰 화면 2열로 보인다.

## 다음 단계로 넘어가기 전

- 이 문서의 각 작업 단위에서 설명을 먼저 읽고, 바로 아래 diff를 기준으로 파일을 수정합니다.
- 새 파일은 diff에 나온 전체 내용을 입력하고, 기존 파일은 diff의 `+`/`-` 줄만 비교하면서 수정합니다.
- 링크된 프로젝트 내부 파일을 열어 현재 단계의 완성본과 직접 비교할 수 있습니다.
