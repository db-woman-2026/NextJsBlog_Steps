# Step 13. 삭제 기능 추가

이 문서는 `step-12`에서 시작해 `step-13`를 완성하는 실습 자료입니다.
원본 개요는 [docs/overview/step-13.md](../overview/step-13.md)에 보존되어 있습니다.
실제 완성 코드는 [step-13 브랜치](https://github.com/db-woman-2026/NextJsBlog_Steps/tree/step-13) 기준입니다.

## 이번 단계 목표

MongoDB 삭제 함수, DELETE /api/post/[id], 상세 화면 삭제 버튼으로 삭제 흐름을 완성합니다.

이번 단계에서 집중할 내용은 다음과 같습니다.

- MongoDB deleteOne을 사용하는 deletePost 함수를 만듭니다.
- DELETE /api/post/[id] API를 추가합니다.
- 상세 화면에 삭제 버튼을 연결하고 성공 후 홈으로 이동합니다.

## 시작 기준

이전 단계인 `step-12` 브랜치까지 완료된 상태에서 시작합니다.

```bash
git switch step-12
# 실습용 브랜치를 직접 만들 경우
git switch -c practice-step-13
```

수업 저장소의 정답 브랜치를 바로 확인하려면 다음 명령을 사용할 수 있습니다.

```bash
git switch step-13
```

## 수정 파일

| 상태 | 파일 | 확인 링크 |
| --- | --- | --- |
| 수정 | `app/api/post/[id]/route.js` | [app/api/post/[id]/route.js](https://github.com/db-woman-2026/NextJsBlog_Steps/blob/step-13/app/api/post/%5Bid%5D/route.js) |
| 생성 | `app/detail/[id]/DeletePostButton.js` | [app/detail/[id]/DeletePostButton.js](https://github.com/db-woman-2026/NextJsBlog_Steps/blob/step-13/app/detail/%5Bid%5D/DeletePostButton.js) |
| 수정 | `app/detail/[id]/page.js` | [app/detail/[id]/page.js](https://github.com/db-woman-2026/NextJsBlog_Steps/blob/step-13/app/detail/%5Bid%5D/page.js) |
| 수정 | `lib/posts.js` | [lib/posts.js](https://github.com/db-woman-2026/NextJsBlog_Steps/blob/step-13/lib/posts.js) |

문서 파일은 이 강의 자료에서 별도로 관리하므로 위 표에는 기능 구현에 필요한 코드와 설정 파일만 넣었습니다.

## 코드 작성

아래 순서대로 파일을 만들거나 수정합니다. 각 코드 블록은 해당 단계 브랜치의 실제 파일 내용을 기준으로 합니다.

### 1. app/api/post/[id]/route.js

기존 `app/api/post/[id]/route.js` 파일을 열고 아래 최종 코드와 같게 수정합니다.

서버에서 실행되는 API Route입니다. 브라우저 화면 코드가 이 주소로 요청을 보내 데이터를 읽거나 변경합니다.

```jsx
import { apiError, apiSuccess } from "@/lib/apiResponse";
import { deletePost, getPostById, updatePost } from "@/lib/posts";

export async function GET(_request, { params }) {
  try {
    const { id } = await params;
    const post = await getPostById(id);

    if (!post) {
      return apiError("Post not found", 404);
    }

    return apiSuccess(post, "Post fetched successfully");
  } catch (error) {
    console.error("Error fetching post:", error);
    return apiError("Internal Server Error", 500);
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const postData = await request.json();
    const title =
      typeof postData.title === "string" ? postData.title.trim() : "";
    const content =
      typeof postData.content === "string" ? postData.content.trim() : "";

    if (!title || !content) {
      return apiError("Title and content are required", 400);
    }

    const result = await updatePost(id, { title, content });

    if (!result || result.matchedCount === 0) {
      return apiError("Post not found", 404);
    }

    return apiSuccess({ postId: id }, "Post updated successfully");
  } catch (error) {
    console.error("Error updating post:", error);
    return apiError("Internal Server Error", 500);
  }
}

export async function DELETE(_request, { params }) {
  try {
    const { id } = await params;
    const result = await deletePost(id);

    if (!result || result.deletedCount === 0) {
      return apiError("Post not found", 404);
    }

    return apiSuccess({ postId: id }, "Post deleted successfully");
  } catch (error) {
    console.error("Error deleting post:", error);
    return apiError("Internal Server Error", 500);
  }
}
```

### 2. app/detail/[id]/DeletePostButton.js

새 파일 `app/detail/[id]/DeletePostButton.js`을 만들고 아래 내용을 입력합니다.

삭제 클릭, 확인창, 삭제 요청, 삭제 중 상태를 담당하는 클라이언트 컴포넌트입니다.

```jsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DeletePostButton({ id }) {
  const [error, setError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  async function handleDelete() {
    const shouldDelete = window.confirm("Delete this post?");

    if (!shouldDelete) {
      return;
    }

    setError("");
    setIsDeleting(true);

    try {
      const response = await fetch(`/api/post/${id}`, {
        method: "DELETE",
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to delete post");
      }

      router.push("/");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete post");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <>
      <button type="button" onClick={handleDelete} disabled={isDeleting}>
        {isDeleting ? "Deleting..." : "Delete"}
      </button>
      {error && <p role="alert">{error}</p>}
    </>
  );
}
```

### 3. app/detail/[id]/page.js

기존 `app/detail/[id]/page.js` 파일을 열고 아래 최종 코드와 같게 수정합니다.

게시글 상세 읽기 화면입니다. URL의 id로 게시글 하나를 조회하고, 없는 글은 404로 보냅니다.

```jsx
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPostById } from "@/lib/posts";
import DeletePostButton from "./DeletePostButton";
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
      <DeletePostButton id={id} />
    </main>
  );
}
```

### 4. lib/posts.js

기존 `lib/posts.js` 파일을 열고 아래 최종 코드와 같게 수정합니다.

서버 로직을 재사용하기 위해 분리한 helper 파일입니다. 페이지나 API가 직접 복잡한 DB 코드를 반복하지 않게 합니다.

```js
import { ObjectId } from "mongodb";
import getMongoClient from "./mongodb";

const dbName = process.env.MONGODB_DB || "blog";
const collectionName = "posts";

function createSeedPosts() {
  return Array.from({ length: 10 }, (_, index) => ({
    createdAt: new Date(),
    title: `Blog Post ${index + 1}`,
    content:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
    image: "https://picsum.photos/100",
  }));
}

async function getPostsCollection() {
  const client = await getMongoClient();
  return client.db(dbName).collection(collectionName);
}

export async function seedPostsIfEmpty() {
  const collection = await getPostsCollection();
  const count = await collection.countDocuments();

  if (count === 0) {
    await collection.insertMany(createSeedPosts());
  }
}

export async function listPosts() {
  await seedPostsIfEmpty();

  const collection = await getPostsCollection();
  return collection.find({}).sort({ createdAt: -1 }).toArray();
}

export async function createPost(postData) {
  const collection = await getPostsCollection();
  const result = await collection.insertOne({
    title: postData.title,
    content: postData.content,
    image: postData.image || "https://picsum.photos/100",
    createdAt: new Date(),
  });

  return result;
}

export async function deletePost(id) {
  if (!ObjectId.isValid(id)) {
    return null;
  }

  const collection = await getPostsCollection();
  return collection.deleteOne({ _id: new ObjectId(id) });
}

export async function getPostById(id) {
  if (!ObjectId.isValid(id)) {
    return null;
  }

  const collection = await getPostsCollection();
  return collection.findOne({ _id: new ObjectId(id) });
}

export async function updatePost(id, postData) {
  if (!ObjectId.isValid(id)) {
    return null;
  }

  const collection = await getPostsCollection();
  return collection.updateOne(
    { _id: new ObjectId(id) },
    {
      $set: {
        title: postData.title,
        content: postData.content,
        updatedAt: new Date(),
      },
    },
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

- 상세 화면에서 Delete 버튼을 누릅니다.
- 확인창에서 OK를 누르면 홈으로 이동하고 삭제한 글이 목록에서 사라지는지 확인합니다.

## 자주 확인할 부분

- 파일 이름과 폴더 이름을 정확히 입력합니다. App Router에서는 `page.js`, `layout.js`, `route.js`, `not-found.js`, `error.js` 같은 파일명이 특별한 의미를 가집니다.
- 클라이언트 상태나 이벤트를 쓰는 파일에는 필요한 경우에만 `"use client";`를 둡니다. 서버에서 실행되어야 하는 MongoDB 코드는 클라이언트 컴포넌트로 가져오지 않습니다.
- API 응답은 가능한 한 `{ success, message, data }` 구조를 유지합니다. 화면 코드는 이 구조를 기준으로 `message`와 `data`를 읽습니다.
- 실습 중 막히면 먼저 이 문서의 코드 블록과 브랜치 링크의 실제 파일을 비교합니다.

## 개념 정리

아래 내용은 기존 단계 개요를 강의 문서 안에서도 바로 볼 수 있도록 가져온 것입니다. 코드 작성 후 다시 읽으면 각 변경의 이유를 확인하기 쉽습니다.

## 이 단계의 목표

`step-13`은 게시글 삭제 기능을 추가하는 단계입니다.

삭제 기능은 단순히 버튼 하나를 추가하는 작업이 아닙니다. 다음 세 부분이 함께 필요합니다.

- MongoDB에서 문서를 삭제하는 데이터 함수
- `DELETE /api/post/[id]` API Route
- 상세 화면에서 삭제 요청을 보내는 클라이언트 버튼

이 세 부분을 같은 단계에 넣어야 `step-13` 브랜치가 독립적으로 완성된 삭제 흐름을 가질 수 있습니다.

## 삭제 흐름

삭제 기능은 다음 순서로 동작합니다.

```txt
상세 화면
-> Delete 버튼 클릭
-> confirm 창으로 삭제 여부 확인
-> DELETE /api/post/[id] 요청
-> MongoDB에서 해당 게시글 삭제
-> 성공하면 홈 화면으로 이동
```

## deletePost 데이터 함수

`lib/posts.js`에 삭제 함수를 추가합니다.

```js
export async function deletePost(id) {
  if (!ObjectId.isValid(id)) {
    return null;
  }

  const collection = await getPostsCollection();
  return collection.deleteOne({ _id: new ObjectId(id) });
}
```

삭제도 상세 조회/수정과 마찬가지로 URL의 id를 MongoDB `ObjectId`로 변환해야 합니다.

잘못된 id가 들어오면 `null`을 반환합니다.

## DELETE API Route

`app/api/post/[id]/route.js`에 `DELETE` 함수를 추가합니다.

```js
export async function DELETE(_request, { params }) {
  try {
    const { id } = await params;
    const result = await deletePost(id);

    if (!result || result.deletedCount === 0) {
      return apiError("Post not found", 404);
    }

    return apiSuccess({ postId: id }, "Post deleted successfully");
  } catch (error) {
    console.error("Error deleting post:", error);
    return apiError("Internal Server Error", 500);
  }
}
```

삭제할 게시글이 없으면 404 응답을 반환합니다.

성공하면 통일된 API 응답 형식으로 삭제된 id를 반환합니다.

## 상세 화면과 삭제 버튼 분리

상세 페이지는 서버 컴포넌트입니다. 하지만 삭제 버튼은 클릭 이벤트와 상태가 필요하므로 클라이언트 컴포넌트여야 합니다.

그래서 삭제 버튼을 별도 파일로 분리합니다.

```txt
app/detail/[id]/DeletePostButton.js
```

상세 페이지에서는 이 컴포넌트를 import해서 렌더링합니다.

```jsx
<DeletePostButton id={id} />
```

## DeletePostButton

삭제 버튼은 클라이언트 컴포넌트입니다.

```js
"use client";
```

상태는 두 가지입니다.

```js
const [error, setError] = useState("");
const [isDeleting, setIsDeleting] = useState(false);
```

`isDeleting`은 삭제 요청 중 버튼을 비활성화하기 위해 사용합니다.

## 삭제 확인창

삭제는 되돌리기 어려운 작업입니다. 그래서 요청을 보내기 전에 확인창을 띄웁니다.

```js
const shouldDelete = window.confirm("Delete this post?");

if (!shouldDelete) {
  return;
}
```

사용자가 취소하면 아무 요청도 보내지 않습니다.

## DELETE 요청 보내기

삭제 요청은 다음처럼 보냅니다.

```js
const response = await fetch(`/api/post/${id}`, {
  method: "DELETE",
});
```

API 응답은 통일된 형식이므로 `message`를 읽어 오류 메시지로 사용할 수 있습니다.

```js
const result = await response.json();

if (!response.ok) {
  throw new Error(result.message || "Failed to delete post");
}
```

## 삭제 성공 후 이동

삭제된 글의 상세 페이지에 계속 머물 수는 없습니다. 성공하면 홈 화면으로 이동합니다.

```js
router.push("/");
router.refresh();
```

## 직접 실습 순서

1. `lib/posts.js`에 `deletePost(id)`를 추가한다.
2. `app/api/post/[id]/route.js`에서 `deletePost`를 import한다.
3. 같은 파일에 `DELETE` 함수를 추가한다.
4. `app/detail/[id]/DeletePostButton.js` 파일을 만든다.
5. 삭제 버튼을 클라이언트 컴포넌트로 작성한다.
6. 버튼 클릭 시 confirm 창을 띄운다.
7. 확인하면 `DELETE /api/post/[id]` 요청을 보낸다.
8. 성공하면 홈으로 이동한다.
9. 상세 페이지에서 `<DeletePostButton id={id} />`를 렌더링한다.

## 확인 방법

상세 화면으로 이동합니다.

```txt
http://localhost:3000/detail/게시글id
```

`Delete` 버튼을 누르고 확인합니다.

성공하면 홈으로 이동하고, 삭제한 글이 목록에 보이지 않아야 합니다.

삭제된 상세 주소로 다시 접근하면 404 흐름으로 이동해야 합니다.

## 검증 명령

```bash
npm run lint
npm run build
```

## 이 단계의 핵심

삭제 기능은 서버 데이터 변경과 사용자 확인이 모두 필요한 기능입니다. 그래서 데이터 함수, API Route, 클라이언트 버튼을 함께 설계해야 합니다.
