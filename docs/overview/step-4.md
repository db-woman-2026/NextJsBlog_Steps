# Step 4. API Route와 통일된 JSON 응답 만들기

## 배울 내용

`step-4` 브랜치는 `step-3`에서 만든 데이터 함수를 HTTP API로 연결하는 단계입니다.

완료 후에는 다음 API가 생깁니다.

| Method | URL | 요청 데이터 | 응답 데이터 |
| --- | --- | --- | --- |
| `GET` | `/api/post` | 없음 | 게시글 배열 |
| `POST` | `/api/post` | `{ title, content, image? }` | 생성된 게시글 id |
| `GET` | `/api/post/[id]` | URL의 `id` | 게시글 하나 |
| `PUT` | `/api/post/[id]` | URL의 `id`, `{ title, content }` | 수정된 게시글 id |

아직 홈 화면이나 작성 화면은 이 API를 호출하지 않습니다. 먼저 API 자체를 만들고, 다음 단계부터 화면과 연결합니다.

## API Route란 무엇인가

지금까지 만든 `page.js`는 화면을 반환했습니다.

```txt
app/about/page.js -> /about 화면
```

API Route는 화면 대신 데이터를 반환합니다.

```txt
app/api/post/route.js -> /api/post JSON 응답
```

App Router에서는 API Route 파일 이름이 `route.js`입니다. `page.js`가 화면을 담당하고, `route.js`가 HTTP 요청/응답을 담당한다고 생각하면 됩니다.

## 이번 단계의 파일 구조

```txt
lib/apiResponse.js
app/api/post/route.js
app/api/post/[id]/route.js
```

`lib/apiResponse.js`는 모든 API가 같은 모양의 JSON 응답을 반환하도록 돕는 작은 헬퍼입니다.

`app/api/post/route.js`는 `/api/post` 주소를 담당합니다.

`app/api/post/[id]/route.js`는 `/api/post/abc123`처럼 id가 붙는 주소를 담당합니다.

대괄호가 있는 `[id]` 폴더는 동적 라우트입니다. 실제 주소의 해당 위치에 들어온 값을 코드에서 `params.id`로 읽을 수 있습니다.

## 응답 형식 통일

API가 어떤 곳은 배열을 바로 반환하고, 어떤 곳은 `{ message, postId }`, 오류는 `{ error }`처럼 반환하면 클라이언트 코드가 매번 다른 방식으로 응답을 읽어야 합니다.

그래서 이 프로젝트의 API는 성공과 실패 모두 다음 최상위 필드를 사용합니다.

```json
{
  "success": true,
  "message": "Posts fetched successfully",
  "data": []
}
```

오류 응답도 같은 필드를 사용합니다.

```json
{
  "success": false,
  "message": "Post not found",
  "data": null
}
```

이렇게 정하면 화면에서는 항상 다음 순서로 처리할 수 있습니다.

```txt
1. response.ok로 HTTP 성공 여부를 확인한다.
2. response.json()으로 body를 읽는다.
3. 성공하면 data를 사용한다.
4. 실패하면 message를 오류 메시지로 사용한다.
```

## apiResponse 헬퍼

`lib/apiResponse.js` 파일을 만들고 공통 응답 함수를 둡니다.

```js
import { NextResponse } from "next/server";

export function apiSuccess(data, message = "OK", init = {}) {
  return NextResponse.json(
    {
      success: true,
      message,
      data,
    },
    init,
  );
}

export function apiError(message = "Internal Server Error", status = 500) {
  return NextResponse.json(
    {
      success: false,
      message,
      data: null,
    },
    { status },
  );
}
```

`apiSuccess`는 성공 응답을 만들고, `apiError`는 오류 응답을 만듭니다.

상태 코드는 HTTP 의미에 맞게 유지합니다. 예를 들어 생성 성공은 `201`, 잘못된 요청은 `400`, 없는 게시글은 `404`, 서버 오류는 `500`을 사용합니다.

## /api/post의 GET

목록 조회 API는 `GET` 함수로 만듭니다.

```js
import { apiError, apiSuccess } from "@/lib/apiResponse";
import { createPost, listPosts } from "@/lib/posts";

export async function GET() {
  try {
    const posts = await listPosts();
    return apiSuccess(posts, "Posts fetched successfully");
  } catch (error) {
    console.error("Error fetching posts:", error);
    return apiError("Internal Server Error", 500);
  }
}
```

Next.js는 export된 `GET` 함수를 찾아 GET 요청을 이 route handler로 전달합니다.

흐름은 다음과 같습니다.

```txt
브라우저 또는 fetch
-> GET /api/post
-> app/api/post/route.js의 GET 함수 실행
-> listPosts() 호출
-> MongoDB posts 컬렉션 조회
-> { success, message, data } 응답
```

