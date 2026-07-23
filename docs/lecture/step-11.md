# Step 11. 제출 중 상태와 상세 페이지 이동 개선하기

## 변경 내용

제출 중 상태를 추가하고 작성/수정 성공 후 해당 게시글 상세 페이지로 이동합니다.

- 작성/수정 form에 `isSubmitting` 상태를 추가합니다.
- 제출 중에는 입력칸과 버튼을 비활성화하고 버튼 문구를 바꿉니다.
- 작성 성공 시 API가 반환한 새 id로 상세 페이지에 이동합니다.

## 시작 전 확인

개인 실습 저장소의 `main`에서 직전 단계까지 마친 상태로 시작합니다. 코드 블록은 복사해 붙이지 않고 직접 입력합니다.

수정 전에 `git status --short`의 출력이 없는지 확인합니다. 변경이 남아 있다면 원인을 확인하고 시작 상태를 정리합니다.

## 작업 1. 작성 form 제출 상태 추가

중복 제출을 막기 위해 요청이 진행되는 동안 form 요소를 disabled 처리합니다. 성공 후에는 홈이 아니라 새 게시글 상세 페이지로 이동합니다.

### 수정할 파일

- 수정: `app/post/page.js`

### 입력할 코드

아래 파일 경로를 확인하고 각 파일의 전체 내용을 입력합니다. 삭제로 표시된 파일은 PowerShell에서 제거합니다.

#### `app/post/page.js`

`app/post/page.js`를 열고 파일 전체를 다음 내용으로 맞춥니다.

~~~js
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";

export default function NewPost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
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
    <main className={styles.container}>
      <h1>Create New Post</h1>
      {error && <p role="alert">{error}</p>}
      <form onSubmit={handleSubmit}>
        <label htmlFor="title">Title:</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          disabled={isSubmitting}
          required
        />

        <label htmlFor="content">Content:</label>
        <textarea
          id="content"
          value={content}
          onChange={(event) => setContent(event.target.value)}
          disabled={isSubmitting}
          required
        />

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create Post"}
        </button>
      </form>
    </main>
  );
}
~~~

### 설명과 확인

- 응답의 `data.postId`를 읽어 `/detail/${postId}`로 이동합니다.
- `finally`에서 `isSubmitting`을 false로 되돌려 실패하더라도 제출 버튼을 다시 활성화합니다.

## 작업 2. 수정 form 제출 상태 추가

수정 화면도 같은 방식으로 중복 제출을 막습니다. 이미 id를 알고 있으므로 성공 후 기존 상세 주소로 돌아갑니다.

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
import styles from "../page.module.css";

export default function EditPost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
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
        body: JSON.stringify({ title, content }),
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
    <main className={styles.container}>
      <h1>Edit Post</h1>
      {error && <p role="alert">{error}</p>}
      <form onSubmit={handleSubmit}>
        <label htmlFor="title">Title:</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          disabled={isSubmitting}
          required
        />

        <label htmlFor="content">Content:</label>
        <textarea
          id="content"
          value={content}
          onChange={(event) => setContent(event.target.value)}
          disabled={isSubmitting}
          required
        />

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Updating..." : "Update Post"}
        </button>
      </form>
    </main>
  );
}
~~~

### 설명과 확인

- 작성 화면과 수정 화면의 UX 규칙을 맞춥니다.
- 입력 disabled, 버튼 disabled, 버튼 문구 변경이 함께 들어가야 사용자가 상태를 이해합니다.

## 실행 확인

기본 정적 검사는 다음 명령으로 확인합니다.

> Windows 11에서는 [환경 준비](../windows-11.md) <span class="print-reference" data-print-reference="true">(인쇄본 위치: Next.js · 장 「Windows 11 x64 실습 환경 준비」 · 절 「1. Windows Terminal 설치」)</span>를 먼저 확인합니다. 명령은 이 교재의 PowerShell 코드 블록에 적힌 `git`, `node`, `npm` 형태를 그대로 사용합니다.

```powershell
npm run lint
npm run build
```

브라우저 확인이 필요하면 개발 서버를 켠 뒤 해당 화면을 확인합니다.

```powershell
npm run dev
```

체크할 내용은 다음과 같습니다.

- 작성 중 버튼 문구가 바뀌고 입력칸이 비활성화된다.
- 작성 성공 후 새 글 상세 화면으로 이동한다.
- 수정 성공 후 해당 글 상세 화면으로 이동한다.

## 독립 확인

제출 버튼을 빠르게 두 번 눌러 중복 요청이 막히는지 확인합니다. 결과와 확인 방법을 한 문장으로 기록합니다. 실험값은 검사를 마치면 원래대로 복구합니다.

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
git commit -m "Complete Next.js step 11"
git push
git status --short --branch
```

현재 브랜치는 `main`이어야 합니다. 마지막 상태에서 `main...origin/main` 뒤에 `ahead`가 없고 작업 파일 목록도 비어 있어야 합니다.
