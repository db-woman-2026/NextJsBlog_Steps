# Step 6. 새 게시글 작성 form 만들기

## 변경 내용

새 게시글 작성 form을 만들고 POST /api/post 요청으로 MongoDB에 글을 저장합니다.

- `/post` 페이지를 단순 껍데기에서 실제 작성 form으로 바꿉니다.
- 클라이언트 상태로 title/content/error를 관리하고 `POST /api/post`로 전송합니다.
- 작성 성공 후 홈 화면으로 이동해 새 글이 목록에 반영되는 흐름을 만듭니다.

## 시작 전 확인

개인 실습 저장소의 `main`에서 직전 단계까지 마친 상태로 시작합니다. 코드 블록은 복사해 붙이지 않고 직접 입력합니다.

수정 전에 `git status --short`의 출력이 없는지 확인합니다. 변경이 남아 있다면 원인을 확인하고 시작 상태를 정리합니다.

## 작업 1. 작성 form 클라이언트 컴포넌트로 전환

입력값 상태와 submit 이벤트가 필요하므로 `app/post/page.js` 맨 위에 `"use client";`를 추가합니다. form 제출 시 기본 새로고침을 막고 API로 JSON을 보냅니다.

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
  const router = useRouter();

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

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

      router.push("/");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create post");
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
          required
        />

        <label htmlFor="content">Content:</label>
        <textarea
          id="content"
          value={content}
          onChange={(event) => setContent(event.target.value)}
          required
        />

        <button type="submit">Create Post</button>
      </form>
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

- 수정: `app/globals.css`
- 생성: `app/post/page.module.css`

### 입력할 코드

아래 파일 경로를 확인하고 각 파일의 전체 내용을 입력합니다. 삭제로 표시된 파일은 PowerShell에서 제거합니다.

#### `app/globals.css`

`app/globals.css`를 열고 파일 전체를 다음 내용으로 맞춥니다.

~~~css
@import "simpledotcss/simple.min.css";

body {
  min-height: 100vh;
}

body > header {
  align-self: start;
  padding: 1rem;
}

body > header > nav:only-child {
  margin-block-start: 0;
}

header nav {
  padding: 0;
  line-height: 1;
}

header nav a,
header nav a:visited {
  margin-bottom: 0;
}

form {
  max-width: 42rem;
}

textarea {
  min-height: 12rem;
}
~~~

#### `app/post/page.module.css`

`app/post/page.module.css`를 열고 파일 전체를 다음 내용으로 맞춥니다.

~~~css
.container {
  display: grid;
  gap: 1rem;
}
~~~

### 설명과 확인

- 이 시점의 스타일은 simpledotcss 위에 최소한만 얹습니다.

## 실행 확인

기본 정적 검사는 다음 명령으로 확인합니다.

> Windows 11에서는 [환경 준비](../windows-11.md) <span class="print-reference" data-print-reference="true">(Next.js · Windows 11 x64 실습 환경 준비 · 1. Windows Terminal 설치)</span>를 먼저 확인합니다. 명령은 이 교재의 PowerShell 코드 블록에 적힌 `git`, `node`, `npm` 형태를 그대로 사용합니다.

```powershell
npm run lint
npm run build
```

브라우저 확인이 필요하면 개발 서버를 켠 뒤 해당 화면을 확인합니다.

```powershell
npm run dev
```

체크할 내용은 다음과 같습니다.

- `/post`에서 제목과 본문을 입력해 제출한다.
- 성공 후 홈으로 이동하고 새 게시글이 목록에 보인다.

## 독립 확인

작성 성공 후 상세 주소와 MongoDB 문서의 `_id`를 비교합니다. 결과와 확인 방법을 한 문장으로 기록합니다. 실험값은 검사를 마치면 원래대로 복구합니다.

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
git commit -m "Complete Next.js step 6"
git push
git status --short --branch
```

현재 브랜치는 `main`이어야 합니다. 마지막 상태에서 `main...origin/main` 뒤에 `ahead`가 없고 작업 파일 목록도 비어 있어야 합니다.