## /api/post의 POST

새 게시글 작성 API는 `POST` 함수로 만듭니다.

```js
export async function POST(request) {
  try {
    const postData = await request.json();

    if (!postData.title || !postData.content) {
      return apiError("Title and content are required", 400);
    }

    const result = await createPost(postData);

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

`request.json()`은 요청 body에 담긴 JSON 데이터를 JavaScript 객체로 바꿉니다.

예를 들어 클라이언트가 다음 데이터를 보내면

```json
{
  "title": "Hello",
  "content": "My first post"
}
```

서버에서는 다음처럼 사용할 수 있습니다.

```js
const postData = await request.json();
console.log(postData.title);
console.log(postData.content);
```

## 유효성 검사

작성과 수정 API에는 아주 기본적인 유효성 검사가 있습니다.

```js
if (!postData.title || !postData.content) {
  return apiError("Title and content are required", 400);
}
```

제목이나 본문이 없으면 MongoDB에 저장하지 않고 400 응답을 반환합니다.

상태 코드 400은 "요청한 클라이언트가 필요한 데이터를 제대로 보내지 않았다"는 뜻입니다. 이때 body는 `{ success: false, message, data: null }` 형식입니다.

## /api/post/[id]의 GET

게시글 하나를 조회할 때는 id가 필요합니다.

```js
import { apiError, apiSuccess } from "@/lib/apiResponse";
import { getPostById, updatePost } from "@/lib/posts";

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
```

최신 Next.js에서는 `params`를 비동기 값처럼 다루기 때문에 다음처럼 `await`합니다.

```js
const { id } = await params;
```

`_request`처럼 앞에 밑줄이 있는 이름은 "인자로 들어오지만 이 함수에서는 직접 사용하지 않는다"는 의미로 자주 씁니다.

## /api/post/[id]의 PUT

수정 API는 `PUT` 함수로 만듭니다.

```js
export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const postData = await request.json();

    if (!postData.title || !postData.content) {
      return apiError("Title and content are required", 400);
    }

    const result = await updatePost(id, postData);

    if (!result || result.matchedCount === 0) {
      return apiError("Post not found", 404);
    }

    return apiSuccess({ postId: id }, "Post updated successfully");
  } catch (error) {
    console.error("Error updating post:", error);
    return apiError("Internal Server Error", 500);
  }
}
```

여기서는 URL의 id와 요청 body의 데이터를 둘 다 사용합니다.

```txt
URL의 id      -> 어떤 게시글을 수정할지 결정
request body -> 제목과 본문을 어떤 값으로 바꿀지 결정
```

## API별 요청과 응답

### GET /api/post

요청 body는 없습니다.

성공 응답은 게시글 배열을 `data`에 담습니다.

```json
{
  "success": true,
  "message": "Posts fetched successfully",
  "data": [
    {
      "_id": "64f...",
      "title": "Blog Post 1",
      "content": "..."
    }
  ]
}
```

### POST /api/post

요청 body는 JSON입니다.

```json
{
  "title": "First API Post",
  "content": "Created from curl"
}
```

성공 응답은 생성된 id를 `data.postId`에 담습니다.

```json
{
  "success": true,
  "message": "Post created successfully",
  "data": {
    "postId": "64f..."
  }
}
```

### GET /api/post/[id]

요청 body는 없습니다. URL의 `[id]` 값을 사용합니다.

성공 응답은 게시글 하나를 `data`에 담습니다.

```json
{
  "success": true,
  "message": "Post fetched successfully",
  "data": {
    "_id": "64f...",
    "title": "Blog Post 1",
    "content": "..."
  }
}
```

### PUT /api/post/[id]

요청 body는 JSON입니다.

```json
{
  "title": "Updated title",
  "content": "Updated content"
}
```

성공 응답은 수정된 id를 `data.postId`에 담습니다.

```json
{
  "success": true,
  "message": "Post updated successfully",
  "data": {
    "postId": "64f..."
  }
}
```

### 오류 응답

유효성 검사 실패, 없는 게시글, 서버 오류도 같은 형식을 사용합니다.

```json
{
  "success": false,
  "message": "Title and content are required",
  "data": null
}
```

## try/catch를 사용하는 이유

MongoDB 연결 실패, 잘못된 데이터, 예상하지 못한 서버 오류가 생길 수 있습니다.

이런 오류가 그대로 밖으로 나가면 사용자에게 불친절한 오류 화면이 보이거나 서버 로그만 남을 수 있습니다. 그래서 API Route에서는 `try/catch`로 오류를 잡고 500 응답을 반환합니다.

```js
catch (error) {
  console.error("Error fetching posts:", error);
  return apiError("Internal Server Error", 500);
}
```

`console.error`는 서버 터미널에서 원인을 확인하기 위한 로그입니다. 사용자에게는 자세한 내부 오류를 그대로 보여주지 않습니다.

## 실습 순서

1. `lib/apiResponse.js` 파일을 만든다.
2. `apiSuccess`, `apiError` 함수를 작성한다.
3. `app/api/post` 폴더를 만든다.
4. `app/api/post/route.js` 파일을 만든다.
5. `apiSuccess`, `apiError`, `createPost`, `listPosts`를 import한다.
6. `GET` 함수로 게시글 목록을 `{ success, message, data }` 형식으로 반환한다.
7. `POST` 함수로 새 게시글을 생성한다.
8. `app/api/post/[id]` 폴더를 만든다.
9. `app/api/post/[id]/route.js` 파일을 만든다.
10. `getPostById`, `updatePost`를 import한다.
11. `GET` 함수로 게시글 하나를 `{ success, message, data }` 형식으로 반환한다.
12. `PUT` 함수로 게시글 하나를 수정한다.
13. 모든 오류 응답도 `apiError`로 반환한다.

## API 테스트 준비

실제로 API를 호출하려면 MongoDB가 실행 중이어야 하고 `.env.local`이 있어야 합니다.

> Windows 11에서는 [환경 준비](../windows-11.md)를 먼저 확인합니다. `git`, `node`, `npm.cmd` 명령은 PowerShell에서도 같습니다. `npm.ps1` 오류가 나면 `npm.cmd`를 사용합니다.

```powershell
Copy-Item -LiteralPath .env.example -Destination .env.local
```

PowerShell에서는 다음 명령을 사용합니다.

```powershell
Copy-Item .env.example .env.local
```

로컬 MongoDB를 사용한다면 `.env.local`은 다음처럼 둘 수 있습니다.

```txt
MONGODB_URI=mongodb://localhost:27017/next_blog_practice
MONGODB_DB=next_blog_practice
```

## 브라우저에서 GET 테스트

개발 서버를 실행합니다.

```powershell
npm.cmd run dev
```

브라우저에서 다음 주소로 접속합니다.

```txt
http://localhost:3000/api/post
```

MongoDB가 정상 연결되어 있으면 `{ success, message, data }` 형식의 JSON이 표시됩니다. 처음에는 샘플 게시글 10개가 `data` 배열에 자동으로 들어갈 수 있습니다.

## PowerShell로 POST 테스트

브라우저 주소창에서는 POST 요청을 보낼 수 없습니다. 새 Windows Terminal의 PowerShell 탭에서 다음 명령을 사용합니다.

```powershell
$body = @{
  title = "First API Post"
  content = "Created from PowerShell"
} | ConvertTo-Json

