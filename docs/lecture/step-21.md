# Step 21. 홈 목록과 상세 읽기 화면 UI 정리

이 문서는 `step-20`에서 시작해 `step-21`를 완성하는 실습 자료입니다.
원본 개요는 [docs/overview/step-21.md](../overview/step-21.md)에 보존되어 있습니다.
실제 완성 코드는 [step-21 브랜치](https://github.com/db-woman-2026/NextJsBlog_Steps/tree/step-21) 기준입니다.

## 이번 단계 목표

홈 목록, 상세 읽기 화면, About 페이지를 Tailwind utility class로 정리해 카드형 읽기 UI를 만듭니다.

이번 단계에서 집중할 내용은 다음과 같습니다.

- 홈 목록과 상세 화면의 CSS Module을 Tailwind utility class로 옮깁니다.
- 게시글 카드를 읽기 쉬운 카드형 UI로 정리합니다.
- About 페이지도 같은 시각 언어로 맞춥니다.

## 시작 기준

이전 단계인 `step-20` 브랜치까지 완료된 상태에서 시작합니다.

```bash
git switch step-20
# 실습용 브랜치를 직접 만들 경우
git switch -c practice-step-21
```

수업 저장소의 정답 브랜치를 바로 확인하려면 다음 명령을 사용할 수 있습니다.

```bash
git switch step-21
```

## 수정 파일

| 상태 | 파일 | 확인 링크 |
| --- | --- | --- |
| 수정 | `README.md` | [README.md](https://github.com/db-woman-2026/NextJsBlog_Steps/blob/step-21/README.md) |
| 수정 | `app/about/page.js` | [app/about/page.js](https://github.com/db-woman-2026/NextJsBlog_Steps/blob/step-21/app/about/page.js) |
| 수정 | `app/detail/[id]/page.js` | [app/detail/[id]/page.js](https://github.com/db-woman-2026/NextJsBlog_Steps/blob/step-21/app/detail/%5Bid%5D/page.js) |
| 삭제 | `app/detail/[id]/page.module.css` | [app/detail/[id]/page.module.css](https://github.com/db-woman-2026/NextJsBlog_Steps/blob/step-20/app/detail/%5Bid%5D/page.module.css) |
| 수정 | `app/page.js` | [app/page.js](https://github.com/db-woman-2026/NextJsBlog_Steps/blob/step-21/app/page.js) |
| 삭제 | `app/page.module.css` | [app/page.module.css](https://github.com/db-woman-2026/NextJsBlog_Steps/blob/step-20/app/page.module.css) |

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

### 2. app/about/page.js

기존 `app/about/page.js` 파일을 열고 아래 최종 코드와 같게 수정합니다.

이 단계의 결과와 맞도록 파일 내용을 정리합니다.

```jsx
import Image from "next/image";

export default function AboutPage() {
  return (
    <main className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
      <section className="space-y-4">
        <p className="text-sm font-semibold uppercase text-zinc-500">About</p>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-950">
          About Me
        </h1>
        <div className="space-y-4 text-sm leading-7 text-zinc-600">
          <p>
            Hello! My name is [Your Name]. I&apos;m a professional working in
            [Your Industry] based in [Your Location].
          </p>
          <p>
            Here&apos;s a photo of our office building where I spend most of my
            working hours.
          </p>
          <p>
            I am passionate about [Your Passion], and I enjoy [Your Hobbies].
          </p>
          <p>
            If you wish to reach out, please contact me at [Your Contact
            Information].
          </p>
        </div>
      </section>
      <Image
        className="rounded-lg border border-zinc-200 object-cover shadow-sm"
        src="https://picsum.photos/id/1047/600/500"
        alt="Office building"
        width={600}
        height={500}
        priority
      />
    </main>
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
    <main className="space-y-6">
      <article className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
        <div className="space-y-3">
          <span className="inline-flex rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium uppercase text-zinc-600">
            {post.category || "general"}
          </span>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-950">
            {post.title}
          </h1>
          <div className="flex flex-wrap gap-3 text-sm text-zinc-500">
            <span>Created: {formatDate(post.createdAt)}</span>
            {post.updatedAt && <span>Updated: {formatDate(post.updatedAt)}</span>}
          </div>
        </div>
        <pre className="mt-6 whitespace-pre-wrap rounded-md bg-zinc-50 p-4 text-sm leading-7 text-zinc-700">
          {post.content}
        </pre>
      </article>
      <div className="flex flex-wrap items-center gap-2">
        <Link
          className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700"
          href={`/post/${id}`}
        >
          Edit
        </Link>
        <DeletePostButton id={id} />
      </div>
    </main>
  );
}
```

### 4. app/detail/[id]/page.module.css

이 단계에서는 `app/detail/[id]/page.module.css` 파일을 삭제합니다.

게시글 상세 읽기 화면입니다. URL의 id로 게시글 하나를 조회하고, 없는 글은 404로 보냅니다.

```bash
rm app/detail/[id]/page.module.css
```

삭제 전 파일은 [step-20의 app/detail/[id]/page.module.css](https://github.com/db-woman-2026/NextJsBlog_Steps/blob/step-20/app/detail/%5Bid%5D/page.module.css)에서 확인할 수 있습니다.

### 5. app/page.js

기존 `app/page.js` 파일을 열고 아래 최종 코드와 같게 수정합니다.

홈 화면입니다. 단계가 진행되면서 소개 화면에서 게시글 목록, 검색, 페이지네이션, 정렬 UI로 확장됩니다.

```jsx
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const PAGE_SIZE = 5;
const DEFAULT_SORT = "created-desc";
const inputClassName =
  "rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm outline-none focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200 disabled:bg-zinc-100";
const secondaryButtonClassName =
  "rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-50";
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
    <main className="space-y-6">
      <section className="space-y-2">
        <p className="text-sm font-semibold uppercase text-zinc-500">
          Next.js Blog
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-950">
          Blog Posts
        </h1>
        <p className="max-w-2xl text-sm leading-6 text-zinc-600">
          MongoDB에 저장된 게시글을 검색, 정렬, 카테고리 필터와 함께
          확인합니다.
        </p>
      </section>

      <form
        className="grid gap-4 rounded-lg border border-zinc-200 bg-white p-4 shadow-sm sm:grid-cols-2 lg:grid-cols-3"
        onSubmit={(event) => event.preventDefault()}
      >
        <div className="grid gap-1.5">
          <label
            className="text-sm font-medium text-zinc-700"
            htmlFor="keyword"
          >
            Search posts
          </label>
          <input
            className={inputClassName}
            type="search"
            id="keyword"
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            disabled={isLoading}
          />
        </div>

        <div className="grid gap-1.5">
          <label
            className="text-sm font-medium text-zinc-700"
            htmlFor="categoryFilter"
          >
            Category
          </label>
          <select
            className={inputClassName}
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
        </div>

        <div className="grid gap-1.5">
          <label
            className="text-sm font-medium text-zinc-700"
            htmlFor="sortOrder"
          >
            Sort posts
          </label>
          <select
            className={inputClassName}
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
        </div>

        <div className="flex flex-wrap gap-2 sm:col-span-2 lg:col-span-3">
          <button
            className={secondaryButtonClassName}
            type="button"
            onClick={handleClientFilter}
            disabled={isLoading}
          >
            Client Filter
          </button>
          <button
            className={secondaryButtonClassName}
            type="button"
            onClick={handleServerSearch}
            disabled={isLoading}
          >
            Server Search
          </button>
          <button
            className={secondaryButtonClassName}
            type="button"
            onClick={handleShowAll}
            disabled={isLoading}
          >
            Show All
          </button>
        </div>
      </form>

      {searchMessage && (
        <p className="rounded-md bg-zinc-100 px-3 py-2 text-sm text-zinc-600">
          {searchMessage}
        </p>
      )}
      {isLoading && <p className="text-sm text-zinc-600">Loading posts...</p>}
      {error && (
        <p
          className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
          role="alert"
        >
          {error}
        </p>
      )}
      {!isLoading && !error && posts.length === 0 && (
        <p className="rounded-md border border-dashed border-zinc-300 bg-white px-4 py-8 text-center text-sm text-zinc-500">
          No posts found.
        </p>
      )}
      {!isLoading && !error && (
        <>
          <section className="grid gap-4" aria-label="Blog posts">
            {posts.map((post) => (
              <article
                key={post._id}
                className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm transition hover:border-zinc-300"
              >
                <Link
                  className="text-xl font-semibold text-zinc-950 hover:text-zinc-700"
                  href={`/detail/${post._id}`}
                >
                  {post.title}
                </Link>
                <div className="mt-3 flex flex-wrap gap-2 text-xs text-zinc-500">
                  <span className="rounded-full bg-zinc-100 px-2.5 py-1 font-medium text-zinc-700">
                    {post.category || "general"}
                  </span>
                  <span>Created: {formatDate(post.createdAt)}</span>
                </div>
                {post.updatedAt && (
                  <p className="mt-2 text-xs text-zinc-500">
                    Updated: {formatDate(post.updatedAt)}
                  </p>
                )}
              </article>
            ))}
          </section>

          {pagination && (
            <nav
              className="flex flex-wrap items-center gap-3 rounded-lg border border-zinc-200 bg-white p-4 text-sm text-zinc-600"
              aria-label="Pagination"
            >
              <button
                className={secondaryButtonClassName}
                type="button"
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={isLoading || !pagination.hasPreviousPage}
              >
                Previous
              </button>
              <span className="font-medium text-zinc-700">
                Page {pagination.page} of {pagination.totalPages} (
                {pagination.totalPosts} posts)
              </span>
              <button
                className={secondaryButtonClassName}
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

### 6. app/page.module.css

이 단계에서는 `app/page.module.css` 파일을 삭제합니다.

이 단계의 결과와 맞도록 파일 내용을 정리합니다.

```bash
rm app/page.module.css
```

삭제 전 파일은 [step-20의 app/page.module.css](https://github.com/db-woman-2026/NextJsBlog_Steps/blob/step-20/app/page.module.css)에서 확인할 수 있습니다.

## 실행 확인

기본 확인 명령은 다음과 같습니다.

```bash
npm run lint
npm run build
npm run dev
```

화면과 기능은 다음 순서로 확인합니다.

- 홈 목록 카드와 상세 article 화면을 확인합니다.
- About 페이지 이미지와 텍스트 영역이 깨지지 않는지 확인합니다.

## 자주 확인할 부분

- 파일 이름과 폴더 이름을 정확히 입력합니다. App Router에서는 `page.js`, `layout.js`, `route.js`, `not-found.js`, `error.js` 같은 파일명이 특별한 의미를 가집니다.
- 클라이언트 상태나 이벤트를 쓰는 파일에는 필요한 경우에만 `"use client";`를 둡니다. 서버에서 실행되어야 하는 MongoDB 코드는 클라이언트 컴포넌트로 가져오지 않습니다.
- API 응답은 가능한 한 `{ success, message, data }` 구조를 유지합니다. 화면 코드는 이 구조를 기준으로 `message`와 `data`를 읽습니다.
- 실습 중 막히면 먼저 이 문서의 코드 블록과 브랜치 링크의 실제 파일을 비교합니다.

## 개념 정리

아래 내용은 기존 단계 개요를 강의 문서 안에서도 바로 볼 수 있도록 가져온 것입니다. 코드 작성 후 다시 읽으면 각 변경의 이유를 확인하기 쉽습니다.

이전 단계에서 Tailwind CSS v4를 설치하고 공통 layout, nav, footer를 정리했습니다. 이번 단계에서는 사용자가 가장 먼저 보는 읽기 화면을 정리합니다.

## 이번 단계에서 하는 일

- 홈 화면에 제목 영역을 추가한다.
- 검색/필터 영역을 흰색 패널로 묶는다.
- 게시글 목록을 카드 형태로 바꾼다.
- 상세 페이지를 하나의 article 카드로 정리한다.
- About 페이지의 텍스트와 이미지를 간단한 2열 레이아웃으로 바꾼다.
- 더 이상 쓰지 않는 `app/page.module.css`, `app/detail/[id]/page.module.css`를 제거한다.

## 왜 읽기 화면부터 바꾸는가

블로그에서 가장 중요한 화면은 글 목록과 글 상세입니다.

작성 form이나 오류 화면을 먼저 꾸밀 수도 있지만, 사용자가 블로그를 열었을 때 처음 확인하는 것은 대부분 목록입니다. 따라서 Tailwind를 배울 때도 가장 자주 보이는 화면부터 작은 단위로 개선하는 편이 좋습니다.

## CSS module에서 utility class로 이동

기존 홈 화면은 CSS module을 import했습니다.

```js
import styles from "./page.module.css";
```

그리고 JSX에서는 다음처럼 사용했습니다.

```jsx
<section className={styles.articleList}>
  <article className={styles.article}>...</article>
</section>
```

이번 단계에서는 이 파일을 제거하고 JSX에 Tailwind class를 직접 작성합니다.

```jsx
<section className="grid gap-4" aria-label="Blog posts">
  <article className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
    ...
  </article>
</section>
```

## 홈 화면 제목 영역

홈 화면에는 이제 간단한 제목과 설명이 있습니다.

```jsx
<section className="space-y-2">
  <p className="text-sm font-semibold uppercase text-zinc-500">
    Next.js Blog
  </p>
  <h1 className="text-3xl font-bold tracking-tight text-zinc-950">
    Blog Posts
  </h1>
  <p className="max-w-2xl text-sm leading-6 text-zinc-600">
    MongoDB에 저장된 게시글을 검색, 정렬, 카테고리 필터와 함께 확인합니다.
  </p>
</section>
```

주요 class는 다음과 같습니다.

| class | 의미 |
| --- | --- |
| `space-y-2` | 자식 요소 사이의 세로 간격을 일정하게 만듭니다. |
| `text-3xl` | 큰 제목 크기를 적용합니다. |
| `font-bold` | 굵은 글자를 적용합니다. |
| `tracking-tight` | 제목 글자 간격을 조금 좁혀 제목처럼 보이게 합니다. |
| `max-w-2xl` | 설명 문장이 너무 길게 퍼지지 않도록 폭을 제한합니다. |

## 게시글 카드

목록의 각 게시글은 카드 형태로 바뀝니다.

```jsx
<article className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm transition hover:border-zinc-300">
  <Link className="text-xl font-semibold text-zinc-950 hover:text-zinc-700">
    {post.title}
  </Link>
  ...
</article>
```

여기서 `hover:border-zinc-300`은 마우스를 올렸을 때 border 색을 조금 진하게 바꿉니다. 기능에는 영향을 주지 않지만 클릭 가능한 카드라는 느낌을 줄 수 있습니다.

## 카테고리 배지

카테고리는 작은 pill 형태로 표시합니다.

```jsx
<span className="rounded-full bg-zinc-100 px-2.5 py-1 font-medium text-zinc-700">
  {post.category || "general"}
</span>
```

`rounded-full`은 좌우가 둥근 배지를 만들 때 자주 사용합니다.

## 상세 페이지 article 카드

상세 페이지는 글 하나를 읽는 화면이므로 하나의 큰 카드로 정리합니다.

```jsx
<article className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
  <div className="space-y-3">
    <span className="inline-flex rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium uppercase text-zinc-600">
      {post.category || "general"}
    </span>
    <h1 className="text-3xl font-bold tracking-tight text-zinc-950">
      {post.title}
    </h1>
  </div>
  <pre className="mt-6 whitespace-pre-wrap rounded-md bg-zinc-50 p-4 text-sm leading-7 text-zinc-700">
    {post.content}
  </pre>
</article>
```

게시글 본문은 줄바꿈을 유지해야 하므로 `pre` 태그를 그대로 사용합니다. 대신 `whitespace-pre-wrap`으로 긴 줄이 화면 밖으로 나가지 않고 줄바꿈되게 합니다.

## About 페이지

About 페이지는 텍스트와 이미지를 나란히 배치합니다.

```jsx
<main className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
  ...
</main>
```

`lg:` 접두사는 큰 화면에서만 적용되는 responsive class입니다. 모바일에서는 한 열로 보이고, 큰 화면에서는 텍스트와 이미지가 2열로 보입니다.

## 이번 단계의 기준

이번 단계는 "읽기 화면이 카드형 UI로 정리됐는가"가 기준입니다.

아직 작성 form, 수정 form, Contact form, 오류 화면은 완성하지 않습니다. 다음 단계에서 form 계열 화면을 따로 정리합니다.

## 확인 방법

```bash
npm run lint
npm run build
```

브라우저에서는 다음 주소를 확인합니다.

```txt
/
/detail/[id]
/about
```

`/detail/[id]`는 실제 게시글 ID가 필요합니다. 홈 목록에서 글 제목을 클릭해 들어가면 됩니다.

## 체크리스트

1. 홈 화면에 제목과 설명이 보인다.
2. 검색/필터 영역이 흰색 패널로 보인다.
3. 게시글 목록이 카드 형태로 보인다.
4. 상세 화면의 제목, 카테고리, 날짜, 본문이 하나의 카드 안에 정리된다.
5. About 페이지가 모바일에서는 1열, 큰 화면에서는 2열로 보인다.
6. 삭제한 CSS module을 import하는 코드가 남아 있지 않다.

다음 단계에서는 작성, 수정, Contact form UI를 정리합니다.
