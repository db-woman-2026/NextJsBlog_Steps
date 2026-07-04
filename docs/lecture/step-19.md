# Step 19. 카테고리

이 문서는 `step-18`에서 시작해 `step-19`를 완성하는 실습 자료입니다.
원본 개요는 [docs/overview/step-19.md](../overview/step-19.md)에 보존되어 있습니다.
실제 완성 코드는 [step-19 브랜치](https://github.com/db-woman-2026/NextJsBlog_Steps/tree/step-19) 기준입니다.

## 이번 단계 목표

게시글 카테고리를 데이터, 작성/수정 form, 목록 필터, 상세 표시까지 전체 흐름에 연결합니다.

이번 단계에서 집중할 내용은 다음과 같습니다.

- 게시글 데이터에 category 기본값을 추가합니다.
- 작성/수정 form에서 카테고리를 선택하게 합니다.
- 목록 필터와 검색 조건에 category를 연결합니다.

## 시작 기준

이전 단계인 `step-18` 브랜치까지 완료된 상태에서 시작합니다.

```bash
git switch step-18
# 실습용 브랜치를 직접 만들 경우
git switch -c practice-step-19
```

수업 저장소의 정답 브랜치를 바로 확인하려면 다음 명령을 사용할 수 있습니다.

```bash
git switch step-19
```

## 수정 파일

| 상태 | 파일 | 확인 링크 |
| --- | --- | --- |
| 수정 | `README.md` | [README.md](https://github.com/db-woman-2026/NextJsBlog_Steps/blob/step-19/README.md) |
| 수정 | `app/api/post/[id]/route.js` | [app/api/post/[id]/route.js](https://github.com/db-woman-2026/NextJsBlog_Steps/blob/step-19/app/api/post/%5Bid%5D/route.js) |
| 수정 | `app/api/post/route.js` | [app/api/post/route.js](https://github.com/db-woman-2026/NextJsBlog_Steps/blob/step-19/app/api/post/route.js) |
| 수정 | `app/detail/[id]/page.js` | [app/detail/[id]/page.js](https://github.com/db-woman-2026/NextJsBlog_Steps/blob/step-19/app/detail/%5Bid%5D/page.js) |
| 수정 | `app/page.js` | [app/page.js](https://github.com/db-woman-2026/NextJsBlog_Steps/blob/step-19/app/page.js) |
| 수정 | `app/post/[id]/page.js` | [app/post/[id]/page.js](https://github.com/db-woman-2026/NextJsBlog_Steps/blob/step-19/app/post/%5Bid%5D/page.js) |
| 수정 | `app/post/page.js` | [app/post/page.js](https://github.com/db-woman-2026/NextJsBlog_Steps/blob/step-19/app/post/page.js) |
| 수정 | `lib/posts.js` | [lib/posts.js](https://github.com/db-woman-2026/NextJsBlog_Steps/blob/step-19/lib/posts.js) |

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

전체 단계 개요는 `/docs/overview/index.md`에 있고, 실습형 강의 자료는 `/docs/lecture/index.md`와 `/docs/lecture/step-N.md`에 있습니다.

## Stack

- Next.js 16
- React 19
- MongoDB Node.js Driver 7
- ESLint 9 flat config
- simple.css

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

### 2. app/api/post/[id]/route.js

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
```

### 3. app/api/post/route.js

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
```

### 4. app/detail/[id]/page.js

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
```

### 5. app/page.js

기존 `app/page.js` 파일을 열고 아래 최종 코드와 같게 수정합니다.

홈 화면입니다. 단계가 진행되면서 소개 화면에서 게시글 목록, 검색, 페이지네이션, 정렬 UI로 확장됩니다.

```jsx
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
```

### 6. app/post/[id]/page.js

기존 `app/post/[id]/page.js` 파일을 열고 아래 최종 코드와 같게 수정합니다.

게시글 작성 또는 수정 화면입니다. form 상태와 API 요청 흐름을 집중해서 봅니다.

```jsx
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
```

### 7. app/post/page.js

기존 `app/post/page.js` 파일을 열고 아래 최종 코드와 같게 수정합니다.

게시글 작성 또는 수정 화면입니다. form 상태와 API 요청 흐름을 집중해서 봅니다.

```jsx
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
```

### 8. lib/posts.js

기존 `lib/posts.js` 파일을 열고 아래 최종 코드와 같게 수정합니다.

서버 로직을 재사용하기 위해 분리한 helper 파일입니다. 페이지나 API가 직접 복잡한 DB 코드를 반복하지 않게 합니다.

```js
import { ObjectId } from "mongodb";
import getMongoClient from "./mongodb";

const dbName = process.env.MONGODB_DB || "blog";
const collectionName = "posts";
const seedCategories = ["general", "notice", "daily", "tech"];

function normalizeCategory(category) {
  return typeof category === "string" && category.trim()
    ? category.trim()
    : "general";
}

function createSeedPosts() {
  return Array.from({ length: 10 }, (_, index) => ({
    createdAt: new Date(),
    title: `Blog Post ${index + 1}`,
    content:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
    image: "https://picsum.photos/100",
    category: seedCategories[index % seedCategories.length],
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

function buildPostQuery(keyword, category) {
  const searchKeyword = keyword.trim();
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

export async function listPosts({
  keyword = "",
  page = 1,
  limit = 5,
  sort = "created-desc",
  category = "all",
} = {}) {
  await seedPostsIfEmpty();

  const collection = await getPostsCollection();
  const query = buildPostQuery(keyword, category);
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
```

## 실행 확인

기본 확인 명령은 다음과 같습니다.

```bash
npm run lint
npm run build
npm run dev
```

화면과 기능은 다음 순서로 확인합니다.

- 작성 화면에서 카테고리를 선택해 저장합니다.
- 홈 목록에서 카테고리 필터를 바꿔 해당 카테고리 글만 보이는지 확인합니다.

## 자주 확인할 부분

- 파일 이름과 폴더 이름을 정확히 입력합니다. App Router에서는 `page.js`, `layout.js`, `route.js`, `not-found.js`, `error.js` 같은 파일명이 특별한 의미를 가집니다.
- 클라이언트 상태나 이벤트를 쓰는 파일에는 필요한 경우에만 `"use client";`를 둡니다. 서버에서 실행되어야 하는 MongoDB 코드는 클라이언트 컴포넌트로 가져오지 않습니다.
- API 응답은 가능한 한 `{ success, message, data }` 구조를 유지합니다. 화면 코드는 이 구조를 기준으로 `message`와 `data`를 읽습니다.
- 실습 중 막히면 먼저 이 문서의 코드 블록과 브랜치 링크의 실제 파일을 비교합니다.

## 개념 정리

아래 내용은 기존 단계 개요를 강의 문서 안에서도 바로 볼 수 있도록 가져온 것입니다. 코드 작성 후 다시 읽으면 각 변경의 이유를 확인하기 쉽습니다.

## 이 단계의 목표

`step-19`는 게시글에 카테고리를 추가하는 단계입니다.

이 단계는 확장 과정의 마지막 단계입니다. 카테고리는 데이터 모델, 작성 form, 수정 form, 목록 필터, 상세 표시가 모두 연결되어야 하므로 앞 단계들이 준비된 뒤에 추가하는 것이 좋습니다.

이 단계에서는 다음을 구현합니다.

- 게시글 데이터에 `category` 필드를 추가한다.
- 샘플 게시글에도 카테고리를 넣는다.
- 작성 화면에서 카테고리를 선택한다.
- 수정 화면에서 기존 카테고리를 불러오고 변경한다.
- 상세 화면과 목록 화면에 카테고리를 표시한다.
- 목록 API에서 `category` query string을 읽는다.
- 검색/페이지네이션/정렬과 카테고리 필터를 함께 사용한다.

## 왜 마지막 단계에 두는가

카테고리는 단순한 화면 장식이 아닙니다.

다음 파일들이 함께 바뀝니다.

```txt
lib/posts.js
app/api/post/route.js
app/api/post/[id]/route.js
app/post/page.js
app/post/[id]/page.js
app/detail/[id]/page.js
app/page.js
```

데이터 모델과 여러 화면이 동시에 바뀌기 때문에 초반 단계에 넣으면 학습 분량이 커집니다.

검색, 페이지네이션, 정렬까지 배운 뒤에 카테고리를 붙이면 “조건이 늘어난 목록 API”를 자연스럽게 이해할 수 있습니다.

## 카테고리 기본값

기존 게시글에는 `category`가 없을 수 있습니다.

그래서 서버에서는 기본값을 `general`로 처리합니다.

```js
function normalizeCategory(category) {
  return typeof category === "string" && category.trim()
    ? category.trim()
    : "general";
}
```

작성/수정 요청에 카테고리가 없더라도 DB에는 안정적인 값이 저장됩니다.

## 샘플 게시글 카테고리

샘플 게시글에는 여러 카테고리를 번갈아 넣습니다.

```js
const seedCategories = ["general", "notice", "daily", "tech"];
```

```js
category: seedCategories[index % seedCategories.length],
```

이렇게 하면 처음 데이터를 만들었을 때도 카테고리 필터를 바로 실습할 수 있습니다.

## 목록 검색 조건 확장

`buildPostQuery`는 검색어와 카테고리를 함께 처리합니다.

```js
function buildPostQuery(keyword, category) {
  const searchKeyword = keyword.trim();
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
```

`category`가 `"all"`이면 카테고리 조건을 넣지 않습니다.

특정 카테고리를 선택하면 해당 카테고리 조건이 MongoDB query에 추가됩니다.

## API Route의 category query string

목록 API는 카테고리를 query string으로 받습니다.

```js
const category = searchParams.get("category") || "all";
const posts = await listPosts({ keyword, page, limit, sort, category });
```

예시는 다음과 같습니다.

```txt
/api/post?category=tech&page=1&limit=5
```

검색, 정렬과 함께 사용할 수도 있습니다.

```txt
/api/post?keyword=next&category=tech&sort=created-desc&page=1&limit=5
```

## 작성 화면 select

작성 화면에는 카테고리 select를 추가합니다.

```js
const [category, setCategory] = useState("general");
```

```jsx
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
```

작성 요청 body에도 카테고리를 포함합니다.

```js
body: JSON.stringify({
  title,
  content,
  category,
  image: "https://picsum.photos/100",
})
```

## 수정 화면 select

수정 화면은 기존 게시글의 카테고리를 불러와야 합니다.

```js
setCategory(post.category || "general");
```

기존 데이터에 `category`가 없으면 `general`로 보여줍니다.

수정 요청에도 카테고리를 포함합니다.

```js
body: JSON.stringify({ title, content, category })
```

## 목록 화면 카테고리 필터

홈 화면에는 카테고리 필터 select를 추가합니다.

```js
const [categoryFilter, setCategoryFilter] = useState("all");
```

카테고리가 바뀌면 서버에서 1페이지를 다시 불러옵니다.

```js
async function handleCategoryChange(event) {
  const nextCategory = event.target.value;

  setCategoryFilter(nextCategory);
  await loadPosts({
    page: 1,
    searchKeyword: serverKeyword,
    categoryValue: nextCategory,
  });
}
```

검색어, 정렬, 페이지네이션과 함께 동작하도록 `buildPostsUrl`에 category를 추가합니다.

## 직접 실습 순서

1. `lib/posts.js`에 카테고리 기본값 처리 함수를 만든다.
2. seed 게시글에 카테고리를 넣는다.
3. `buildPostQuery`가 카테고리 조건을 받을 수 있게 수정한다.
4. `listPosts` 옵션에 `category`를 추가한다.
5. 목록 API에서 `category` query string을 읽는다.
6. 작성 API와 수정 API가 category를 데이터 함수에 전달하도록 수정한다.
7. 작성 화면에 category 상태와 select를 추가한다.
8. 수정 화면에 category 상태와 select를 추가한다.
9. 상세 화면에 카테고리를 표시한다.
10. 홈 화면에 카테고리 필터 select를 추가한다.
11. 검색/정렬/페이지 이동 시 카테고리 조건이 유지되는지 확인한다.

## 확인 방법

새 글을 작성할 때 카테고리를 선택합니다.

```txt
http://localhost:3000/post
```

작성 후 상세 화면에서 카테고리가 보이는지 확인합니다.

홈 화면에서 카테고리 필터를 바꿉니다.

```txt
http://localhost:3000/
```

선택한 카테고리의 글만 보이면 성공입니다.

검색어와 정렬을 함께 사용해도 카테고리 조건이 유지되는지 확인합니다.

## 검증 명령

```bash
npm run lint
npm run build
```

## 이 단계의 핵심

카테고리는 데이터 모델을 확장하는 기능입니다. 필드를 하나 추가하는 것처럼 보이지만, 작성/수정/목록/상세/API/DB 조회 조건이 모두 함께 바뀌어야 완성됩니다.