Invoke-RestMethod -Method Post -Uri "http://localhost:3000/api/post" -ContentType "application/json" -Body $body
```

성공하면 다음과 비슷한 응답을 받습니다.

```json
{
  "success": true,
  "message": "Post created successfully",
  "data": {
    "postId": "64f..."
  }
}
```

## 검증 명령

코드 구조 자체는 다음 명령으로 검증합니다.

```powershell
npm.cmd run lint
npm.cmd run build
```

API 동작까지 확인하려면 개발 서버, MongoDB, `.env.local`이 모두 필요합니다.

## 자주 발생하는 실수

### page.js로 API를 만드는 경우

API Route는 `page.js`가 아니라 `route.js`입니다.

```txt
app/api/post/route.js
```

### 함수 이름을 소문자로 쓰는 경우

`get`, `post`가 아니라 `GET`, `POST`처럼 대문자로 export해야 합니다.

### request.json()에 await를 빼먹는 경우

`request.json()`은 Promise를 반환합니다. 따라서 다음처럼 `await`가 필요합니다.

```js
const postData = await request.json();
```

### API마다 다른 응답 구조를 쓰는 경우

이 프로젝트에서는 배열을 바로 반환하거나 `{ error }`만 반환하지 않습니다.

```js
return apiSuccess(posts, "Posts fetched successfully");
return apiError("Post not found", 404);
```

### MongoDB 환경 변수를 준비하지 않는 경우

API는 데이터 함수를 호출하고, 데이터 함수는 MongoDB에 연결합니다. `.env.local`이 없으면 `Please define MONGODB_URI in .env.local` 오류가 서버 로그에 나타납니다.

## 이 단계에서 아직 하지 않는 것

아직 홈 화면은 API를 호출하지 않습니다. `/api/post`는 준비됐지만 `/` 화면은 여전히 정적 안내 문구를 보여줍니다.

다음 단계에서 홈 화면을 클라이언트 컴포넌트로 바꾸고, `fetch("/api/post")`로 게시글 목록을 불러옵니다.
