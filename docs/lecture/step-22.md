# Step 22. 작성, 수정, Contact form UI 정리

## 이번 스텝 주요 기능 Overview

게시글 작성/수정 form과 Contact form에 같은 Tailwind 입력/버튼 패턴을 적용합니다.

- 게시글 작성/수정 form에 같은 Tailwind 입력 패턴을 적용합니다.
- Contact mockup form도 같은 카드/label/input/button 구조로 정리합니다.
- 기존 post CSS module을 제거하고 오류 메시지를 alert 형태로 표시합니다.

## 작업 1. 게시글 작성 form Tailwind UI 적용

작성 화면에 제목 영역과 form 카드 UI를 적용합니다. 반복되는 label/input/button class는 상수로 분리해 같은 패턴을 재사용합니다.

### 직접 수정할 파일

- 수정: [app/post/page.js](../../app/post/page.js)
- 삭제: `app/post/page.module.css`

### 먼저 실행할 명령

```bash
rm app/post/page.module.css
```

### 이전 단계와 달라지는 코드

아래 diff에서 `+`로 시작하는 줄을 추가하고, `-`로 시작하는 줄을 제거합니다. 새 파일은 diff에 보이는 전체 내용을 새로 입력합니다.

~~~diff
diff --git a/app/post/page.js b/app/post/page.js
index 952f1b7..9863577 100644
--- a/app/post/page.js
+++ b/app/post/page.js
@@ -2,7 +2,6 @@

 import { useState } from "react";
 import { useRouter } from "next/navigation";
