# Step 5. 홈 게시글 목록과 상세 읽기 화면 연결하기

## 이번 단계에서 할 일

홈 목록에서 게시글을 불러오고 제목 클릭으로 상세 화면까지 이동하는 읽기 흐름을 완성합니다.

- 홈 화면에서 MongoDB 게시글 목록을 직접 조회해 보여줍니다.
- 게시글 제목 링크를 `/detail/[id]` 상세 화면으로 연결합니다.
- 상세 화면에서 id로 게시글을 가져오고 없으면 간단한 안내를 보여줍니다.

## 작업 1. 홈 화면을 게시글 목록으로 변경

기존 소개용 홈 화면을 실제 게시글 목록 화면으로 바꿉니다. `app/page.js`를 클라이언트 컴포넌트로 바꾸고, `useEffect` 안에서 `/api/post`를 fetch해 MongoDB 게시글 목록을 화면에 표시합니다.

### 수정할 파일

- 수정: [app/page.js](../../app/page.js)
- 생성: [app/page.module.css](../../app/page.module.css)

### 코드 변경

아래 diff에서 `+`로 시작하는 줄을 추가하고, `-`로 시작하는 줄을 제거합니다. 새 파일은 diff에 보이는 전체 내용을 새로 입력합니다.

~~~diff
diff --git a/app/page.js b/app/page.js
index 63adb50..21584c9 100644
--- a/app/page.js
+++ b/app/page.js
@@ -1,20 +1,49 @@
+"use client";
+
 import Link from "next/link";
+import { useEffect, useState } from "react";
+import styles from "./page.module.css";

 export default function Home() {
+  const [posts, setPosts] = useState([]);
+  const [error, setError] = useState("");
+  const [isLoading, setIsLoading] = useState(true);
+
+  useEffect(() => {
+    async function loadPosts() {
+      try {
+        const response = await fetch("/api/post", { cache: "no-store" });
+        const result = await response.json();
+
+        if (!response.ok) {
+          throw new Error(result.message || "Failed to fetch posts");
+        }
+
+        setPosts(result.data);
+      } catch (err) {
+        setError(err instanceof Error ? err.message : "Failed to fetch posts");
+      } finally {
+        setIsLoading(false);
+      }
+    }
+
+    loadPosts();
+  }, []);
+
   return (
     <main>
-      <h1>Next.js Blog</h1>
-      <p>
-        This project will become a small blog through beginner-friendly
-        practice steps.
-      </p>
-      <p>
-        In this first step, focus on moving between pages with the navigation
-        menu.
-      </p>
-      <p>
-        <Link href="/post">Create a post page shell</Link>
-      </p>
+      {isLoading && <p>Loading posts...</p>}
+      {error && <p role="alert">{error}</p>}
+      {!isLoading && !error && posts.length === 0 && <p>No posts yet.</p>}
+      {!isLoading && !error && (
+        <section className={styles.articleList} aria-label="Blog posts">
+          {posts.map((post) => (
+            <article key={post._id} className={styles.article}>
+              <Link href={`/detail/${post._id}`}>{post.title}</Link>
+            </article>
+          ))}
+        </section>
+      )}
     </main>
   );
 }
diff --git a/app/page.module.css b/app/page.module.css
new file mode 100644
index 0000000..4418093
--- /dev/null
+++ b/app/page.module.css
@@ -0,0 +1,8 @@
+.articleList {
+  display: grid;
+  gap: 1rem;
+}
+
+.article {
+  padding: 1rem 0;
+}
~~~

### 설명과 확인

- 목록 제목 링크는 MongoDB `_id`를 문자열로 변환해 `/detail/${post._id}`로 보냅니다.
- CSS module은 이 단계에서 목록 카드의 최소 간격만 담당합니다.

## 작업 2. 게시글 상세 화면 추가

`app/detail/[id]/page.js`는 URL의 id를 받아 게시글 하나를 조회합니다. 목록에서 제목을 클릭하면 이 화면으로 이동합니다.

### 수정할 파일

- 생성: [app/detail/[id]/page.js](../../app/detail/%5Bid%5D/page.js)
- 생성: [app/detail/[id]/page.module.css](../../app/detail/%5Bid%5D/page.module.css)

### 코드 변경

아래 diff에서 `+`로 시작하는 줄을 추가하고, `-`로 시작하는 줄을 제거합니다. 새 파일은 diff에 보이는 전체 내용을 새로 입력합니다.

~~~diff
diff --git a/app/detail/[id]/page.js b/app/detail/[id]/page.js
new file mode 100644
index 0000000..e315fc7
--- /dev/null
+++ b/app/detail/[id]/page.js
@@ -0,0 +1,23 @@
+import Link from "next/link";
+import { notFound } from "next/navigation";
+import { getPostById } from "@/lib/posts";
+import styles from "./page.module.css";
+
+export default async function BlogDetail({ params }) {
+  const { id } = await params;
+  const post = await getPostById(id);
+
+  if (!post) {
+    notFound();
+  }
+
+  return (
+    <main className={styles.container}>
+      <article>
+        <h1>{post.title}</h1>
+        <pre className={styles.content}>{post.content}</pre>
+      </article>
+      <Link href="/">Back to list</Link>
+    </main>
+  );
+}
diff --git a/app/detail/[id]/page.module.css b/app/detail/[id]/page.module.css
new file mode 100644
index 0000000..c52da0a
--- /dev/null
+++ b/app/detail/[id]/page.module.css
@@ -0,0 +1,8 @@
+.container {
+  display: grid;
+  gap: 1rem;
+}
+
+.content {
+  white-space: pre-wrap;
+}
~~~

### 설명과 확인

- 이 단계의 없는 게시글 처리는 `notFound()`로 Next.js 기본 Not Found 화면을 보여줍니다. 정식 Not Found UI는 step-18에서 추가합니다.
- 본문은 줄바꿈을 보존하기 위해 `pre` 태그를 사용합니다.

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

- `/`에서 샘플 게시글 목록이 보인다.
- 게시글 제목을 클릭하면 `/detail/[id]` 화면으로 이동한다.

## 마무리 확인

- 이 문서의 각 작업 단위에서 설명을 먼저 읽고, 바로 아래 diff를 기준으로 파일을 수정합니다.
- 새 파일은 diff에 나온 전체 내용을 입력하고, 기존 파일은 diff의 `+`/`-` 줄만 비교하면서 수정합니다.
- 링크된 프로젝트 내부 파일을 열어 현재 단계의 완성본과 직접 비교할 수 있습니다.
