# Step 22. 작성, 수정, Contact form UI 정리

## 변경 내용

게시글 작성/수정 form과 Contact form에 같은 Tailwind 입력/버튼 패턴을 적용합니다.

- 게시글 작성/수정 form에 같은 Tailwind 입력 패턴을 적용합니다.
- Contact mockup form도 같은 카드/label/input/button 구조로 정리합니다.
- 기존 post CSS module을 제거하고 오류 메시지를 alert 형태로 표시합니다.

## 시작 전 확인

개인 실습 저장소의 `main`에서 직전 단계까지 마친 상태로 시작합니다. 코드 블록은 복사해 붙이지 않고 직접 입력합니다.

수정 전에 `git status --short`의 출력이 없는지 확인합니다. 변경이 남아 있다면 원인을 확인하고 시작 상태를 정리합니다.

## 작업 1. 게시글 작성 form Tailwind UI 적용

작성 화면에 제목 영역과 form 카드 UI를 적용합니다. 반복되는 label/input/button class는 상수로 분리해 같은 패턴을 재사용합니다.

### 수정할 파일

- 수정: `app/post/page.js`
- 삭제: `app/post/page.module.css`

### 먼저 실행

> Windows 11에서는 [환경 준비](../windows-11.md) <span class="print-reference" data-print-reference="true">(Next.js · Windows 11 x64 실습 환경 준비 · 1. Windows Terminal 설치)</span>를 먼저 확인합니다. 명령은 이 교재의 PowerShell 코드 블록에 적힌 `git`, `node`, `npm` 형태를 그대로 사용합니다.

```powershell
Remove-Item -LiteralPath 'app/post/page.module.css'
```

### 입력할 코드

아래 파일 경로를 확인하고 각 파일의 전체 내용을 입력합니다. 삭제로 표시된 파일은 PowerShell에서 제거합니다.

#### `app/post/page.js`

`app/post/page.js`를 열고 파일 전체를 다음 내용으로 맞춥니다.

~~~js
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const CATEGORY_OPTIONS = [
  { value: "general", label: "General" },
  { value: "notice", label: "Notice" },
  { value: "daily", label: "Daily" },
  { value: "tech", label: "Tech" },
];
const fieldClassName = "grid gap-1.5";
const labelClassName = "text-sm font-medium text-zinc-700";
const inputClassName =
  "rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm outline-none focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200 disabled:bg-zinc-100";
const textareaClassName = `${inputClassName} min-h-48 resize-y`;
const primaryButtonClassName =
  "rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-50";
const errorClassName =
  "rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700";

