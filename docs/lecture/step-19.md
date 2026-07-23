# Step 19. 게시글 카테고리 추가하기

## 변경 내용

게시글 카테고리를 데이터, 작성/수정 form, 목록 필터, 상세 표시까지 전체 흐름에 연결합니다.

- 게시글 데이터에 category 필드를 추가하고 기본값을 둡니다.
- 저장할 category는 `general`, `notice`, `daily`, `tech` 중 하나로 제한합니다.
- 작성/수정 form에 카테고리 select를 추가합니다.
- 목록 API와 홈 화면에 카테고리 필터를 연결하고 상세 화면에 카테고리를 표시합니다.

## 시작 전 확인

개인 실습 저장소의 `main`에서 직전 단계까지 마친 상태로 시작합니다. 코드 블록은 복사해 붙이지 않고 직접 입력합니다.

수정 전에 `git status --short`의 출력이 없는지 확인합니다. 변경이 남아 있다면 원인을 확인하고 시작 상태를 정리합니다.

## 작업 1. 데이터 계층에 category 필드 반영

새 글, 샘플 글, 수정 글 모두 같은 category 규칙을 가져야 합니다. 이전 단계에서 만든 기존 게시글에는 아직 category가 없을 수 있으므로, 목록을 조회할 때 누락된 값을 `general`로 보정해 화면과 필터가 안정적으로 동작하게 합니다. API를 직접 호출해 임의의 category를 보내도 허용 목록 밖의 값은 저장하지 않습니다.

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
const postCategories = ["general", "notice", "daily", "tech"];

function normalizeCategory(category) {
  const normalized = typeof category === "string" ? category.trim() : "";
  return postCategories.includes(normalized) ? normalized : "general";
}

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
    category: postCategories[index % postCategories.length],
  }));
}

async function getPostsCollection() {
  const client = await getMongoClient();
  return client.db(dbName).collection(collectionName);
}

async function ensurePostCategories(collection) {
  await collection.updateMany(
    {
      $or: [
        { category: { $exists: false } },
        { category: null },
        { category: "" },
      ],
    },
    { $set: { category: "general" } },
  );
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

function buildPostQuery(keyword, category) {
  const searchKeyword = escapeRegex(keyword.trim());
  const selectedCategory = category.trim();
  const query = {};

  if (searchKeyword) {
    query.$or = [
      { title: { $regex: searchKeyword, $options: "i" } },
      { content: { $regex: searchKeyword, $options: "i" } },
    ];
  }

  if (selectedCategory && selectedCategory !== "all") {
    query.category = selectedCategory;
  }

  return query;
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
  category = "all",
} = {}) {
  await seedPostsIfEmpty();

  const collection = await getPostsCollection();
  await ensurePostCategories(collection);

  const query = buildPostQuery(keyword, category);
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
    category: normalizeCategory(postData.category),
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
        category: normalizeCategory(postData.category),
        updatedAt: new Date(),
      },
    },
  );
}
~~~

### 설명과 확인

- 샘플 데이터에도 category가 들어가야 필터를 바로 테스트할 수 있습니다.
- 이전 단계에서 이미 만든 게시글은 category가 없을 수 있으므로 목록 조회 전에 `general`로 보정합니다.
- 작성/수정 category가 허용 목록에 없거나 비어 있으면 `general`로 저장합니다.
- 검색 조건과 카테고리 조건은 동시에 적용됩니다.

## 작업 2. API 요청/응답에 category 연결

작성, 수정, 목록 API가 category를 이해하도록 route handler를 수정합니다. 목록 API는 `category` query string을 받아 필터링합니다.

### 수정할 파일

- 수정: `app/api/post/route.js`
- 수정: [app/api/post/[id]/route.js](../../app/api/post/%5Bid%5D/route.js)

### 입력할 코드

아래 파일 경로를 확인하고 각 파일의 전체 내용을 입력합니다. 삭제로 표시된 파일은 PowerShell에서 제거합니다.

#### `app/api/post/[id]/route.js`

`app/api/post/[id]/route.js`를 열고 파일 전체를 다음 내용으로 맞춥니다.

~~~js
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

    const result = await updatePost(id, {
      title,
      content,
      category: postData.category,
    });

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
~~~

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
    const category = searchParams.get("category") || "all";
    const posts = await listPosts({ keyword, page, limit, sort, category });

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
      category: postData.category,
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

- 작성/수정 요청 body의 category가 문자열이면 사용하고 아니면 `general`을 사용합니다.
- 목록 API는 `category=all` 또는 빈 값이면 전체를 보여줍니다.

## 작업 3. 홈 목록에 카테고리 필터와 표시 추가

홈 화면에서 카테고리 select를 추가하고 query string에 포함합니다. 게시글 카드에도 현재 글의 카테고리를 표시합니다.

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
const CATEGORY_FILTERS = [
  { value: "all", label: "All categories" },
  { value: "general", label: "General" },
  { value: "notice", label: "Notice" },
  { value: "daily", label: "Daily" },
  { value: "tech", label: "Tech" },
];

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

