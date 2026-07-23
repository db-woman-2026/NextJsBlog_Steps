# Step 17. 정렬 기능 추가하기

## 변경 내용

sort query string과 정렬 select를 추가해 최신순, 오래된순, 제목순 정렬을 서버에서 처리합니다.

- API가 `sort` query string을 받아 정렬 방식을 선택합니다.
- MongoDB query에서 최신순, 오래된순, 제목순 정렬을 처리합니다.
- 홈 화면에 정렬 select를 추가하고 정렬 변경 시 1페이지부터 다시 조회합니다.

## 시작 전 확인

개인 실습 저장소의 `main`에서 직전 단계까지 마친 상태로 시작합니다. 코드 블록은 복사해 붙이지 않고 직접 입력합니다.

수정 전에 `git status --short`의 출력이 없는지 확인합니다. 변경이 남아 있다면 원인을 확인하고 시작 상태를 정리합니다.

## 작업 1. 데이터 함수에 sort 옵션 추가

정렬은 화면에서 배열을 다시 정렬하기보다 DB 조회 조건에 넣어 처리합니다. `sort` 값에 따라 MongoDB sort 객체를 선택합니다.

### 수정할 파일

- 수정: `lib/posts.js`

### 입력할 코드

아래 파일 경로를 확인하고 각 파일의 전체 내용을 입력합니다. 삭제로 표시된 파일은 PowerShell에서 제거합니다.

#### `lib/posts.js`

`lib/posts.js`를 열고 파일 전체를 다음 내용으로 맞춥니다.

~~~js
import { ObjectId } from "mongodb";
import getMongoClient from "./mongodb";

const dbName = process.env.MONGODB_DB || "next_blog_practice";
const collectionName = "posts";

if (!dbName.startsWith("next_blog_")) {
  throw new Error("MONGODB_DB must start with next_blog_");
}

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

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export async function seedPostsIfEmpty() {
  const collection = await getPostsCollection();
  const count = await collection.countDocuments();

  if (count === 0) {
    await collection.insertMany(createSeedPosts());
  }
}

function buildPostQuery(keyword) {
  const searchKeyword = escapeRegex(keyword.trim());

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

function toPositiveInteger(value, fallback, max = Number.MAX_SAFE_INTEGER) {
  const number = Number(value);

  if (!Number.isInteger(number) || number < 1) {
    return fallback;
  }

  return Math.min(number, max);
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
  const requestedPage = toPositiveInteger(page, 1);
  const pageSize = toPositiveInteger(limit, 5, 20);
  const totalPosts = await collection.countDocuments(query);
  const totalPages = Math.max(Math.ceil(totalPosts / pageSize), 1);
  const currentPage = Math.min(requestedPage, totalPages);
  const skip = (currentPage - 1) * pageSize;

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
~~~

### 설명과 확인

- 기본값은 최신순입니다.
- 제목순은 `{ title: 1 }`로 오름차순 정렬합니다.

## 작업 2. API에서 sort query string 전달

`GET /api/post`가 URL의 sort 값을 읽어 `listPosts`에 넘깁니다. keyword/page/limit/sort가 모두 목록 조회 조건이 됩니다.

### 수정할 파일

- 수정: `app/api/post/route.js`

### 입력할 코드

아래 파일 경로를 확인하고 각 파일의 전체 내용을 입력합니다. 삭제로 표시된 파일은 PowerShell에서 제거합니다.

#### `app/api/post/route.js`

`app/api/post/route.js`를 열고 파일 전체를 다음 내용으로 맞춥니다.

~~~js
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
~~~

### 설명과 확인

- 지원하지 않는 값은 데이터 함수에서 기본 정렬로 처리합니다.
- query string이 늘어나도 응답 구조는 그대로 유지합니다.

## 작업 3. 홈 화면에 정렬 select 추가

사용자가 최신순, 오래된순, 제목순을 선택할 수 있도록 select를 추가합니다. 정렬이 바뀌면 결과 순서가 바뀌므로 첫 페이지부터 다시 조회합니다.

### 수정할 파일

- 수정: `app/page.js`

### 입력할 코드

아래 파일 경로를 확인하고 각 파일의 전체 내용을 입력합니다. 삭제로 표시된 파일은 PowerShell에서 제거합니다.

#### `app/page.js`

`app/page.js`를 열고 파일 전체를 다음 내용으로 맞춥니다.

~~~js
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
~~~

### 설명과 확인

- 정렬 상태도 `URLSearchParams`에 포함합니다.
- 정렬을 바꾸면 `loadPosts({ page: 1, ... })`로 첫 페이지를 다시 조회합니다.

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

- 정렬 select가 보인다.
- Oldest를 선택하면 오래된 글이 먼저 보인다.
- Title A-Z를 선택하면 제목순으로 보인다.

## 독립 확인

허용되지 않은 sort 값이 기본 정렬로 돌아가는지 확인합니다. 결과와 확인 방법을 한 문장으로 기록합니다. 실험값은 검사를 마치면 원래대로 복구합니다.

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
git commit -m "Complete Next.js step 17"
git push
git status --short --branch
```

현재 브랜치는 `main`이어야 합니다. 마지막 상태에서 `main...origin/main` 뒤에 `ahead`가 없고 작업 파일 목록도 비어 있어야 합니다.
