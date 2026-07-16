# Step 15. 서버 검색으로 전환하기

## 이번 단계에서 할 일

keyword query string을 API로 보내 MongoDB에서 직접 검색하는 서버 검색을 추가합니다.

- 검색어를 `/api/post?keyword=...` query string으로 보냅니다.
- MongoDB 쿼리에서 제목/본문 정규식 검색을 수행합니다.
- 홈 화면은 `Server Search` 버튼을 눌렀을 때 서버에서 필터링된 목록을 다시 가져옵니다.

## 작업 1. MongoDB 목록 함수에 keyword 필터 추가

검색 대상이 많아질수록 브라우저 필터보다 데이터베이스 검색이 적합합니다. `listPosts`가 선택적으로 keyword를 받아 MongoDB query를 구성하게 합니다.

### 수정할 파일

- 수정: [lib/posts.js](../../lib/posts.js)

### 코드 변경

아래 diff에서 `+`로 시작하는 줄을 추가하고, `-`로 시작하는 줄을 제거합니다. 새 파일은 diff에 보이는 전체 내용을 새로 입력합니다.

~~~diff
diff --git a/lib/posts.js b/lib/posts.js
index d24f792..4bbab9c 100644
--- a/lib/posts.js
+++ b/lib/posts.js
@@ -28,11 +28,25 @@ export async function seedPostsIfEmpty() {
   }
 }

