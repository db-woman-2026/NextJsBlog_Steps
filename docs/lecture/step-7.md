# Step 7. 게시글 수정 화면과 PUT 요청 연결하기

이 문서는 이전 단계 실습 결과에서 시작해 `step-7` 수준의 기능을 완성하는 실습 자료입니다.
원본 개요는 [docs/overview/step-7.md](../overview/step-7.md)에 보존되어 있습니다.
아래 파일 링크는 GitHub가 아니라 이 프로젝트 안의 현재 단계 파일을 여는 경로입니다.

## 이번 스텝 주요 기능 Overview

상세 화면에서 수정 화면으로 이동하고 기존 글을 불러와 PUT /api/post/[id]로 수정합니다.

- 상세 화면에 Edit 링크를 추가해 수정 화면으로 이동하게 합니다.
- `/post/[id]`에서 기존 게시글을 불러와 form 초기값으로 넣습니다.
- 수정 제출 시 `PUT /api/post/[id]`를 호출하고 성공 후 상세 화면으로 돌아갑니다.

## 시작 기준

이미 `step-6` 실습을 끝낸 코드에서 이어서 진행합니다.
단계별로 브랜치를 나눠 관리한다면 이전 실습 브랜치에서 새 브랜치를 만듭니다.

```bash
git switch practice-step-6
git switch -c practice-step-7
```

## 작업 1. 상세 화면에 수정 링크 추가

사용자가 상세 화면에서 바로 수정 화면으로 이동할 수 있도록 Edit 링크를 추가합니다. 링크 주소는 현재 게시글 id를 사용합니다.

### 직접 수정할 파일

- 수정: [app/detail/[id]/page.js](../../app/detail/%5Bid%5D/page.js)

### 이전 단계와 달라지는 코드

아래 diff에서 `+`로 시작하는 줄을 추가하고, `-`로 시작하는 줄을 제거합니다. 새 파일은 diff에 보이는 전체 내용을 새로 입력합니다.

~~~diff
diff --git a/app/detail/[id]/page.js b/app/detail/[id]/page.js
index e315fc7..b3e7f90 100644
--- a/app/detail/[id]/page.js
+++ b/app/detail/[id]/page.js
@@ -17,7 +17,7 @@ export default async function BlogDetail({ params }) {
         <h1>{post.title}</h1>
         <pre className={styles.content}>{post.content}</pre>
       </article>
-      <Link href="/">Back to list</Link>
+      <Link href={`/post/${id}`}>Edit</Link>
     </main>
   );
 }
~~~

### 설명/확인 포인트

- `String(post._id)`로 ObjectId를 URL 문자열로 변환합니다.
- 삭제 기능은 아직 없고 step-13에서 추가합니다.

## 작업 2. 게시글 수정 form 추가

수정 화면은 작성 화면과 비슷하지만, 처음 렌더링 시 기존 게시글을 API로 가져와 상태에 채운 뒤 PUT 요청으로 저장합니다.

### 직접 수정할 파일

- 생성: [app/post/[id]/page.js](../../app/post/%5Bid%5D/page.js)

### 이전 단계와 달라지는 코드

아래 diff에서 `+`로 시작하는 줄을 추가하고, `-`로 시작하는 줄을 제거합니다. 새 파일은 diff에 보이는 전체 내용을 새로 입력합니다.

~~~diff
diff --git a/app/post/[id]/page.js b/app/post/[id]/page.js
new file mode 100644
index 0000000..26ef794
--- /dev/null
+++ b/app/post/[id]/page.js
@@ -0,0 +1,88 @@
+"use client";
+
+import { useEffect, useState } from "react";
+import { useParams, useRouter } from "next/navigation";
+import styles from "../page.module.css";
+
+export default function EditPost() {
+  const [title, setTitle] = useState("");
+  const [content, setContent] = useState("");
+  const [error, setError] = useState("");
+  const { id } = useParams();
+  const router = useRouter();
+
+  useEffect(() => {
+    async function loadPost() {
+      try {
+        const response = await fetch(`/api/post/${id}`);
+        const result = await response.json();
+
+        if (!response.ok) {
+          throw new Error(result.message || "Failed to fetch post data");
+        }
+
+        const post = result.data;
+        setTitle(post.title);
+        setContent(post.content);
+      } catch (err) {
+        setError(err instanceof Error ? err.message : "Failed to fetch post");
+      }
+    }
+
+    if (id) {
+      loadPost();
+    }
+  }, [id]);
+
+  async function handleSubmit(event) {
+    event.preventDefault();
+    setError("");
+
+    try {
+      const response = await fetch(`/api/post/${id}`, {
+        method: "PUT",
+        headers: {
+          "Content-Type": "application/json",
+        },
+        body: JSON.stringify({ title, content }),
+      });
+      const result = await response.json();
+
+      if (!response.ok) {
+        throw new Error(result.message || "Failed to update post");
+      }
+
+      router.replace("/");
+      router.refresh();
+    } catch (err) {
+      setError(err instanceof Error ? err.message : "Failed to update post");
+    }
+  }
+
+  return (
+    <main className={styles.container}>
+      <h1>Edit Post</h1>
+      {error && <p role="alert">{error}</p>}
+      <form onSubmit={handleSubmit}>
+        <label htmlFor="title">Title:</label>
+        <input
+          type="text"
+          id="title"
+          value={title}
+          onChange={(event) => setTitle(event.target.value)}
+          required
+        />
+
+        <label htmlFor="content">Content:</label>
+        <textarea
+          id="content"
+          value={content}
+          onChange={(event) => setContent(event.target.value)}
+          required
+        />
+
+        <button type="submit">Update Post</button>
+      </form>
+    </main>
+  );
+}
~~~

### 설명/확인 포인트

- `useEffect`에서 id가 준비되면 기존 게시글을 fetch합니다.
- 수정 성공 후에는 `/detail/${id}`로 이동합니다.
- 로딩 중에는 간단한 Loading 문구를 보여줍니다.

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

- 상세 화면에서 Edit 링크가 보인다.
- 수정 후 상세 화면으로 돌아오고 제목/본문이 바뀐다.

## 다음 단계로 넘어가기 전

- 이 문서의 각 작업 단위에서 설명을 먼저 읽고, 바로 아래 diff를 기준으로 파일을 수정합니다.
- 새 파일은 diff에 나온 전체 내용을 입력하고, 기존 파일은 diff의 `+`/`-` 줄만 비교하면서 수정합니다.
- 링크된 프로젝트 내부 파일을 열어 현재 단계의 완성본과 직접 비교할 수 있습니다.
