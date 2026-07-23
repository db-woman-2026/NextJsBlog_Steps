# Step 21. 홈 목록과 상세 읽기 화면 UI 정리

## 변경 내용

홈 목록, 상세 읽기 화면, About 페이지를 Tailwind utility class로 정리해 카드형 읽기 UI를 만듭니다.

- 홈 화면에 제목 영역, 필터 패널, 게시글 카드 UI를 적용합니다.
- 상세 화면을 article 카드 형태로 정리합니다.
- About 페이지를 텍스트와 이미지가 있는 반응형 레이아웃으로 바꾸고 기존 CSS module을 제거합니다.

## 시작 전 확인

개인 실습 저장소의 `main`에서 직전 단계까지 마친 상태로 시작합니다. 코드 블록은 복사해 붙이지 않고 직접 입력합니다.

수정 전에 `git status --short`의 출력이 없는지 확인합니다. 변경이 남아 있다면 원인을 확인하고 시작 상태를 정리합니다.

## 작업 1. 홈 목록을 카드형 Tailwind UI로 변경

step-20에서 공통 shell을 바꿨으므로, 이제 사용자가 가장 먼저 보는 홈 목록을 Tailwind class로 정리합니다. 검색/정렬/카테고리 controls는 하나의 패널 안에 묶습니다.

### 수정할 파일

- 수정: `app/page.js`
- 삭제: `app/page.module.css`

### 먼저 실행

> Windows 11에서는 [환경 준비](../windows-11.md)를 먼저 확인합니다. `git`, `node`, `npm.cmd` 명령은 PowerShell에서도 같습니다. `npm.ps1` 오류가 나면 `npm.cmd`를 사용합니다.

```powershell
Remove-Item -LiteralPath 'app/page.module.css'
```

### 입력할 코드

아래 파일 경로를 확인하고 각 파일의 전체 내용을 입력합니다. 삭제로 표시된 파일은 PowerShell에서 제거합니다.

#### `app/page.js`

`app/page.js`를 열고 파일 전체를 다음 내용으로 맞춥니다.

~~~js
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
~~~

#### `app/page.module.css` 삭제

`app/page.module.css`는 더 이상 사용하지 않으므로 삭제합니다.

### 설명과 확인

- CSS module import를 제거하고 JSX에 utility class를 직접 작성합니다.
- 필터 controls와 목록 카드는 서로 다른 영역으로 보여야 스캔하기 쉽습니다.

## 작업 2. 상세 읽기 화면을 article 카드로 정리

게시글 하나를 읽는 화면은 제목, 카테고리, 날짜, 본문, 액션 버튼이 한 덩어리로 보여야 합니다. 기존 CSS module을 제거하고 Tailwind class만 사용합니다.

### 수정할 파일

- 수정: [app/detail/[id]/page.js](../../app/detail/%5Bid%5D/page.js)
- 삭제: `app/detail/[id]/page.module.css`

### 먼저 실행

```powershell
Remove-Item -LiteralPath 'app/detail/[id]/page.module.css'
```

### 입력할 코드

아래 파일 경로를 확인하고 각 파일의 전체 내용을 입력합니다. 삭제로 표시된 파일은 PowerShell에서 제거합니다.

#### `app/detail/[id]/page.js`

`app/detail/[id]/page.js`를 열고 파일 전체를 다음 내용으로 맞춥니다.

~~~js
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
~~~

#### `app/detail/[id]/page.module.css` 삭제

`app/detail/[id]/page.module.css`는 더 이상 사용하지 않으므로 삭제합니다.

### 설명과 확인

- 본문은 기존처럼 `pre`를 유지하되 `whitespace-pre-wrap`으로 긴 줄을 처리합니다.
- Edit/Delete 액션은 본문 아래에서 같은 줄 그룹으로 정리합니다.

## 작업 3. About 페이지 반응형 레이아웃 적용

소개 페이지는 텍스트와 이미지가 함께 보이는 정적 페이지입니다. 모바일에서는 1열, 큰 화면에서는 2열로 보이도록 Tailwind grid를 적용합니다.

### 수정할 파일

- 수정: `app/about/page.js`

### 입력할 코드

아래 파일 경로를 확인하고 각 파일의 전체 내용을 입력합니다. 삭제로 표시된 파일은 PowerShell에서 제거합니다.

#### `app/about/page.js`

`app/about/page.js`를 열고 파일 전체를 다음 내용으로 맞춥니다.

~~~js
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
~~~

### 설명과 확인

- 이미지는 `rounded-lg`와 border로 카드처럼 보이게 합니다.
- `lg:` 접두사는 큰 화면에서만 2열 레이아웃을 적용합니다.

## 실행 확인

기본 정적 검사는 다음 명령으로 확인합니다.

```powershell
npm.cmd run lint
npm.cmd run build
```

브라우저 확인이 필요하면 개발 서버를 켠 뒤 해당 화면을 확인합니다.

```powershell
npm.cmd run dev
```

체크할 내용은 다음과 같습니다.

- 홈 목록이 카드 형태로 보인다.
- 상세 화면이 하나의 article 카드로 보인다.
- About 페이지가 모바일 1열, 큰 화면 2열로 보인다.

## 독립 확인

좁은 화면에서 카드와 본문이 가로로 넘치지 않는지 확인합니다. 결과와 확인 방법을 한 문장으로 기록합니다. 실험값은 검사를 마치면 원래대로 복구합니다.

## 마무리 확인

- 각 작업 단위의 설명과 파일 경로를 먼저 확인합니다.
- 코드 블록은 해당 파일의 일부가 아니라 현재 단계에서 사용할 전체 내용입니다.

## 저장소에 기록하기

실험용 변경을 모두 복구한 뒤 검사 결과와 코드 변경을 함께 확인합니다.

```powershell
git branch --show-current
git status --short
npm.cmd run lint
npm.cmd run build
git add .
git commit -m "Complete Next.js step 21"
git push
git status --short --branch
```

현재 브랜치는 `main`이어야 합니다. 마지막 상태에서 `main...origin/main` 뒤에 `ahead`가 없고 작업 파일 목록도 비어 있어야 합니다.