-export async function listPosts() {
+export async function listPosts(keyword = "") {
   await seedPostsIfEmpty();

   const collection = await getPostsCollection();
-  return collection.find({}).sort({ createdAt: -1 }).toArray();
+  const searchKeyword = keyword.trim();
+
+  if (!searchKeyword) {
+    return collection.find({}).sort({ createdAt: -1 }).toArray();
+  }
+
+  return collection
+    .find({
+      $or: [
+        { title: { $regex: searchKeyword, $options: "i" } },
+        { content: { $regex: searchKeyword, $options: "i" } },
+      ],
+    })
+    .sort({ createdAt: -1 })
+    .toArray();
 }

 export async function createPost(postData) {
~~~

### 설명과 확인

- 제목 또는 본문 중 하나라도 매칭되도록 `$or` 조건을 사용합니다.
- 정규식 옵션 `i`는 대소문자를 구분하지 않게 합니다.

## 작업 2. API에서 keyword query string 읽기

`GET /api/post`가 요청 URL의 `keyword` 값을 읽어 `listPosts`에 넘깁니다. 이제 검색 조건은 API의 공식 입력이 됩니다.

### 수정할 파일

- 수정: [app/api/post/route.js](../../app/api/post/route.js)

### 코드 변경

아래 diff에서 `+`로 시작하는 줄을 추가하고, `-`로 시작하는 줄을 제거합니다. 새 파일은 diff에 보이는 전체 내용을 새로 입력합니다.

~~~diff
diff --git a/app/api/post/route.js b/app/api/post/route.js
index 346044d..ef88194 100644
--- a/app/api/post/route.js
+++ b/app/api/post/route.js
@@ -1,9 +1,12 @@
 import { apiError, apiSuccess } from "@/lib/apiResponse";
 import { createPost, listPosts } from "@/lib/posts";

-export async function GET() {
+export async function GET(request) {
   try {
-    const posts = await listPosts();
+    const { searchParams } = new URL(request.url);
+    const keyword = searchParams.get("keyword") || "";
+    const posts = await listPosts(keyword);
+
     return apiSuccess(posts, "Posts fetched successfully");
   } catch (error) {
     console.error("Error fetching posts:", error);
~~~

### 설명과 확인

- `new URL(request.url)`로 query string을 읽습니다.
- keyword가 없으면 기존처럼 전체 목록을 반환합니다.

## 작업 3. 홈 화면 fetch URL에 keyword 연결

`Server Search` 버튼을 누르면 현재 검색어로 API URL을 만들고 서버 검색 결과를 받아 화면에 표시합니다. 이 단계부터 검색 결과는 DB 기준입니다.

### 수정할 파일

- 수정: [app/page.js](../../app/page.js)

### 코드 변경

아래 diff에서 `+`로 시작하는 줄을 추가하고, `-`로 시작하는 줄을 제거합니다. 새 파일은 diff에 보이는 전체 내용을 새로 입력합니다.

~~~diff
diff --git a/app/page.js b/app/page.js
index 3c36f22..56808c0 100644
--- a/app/page.js
+++ b/app/page.js
@@ -23,6 +23,17 @@ function postMatchesKeyword(post, keyword) {
   );
 }

+async function fetchPosts(url) {
+  const response = await fetch(url, { cache: "no-store" });
+  const result = await response.json();
+
+  if (!response.ok) {
+    throw new Error(result.message || "Failed to fetch posts");
+  }
+
+  return result.data;
+}
+
 export default function Home() {
   const [allPosts, setAllPosts] = useState([]);
   const [posts, setPosts] = useState([]);
@@ -34,15 +45,9 @@ export default function Home() {
   useEffect(() => {
     async function loadPosts() {
       try {
-        const response = await fetch("/api/post", { cache: "no-store" });
-        const result = await response.json();
-
-        if (!response.ok) {
-          throw new Error(result.message || "Failed to fetch posts");
-        }
-
-        setAllPosts(result.data);
-        setPosts(result.data);
+        const data = await fetchPosts("/api/post");
+        setAllPosts(data);
+        setPosts(data);
       } catch (err) {
         setError(err instanceof Error ? err.message : "Failed to fetch posts");
       } finally {
@@ -72,11 +77,41 @@ export default function Home() {
     setSearchMessage(`Client filter result: ${filteredPosts.length} posts`);
   }

-  function handleShowAll() {
+  async function handleServerSearch() {
+    const searchKeyword = keyword.trim();
+    const url = searchKeyword
+      ? `/api/post?keyword=${encodeURIComponent(searchKeyword)}`
+      : "/api/post";
+
     setError("");
-    setKeyword("");
-    setPosts(allPosts);
-    setSearchMessage("");
+    setIsLoading(true);
+
+    try {
+      const data = await fetchPosts(url);
+      setPosts(data);
+      setSearchMessage(`Server search result: ${data.length} posts`);
+    } catch (err) {
+      setError(err instanceof Error ? err.message : "Failed to fetch posts");
+    } finally {
+      setIsLoading(false);
+    }
+  }
+
+  async function handleShowAll() {
+    setError("");
+    setIsLoading(true);
+
+    try {
+      const data = await fetchPosts("/api/post");
+      setAllPosts(data);
+      setPosts(data);
+      setKeyword("");
+      setSearchMessage("");
+    } catch (err) {
+      setError(err instanceof Error ? err.message : "Failed to fetch posts");
+    } finally {
+      setIsLoading(false);
+    }
   }

   return (
@@ -94,6 +129,9 @@ export default function Home() {
         <button type="button" onClick={handleClientFilter} disabled={isLoading}>
           Client Filter
         </button>
+        <button type="button" onClick={handleServerSearch} disabled={isLoading}>
+          Server Search
+        </button>
         <button type="button" onClick={handleShowAll} disabled={isLoading}>
           Show All
         </button>
~~~

### 설명과 확인

- `encodeURIComponent`로 검색어를 query string에 안전하게 넣습니다.
- 검색어가 빈 값이면 keyword parameter를 붙이지 않습니다.

## 실행 확인

기본 정적 검사는 다음 명령으로 확인합니다.

> Windows 11에서는 [환경 준비](../windows-11.md)를 먼저 확인합니다. `git`, `node`, `npm` 명령은 PowerShell에서도 같습니다. `npm.ps1` 오류가 나면 `npm.cmd`를 사용합니다.

```bash
npm run lint
npm run build
```

브라우저 확인이 필요하면 개발 서버를 켠 뒤 해당 화면을 확인합니다.

```bash
npm run dev
```

체크할 내용은 다음과 같습니다.

- 검색어를 입력한 뒤 `Server Search` 버튼을 누르면 `/api/post?keyword=...` 요청이 발생한다.
- 제목 또는 본문에 검색어가 있는 글만 보인다.

## 마무리 확인

- 이 문서의 각 작업 단위에서 설명을 먼저 읽고, 바로 아래 diff를 기준으로 파일을 수정합니다.
- 새 파일은 diff에 나온 전체 내용을 입력하고, 기존 파일은 diff의 `+`/`-` 줄만 비교하면서 수정합니다.
- 링크된 프로젝트 내부 파일을 열어 현재 단계의 완성본과 직접 비교할 수 있습니다.
