# Step 12. 작성일과 수정일 표시

이 문서는 `step-11`에서 시작해 `step-12`를 완성하는 실습 자료입니다.
원본 개요는 [docs/overview/step-12.md](../overview/step-12.md)에 보존되어 있습니다.
실제 완성 코드는 [step-12 브랜치](https://github.com/db-woman-2026/NextJsBlog_Steps/tree/step-12) 기준입니다.

## 이번 단계 목표

홈 목록과 상세 화면에 작성일과 수정일을 표시합니다.

이번 단계에서 집중할 내용은 다음과 같습니다.

- createdAt과 updatedAt 값을 화면에서 읽기 쉬운 날짜로 변환합니다.
- 홈 목록에서 작성일과 수정일을 보여줍니다.
- 상세 화면에서도 같은 날짜 정보를 보여줍니다.

## 시작 기준

이전 단계인 `step-11` 브랜치까지 완료된 상태에서 시작합니다.

```bash
git switch step-11
# 실습용 브랜치를 직접 만들 경우
git switch -c practice-step-12
```

수업 저장소의 정답 브랜치를 바로 확인하려면 다음 명령을 사용할 수 있습니다.

```bash
git switch step-12
```

## 수정 파일

| 상태 | 파일 | 확인 링크 |
| --- | --- | --- |
| 수정 | `app/detail/[id]/page.js` | [app/detail/[id]/page.js](https://github.com/db-woman-2026/NextJsBlog_Steps/blob/step-12/app/detail/%5Bid%5D/page.js) |
| 수정 | `app/page.js` | [app/page.js](https://github.com/db-woman-2026/NextJsBlog_Steps/blob/step-12/app/page.js) |

문서 파일은 이 강의 자료에서 별도로 관리하므로 위 표에는 기능 구현에 필요한 코드와 설정 파일만 넣었습니다.

## 코드 작성

아래 순서대로 파일을 만들거나 수정합니다. 각 코드 블록은 해당 단계 브랜치의 실제 파일 내용을 기준으로 합니다.

### 1. app/detail/[id]/page.js

기존 `app/detail/[id]/page.js` 파일을 열고 아래 최종 코드와 같게 수정합니다.

게시글 상세 읽기 화면입니다. URL의 id로 게시글 하나를 조회하고, 없는 글은 404로 보냅니다.

```jsx
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPostById } from "@/lib/posts";
import styles from "./page.module.css";

function formatDate(dateValue) {
  if (!dateValue) {
    return "";
  }

  return new Date(dateValue).toLocaleString("ko-KR");
}

export default async function BlogDetail({ params }) {
  const { id } = await params;
  const post = await getPostById(id);

  if (!post) {
    notFound();
  }

  return (
    <main className={styles.container}>
      <article>
        <h1>{post.title}</h1>
        <p>Created: {formatDate(post.createdAt)}</p>
        {post.updatedAt && <p>Updated: {formatDate(post.updatedAt)}</p>}
        <pre className={styles.content}>{post.content}</pre>
      </article>
      <Link href={`/post/${id}`}>Edit</Link>
    </main>
  );
}
```

### 2. app/page.js

기존 `app/page.js` 파일을 열고 아래 최종 코드와 같게 수정합니다.

홈 화면입니다. 단계가 진행되면서 소개 화면에서 게시글 목록, 검색, 페이지네이션, 정렬 UI로 확장됩니다.

```jsx
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "./page.module.css";

function formatDate(dateValue) {
  if (!dateValue) {
    return "";
  }

  return new Date(dateValue).toLocaleString("ko-KR");
}

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadPosts() {
      try {
        const response = await fetch("/api/post", { cache: "no-store" });
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Failed to fetch posts");
        }

        setPosts(result.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch posts");
      } finally {
        setIsLoading(false);
      }
    }

    loadPosts();
  }, []);

  return (
    <main>
      {isLoading && <p>Loading posts...</p>}
      {error && <p role="alert">{error}</p>}
      {!isLoading && !error && posts.length === 0 && <p>No posts yet.</p>}
      {!isLoading && !error && (
        <section className={styles.articleList} aria-label="Blog posts">
          {posts.map((post) => (
            <article key={post._id} className={styles.article}>
              <Link href={`/detail/${post._id}`}>{post.title}</Link>
              <p>Created: {formatDate(post.createdAt)}</p>
              {post.updatedAt && <p>Updated: {formatDate(post.updatedAt)}</p>}
            </article>
          ))}
        </section>
      )}
    </main>
  );
}
```

## 실행 확인

기본 확인 명령은 다음과 같습니다.

```bash
npm run lint
npm run build
npm run dev
```

화면과 기능은 다음 순서로 확인합니다.

- 홈 목록에 Created, Updated 날짜가 보이는지 확인합니다.
- 상세 화면에도 같은 날짜 정보가 보이는지 확인합니다.

## 자주 확인할 부분

- 파일 이름과 폴더 이름을 정확히 입력합니다. App Router에서는 `page.js`, `layout.js`, `route.js`, `not-found.js`, `error.js` 같은 파일명이 특별한 의미를 가집니다.
- 클라이언트 상태나 이벤트를 쓰는 파일에는 필요한 경우에만 `"use client";`를 둡니다. 서버에서 실행되어야 하는 MongoDB 코드는 클라이언트 컴포넌트로 가져오지 않습니다.
- API 응답은 가능한 한 `{ success, message, data }` 구조를 유지합니다. 화면 코드는 이 구조를 기준으로 `message`와 `data`를 읽습니다.
- 실습 중 막히면 먼저 이 문서의 코드 블록과 브랜치 링크의 실제 파일을 비교합니다.

## 개념 정리

아래 내용은 기존 단계 개요를 강의 문서 안에서도 바로 볼 수 있도록 가져온 것입니다. 코드 작성 후 다시 읽으면 각 변경의 이유를 확인하기 쉽습니다.

## 이 단계의 목표

`step-12`는 게시글의 작성일과 수정일을 화면에 표시하는 단계입니다.

이전 단계까지는 게시글 제목과 본문만 보였습니다. 하지만 실제 게시판에서는 글이 언제 작성되었고, 나중에 수정되었는지도 중요한 정보입니다.

이 단계에서는 다음을 구현합니다.

- 날짜 값을 화면에 표시하기 위한 `formatDate` 함수를 만든다.
- 홈 목록에서 작성일을 표시한다.
- 홈 목록에서 수정일이 있을 때만 수정일을 표시한다.
- 상세 화면에서도 작성일/수정일을 표시한다.

## 날짜 데이터는 어디에서 생기는가

`lib/posts.js`의 `createPost` 함수는 새 글을 저장할 때 `createdAt`을 넣습니다.

```js
createdAt: new Date()
```

`updatePost` 함수는 글을 수정할 때 `updatedAt`을 넣습니다.

```js
updatedAt: new Date()
```

즉, 이 단계에서는 DB 구조를 새로 만들지 않고 이미 저장되는 값을 화면에 보여줍니다.

## formatDate 함수

MongoDB에서 온 날짜 값은 그대로 출력하면 읽기 어려울 수 있습니다.

그래서 화면 파일에 다음 함수를 추가합니다.

```js
function formatDate(dateValue) {
  if (!dateValue) {
    return "";
  }

  return new Date(dateValue).toLocaleString("ko-KR");
}
```

`dateValue`가 없으면 빈 문자열을 반환합니다. 값이 있으면 JavaScript `Date` 객체로 바꾼 뒤 한국어 로케일 문자열로 표시합니다.

## 홈 목록에서 날짜 표시

홈 목록의 게시글 article 안에 날짜를 추가합니다.

```jsx
<Link href={`/detail/${post._id}`}>{post.title}</Link>
<p>Created: {formatDate(post.createdAt)}</p>
{post.updatedAt && <p>Updated: {formatDate(post.updatedAt)}</p>}
```

`createdAt`은 새 글을 만들 때 항상 들어갑니다.

`updatedAt`은 수정한 적이 있는 글에만 있습니다. 그래서 조건부 렌더링을 사용합니다.

```jsx
{post.updatedAt && <p>Updated: {formatDate(post.updatedAt)}</p>}
```

## 상세 화면에서 날짜 표시

상세 화면도 같은 정보를 보여줍니다.

```jsx
<h1>{post.title}</h1>
<p>Created: {formatDate(post.createdAt)}</p>
{post.updatedAt && <p>Updated: {formatDate(post.updatedAt)}</p>}
<pre className={styles.content}>{post.content}</pre>
```

목록에서는 요약 정보를 보고, 상세에서는 본문과 함께 날짜를 확인할 수 있습니다.

## 직접 실습 순서

1. `app/page.js`에 `formatDate` 함수를 만든다.
2. 홈 목록의 article에 `Created` 문구를 추가한다.
3. `updatedAt`이 있을 때만 `Updated` 문구를 보여준다.
4. `app/detail/[id]/page.js`에도 같은 `formatDate` 함수를 만든다.
5. 상세 화면 제목 아래에 작성일/수정일을 표시한다.

## 확인 방법

홈 화면에서 게시글 목록을 확인합니다.

```txt
http://localhost:3000/
```

각 게시글 제목 아래에 작성일이 보이면 성공입니다.

게시글을 수정한 뒤 홈이나 상세 화면으로 돌아오면 수정일도 표시되어야 합니다.

## 검증 명령

```bash
npm run lint
npm run build
```

## 이 단계의 핵심

DB에 저장된 값은 화면에 그대로 보여주기보다 사용자가 읽기 좋은 형태로 가공해서 보여주는 경우가 많습니다. 날짜 표시 함수는 그런 가공의 가장 기본적인 예입니다.