export default function NewPost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("general");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          content,
          category,
          image: "https://picsum.photos/100",
        }),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to create post");
      }

      router.push(`/detail/${result.data.postId}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create post");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="space-y-6">
      <section className="space-y-2">
        <p className="text-sm font-semibold uppercase text-zinc-500">Write</p>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-950">
          Create New Post
        </h1>
        <p className="max-w-2xl text-sm leading-6 text-zinc-600">
          제목, 본문, 카테고리를 입력해 새 게시글을 작성합니다.
        </p>
      </section>
      {error && (
        <p className={errorClassName} role="alert">
          {error}
        </p>
      )}
      <form
        className="grid max-w-2xl gap-4 rounded-lg border border-zinc-200 bg-white p-5 shadow-sm"
        onSubmit={handleSubmit}
      >
        <div className={fieldClassName}>
          <label className={labelClassName} htmlFor="title">
            Title
          </label>
          <input
            className={inputClassName}
            type="text"
            id="title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            disabled={isSubmitting}
            required
          />
        </div>

        <div className={fieldClassName}>
          <label className={labelClassName} htmlFor="content">
            Content
          </label>
          <textarea
            className={textareaClassName}
            id="content"
            value={content}
            onChange={(event) => setContent(event.target.value)}
            disabled={isSubmitting}
            required
          />
        </div>

        <div className={fieldClassName}>
          <label className={labelClassName} htmlFor="category">
            Category
          </label>
          <select
            className={inputClassName}
            id="category"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            disabled={isSubmitting}
          >
            {CATEGORY_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <button
          className={primaryButtonClassName}
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Creating..." : "Create Post"}
        </button>
      </form>
    </main>
  );
}
~~~

#### `app/post/page.module.css` 삭제

`app/post/page.module.css`는 더 이상 사용하지 않으므로 삭제합니다.

### 설명과 확인

- `fieldClassName`, `labelClassName`, `inputClassName` 같은 상수는 긴 class 문자열 반복을 줄입니다.
- 오류 메시지는 `role="alert"`를 유지하면서 빨간 alert 스타일을 적용합니다.

## 작업 2. 게시글 수정 form Tailwind UI 적용

수정 화면도 작성 화면과 같은 입력 패턴을 사용합니다. 로딩/오류/제출 중 상태가 스타일과 함께 일관되게 보여야 합니다.

### 수정할 파일

- 수정: [app/post/[id]/page.js](../../app/post/%5Bid%5D/page.js)

### 입력할 코드

아래 파일 경로를 확인하고 각 파일의 전체 내용을 입력합니다. 삭제로 표시된 파일은 PowerShell에서 제거합니다.

#### `app/post/[id]/page.js`

`app/post/[id]/page.js`를 열고 파일 전체를 다음 내용으로 맞춥니다.

~~~js
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

const CATEGORY_OPTIONS = [
  { value: "general", label: "General" },
  { value: "notice", label: "Notice" },
  { value: "daily", label: "Daily" },
  { value: "tech", label: "Tech" },
];
const fieldClassName = "grid gap-1.5";
const labelClassName = "text-sm font-medium text-zinc-700";
const inputClassName =
  "rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm outline-none focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200 disabled:bg-zinc-100";
const textareaClassName = `${inputClassName} min-h-48 resize-y`;
const primaryButtonClassName =
  "rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-50";
const errorClassName =
  "rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700";

export default function EditPost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("general");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { id } = useParams();
  const router = useRouter();

  useEffect(() => {
    async function loadPost() {
      try {
        const response = await fetch(`/api/post/${id}`);
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Failed to fetch post data");
        }

        const post = result.data;
        setTitle(post.title);
        setContent(post.content);
        setCategory(post.category || "general");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch post");
      }
    }

    if (id) {
      loadPost();
    }
  }, [id]);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/post/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, content, category }),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to update post");
      }

      router.replace(`/detail/${result.data.postId}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update post");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="space-y-6">
      <section className="space-y-2">
        <p className="text-sm font-semibold uppercase text-zinc-500">Edit</p>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-950">
          Edit Post
        </h1>
        <p className="max-w-2xl text-sm leading-6 text-zinc-600">
          기존 게시글을 불러온 뒤 제목, 본문, 카테고리를 수정합니다.
        </p>
      </section>
      {error && (
        <p className={errorClassName} role="alert">
          {error}
        </p>
      )}
      <form
        className="grid max-w-2xl gap-4 rounded-lg border border-zinc-200 bg-white p-5 shadow-sm"
        onSubmit={handleSubmit}
      >
        <div className={fieldClassName}>
          <label className={labelClassName} htmlFor="title">
            Title
          </label>
          <input
            className={inputClassName}
            type="text"
            id="title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            disabled={isSubmitting}
            required
          />
        </div>

        <div className={fieldClassName}>
          <label className={labelClassName} htmlFor="content">
            Content
          </label>
          <textarea
            className={textareaClassName}
            id="content"
            value={content}
            onChange={(event) => setContent(event.target.value)}
            disabled={isSubmitting}
            required
          />
        </div>

        <div className={fieldClassName}>
          <label className={labelClassName} htmlFor="category">
            Category
          </label>
          <select
            className={inputClassName}
            id="category"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            disabled={isSubmitting}
          >
            {CATEGORY_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <button
          className={primaryButtonClassName}
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Updating..." : "Update Post"}
        </button>
      </form>
    </main>
  );
}
~~~

### 설명과 확인

- 작성 화면과 수정 화면의 class 상수 이름과 구조를 맞추면 두 구현을 비교하기 쉽습니다.
- disabled 상태는 입력칸과 버튼 모두에서 시각적으로 드러나야 합니다.

## 작업 3. Contact form Tailwind UI 적용

Contact form도 실제 기능은 mockup이지만 사용자가 입력하는 화면이므로 같은 UI 패턴을 적용합니다. 페이지 자체에는 제목/설명을 두고 form은 카드로 묶습니다.

