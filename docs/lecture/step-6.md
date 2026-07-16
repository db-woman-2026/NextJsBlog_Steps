# Step 6. 새 게시글 작성 form 만들기

## 이번 단계에서 할 일

새 게시글 작성 form을 만들고 POST /api/post 요청으로 MongoDB에 글을 저장합니다.

- `/post` 페이지를 단순 껍데기에서 실제 작성 form으로 바꿉니다.
- 클라이언트 상태로 title/content/error를 관리하고 `POST /api/post`로 전송합니다.
- 작성 성공 후 홈 화면으로 이동해 새 글이 목록에 반영되는 흐름을 만듭니다.

## 작업 1. 작성 form 클라이언트 컴포넌트로 전환

입력값 상태와 submit 이벤트가 필요하므로 `app/post/page.js` 맨 위에 `"use client";`를 추가합니다. form 제출 시 기본 새로고침을 막고 API로 JSON을 보냅니다.

### 수정할 파일

- 수정: [app/post/page.js](../../app/post/page.js)

### 코드 변경

아래 diff에서 `+`로 시작하는 줄을 추가하고, `-`로 시작하는 줄을 제거합니다. 새 파일은 diff에 보이는 전체 내용을 새로 입력합니다.

~~~diff
diff --git a/app/post/page.js b/app/post/page.js
index 99c31e0..54ca12e 100644
--- a/app/post/page.js
+++ b/app/post/page.js
@@ -1,8 +1,68 @@
-export default function NewPostPage() {
+"use client";
+
+import { useState } from "react";
+import { useRouter } from "next/navigation";
+import styles from "./page.module.css";
+
+export default function NewPost() {
+  const [title, setTitle] = useState("");
+  const [content, setContent] = useState("");
+  const [error, setError] = useState("");
+  const router = useRouter();
+
+  async function handleSubmit(event) {
+    event.preventDefault();
+    setError("");
+
+    try {
+      const response = await fetch("/api/post", {
+        method: "POST",
+        headers: {
+          "Content-Type": "application/json",
+        },
+        body: JSON.stringify({
+          title,
+          content,
+          image: "https://picsum.photos/100",
+        }),
+      });
+      const result = await response.json();
+
+      if (!response.ok) {
+        throw new Error(result.message || "Failed to create post");
+      }
+
+      router.push("/");
+      router.refresh();
+    } catch (err) {
+      setError(err instanceof Error ? err.message : "Failed to create post");
+    }
+  }
+
   return (
-    <main>
+    <main className={styles.container}>
       <h1>Create New Post</h1>
-      <p>The post form will be added after the data and API layers are ready.</p>
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
+        <button type="submit">Create Post</button>
+      </form>
     </main>
   );
 }
~~~

### 설명과 확인

- `useRouter`의 `router.push("/")`로 작성 성공 후 홈으로 이동합니다.
- API 오류가 나면 응답의 `message`를 error 상태에 넣어 화면에 표시합니다.

## 작업 2. form 기본 스타일 보강

작성 화면이 너무 좁거나 textarea가 낮아지지 않도록 전역 CSS와 CSS module에 최소 스타일을 추가합니다.

### 수정할 파일

- 수정: [app/globals.css](../../app/globals.css)
- 생성: [app/post/page.module.css](../../app/post/page.module.css)

### 코드 변경

아래 diff에서 `+`로 시작하는 줄을 추가하고, `-`로 시작하는 줄을 제거합니다. 새 파일은 diff에 보이는 전체 내용을 새로 입력합니다.

~~~diff
diff --git a/app/globals.css b/app/globals.css
index a6f7b7a..9582211 100644
--- a/app/globals.css
+++ b/app/globals.css
@@ -22,3 +22,11 @@ header nav a,
 header nav a:visited {
   margin-bottom: 0;
 }
+
+form {
+  max-width: 42rem;
+}
+
+textarea {
+  min-height: 12rem;
+}
diff --git a/app/post/page.module.css b/app/post/page.module.css
new file mode 100644
index 0000000..8a6b6ea
--- /dev/null
+++ b/app/post/page.module.css
@@ -0,0 +1,4 @@
+.container {
+  display: grid;
+  gap: 1rem;
+}
~~~

### 설명과 확인

- 이 시점의 스타일은 simpledotcss 위에 최소한만 얹습니다.
- Tailwind 전환은 step-20 이후에 진행합니다.

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

- `/post`에서 제목과 본문을 입력해 제출한다.
- 성공 후 홈으로 이동하고 새 게시글이 목록에 보인다.

## 마무리 확인

- 이 문서의 각 작업 단위에서 설명을 먼저 읽고, 바로 아래 diff를 기준으로 파일을 수정합니다.
- 새 파일은 diff에 나온 전체 내용을 입력하고, 기존 파일은 diff의 `+`/`-` 줄만 비교하면서 수정합니다.
- 링크된 프로젝트 내부 파일을 열어 현재 단계의 완성본과 직접 비교할 수 있습니다.
