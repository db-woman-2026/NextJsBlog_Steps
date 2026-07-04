# Step 17. 정렬 기능

이 문서는 `step-16`에서 시작해 `step-17`를 완성하는 실습 자료입니다.
원본 개요는 [docs/overview/step-17.md](../overview/step-17.md)에 보존되어 있습니다.
실제 완성 코드는 [step-17 브랜치](https://github.com/db-woman-2026/NextJsBlog_Steps/tree/step-17) 기준입니다.

## 이번 단계 목표

sort query string과 정렬 select를 추가해 최신순, 오래된순, 제목순 정렬을 서버에서 처리합니다.

이번 단계에서 집중할 내용은 다음과 같습니다.

- sort query string을 API와 화면 상태에 연결합니다.
- MongoDB sort 조건을 최신순, 오래된순, 제목순으로 바꿉니다.
- 검색, 페이지네이션, 정렬이 함께 동작하게 URL을 조합합니다.

## 시작 기준

이전 단계인 `step-16` 브랜치까지 완료된 상태에서 시작합니다.

```bash
git switch step-16
# 실습용 브랜치를 직접 만들 경우
git switch -c practice-step-17
```

수업 저장소의 정답 브랜치를 바로 확인하려면 다음 명령을 사용할 수 있습니다.

```bash
git switch step-17
```

## 수정 파일

| 상태 | 파일 | 확인 링크 |
| --- | --- | --- |
| 수정 | `app/api/post/route.js` | [app/api/post/route.js](https://github.com/db-woman-2026/NextJsBlog_Steps/blob/step-17/app/api/post/route.js) |
| 수정 | `app/page.js` | [app/page.js](https://github.com/db-woman-2026/NextJsBlog_Steps/blob/step-17/app/page.js) |
| 수정 | `lib/posts.js` | [lib/posts.js](https://github.com/db-woman-2026/NextJsBlog_Steps/blob/step-17/lib/posts.js) |

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
    const sort = searchParams.get("sort") || "created-desc";
    const posts = await listPosts({ keyword, page, limit, sort });

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
const DEFAULT_SORT = "created-desc";

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

function buildPostsUrl({ keyword, page, sort }) {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(PAGE_SIZE),
    sort,
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
  const [sortOrder, setSortOrder] = useState(DEFAULT_SORT);

  async function loadPosts({
    page = 1,
    searchKeyword = serverKeyword,
    sortValue = sortOrder,
  } = {}) {
    setError("");
    setIsLoading(true);

    try {
      const data = await fetchPosts(
        buildPostsUrl({ keyword: searchKeyword, page, sort: sortValue }),
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
          buildPostsUrl({ keyword: "", page: 1, sort: DEFAULT_SORT }),
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

  async function handleSortChange(event) {
    const nextSortOrder = event.target.value;

    setSortOrder(nextSortOrder);
    setSearchMessage("Sorted posts from the server.");
    await loadPosts({
      page: 1,
      searchKeyword: serverKeyword,
      sortValue: nextSortOrder,
    });
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

        <label htmlFor="sortOrder">Sort posts:</label>
        <select
          id="sortOrder"
          value={sortOrder}
          onChange={handleSortChange}
          disabled={isLoading}
        >
          <option value="created-desc">Newest first</option>
          <option value="created-asc">Oldest first</option>
          <option value="title-asc">Title A-Z</option>
          <option value="title-desc">Title Z-A</option>
        </select>

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

function buildPostSort(sort) {
  switch (sort) {
    case "created-asc":
      return { createdAt: 1 };
    case "title-asc":
      return { title: 1 };
    case "title-desc":
      return { title: -1 };
    case "created-desc":
    default:
      return { createdAt: -1 };
  }
}

export async function listPosts({
  keyword = "",
  page = 1,
  limit = 5,
  sort = "created-desc",
} = {}) {
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
    .sort(buildPostSort(sort))
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

- 정렬 select를 바꿉니다.
- 최신순, 오래된순, 제목순에 따라 목록 순서가 바뀌는지 확인합니다.

## 자주 확인할 부분

- 파일 이름과 폴더 이름을 정확히 입력합니다. App Router에서는 `page.js`, `layout.js`, `route.js`, `not-found.js`, `error.js` 같은 파일명이 특별한 의미를 가집니다.
- 클라이언트 상태나 이벤트를 쓰는 파일에는 필요한 경우에만 `"use client";`를 둡니다. 서버에서 실행되어야 하는 MongoDB 코드는 클라이언트 컴포넌트로 가져오지 않습니다.
- API 응답은 가능한 한 `{ success, message, data }` 구조를 유지합니다. 화면 코드는 이 구조를 기준으로 `message`와 `data`를 읽습니다.
- 실습 중 막히면 먼저 이 문서의 코드 블록과 브랜치 링크의 실제 파일을 비교합니다.

## 개념 정리

아래 내용은 기존 단계 개요를 강의 문서 안에서도 바로 볼 수 있도록 가져온 것입니다. 코드 작성 후 다시 읽으면 각 변경의 이유를 확인하기 쉽습니다.

## 이 단계의 목표

`step-17`은 게시글 목록 정렬 기능을 추가하는 단계입니다.

`step-16`에서 페이지네이션을 추가했기 때문에, 정렬도 서버에서 처리하는 편이 자연스럽습니다. 정렬 기준이 바뀌면 MongoDB 조회 순서가 바뀌고, 첫 페이지부터 다시 보여줍니다.

이 단계에서는 다음을 구현합니다.

- `sort` query string을 API에서 읽는다.
- MongoDB `sort` 조건을 선택하는 함수를 만든다.
- 홈 화면에 정렬 select를 추가한다.
- 정렬 기준이 바뀌면 서버에서 1페이지를 다시 불러온다.
- 검색, 페이지네이션, 정렬 조건이 함께 동작하도록 만든다.

## 정렬 옵션

이 단계에서는 네 가지 정렬을 제공합니다.

| 값 | 의미 |
| --- | --- |
| `created-desc` | 최신순 |
| `created-asc` | 오래된순 |
| `title-asc` | 제목 A-Z |
| `title-desc` | 제목 Z-A |

기본값은 최신순입니다.

```js
const DEFAULT_SORT = "created-desc";
```

## MongoDB sort 조건 만들기

`lib/posts.js`에 정렬 조건을 만드는 함수를 추가합니다.

```js
function buildPostSort(sort) {
  switch (sort) {
    case "created-asc":
      return { createdAt: 1 };
    case "title-asc":
      return { title: 1 };
    case "title-desc":
      return { title: -1 };
    case "created-desc":
    default:
      return { createdAt: -1 };
  }
}
```

MongoDB에서 `1`은 오름차순, `-1`은 내림차순입니다.

## listPosts에 sort 추가

`listPosts` 옵션 객체에 `sort`를 추가합니다.

```js
export async function listPosts({
  keyword = "",
  page = 1,
  limit = 5,
  sort = "created-desc",
} = {}) {
  // ...
}
```

조회할 때 고정된 최신순 대신 선택된 정렬 조건을 사용합니다.

```js
.sort(buildPostSort(sort))
```

## API Route에서 sort 읽기

`app/api/post/route.js`에서 query string을 읽습니다.

```js
const sort = searchParams.get("sort") || "created-desc";
const posts = await listPosts({ keyword, page, limit, sort });
```

이제 API 주소는 다음처럼 사용할 수 있습니다.

```txt
/api/post?page=1&limit=5&sort=title-asc
```

검색과 함께 사용할 수도 있습니다.

```txt
/api/post?keyword=react&page=1&limit=5&sort=created-desc
```

## 홈 화면 select

정렬 기준은 select로 선택합니다.

```jsx
<select
  id="sortOrder"
  value={sortOrder}
  onChange={handleSortChange}
  disabled={isLoading}
>
  <option value="created-desc">Newest first</option>
  <option value="created-asc">Oldest first</option>
  <option value="title-asc">Title A-Z</option>
  <option value="title-desc">Title Z-A</option>
</select>
```

`sortOrder` 상태는 현재 선택된 정렬 기준입니다.

```js
const [sortOrder, setSortOrder] = useState(DEFAULT_SORT);
```

## 정렬 변경 처리

정렬 기준이 바뀌면 1페이지부터 다시 불러옵니다.

```js
async function handleSortChange(event) {
  const nextSortOrder = event.target.value;

  setSortOrder(nextSortOrder);
  setSearchMessage("Sorted posts from the server.");
  await loadPosts({
    page: 1,
    searchKeyword: serverKeyword,
    sortValue: nextSortOrder,
  });
}
```

정렬 기준을 바꿨는데 기존 페이지 번호를 유지하면 사용자가 예상하기 어려울 수 있습니다. 그래서 1페이지로 돌아갑니다.

## URL 만들기

홈 화면의 `buildPostsUrl` 함수도 정렬 조건을 포함합니다.

```js
function buildPostsUrl({ keyword, page, sort }) {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(PAGE_SIZE),
    sort,
  });

  if (keyword) {
    params.set("keyword", keyword);
  }

  return `/api/post?${params.toString()}`;
}
```

`URLSearchParams`를 사용하면 query string을 직접 문자열로 이어 붙이는 것보다 안전합니다.

## 직접 실습 순서

1. `lib/posts.js`에 `buildPostSort` 함수를 만든다.
2. `listPosts` 옵션에 `sort`를 추가한다.
3. MongoDB 조회의 `.sort()`에 `buildPostSort(sort)`를 사용한다.
4. API Route에서 `sort` query string을 읽는다.
5. 홈 화면에 `DEFAULT_SORT`와 `sortOrder` 상태를 만든다.
6. `buildPostsUrl`이 `sort`를 포함하도록 수정한다.
7. 정렬 select를 추가한다.
8. `handleSortChange`에서 정렬 기준을 바꾸고 서버 목록을 다시 불러온다.

## 확인 방법

홈 화면에서 정렬 select를 바꿉니다.

```txt
http://localhost:3000/
```

최신순, 오래된순, 제목순이 각각 다르게 보이면 성공입니다.

서버 검색을 한 뒤에도 정렬 기준이 유지되는지 확인합니다.

## 검증 명령

```bash
npm run lint
npm run build
```

## 이 단계의 핵심

페이지네이션이 있는 목록에서는 정렬도 서버에서 처리하는 것이 자연스럽습니다. 그래야 모든 데이터 기준으로 정렬한 뒤 해당 페이지를 가져올 수 있습니다.
