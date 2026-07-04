# Step 15. 서버 검색

이 문서는 `step-14`에서 시작해 `step-15`를 완성하는 실습 자료입니다.
원본 개요는 [docs/overview/step-15.md](../overview/step-15.md)에 보존되어 있습니다.
실제 완성 코드는 [step-15 브랜치](https://github.com/db-woman-2026/NextJsBlog_Steps/tree/step-15) 기준입니다.

## 이번 단계 목표

keyword query string을 API로 보내 MongoDB에서 직접 검색하는 서버 검색을 추가합니다.

이번 단계에서 집중할 내용은 다음과 같습니다.

- 검색어를 URL query string으로 API에 전달합니다.
- MongoDB $regex 조건으로 제목과 본문을 검색합니다.
- 클라이언트 필터와 서버 검색의 차이를 비교합니다.

## 시작 기준

이전 단계인 `step-14` 브랜치까지 완료된 상태에서 시작합니다.

```bash
git switch step-14
# 실습용 브랜치를 직접 만들 경우
git switch -c practice-step-15
```

수업 저장소의 정답 브랜치를 바로 확인하려면 다음 명령을 사용할 수 있습니다.

```bash
git switch step-15
```

## 수정 파일

| 상태 | 파일 | 확인 링크 |
| --- | --- | --- |
| 수정 | `app/api/post/route.js` | [app/api/post/route.js](https://github.com/db-woman-2026/NextJsBlog_Steps/blob/step-15/app/api/post/route.js) |
| 수정 | `app/page.js` | [app/page.js](https://github.com/db-woman-2026/NextJsBlog_Steps/blob/step-15/app/page.js) |
| 수정 | `lib/posts.js` | [lib/posts.js](https://github.com/db-woman-2026/NextJsBlog_Steps/blob/step-15/lib/posts.js) |

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
```

### 2. app/page.js

기존 `app/page.js` 파일을 열고 아래 최종 코드와 같게 수정합니다.

홈 화면입니다. 단계가 진행되면서 소개 화면에서 게시글 목록, 검색, 페이지네이션, 정렬 UI로 확장됩니다.

```jsx
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

export async function listPosts(keyword = "") {
  await seedPostsIfEmpty();

  const collection = await getPostsCollection();
  const searchKeyword = keyword.trim();

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
```

## 실행 확인

기본 확인 명령은 다음과 같습니다.

```bash
npm run lint
npm run build
npm run dev
```

화면과 기능은 다음 순서로 확인합니다.

- 검색어를 입력하고 Server Search를 누릅니다.
- 브라우저가 가진 목록이 아니라 서버 검색 결과가 표시되는지 확인합니다.

## 자주 확인할 부분

- 파일 이름과 폴더 이름을 정확히 입력합니다. App Router에서는 `page.js`, `layout.js`, `route.js`, `not-found.js`, `error.js` 같은 파일명이 특별한 의미를 가집니다.
- 클라이언트 상태나 이벤트를 쓰는 파일에는 필요한 경우에만 `"use client";`를 둡니다. 서버에서 실행되어야 하는 MongoDB 코드는 클라이언트 컴포넌트로 가져오지 않습니다.
- API 응답은 가능한 한 `{ success, message, data }` 구조를 유지합니다. 화면 코드는 이 구조를 기준으로 `message`와 `data`를 읽습니다.
- 실습 중 막히면 먼저 이 문서의 코드 블록과 브랜치 링크의 실제 파일을 비교합니다.

## 개념 정리

아래 내용은 기존 단계 개요를 강의 문서 안에서도 바로 볼 수 있도록 가져온 것입니다. 코드 작성 후 다시 읽으면 각 변경의 이유를 확인하기 쉽습니다.

## 이 단계의 목표

`step-15`는 MongoDB에서 직접 검색하는 서버 검색을 추가하는 단계입니다.

`step-14`의 클라이언트 필터는 브라우저가 이미 가진 배열 안에서만 검색했습니다. 이번 단계에서는 검색어를 API로 보내고, 서버가 MongoDB에서 검색합니다.

이 단계에서는 다음을 구현합니다.

- `GET /api/post?keyword=...` query string을 읽는다.
- `listPosts(keyword)` 데이터 함수에서 MongoDB 검색 조건을 만든다.
- 제목 또는 본문에 검색어가 포함된 게시글을 찾는다.
- 홈 화면에 `Server Search` 버튼을 추가한다.
- `encodeURIComponent()`로 검색어를 안전하게 URL에 넣는다.
- 클라이언트 필터와 서버 검색의 차이를 비교한다.

## 클라이언트 필터와 서버 검색의 차이

클라이언트 필터는 브라우저가 이미 가진 배열에서 검색합니다.

```txt
브라우저 배열 -> filter()
```

서버 검색은 API에 검색어를 보내고, MongoDB에서 검색합니다.

```txt
브라우저
-> GET /api/post?keyword=react
-> API Route
-> MongoDB 검색
-> 검색 결과 응답
```

데이터가 많아질수록 서버 검색이 더 현실적인 구조입니다.

## API Route에서 검색어 읽기

`app/api/post/route.js`의 `GET` 함수는 `request` 인자를 받도록 바꿉니다.

```js
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const keyword = searchParams.get("keyword") || "";
  const posts = await listPosts(keyword);

  return apiSuccess(posts, "Posts fetched successfully");
}
```

`new URL(request.url)`을 사용하면 query string을 읽을 수 있습니다.

예를 들어 다음 주소에서

```txt
/api/post?keyword=react
```

`searchParams.get("keyword")`는 `"react"`를 반환합니다.

## listPosts(keyword)

`lib/posts.js`의 `listPosts` 함수는 검색어를 받을 수 있게 바꿉니다.

```js
export async function listPosts(keyword = "") {
  await seedPostsIfEmpty();

  const collection = await getPostsCollection();
  const searchKeyword = keyword.trim();

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
```

검색어가 없으면 전체 목록을 반환합니다.

검색어가 있으면 제목 또는 본문에 검색어가 포함된 글을 찾습니다.

## $regex와 $options

MongoDB의 `$regex`는 정규식 검색 조건입니다.

```js
{ title: { $regex: searchKeyword, $options: "i" } }
```

`$options: "i"`는 대소문자를 구분하지 않는다는 뜻입니다.

`$or`는 여러 조건 중 하나라도 맞으면 결과에 포함합니다.

```js
$or: [
  { title: ... },
  { content: ... },
]
```

## fetchPosts 공통 함수

홈 화면에서는 API 호출 로직을 함수로 분리합니다.

```js
async function fetchPosts(url) {
  const response = await fetch(url, { cache: "no-store" });
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to fetch posts");
  }

  return result.data;
}
```

API 응답이 통일되어 있으므로 성공 데이터는 항상 `result.data`에서 읽습니다.

## Server Search 버튼

검색어를 query string으로 만들어 API를 호출합니다.

```js
const searchKeyword = keyword.trim();
const url = searchKeyword
  ? `/api/post?keyword=${encodeURIComponent(searchKeyword)}`
  : "/api/post";
```

`encodeURIComponent()`는 검색어에 공백이나 특수문자가 들어가도 URL이 깨지지 않게 합니다.

## Show All은 다시 서버에서 불러오기

서버 검색 후 전체 목록으로 돌아갈 때는 `/api/post`를 다시 호출합니다.

```js
const data = await fetchPosts("/api/post");
setAllPosts(data);
setPosts(data);
setKeyword("");
setSearchMessage("");
```

이렇게 하면 다른 사용자가 추가한 글이나 방금 작성/삭제한 글도 최신 상태로 다시 받을 수 있습니다.

## 직접 실습 순서

1. `lib/posts.js`의 `listPosts`가 `keyword`를 받도록 수정한다.
2. 검색어가 없으면 전체 목록을 반환한다.
3. 검색어가 있으면 `$regex`와 `$or`로 제목/본문을 검색한다.
4. `app/api/post/route.js`의 `GET` 함수에서 query string을 읽는다.
5. `listPosts(keyword)`를 호출한다.
6. 홈 화면에 `fetchPosts(url)` 공통 함수를 만든다.
7. `handleServerSearch` 함수를 만든다.
8. `Server Search` 버튼을 추가한다.
9. `Show All`은 서버에서 전체 목록을 다시 불러오도록 바꾼다.

## 확인 방법

홈 화면에서 검색어를 입력합니다.

```txt
http://localhost:3000/
```

`Client Filter`와 `Server Search`를 각각 눌러 결과를 비교합니다.

브라우저 주소창에서 API를 직접 확인할 수도 있습니다.

```txt
http://localhost:3000/api/post?keyword=Blog
```

## 검증 명령

```bash
npm run lint
npm run build
```

## 이 단계의 핵심

검색은 어디에서 실행되는지에 따라 의미가 달라집니다. 클라이언트 필터는 브라우저 배열 검색이고, 서버 검색은 API와 DB를 사용하는 검색입니다.