-import styles from "./page.module.css";

 const CATEGORY_OPTIONS = [
   { value: "general", label: "General" },
@@ -10,6 +9,15 @@ const CATEGORY_OPTIONS = [
   { value: "daily", label: "Daily" },
   { value: "tech", label: "Tech" },
 ];
+const fieldClassName = "grid gap-1.5";
+const labelClassName = "text-sm font-medium text-zinc-700";
+const inputClassName =
+  "rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm outline-none focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200 disabled:bg-zinc-100";
+const textareaClassName = `${inputClassName} min-h-48 resize-y`;
+const primaryButtonClassName =
+  "rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-50";
+const errorClassName =
+  "rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700";

 export default function NewPost() {
   const [title, setTitle] = useState("");
@@ -53,44 +61,78 @@ export default function NewPost() {
   }

   return (
-    <main className={styles.container}>
-      <h1>Create New Post</h1>
-      {error && <p role="alert">{error}</p>}
-      <form onSubmit={handleSubmit}>
-        <label htmlFor="title">Title:</label>
-        <input
-          type="text"
-          id="title"
-          value={title}
-          onChange={(event) => setTitle(event.target.value)}
-          disabled={isSubmitting}
-          required
-        />
+    <main className="space-y-6">
+      <section className="space-y-2">
+        <p className="text-sm font-semibold uppercase text-zinc-500">Write</p>
+        <h1 className="text-3xl font-bold tracking-tight text-zinc-950">
+          Create New Post
+        </h1>
+        <p className="max-w-2xl text-sm leading-6 text-zinc-600">
+          제목, 본문, 카테고리를 입력해 새 게시글을 작성합니다.
+        </p>
+      </section>
+      {error && (
+        <p className={errorClassName} role="alert">
+          {error}
+        </p>
+      )}
+      <form
+        className="grid max-w-2xl gap-4 rounded-lg border border-zinc-200 bg-white p-5 shadow-sm"
+        onSubmit={handleSubmit}
+      >
+        <div className={fieldClassName}>
+          <label className={labelClassName} htmlFor="title">
+            Title
+          </label>
+          <input
+            className={inputClassName}
+            type="text"
+            id="title"
+            value={title}
+            onChange={(event) => setTitle(event.target.value)}
+            disabled={isSubmitting}
+            required
+          />
+        </div>

-        <label htmlFor="content">Content:</label>
-        <textarea
-          id="content"
-          value={content}
-          onChange={(event) => setContent(event.target.value)}
-          disabled={isSubmitting}
-          required
-        />
+        <div className={fieldClassName}>
+          <label className={labelClassName} htmlFor="content">
+            Content
+          </label>
+          <textarea
+            className={textareaClassName}
+            id="content"
+            value={content}
+            onChange={(event) => setContent(event.target.value)}
+            disabled={isSubmitting}
+            required
+          />
+        </div>

-        <label htmlFor="category">Category:</label>
-        <select
-          id="category"
-          value={category}
-          onChange={(event) => setCategory(event.target.value)}
+        <div className={fieldClassName}>
+          <label className={labelClassName} htmlFor="category">
+            Category
+          </label>
+          <select
+            className={inputClassName}
+            id="category"
+            value={category}
+            onChange={(event) => setCategory(event.target.value)}
+            disabled={isSubmitting}
+          >
+            {CATEGORY_OPTIONS.map((option) => (
+              <option key={option.value} value={option.value}>
+                {option.label}
+              </option>
+            ))}
+          </select>
+        </div>
+
+        <button
+          className={primaryButtonClassName}
+          type="submit"
           disabled={isSubmitting}
         >
-          {CATEGORY_OPTIONS.map((option) => (
-            <option key={option.value} value={option.value}>
-              {option.label}
-            </option>
-          ))}
-        </select>
-
-        <button type="submit" disabled={isSubmitting}>
           {isSubmitting ? "Creating..." : "Create Post"}
         </button>
       </form>
diff --git a/app/post/page.module.css b/app/post/page.module.css
deleted file mode 100644
index 8a6b6ea..0000000
--- a/app/post/page.module.css
+++ /dev/null
@@ -1,4 +0,0 @@
-.container {
-  display: grid;
-  gap: 1rem;
-}
~~~

### 설명/확인 포인트

- `fieldClassName`, `labelClassName`, `inputClassName` 같은 상수는 긴 class 문자열 반복을 줄입니다.
- 오류 메시지는 `role="alert"`를 유지하면서 빨간 alert 스타일을 적용합니다.

## 작업 2. 게시글 수정 form Tailwind UI 적용

수정 화면도 작성 화면과 같은 입력 패턴을 사용합니다. 로딩/오류/제출 중 상태가 스타일과 함께 일관되게 보여야 합니다.

### 직접 수정할 파일

- 수정: [app/post/[id]/page.js](../../app/post/%5Bid%5D/page.js)

### 이전 단계와 달라지는 코드

아래 diff에서 `+`로 시작하는 줄을 추가하고, `-`로 시작하는 줄을 제거합니다. 새 파일은 diff에 보이는 전체 내용을 새로 입력합니다.

~~~diff
diff --git a/app/post/[id]/page.js b/app/post/[id]/page.js
index 9fa480c..79589b4 100644
--- a/app/post/[id]/page.js
+++ b/app/post/[id]/page.js
@@ -2,7 +2,6 @@

 import { useEffect, useState } from "react";
 import { useParams, useRouter } from "next/navigation";
-import styles from "../page.module.css";

 const CATEGORY_OPTIONS = [
   { value: "general", label: "General" },
@@ -10,6 +9,15 @@ const CATEGORY_OPTIONS = [
   { value: "daily", label: "Daily" },
   { value: "tech", label: "Tech" },
 ];
+const fieldClassName = "grid gap-1.5";
+const labelClassName = "text-sm font-medium text-zinc-700";
+const inputClassName =
+  "rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm outline-none focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200 disabled:bg-zinc-100";
+const textareaClassName = `${inputClassName} min-h-48 resize-y`;
+const primaryButtonClassName =
+  "rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-50";
+const errorClassName =
+  "rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700";

 export default function EditPost() {
   const [title, setTitle] = useState("");
@@ -73,44 +81,78 @@ export default function EditPost() {
   }

   return (
-    <main className={styles.container}>
-      <h1>Edit Post</h1>
-      {error && <p role="alert">{error}</p>}
-      <form onSubmit={handleSubmit}>
-        <label htmlFor="title">Title:</label>
-        <input
-          type="text"
-          id="title"
-          value={title}
-          onChange={(event) => setTitle(event.target.value)}
-          disabled={isSubmitting}
-          required
-        />
+    <main className="space-y-6">
+      <section className="space-y-2">
+        <p className="text-sm font-semibold uppercase text-zinc-500">Edit</p>
+        <h1 className="text-3xl font-bold tracking-tight text-zinc-950">
+          Edit Post
+        </h1>
+        <p className="max-w-2xl text-sm leading-6 text-zinc-600">
+          기존 게시글을 불러온 뒤 제목, 본문, 카테고리를 수정합니다.
+        </p>
+      </section>
+      {error && (
+        <p className={errorClassName} role="alert">
+          {error}
+        </p>
+      )}
+      <form
+        className="grid max-w-2xl gap-4 rounded-lg border border-zinc-200 bg-white p-5 shadow-sm"
+        onSubmit={handleSubmit}
+      >
+        <div className={fieldClassName}>
+          <label className={labelClassName} htmlFor="title">
+            Title
+          </label>
+          <input
+            className={inputClassName}
+            type="text"
+            id="title"
+            value={title}
+            onChange={(event) => setTitle(event.target.value)}
+            disabled={isSubmitting}
+            required
+          />
+        </div>

-        <label htmlFor="content">Content:</label>
-        <textarea
-          id="content"
-          value={content}
-          onChange={(event) => setContent(event.target.value)}
-          disabled={isSubmitting}
-          required
-        />
+        <div className={fieldClassName}>
+          <label className={labelClassName} htmlFor="content">
+            Content
+          </label>
+          <textarea
+            className={textareaClassName}
+            id="content"
+            value={content}
+            onChange={(event) => setContent(event.target.value)}
+            disabled={isSubmitting}
+            required
+          />
+        </div>

-        <label htmlFor="category">Category:</label>
-        <select
-          id="category"
-          value={category}
-          onChange={(event) => setCategory(event.target.value)}
+        <div className={fieldClassName}>
+          <label className={labelClassName} htmlFor="category">
+            Category
+          </label>
+          <select
+            className={inputClassName}
+            id="category"
+            value={category}
+            onChange={(event) => setCategory(event.target.value)}
+            disabled={isSubmitting}
+          >
+            {CATEGORY_OPTIONS.map((option) => (
+              <option key={option.value} value={option.value}>
+                {option.label}
+              </option>
+            ))}
+          </select>
+        </div>
+
+        <button
+          className={primaryButtonClassName}
+          type="submit"
           disabled={isSubmitting}
         >
-          {CATEGORY_OPTIONS.map((option) => (
-            <option key={option.value} value={option.value}>
-              {option.label}
-            </option>
-          ))}
-        </select>
-
-        <button type="submit" disabled={isSubmitting}>
           {isSubmitting ? "Updating..." : "Update Post"}
         </button>
       </form>
~~~

### 설명/확인 포인트

- 작성 화면과 수정 화면의 class 상수 이름과 구조를 맞추면 비교 학습이 쉽습니다.
- disabled 상태는 입력칸과 버튼 모두에서 시각적으로 드러나야 합니다.

## 작업 3. Contact form Tailwind UI 적용

Contact form도 실제 기능은 mockup이지만 사용자가 입력하는 화면이므로 같은 UI 패턴을 적용합니다. 페이지 자체에는 제목/설명을 두고 form은 카드로 묶습니다.

### 직접 수정할 파일

- 수정: [app/contact/page.js](../../app/contact/page.js)
- 수정: [app/contact/ContactForm.js](../../app/contact/ContactForm.js)

### 이전 단계와 달라지는 코드

아래 diff에서 `+`로 시작하는 줄을 추가하고, `-`로 시작하는 줄을 제거합니다. 새 파일은 diff에 보이는 전체 내용을 새로 입력합니다.

~~~diff
diff --git a/app/contact/ContactForm.js b/app/contact/ContactForm.js
index 8bf074b..fa9a472 100644
--- a/app/contact/ContactForm.js
+++ b/app/contact/ContactForm.js
@@ -2,6 +2,14 @@

 import { useState } from "react";

+const fieldClassName = "grid gap-1.5";
+const labelClassName = "text-sm font-medium text-zinc-700";
+const inputClassName =
+  "rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm outline-none focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200";
+const textareaClassName = `${inputClassName} min-h-40 resize-y`;
+const primaryButtonClassName =
+  "rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700";
+
 export default function ContactForm() {
   const [name, setName] = useState("");
   const [email, setEmail] = useState("");
@@ -16,34 +24,54 @@ export default function ContactForm() {
   }

   return (
-    <form onSubmit={handleSubmit}>
-      <label htmlFor="name">Name:</label>
-      <input
-        type="text"
-        id="name"
-        value={name}
-        onChange={(event) => setName(event.target.value)}
-        required
-      />
-
-      <label htmlFor="email">Email:</label>
-      <input
-        type="email"
-        id="email"
-        value={email}
-        onChange={(event) => setEmail(event.target.value)}
-        required
-      />
-
-      <label htmlFor="message">Message:</label>
-      <textarea
-        id="message"
-        value={message}
-        onChange={(event) => setMessage(event.target.value)}
-        required
-      />
-
-      <button type="submit">Submit</button>
+    <form
+      className="grid max-w-2xl gap-4 rounded-lg border border-zinc-200 bg-white p-5 shadow-sm"
+      onSubmit={handleSubmit}
+    >
+      <div className={fieldClassName}>
+        <label className={labelClassName} htmlFor="name">
+          Name
+        </label>
+        <input
+          className={inputClassName}
+          type="text"
+          id="name"
+          value={name}
+          onChange={(event) => setName(event.target.value)}
+          required
+        />
+      </div>
+
+      <div className={fieldClassName}>
+        <label className={labelClassName} htmlFor="email">
+          Email
+        </label>
+        <input
+          className={inputClassName}
+          type="email"
+          id="email"
+          value={email}
+          onChange={(event) => setEmail(event.target.value)}
+          required
+        />
+      </div>
+
+      <div className={fieldClassName}>
+        <label className={labelClassName} htmlFor="message">
+          Message
+        </label>
+        <textarea
+          className={textareaClassName}
+          id="message"
+          value={message}
+          onChange={(event) => setMessage(event.target.value)}
+          required
+        />
+      </div>
+
+      <button className={primaryButtonClassName} type="submit">
+        Submit
+      </button>
     </form>
   );
 }
diff --git a/app/contact/page.js b/app/contact/page.js
index c14ed86..549c4e7 100644
--- a/app/contact/page.js
+++ b/app/contact/page.js
@@ -2,8 +2,18 @@ import ContactForm from "./ContactForm";

 export default function ContactPage() {
   return (
-    <main>
-      <h1>Contact Us</h1>
+    <main className="space-y-6">
+      <section className="space-y-2">
+        <p className="text-sm font-semibold uppercase text-zinc-500">
+          Contact
+        </p>
+        <h1 className="text-3xl font-bold tracking-tight text-zinc-950">
+          Contact Us
+        </h1>
+        <p className="max-w-2xl text-sm leading-6 text-zinc-600">
+          controlled input과 submit 이벤트를 연습하는 mockup form입니다.
+        </p>
+      </section>
       <ContactForm />
     </main>
   );
~~~

### 설명/확인 포인트

- ContactForm의 controlled input 흐름은 유지하고 class만 Tailwind 기준으로 바꿉니다.
- 성공 메시지는 녹색 alert 패턴으로 표시합니다.

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

- `/post`, `/post/[id]`, `/contact` form이 같은 입력 패턴으로 보인다.
- 오류 메시지가 alert 스타일로 보이고 `role="alert"`가 유지된다.

## 다음 단계로 넘어가기 전

- 이 문서의 각 작업 단위에서 설명을 먼저 읽고, 바로 아래 diff를 기준으로 파일을 수정합니다.
- 새 파일은 diff에 나온 전체 내용을 입력하고, 기존 파일은 diff의 `+`/`-` 줄만 비교하면서 수정합니다.
- 링크된 프로젝트 내부 파일을 열어 현재 단계의 완성본과 직접 비교할 수 있습니다.
