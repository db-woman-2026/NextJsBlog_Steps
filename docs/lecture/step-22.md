# Step 22. 작성, 수정, Contact form UI 정리

이 문서는 `step-21`에서 시작해 `step-22`를 완성하는 실습 자료입니다.
원본 개요는 [docs/overview/step-22.md](../overview/step-22.md)에 보존되어 있습니다.
실제 완성 코드는 [step-22 브랜치](https://github.com/db-woman-2026/NextJsBlog_Steps/tree/step-22) 기준입니다.

## 이번 단계 목표

게시글 작성/수정 form과 Contact form에 같은 Tailwind 입력/버튼 패턴을 적용합니다.

이번 단계에서 집중할 내용은 다음과 같습니다.

- 작성, 수정, Contact form에 같은 입력 스타일을 적용합니다.
- 반복 className을 상수로 분리합니다.
- focus, disabled, error 상태를 Tailwind class로 표현합니다.

## 시작 기준

이전 단계인 `step-21` 브랜치까지 완료된 상태에서 시작합니다.

```bash
git switch step-21
# 실습용 브랜치를 직접 만들 경우
git switch -c practice-step-22
```

수업 저장소의 정답 브랜치를 바로 확인하려면 다음 명령을 사용할 수 있습니다.

```bash
git switch step-22
```

## 수정 파일

| 상태 | 파일 | 확인 링크 |
| --- | --- | --- |
| 수정 | `README.md` | [README.md](https://github.com/db-woman-2026/NextJsBlog_Steps/blob/step-22/README.md) |
| 수정 | `app/contact/ContactForm.js` | [app/contact/ContactForm.js](https://github.com/db-woman-2026/NextJsBlog_Steps/blob/step-22/app/contact/ContactForm.js) |
| 수정 | `app/contact/page.js` | [app/contact/page.js](https://github.com/db-woman-2026/NextJsBlog_Steps/blob/step-22/app/contact/page.js) |
| 수정 | `app/post/[id]/page.js` | [app/post/[id]/page.js](https://github.com/db-woman-2026/NextJsBlog_Steps/blob/step-22/app/post/%5Bid%5D/page.js) |
| 수정 | `app/post/page.js` | [app/post/page.js](https://github.com/db-woman-2026/NextJsBlog_Steps/blob/step-22/app/post/page.js) |
| 삭제 | `app/post/page.module.css` | [app/post/page.module.css](https://github.com/db-woman-2026/NextJsBlog_Steps/blob/step-21/app/post/page.module.css) |

문서 파일은 이 강의 자료에서 별도로 관리하므로 위 표에는 기능 구현에 필요한 코드와 설정 파일만 넣었습니다.

## 코드 작성

아래 순서대로 파일을 만들거나 수정합니다. 각 코드 블록은 해당 단계 브랜치의 실제 파일 내용을 기준으로 합니다.

### 1. README.md

기존 `README.md` 파일을 열고 아래 최종 코드와 같게 수정합니다.

저장소 첫 화면에서 프로젝트 목적, 실행 방법, 단계 흐름을 설명하는 문서입니다.

````markdown
# NextJsBlog_Steps

초급 개발자 교육용 Next.js 블로그 프로젝트를 단계별 브랜치로 나눈 저장소입니다.

`main`은 `create-next-app` 직후의 기본 프로젝트 상태입니다. `step-1`부터는 이전 단계 위에 코드를 누적해서 실습합니다. `step-9`는 기본 블로그 기능의 마무리이고, `step-10`부터는 기능 확장 단계입니다.

## Branch Flow

| 브랜치 | 내용 |
| --- | --- |
| `main` | Next.js 기본 프로젝트 생성 상태 |
| `step-1` | App Router 기본 페이지, Header, Footer, nav 구성 |
| `step-2` | `simpledotcss`, 전역 스타일, About 이미지, 이미지 도메인 설정 |
| `step-3` | MongoDB 연결, 환경 변수 예시, 게시글 데이터 함수 |
| `step-4` | 게시글 목록/작성/단건조회/수정 API Route와 통일된 응답 형식 |
| `step-5` | 홈 화면 게시글 목록과 `/detail/[id]` 상세 읽기 화면 |
| `step-6` | 새 게시글 작성 form과 POST 요청 |
| `step-7` | 상세 화면에서 진입하는 게시글 수정 form과 PUT 요청 |
| `step-8` | Contact mockup form |
| `step-9` | README 정리, 불필요한 기본 파일 제거, 최종 기본 기능 |
| `step-10` | 입력값 검증 강화와 서버 오류 메시지 표시 |
| `step-11` | 제출 중 상태와 작성/수정 후 상세 페이지 이동 |
| `step-12` | 작성일과 수정일 표시 |
| `step-13` | 삭제 기능 |
| `step-14` | 클라이언트 필터 검색 |
| `step-15` | 서버 검색 |
| `step-16` | 페이지네이션 |
| `step-17` | 정렬 기능 |
| `step-18` | Not Found와 Error UI 개선 |
| `step-19` | 카테고리 |
| `step-20` | `simpledotcss` 제거, Tailwind CSS v4 설치, 공통 layout/nav/footer 정리 |
| `step-21` | 홈 목록, 상세 읽기 화면, About 페이지의 기본 카드 UI |
| `step-22` | 게시글 작성/수정 form과 Contact form의 Tailwind UI |

전체 단계 개요는 `/docs/overview/index.md`에 있고, 실습형 강의 자료는 `/docs/lecture/index.md`와 `/docs/lecture/step-N.md`에 있습니다.

## Stack

- Next.js 16
- React 19
- MongoDB Node.js Driver 7
- ESLint 9 flat config
- Tailwind CSS v4

## Getting Started

의존성을 설치합니다.

```bash
npm install
```

환경 변수 예시 파일을 복사합니다.

```bash
cp .env.example .env.local
```

로컬 MongoDB를 사용한다면 `.env.local`을 다음처럼 둡니다.

```txt
MONGODB_URI=mongodb://localhost:27017/blog
MONGODB_DB=blog
```

개발 서버를 실행합니다.

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 엽니다.

## Routes

| 주소 | 역할 |
| --- | --- |
| `/` | 게시글 목록 |
| `/detail/[id]` | 게시글 상세 |
| `/post` | 게시글 작성 |
| `/post/[id]` | 게시글 수정 |
| `/about` | 소개 페이지 |
| `/contact` | Contact mockup form |
| `/api/post` | 게시글 목록/작성 API |
| `/api/post/[id]` | 게시글 단건 조회/수정/삭제 API |

## API Response Format

모든 API 응답은 같은 최상위 필드를 사용합니다.

```json
{
  "success": true,
  "message": "Posts fetched successfully",
  "data": []
}
```

오류도 같은 형식으로 반환합니다.

```json
{
  "success": false,
  "message": "Post not found",
  "data": null
}
```

| Method | 주소 | 요청 데이터 | 성공 시 `data` |
| --- | --- | --- | --- |
| `GET` | `/api/post` | query string: `keyword`, `page`, `limit`, `sort`, `category` | `{ posts, pagination }` |
| `POST` | `/api/post` | `{ title, content, image?, category? }` | `{ postId }` |
| `GET` | `/api/post/[id]` | URL의 `id` | 게시글 하나 |
| `PUT` | `/api/post/[id]` | URL의 `id`, `{ title, content, category? }` | `{ postId }` |
| `DELETE` | `/api/post/[id]` | URL의 `id` | `{ postId }` |

## Useful Commands

```bash
npm run lint
npm run build
```

`lint`는 코드 규칙을 확인하고, `build`는 실제 배포용 빌드가 가능한지 확인합니다.

## Notes For Beginners

- 페이지 라우트는 `app` 폴더의 `page.js` 파일로 만듭니다.
- API 라우트는 `app/api` 폴더의 `route.js` 파일로 만듭니다.
- API 응답은 `lib/apiResponse.js`의 `apiSuccess`, `apiError`로 통일합니다.
- MongoDB 연결은 `lib/mongodb.js`에 있습니다.
- 게시글 데이터 함수는 `lib/posts.js`에 있습니다.
- 클라이언트 컴포넌트에서 MongoDB를 직접 import하지 않습니다.
- 첫 `/api/post` 요청은 `posts` 컬렉션이 비어 있으면 샘플 게시글 10개를 넣습니다.
- Contact form은 실제 메일을 보내지 않는 mockup입니다.
````

### 2. app/contact/ContactForm.js

기존 `app/contact/ContactForm.js` 파일을 열고 아래 최종 코드와 같게 수정합니다.

사용자 입력 상태와 submit 이벤트가 필요한 클라이언트 컴포넌트입니다.

```jsx
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
```

### 3. app/contact/page.js

기존 `app/contact/page.js` 파일을 열고 아래 최종 코드와 같게 수정합니다.

이 단계의 결과와 맞도록 파일 내용을 정리합니다.

```jsx
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
```

### 4. app/post/[id]/page.js

기존 `app/post/[id]/page.js` 파일을 열고 아래 최종 코드와 같게 수정합니다.

게시글 작성 또는 수정 화면입니다. form 상태와 API 요청 흐름을 집중해서 봅니다.

```jsx
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
```

### 5. app/post/page.js

기존 `app/post/page.js` 파일을 열고 아래 최종 코드와 같게 수정합니다.

게시글 작성 또는 수정 화면입니다. form 상태와 API 요청 흐름을 집중해서 봅니다.

```jsx
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
```

### 6. app/post/page.module.css

이 단계에서는 `app/post/page.module.css` 파일을 삭제합니다.

게시글 작성 또는 수정 화면입니다. form 상태와 API 요청 흐름을 집중해서 봅니다.

```bash
rm app/post/page.module.css
```

삭제 전 파일은 [step-21의 app/post/page.module.css](https://github.com/db-woman-2026/NextJsBlog_Steps/blob/step-21/app/post/page.module.css)에서 확인할 수 있습니다.

## 실행 확인

기본 확인 명령은 다음과 같습니다.

```bash
npm run lint
npm run build
npm run dev
```

화면과 기능은 다음 순서로 확인합니다.

- 작성, 수정, Contact form의 input, textarea, button 스타일을 확인합니다.
- 제출 중 disabled 상태와 오류 메시지 스타일을 확인합니다.

## 자주 확인할 부분

- 파일 이름과 폴더 이름을 정확히 입력합니다. App Router에서는 `page.js`, `layout.js`, `route.js`, `not-found.js`, `error.js` 같은 파일명이 특별한 의미를 가집니다.
- 클라이언트 상태나 이벤트를 쓰는 파일에는 필요한 경우에만 `"use client";`를 둡니다. 서버에서 실행되어야 하는 MongoDB 코드는 클라이언트 컴포넌트로 가져오지 않습니다.
- API 응답은 가능한 한 `{ success, message, data }` 구조를 유지합니다. 화면 코드는 이 구조를 기준으로 `message`와 `data`를 읽습니다.
- 실습 중 막히면 먼저 이 문서의 코드 블록과 브랜치 링크의 실제 파일을 비교합니다.

## 개념 정리

아래 내용은 기존 단계 개요를 강의 문서 안에서도 바로 볼 수 있도록 가져온 것입니다. 코드 작성 후 다시 읽으면 각 변경의 이유를 확인하기 쉽습니다.

이전 단계에서는 홈 목록과 상세 읽기 화면을 카드형 UI로 바꿨습니다. 이번 단계에서는 사용자가 직접 입력하는 form 화면을 정리합니다.

## 이번 단계에서 하는 일

- 게시글 작성 페이지에 제목 영역과 form 카드 UI를 적용한다.
- 게시글 수정 페이지에 같은 form UI 패턴을 적용한다.
- Contact mockup form에도 같은 입력 패턴을 적용한다.
- 오류 메시지를 눈에 띄는 alert 형태로 표시한다.
- `app/post/page.module.css`를 제거한다.

## form을 따로 분리해서 다루는 이유

form은 단순한 텍스트 화면보다 고려할 요소가 많습니다.

- label과 input의 관계
- 입력칸의 focus 상태
- disabled 상태
- submit 버튼
- 오류 메시지
- textarea 높이

그래서 읽기 화면과 같은 단계에서 한꺼번에 바꾸기보다, form만 따로 다루는 편이 학습하기 쉽습니다.

## 반복되는 class를 상수로 두기

작성 페이지와 수정 페이지에서는 같은 입력 스타일이 여러 번 반복됩니다. 이럴 때는 문자열 상수를 만들어 재사용할 수 있습니다.

```js
const fieldClassName = "grid gap-1.5";
const labelClassName = "text-sm font-medium text-zinc-700";
const inputClassName =
  "rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm outline-none focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200 disabled:bg-zinc-100";
```

이 방식은 CSS 파일을 새로 만들지 않으면서도 긴 class 문자열을 여러 곳에 반복 작성하지 않게 해줍니다.

## label과 input 묶기

각 입력 필드는 label과 input을 하나의 `div`로 묶습니다.

```jsx
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
```

`htmlFor`와 `id`가 연결되어 있으므로 label을 클릭해도 input에 focus가 갑니다. 스타일을 바꿔도 접근성 기본 구조는 유지해야 합니다.

## focus 상태

입력칸 class에는 focus 관련 class가 들어 있습니다.

```txt
focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200
```

사용자가 입력칸을 클릭하면 border와 ring이 바뀌어 현재 입력 위치를 더 쉽게 알 수 있습니다.

## disabled 상태

게시글 작성/수정 중에는 input과 button이 disabled 됩니다.

```txt
disabled:bg-zinc-100
disabled:cursor-not-allowed
disabled:opacity-50
```

Tailwind의 `disabled:` 접두사는 HTML 요소가 `disabled` 상태일 때만 적용됩니다.

## textarea 높이

본문 입력칸은 일반 input보다 높아야 합니다.

```js
const textareaClassName = `${inputClassName} min-h-48 resize-y`;
```

`min-h-48`은 최소 높이를 확보하고, `resize-y`는 사용자가 세로 방향으로만 크기를 조절할 수 있게 합니다.

## 오류 메시지

오류 메시지는 빨간색 계열의 alert 패턴으로 표시합니다.

```jsx
{error && (
  <p className={errorClassName} role="alert">
    {error}
  </p>
)}
```

`role="alert"`는 화면 낭독기에도 오류 메시지임을 알려주는 역할을 합니다. 스타일을 입히더라도 기존 의미를 잃지 않는 것이 중요합니다.

## Contact form

Contact form은 실제 메일을 보내지는 않지만 controlled input과 submit 이벤트를 연습하기 좋은 예제입니다. 게시글 form과 같은 카드, label, input, button 패턴을 적용해 화면 전체의 일관성을 맞춥니다.

## 이번 단계의 기준

이번 단계의 완성 기준은 "사용자가 입력하는 화면들이 같은 form 패턴을 가진다"입니다.

아직 삭제 버튼, not-found, error 화면은 따로 정리하지 않습니다. 다음 단계에서 남은 작은 UI 조각들을 정리해 Tailwind 전환을 마무리합니다.

## 확인 방법

```bash
npm run lint
npm run build
```

브라우저에서는 다음 주소를 확인합니다.

```txt
/post
/post/[id]
/contact
```

`/post/[id]`는 실제 게시글 ID가 필요하므로 홈 목록에서 상세 화면으로 들어간 뒤 Edit 링크를 클릭하면 됩니다.

## 체크리스트

1. 작성 페이지의 입력칸과 버튼이 카드 안에 정리되어 있다.
2. 수정 페이지도 작성 페이지와 같은 form 패턴을 사용한다.
3. Contact form도 같은 입력 패턴을 사용한다.
4. 작성/수정 중 disabled 상태가 눈에 보인다.
5. 오류 메시지는 `role="alert"`를 유지하면서 alert 스타일로 보인다.
6. `app/post/page.module.css`를 import하는 코드가 남아 있지 않다.

다음 단계에서는 삭제 버튼, Not Found, Error 화면과 문서 인덱스를 정리해 Tailwind 기본 UI 전환을 마무리합니다.