function buildPostsUrl({ keyword, page, sort, category }) {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(PAGE_SIZE),
    sort,
  });

  if (keyword) {
    params.set("keyword", keyword);
  }

  if (category && category !== "all") {
    params.set("category", category);
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
  const [categoryFilter, setCategoryFilter] = useState("all");

  async function loadPosts({
    page = 1,
    searchKeyword = serverKeyword,
    sortValue = sortOrder,
    categoryValue = categoryFilter,
  } = {}) {
    setError("");
    setIsLoading(true);

    try {
      const data = await fetchPosts(
        buildPostsUrl({
          keyword: searchKeyword,
          page,
          sort: sortValue,
          category: categoryValue,
        }),
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
          buildPostsUrl({
            keyword: "",
            page: 1,
            sort: DEFAULT_SORT,
            category: "all",
          }),
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
    setCategoryFilter("all");
    setSearchMessage("");
    await loadPosts({ page: 1, searchKeyword: "", categoryValue: "all" });
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

  async function handleCategoryChange(event) {
    const nextCategory = event.target.value;

    setCategoryFilter(nextCategory);
    setSearchMessage(
      nextCategory === "all"
        ? "Showing all categories."
        : `Showing ${nextCategory} posts.`,
    );
    await loadPosts({
      page: 1,
      searchKeyword: serverKeyword,
      categoryValue: nextCategory,
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

        <label htmlFor="categoryFilter">Category:</label>
        <select
          id="categoryFilter"
          value={categoryFilter}
          onChange={handleCategoryChange}
          disabled={isLoading}
        >
          {CATEGORY_FILTERS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

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
                <p>Category: {post.category || "general"}</p>
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

- 카테고리 변경 시 검색/정렬 변경과 마찬가지로 1페이지로 돌아갑니다.
- 필터 조건이 늘어나도 API 요청 구성은 `URLSearchParams`로 관리합니다.

## 작업 4. 작성/수정/상세 화면에 category 반영

작성/수정 form에서 선택한 category를 요청 본문에 넣고, 상세 화면에는 저장된 category를 표시합니다.

### 수정할 파일

- 수정: `app/post/page.js`
- 수정: [app/post/[id]/page.js](../../app/post/%5Bid%5D/page.js)
- 수정: [app/detail/[id]/page.js](../../app/detail/%5Bid%5D/page.js)

### 입력할 코드

아래 파일 경로를 확인하고 각 파일의 전체 내용을 입력합니다. 삭제로 표시된 파일은 PowerShell에서 제거합니다.

#### `app/detail/[id]/page.js`

`app/detail/[id]/page.js`를 열고 파일 전체를 다음 내용으로 맞춥니다.

~~~js
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
        <p>Category: {post.category || "general"}</p>
        <p>Created: {formatDate(post.createdAt)}</p>
        {post.updatedAt && <p>Updated: {formatDate(post.updatedAt)}</p>}
        <pre className={styles.content}>{post.content}</pre>
      </article>
      <Link href={`/post/${id}`}>Edit</Link>
      <DeletePostButton id={id} />
    </main>
  );
}
~~~

#### `app/post/[id]/page.js`

`app/post/[id]/page.js`를 열고 파일 전체를 다음 내용으로 맞춥니다.

~~~js
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import styles from "../page.module.css";

const CATEGORY_OPTIONS = [
  { value: "general", label: "General" },
  { value: "notice", label: "Notice" },
  { value: "daily", label: "Daily" },
  { value: "tech", label: "Tech" },
];

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

        <label htmlFor="category">Category:</label>
        <select
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

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Updating..." : "Update Post"}
        </button>
      </form>
    </main>
  );
}
~~~

#### `app/post/page.js`

`app/post/page.js`를 열고 파일 전체를 다음 내용으로 맞춥니다.

~~~js
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";

const CATEGORY_OPTIONS = [
  { value: "general", label: "General" },
  { value: "notice", label: "Notice" },
  { value: "daily", label: "Daily" },
  { value: "tech", label: "Tech" },
];

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

        <label htmlFor="category">Category:</label>
        <select
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

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create Post"}
        </button>
      </form>
    </main>
  );
}
~~~

### 설명과 확인

- 작성 화면은 category 초기값을 `general`로 둡니다.
- 수정 화면은 기존 게시글의 category를 불러와 select 값으로 사용합니다.
- 상세 화면은 제목 주변에 category를 표시합니다.

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

- 작성 화면에서 category를 선택해 저장한다.
- 홈에서 category 필터를 바꾸면 목록이 바뀐다.
- 상세 화면에 category가 보인다.
- API를 직접 호출해 허용되지 않은 category를 보내면 `general`로 저장된다. 확인용 게시글은 테스트 뒤 삭제한다.

## 독립 확인

허용되지 않은 category 입력이 저장되지 않는지 확인합니다. 결과와 확인 방법을 한 문장으로 기록합니다. 실험값은 검사를 마치면 원래대로 복구합니다.

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
git commit -m "Complete Next.js step 19"
git push
git status --short --branch
```

현재 브랜치는 `main`이어야 합니다. 마지막 상태에서 `main...origin/main` 뒤에 `ahead`가 없고 작업 파일 목록도 비어 있어야 합니다.
