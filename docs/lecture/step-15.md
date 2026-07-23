# Step 15. 서버 검색으로 전환하기

## 변경 내용

keyword query string을 API로 보내 MongoDB에서 직접 검색하는 서버 검색을 추가합니다.

- 검색어를 `/api/post?keyword=...` query string으로 보냅니다.
- 검색어의 정규식 문자를 이스케이프한 뒤 제목과 본문을 검색합니다.
- 홈 화면은 `Server Search` 버튼을 눌렀을 때 서버에서 필터링된 목록을 다시 가져옵니다.

## 시작 전 확인

개인 실습 저장소의 `main`에서 직전 단계까지 마친 상태로 시작합니다. 코드 블록은 복사해 붙이지 않고 직접 입력합니다.

수정 전에 `git status --short`의 출력이 없는지 확인합니다. 변경이 남아 있다면 원인을 확인하고 시작 상태를 정리합니다.

## 작업 1. MongoDB 목록 함수에 keyword 필터 추가

검색 대상이 많아질수록 브라우저 필터보다 데이터베이스 검색이 적합합니다. `listPosts`가 선택적으로 keyword를 받아 MongoDB query를 구성하게 합니다. 사용자가 입력한 `.`, ``lib/posts.js`

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

export async function listPosts(keyword = "") {
  await seedPostsIfEmpty();

  const collection = await getPostsCollection();
  const searchKeyword = escapeRegex(keyword.trim());

  if (!searchKeyword) {
    return collection.find({}).sort({ createdAt: -1 }).toArray();
  }

  return collection
    .find({
      $or: [
        { title: { $regex: searchKeyword, $options: "i" } },
        { content: { $regex: searchKeyword, $options: "i" } },
      ],
    })
    .sort({ createdAt: -1 })
    .toArray();
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

- 제목 또는 본문 중 하나라도 매칭되도록 `$or` 조건을 사용합니다.
- 정규식 옵션 `i`는 대소문자를 구분하지 않게 합니다.
- `escapeRegex()`는 검색어의 정규식 특수 문자를 이스케이프합니다. 이 처리가 없으면 `.`은 모든 문자, ``app/api/post/route.js`

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
    const posts = await listPosts(keyword);

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

- `new URL(request.url)`로 query string을 읽습니다.
- keyword가 없으면 기존처럼 전체 목록을 반환합니다.

## 작업 3. 홈 화면 fetch URL에 keyword 연결

`Server Search` 버튼을 누르면 현재 검색어로 API URL을 만들고 서버 검색 결과를 받아 화면에 표시합니다. 검색 결과는 DB 값을 기준으로 합니다.

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

export default function Home() {
  const [allPosts, setAllPosts] = useState([]);
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [keyword, setKeyword] = useState("");
  const [searchMessage, setSearchMessage] = useState("");

  useEffect(() => {
    async function loadPosts() {
      try {
        const data = await fetchPosts("/api/post");
        setAllPosts(data);
        setPosts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch posts");
      } finally {
        setIsLoading(false);
      }
    }

    loadPosts();
  }, []);

  function handleClientFilter() {
    const searchKeyword = keyword.trim();

    setError("");

    if (!searchKeyword) {
      setPosts(allPosts);
      setSearchMessage("Showing all posts because the search keyword is empty.");
      return;
    }

    const filteredPosts = allPosts.filter((post) =>
      postMatchesKeyword(post, searchKeyword),
    );

    setPosts(filteredPosts);
    setSearchMessage(`Client filter result: ${filteredPosts.length} posts`);
  }

  async function handleServerSearch() {
    const searchKeyword = keyword.trim();
    const url = searchKeyword
      ? `/api/post?keyword=${encodeURIComponent(searchKeyword)}`
      : "/api/post";

    setError("");
    setIsLoading(true);

    try {
      const data = await fetchPosts(url);
      setPosts(data);
      setSearchMessage(`Server search result: ${data.length} posts`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch posts");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleShowAll() {
    setError("");
    setIsLoading(true);

    try {
      const data = await fetchPosts("/api/post");
      setAllPosts(data);
      setPosts(data);
      setKeyword("");
      setSearchMessage("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch posts");
    } finally {
      setIsLoading(false);
    }
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
~~~

### 설명과 확인

- `encodeURIComponent`로 검색어를 query string에 안전하게 넣습니다.
- 검색어가 빈 값이면 keyword parameter를 붙이지 않습니다.

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

- 검색어를 입력한 뒤 `Server Search` 버튼을 누르면 `/api/post?keyword=...` 요청이 발생한다.
- 제목 또는 본문에 검색어가 있는 글만 보인다.
- `.`, `[`, `?`를 검색해도 오류가 나지 않고 해당 문자가 들어간 글만 찾는다.

## 독립 확인

`.`, `[`, `?`를 검색해 문자 그대로 처리되는지 확인합니다. 결과와 확인 방법을 한 문장으로 기록합니다. 실험값은 검사를 마치면 원래대로 복구합니다.

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
git commit -m "Complete Next.js step 15"
git push
git status --short --branch
```

현재 브랜치는 `main`이어야 합니다. 마지막 상태에서 `main...origin/main` 뒤에 `ahead`가 없고 작업 파일 목록도 비어 있어야 합니다.