### 수정할 파일

- 수정: `app/contact/page.js`
- 수정: `app/contact/ContactForm.js`

### 입력할 코드

아래 파일 경로를 확인하고 각 파일의 전체 내용을 입력합니다. 삭제로 표시된 파일은 PowerShell에서 제거합니다.

#### `app/contact/ContactForm.js`

`app/contact/ContactForm.js`를 열고 파일 전체를 다음 내용으로 맞춥니다.

~~~js
"use client";

import { useState } from "react";

const fieldClassName = "grid gap-1.5";
const labelClassName = "text-sm font-medium text-zinc-700";
const inputClassName =
  "rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm outline-none focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200";
const textareaClassName = `${inputClassName} min-h-40 resize-y`;
const primaryButtonClassName =
  "rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    alert(
      `메일 전송 mockup입니다.\n\n이름: ${name}\n이메일: ${email}\n내용: ${message}`,
    );

    setName("");
    setEmail("");
    setMessage("");
  }

  return (
    <form
      className="grid max-w-2xl gap-4 rounded-lg border border-zinc-200 bg-white p-5 shadow-sm"
      onSubmit={handleSubmit}
    >
      <div className={fieldClassName}>
        <label className={labelClassName} htmlFor="name">
          Name
        </label>
        <input
          className={inputClassName}
          type="text"
          id="name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
        />
      </div>

      <div className={fieldClassName}>
        <label className={labelClassName} htmlFor="email">
          Email
        </label>
        <input
          className={inputClassName}
          type="email"
          id="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
      </div>

      <div className={fieldClassName}>
        <label className={labelClassName} htmlFor="message">
          Message
        </label>
        <textarea
          className={textareaClassName}
          id="message"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          required
        />
      </div>

      <button className={primaryButtonClassName} type="submit">
        Submit
      </button>
    </form>
  );
}
~~~

#### `app/contact/page.js`

`app/contact/page.js`를 열고 파일 전체를 다음 내용으로 맞춥니다.

~~~js
import ContactForm from "./ContactForm";

export default function ContactPage() {
  return (
    <main className="space-y-6">
      <section className="space-y-2">
        <p className="text-sm font-semibold uppercase text-zinc-500">
          Contact
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-950">
          Contact Us
        </h1>
        <p className="max-w-2xl text-sm leading-6 text-zinc-600">
          controlled input과 submit 이벤트를 연습하는 mockup form입니다.
        </p>
      </section>
      <ContactForm />
    </main>
  );
}
~~~

### 설명과 확인

- ContactForm의 controlled input 흐름은 유지하고 class만 Tailwind 기준으로 바꿉니다.
- submit 후에는 기존처럼 브라우저 `alert()` mockup을 띄우고 입력값을 비웁니다.

## 실행 확인

기본 정적 검사는 다음 명령으로 확인합니다.

```powershell
npm run lint
npm run build
```

브라우저 확인이 필요하면 개발 서버를 켠 뒤 해당 화면을 확인합니다.

```powershell
npm run dev
```

체크할 내용은 다음과 같습니다.

- `/post`, `/post/[id]`, `/contact` form이 같은 입력 패턴으로 보인다.
- 오류 메시지가 alert 스타일로 보이고 `role="alert"`가 유지된다.

## 독립 확인

keyboard만으로 label, input, button 순서로 이동합니다. 결과와 확인 방법을 한 문장으로 기록합니다. 실험값은 검사를 마치면 원래대로 복구합니다.

## 마무리 확인

- 각 작업 단위의 설명과 파일 경로를 먼저 확인합니다.
- 코드 블록은 해당 파일의 일부가 아니라 현재 단계에서 사용할 전체 내용입니다.

## 저장소에 기록하기

실험용 변경을 모두 복구한 뒤 검사 결과와 코드 변경을 함께 확인합니다.

```powershell
git branch --show-current
git status --short
npm run lint
npm run build
git add .
git commit -m "Complete Next.js step 22"
git push
git status --short --branch
```

현재 브랜치는 `main`이어야 합니다. 마지막 상태에서 `main...origin/main` 뒤에 `ahead`가 없고 작업 파일 목록도 비어 있어야 합니다.
