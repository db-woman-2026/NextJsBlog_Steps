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
