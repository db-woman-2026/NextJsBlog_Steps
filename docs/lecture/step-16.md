# Step 16. 페이지네이션

이 문서는 `step-15`에서 시작해 `step-16`를 완성하는 실습 자료입니다.
원본 개요는 [docs/overview/step-16.md](../overview/step-16.md)에 보존되어 있습니다.
실제 완성 코드는 [step-16 브랜치](https://github.com/db-woman-2026/NextJsBlog_Steps/tree/step-16) 기준입니다.

## 이번 단계 목표

page와 limit query string, MongoDB skip/limit, Previous/Next 버튼으로 페이지네이션을 구현합니다.

이번 단계에서 집중할 내용은 다음과 같습니다.

- page와 limit 값을 API에서 숫자로 정리합니다.
- MongoDB skip과 limit으로 한 페이지 분량만 가져옵니다.
- totalPages 값을 사용해 Previous/Next 버튼을 제어합니다.

## 시작 기준

이전 단계인 `step-15` 브랜치까지 완료된 상태에서 시작합니다.

```bash
git switch step-15
# 실습용 브랜치를 직접 만들 경우
git switch -c practice-step-16
```

수업 저장소의 정답 브랜치를 바로 확인하려면 다음 명령을 사용할 수 있습니다.

```bash
git switch step-16
```

## 수정 파일

| 상태 | 파일 | 확인 링크 |
| --- | --- | --- |
| 수정 | `app/api/post/route.js` | [app/api/post/route.js](https://github.com/db-woman-2026/NextJsBlog_Steps/blob/step-16/app/api/post/route.js) |
| 수정 | `app/page.js` | [app/page.js](https://github.com/db-woman-2026/NextJsBlog_Steps/blob/step-16/app/page.js) |
| 수정 | `lib/posts.js` | [lib/posts.js](https://github.com/db-woman-2026/NextJsBlog_Steps/blob/step-16/lib/posts.js) |

문서 파일은 이 강의 자료에서 별도로 관리하므로 위 표에는 기능 구현에 필요한 코드와 설정 파일만 넣었습니다.

## 코드 작성

아래 순서대로 파일을 만들거나 수정합니다. 각 코드 블록은 해당 단계 브랜치의 실제 파일 내용을 기준으로 합니다.

### 1. app/api/post/route.js

기존 `app/api/post/route.js` 파일을 열고 아래 최종 코드와 같게 수정합니다.

서버에서 실행되는 API Route입니다. 브라우저 화면 코드가 이 주소로 요청을 보내 데이터를 읽거나 변경합니다.

```jsx
import { apiError, apiSuccess } from "@/lib/apiResponse";
import { createPost, listPosts } from "@/lib/posts";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const keyword = searchParams.get("keyword") || "";
    const page = searchParams.get("page") || "1";
    const limit = searchParams.get("limit") || "5";
    const posts = await listPosts({ keyword, page, limit });

    return apiSuccess(posts, "Posts fetched successfully");
  } catch (error) {
    console.error("Error fetching posts:", error);
    return apiError("Internal Server Error", 500);
  }
}

export async function POST(request) {
  try {
    const postData = await request.json();
    const title =
      typeof postData.title === "string" ? postData.title.trim() : "";
    const content =
      typeof postData.content === "string" ? postData.content.trim() : "";

    if (!title || !content) {
      return apiError("Title and content are required", 400);
    }

    const result = await createPost({
      title,
      content,
      image: postData.image,
    });

    return apiSuccess(
      { postId: result.insertedId },
      "Post created successfully",
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating post:", error);
    return apiError("Internal Server Error", 500);
  }
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

const PAGE_SIZE = 5;

function formatDate(dateValue) {
  if (!dateValue) {
    return "";
  }

  return new Date(dateValue).toLocaleString("ko-KR");
}

function postMatchesKeyword(post, keyword) {
  const title = post.title || "";
  const content = post.content || "";
  const lowerKeyword = keyword.toLowerCase();

  return (
    title.toLowerCase().includes(lowerKeyword) ||
    content.toLowerCase().includes(lowerKeyword)
  );
}

async function fetchPosts(url) {
  const response = await fetch(url, { cache: "no-store" });
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to fetch posts");
  }

  return result.data;
}

function buildPostsUrl({ keyword, page }) {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(PAGE_SIZE),
  });

  if (keyword) {
    params.set("keyword", keyword);
  }

  return `/api/post?${params.toString()}`;
}

export default function Home() {
  const [allPosts, setAllPosts] = useState([]);
  const [posts, setPosts] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [keyword, setKeyword] = useState("");
  const [searchMessage, setSearchMessage] = useState("");
  const [serverKeyword, setServerKeyword] = useState("");

  async function loadPosts({ page = 1, searchKeyword = serverKeyword } = {}) {
    setError("");
    setIsLoading(true);

    try {
      const data = await fetchPosts(
        buildPostsUrl({ keyword: searchKeyword, page }),
      );
      setAllPosts(data.posts);
      setPosts(data.posts);
      setPagination(data.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch posts");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    async function loadInitialPosts() {
      try {
        const data = await fetchPosts(
          buildPostsUrl({ keyword: "", page: 1 }),
        );
        setAllPosts(data.posts);
        setPosts(data.posts);
        setPagination(data.pagination);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch posts");
      } finally {
        setIsLoading(false);
      }
    }

    loadInitialPosts();
  }, []);

  function handleClientFilter() {
    const searchKeyword = keyword.trim();

    setError("");

    if (!searchKeyword) {
      setPosts(allPosts);
      setSearchMessage(
        "Showing current page posts because the search keyword is empty.",
      );
      return;
    }

    const filteredPosts = allPosts.filter((post) =>
      postMatchesKeyword(post, searchKeyword),
    );

    setPosts(filteredPosts);
    setSearchMessage(
      `Client filter result on this page: ${filteredPosts.length} posts`,
    );
  }

  async function handleServerSearch() {
    const searchKeyword = keyword.trim();

    setServerKeyword(searchKeyword);
    setSearchMessage(
      searchKeyword
        ? `Server search result for "${searchKeyword}"`
        : "Server search with empty keyword shows all posts.",
    );
    await loadPosts({ page: 1, searchKeyword });
  }

  async function handleShowAll() {
    setKeyword("");
    setServerKeyword("");
    setSearchMessage("");
    await loadPosts({ page: 1, searchKeyword: "" });
  }

  async function handlePageChange(nextPage) {
    await loadPosts({ page: nextPage, searchKeyword: serverKeyword });
  }

  return (
    <main>
      <form onSubmit={(event) => event.preventDefault()}>
        <label htmlFor="keyword">Search posts:</label>
        <input
          type="search"
          id="keyword"
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
          disabled={isLoading}
        />

        <button type="button" onClick={handleClientFilter} disabled={isLoading}>
          Client Filter
        </button>
        <button type="button" onClick={handleServerSearch} disabled={isLoading}>
          Server Search
        </button>
        <button type="button" onClick={handleShowAll} disabled={isLoading}>
          Show All
        </button>
      </form>

      {searchMessage && <p>{searchMessage}</p>}
      {isLoading && <p>Loading posts...</p>}
      {error && <p role="alert">{error}</p>}
      {!isLoading && !error && posts.length === 0 && <p>No posts found.</p>}
      {!isLoading && !error && (
        <>
          <section className={styles.articleList} aria-label="Blog posts">
            {posts.map((post) => (
              <article key={post._id} className={styles.article}>
                <Link href={`/detail/${post._id}`}>{post.title}</Link>
                <p>Created: {formatDate(post.createdAt)}</p>
                {post.updatedAt && (
                  <p>Updated: {formatDate(post.updatedAt)}</p>
                )}
              </article>
            ))}
          </section>

          {pagination && (
            <nav aria-label="Pagination">
              <button
                type="button"
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={isLoading || !pagination.hasPreviousPage}
              >
                Previous
              </button>
              <span>
                Page {pagination.page} of {pagination.totalPages} (
                {pagination.totalPosts} posts)
              </span>
              <button
                type="button"
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={isLoading || !pagination.hasNextPage}
              >
                Next
              </button>
            </nav>
          )}
        </>
      )}
    </main>
  );
}
```

### 3. lib/posts.js

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

function buildPostQuery(keyword) {
  const searchKeyword = keyword.trim();

  if (!searchKeyword) {
    return {};
  }

  return {
    $or: [
      { title: { $regex: searchKeyword, $options: "i" } },
      { content: { $regex: searchKeyword, $options: "i" } },
    ],
  };
}

export async function listPosts({ keyword = "", page = 1, limit = 5 } = {}) {
  await seedPostsIfEmpty();

  const collection = await getPostsCollection();
  const query = buildPostQuery(keyword);
  const currentPage = Math.max(Number(page) || 1, 1);
  const pageSize = Math.min(Math.max(Number(limit) || 5, 1), 20);
  const skip = (currentPage - 1) * pageSize;
  const totalPosts = await collection.countDocuments(query);
  const totalPages = Math.max(Math.ceil(totalPosts / pageSize), 1);

  const posts = await collection
    .find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(pageSize)
    .toArray();

  return {
    posts,
    pagination: {
      page: currentPage,
      limit: pageSize,
      totalPosts,
      totalPages,
      hasPreviousPage: currentPage > 1,
      hasNextPage: currentPage < totalPages,
    },
  };
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

- 게시글을 limit보다 많이 준비한 뒤 Previous/Next 버튼을 누릅니다.
- 첫 페이지에서 Previous가 비활성화되고 마지막 페이지에서 Next가 비활성화되는지 확인합니다.

## 자주 확인할 부분

- 파일 이름과 폴더 이름을 정확히 입력합니다. App Router에서는 `page.js`, `layout.js`, `route.js`, `not-found.js`, `error.js` 같은 파일명이 특별한 의미를 가집니다.
- 클라이언트 상태나 이벤트를 쓰는 파일에는 필요한 경우에만 `"use client";`를 둡니다. 서버에서 실행되어야 하는 MongoDB 코드는 클라이언트 컴포넌트로 가져오지 않습니다.
- API 응답은 가능한 한 `{ success, message, data }` 구조를 유지합니다. 화면 코드는 이 구조를 기준으로 `message`와 `data`를 읽습니다.
- 실습 중 막히면 먼저 이 문서의 코드 블록과 브랜치 링크의 실제 파일을 비교합니다.

## 개념 정리

아래 내용은 기존 단계 개요를 강의 문서 안에서도 바로 볼 수 있도록 가져온 것입니다. 코드 작성 후 다시 읽으면 각 변경의 이유를 확인하기 쉽습니다.

## 이 단계의 목표

`step-16`은 게시글 목록에 페이지네이션을 추가하는 단계입니다.

검색 기능까지 추가하면 게시글 목록은 점점 커질 수 있습니다. 모든 글을 한 번에 가져오면 데이터가 많아질수록 느려질 수 있습니다.

이 단계에서는 다음을 구현합니다.

- `GET /api/post?page=1&limit=5` 형식의 query string을 지원한다.
- MongoDB에서 `skip`, `limit`으로 일부 게시글만 가져온다.
- 전체 게시글 수와 전체 페이지 수를 계산한다.
- API 응답의 `data` 안에 `posts`와 `pagination`을 담는다.
- 홈 화면에 `Previous`, `Next` 버튼을 추가한다.
- 서버 검색 결과도 페이지 단위로 볼 수 있게 한다.

## API 응답 형식은 그대로 유지한다

이 프로젝트의 API 응답은 `step-4`부터 같은 최상위 형식을 사용합니다.

```json
{
  "success": true,
  "message": "Posts fetched successfully",
  "data": {}
}
```

페이지네이션을 추가해도 이 최상위 형식은 바꾸지 않습니다.

대신 `data` 내부 구조가 배열에서 객체로 확장됩니다.

```json
{
  "success": true,
  "message": "Posts fetched successfully",
  "data": {
    "posts": [],
    "pagination": {
      "page": 1,
      "limit": 5,
      "totalPosts": 10,
      "totalPages": 2,
      "hasPreviousPage": false,
      "hasNextPage": true
    }
  }
}
```

## listPosts 옵션 객체

`lib/posts.js`의 `listPosts`는 옵션 객체를 받도록 바꿉니다.

```js
export async function listPosts({ keyword = "", page = 1, limit = 5 } = {}) {
  // ...
}
```

검색어, 현재 페이지, 페이지 크기를 함께 다루기 위해서입니다.

## 검색 조건 분리

검색 조건은 별도 함수로 분리합니다.

```js
function buildPostQuery(keyword) {
  const searchKeyword = keyword.trim();

  if (!searchKeyword) {
    return {};
  }

  return {
    $or: [
      { title: { $regex: searchKeyword, $options: "i" } },
      { content: { $regex: searchKeyword, $options: "i" } },
    ],
  };
}
```

검색어가 없으면 빈 조건 `{}`을 반환합니다. MongoDB에서 빈 조건은 전체 문서 조회를 의미합니다.

## page와 limit 정리

query string으로 받은 값은 문자열입니다. 그래서 숫자로 바꿔야 합니다.

```js
const currentPage = Math.max(Number(page) || 1, 1);
const pageSize = Math.min(Math.max(Number(limit) || 5, 1), 20);
```

`page`는 최소 1입니다.

`limit`은 최소 1, 최대 20으로 제한합니다. 사용자가 너무 큰 값을 보내도 한 번에 과도한 데이터를 가져오지 않게 하기 위해서입니다.

## skip과 limit

MongoDB에서 일부 문서만 가져올 때 `skip`과 `limit`을 사용합니다.

```js
const skip = (currentPage - 1) * pageSize;
```

예를 들어 페이지 크기가 5일 때:

| page | skip | 가져오는 범위 |
| --- | --- | --- |
| 1 | 0 | 1번째부터 5개 |
| 2 | 5 | 6번째부터 5개 |
| 3 | 10 | 11번째부터 5개 |

실제 조회는 다음처럼 합니다.

```js
const posts = await collection
  .find(query)
  .sort({ createdAt: -1 })
  .skip(skip)
  .limit(pageSize)
  .toArray();
```

## 전체 개수 세기

페이지 정보를 만들려면 전체 게시글 수가 필요합니다.

```js
const totalPosts = await collection.countDocuments(query);
const totalPages = Math.max(Math.ceil(totalPosts / pageSize), 1);
```

검색어가 있으면 검색 조건에 맞는 글의 개수를 셉니다.

## API Route 수정

`app/api/post/route.js`에서 page와 limit을 읽습니다.

```js
const page = searchParams.get("page") || "1";
const limit = searchParams.get("limit") || "5";
const posts = await listPosts({ keyword, page, limit });
```

## 홈 화면 상태

홈 화면에는 페이지 정보를 담는 상태를 추가합니다.

```js
const [pagination, setPagination] = useState(null);
```

API 응답을 받으면 게시글과 페이지 정보를 각각 저장합니다.

```js
setAllPosts(data.posts);
setPosts(data.posts);
setPagination(data.pagination);
```

## 페이지 이동 버튼

페이지 정보가 있으면 버튼을 보여줍니다.

```jsx
<button
  type="button"
  onClick={() => handlePageChange(pagination.page - 1)}
  disabled={isLoading || !pagination.hasPreviousPage}
>
  Previous
</button>
```

다음 버튼도 같은 방식입니다.

```jsx
<button
  type="button"
  onClick={() => handlePageChange(pagination.page + 1)}
  disabled={isLoading || !pagination.hasNextPage}
>
  Next
</button>
```

이전 페이지가 없으면 `Previous`를 비활성화하고, 다음 페이지가 없으면 `Next`를 비활성화합니다.

## 검색과 페이지네이션

서버 검색을 한 뒤 다음 페이지로 이동할 때도 같은 검색어를 유지해야 합니다.

그래서 마지막 서버 검색어를 `serverKeyword` 상태로 저장합니다.

```js
const [serverKeyword, setServerKeyword] = useState("");
```

페이지 변경 시 이 값을 다시 API 요청에 넣습니다.

```js
await loadPosts({ page: nextPage, searchKeyword: serverKeyword });
```

## 직접 실습 순서

1. `lib/posts.js`에서 검색 조건을 만드는 `buildPostQuery` 함수를 만든다.
2. `listPosts`가 `{ keyword, page, limit }` 옵션 객체를 받도록 바꾼다.
3. `countDocuments`, `skip`, `limit`을 사용해 페이지 단위 결과를 만든다.
4. API Route에서 `page`, `limit` query string을 읽는다.
5. 홈 화면의 `fetchPosts` 결과가 `{ posts, pagination }` 구조임을 반영한다.
6. `pagination` 상태를 추가한다.
7. `Previous`, `Next` 버튼을 만든다.
8. 서버 검색어를 유지하면서 페이지를 이동한다.

## 확인 방법

홈 화면을 엽니다.

```txt
http://localhost:3000/
```

게시글이 5개씩 보이고, `Next` 버튼으로 다음 페이지로 이동할 수 있어야 합니다.

검색어를 입력하고 `Server Search`를 누른 뒤에도 페이지 버튼이 검색 결과 기준으로 동작해야 합니다.

## 검증 명령

```bash
npm run lint
npm run build
```

## 이 단계의 핵심

페이지네이션은 단순한 버튼 UI가 아니라 API, DB 조회 방식, 화면 상태가 함께 바뀌는 기능입니다. 검색 이후에 추가해야 검색 결과도 페이지 단위로 다룰 수 있습니다.
