# Step 4. API Route로 게시글 JSON 응답 만들기

## 이 단계의 목표

`step-4` 브랜치는 `step-3`에서 만든 데이터 함수를 HTTP API로 연결하는 단계입니다.

이 단계가 끝나면 다음 API가 생깁니다.

| Method | URL | 역할 |
| --- | --- | --- |
| `GET` | `/api/post` | 게시글 목록 조회 |
| `POST` | `/api/post` | 새 게시글 작성 |
| `GET` | `/api/post/[id]` | 게시글 하나 조회 |
| `PUT` | `/api/post/[id]` | 게시글 하나 수정 |

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
app/api/post/route.js
app/api/post/[id]/route.js
```

`app/api/post/route.js`는 `/api/post` 주소를 담당합니다.

`app/api/post/[id]/route.js`는 `/api/post/abc123`처럼 id가 붙는 주소를 담당합니다.

대괄호가 있는 `[id]` 폴더는 동적 라우트입니다. 실제 주소의 해당 위치에 들어온 값을 코드에서 `params.id`로 읽을 수 있습니다.

## NextResponse.json

API는 보통 JSON을 반환합니다. Next.js에서는 `NextResponse.json()`을 사용하면 JSON 응답을 쉽게 만들 수 있습니다.

```js
import { NextResponse } from "next/server";

return NextResponse.json({ message: "hello" });
```

상태 코드를 지정하고 싶으면 두 번째 인자로 옵션을 넘깁니다.

```js
return NextResponse.json({ error: "Post not found" }, { status: 404 });
```

## /api/post의 GET

목록 조회 API는 `GET` 함수로 만듭니다.

```js
export async function GET() {
  try {
    const posts = await listPosts();
    return NextResponse.json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
```

함수 이름이 중요합니다. `GET` 요청을 처리하려면 export된 함수 이름이 `GET`이어야 합니다.

흐름은 다음과 같습니다.

```txt
브라우저 또는 fetch
-> GET /api/post
-> app/api/post/route.js의 GET 함수 실행
-> listPosts() 호출
-> MongoDB posts 컬렉션 조회
-> JSON 배열 응답
```

## /api/post의 POST

새 게시글 작성 API는 `POST` 함수로 만듭니다.

```js
export async function POST(request) {
  try {
    const postData = await request.json();

    if (!postData.title || !postData.content) {
      return NextResponse.json(
        { error: "Title and content are required" },
        { status: 400 },
      );
    }

    const result = await createPost(postData);

    return NextResponse.json(
      {
        message: "Post created successfully",
        postId: result.insertedId,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
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
  return NextResponse.json(
    { error: "Title and content are required" },
    { status: 400 },
  );
}
```

제목이나 본문이 없으면 MongoDB에 저장하지 않고 400 응답을 반환합니다.

상태 코드 400은 "요청한 클라이언트가 필요한 데이터를 제대로 보내지 않았다"는 뜻입니다.

## /api/post/[id]의 GET

게시글 하나를 조회할 때는 id가 필요합니다.

```js
export async function GET(_request, { params }) {
  try {
    const { id } = await params;
    const post = await getPostById(id);

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error("Error fetching post:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
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
      return NextResponse.json(
        { error: "Title and content are required" },
        { status: 400 },
      );
    }

    const result = await updatePost(id, postData);

    if (!result || result.matchedCount === 0) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Post updated successfully" });
  } catch (error) {
    console.error("Error updating post:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
```

여기서는 URL의 id와 요청 body의 데이터를 둘 다 사용합니다.

```txt
URL의 id      -> 어떤 게시글을 수정할지 결정
request body -> 제목과 본문을 어떤 값으로 바꿀지 결정
```

## try/catch를 사용하는 이유

MongoDB 연결 실패, 잘못된 데이터, 예상하지 못한 서버 오류가 생길 수 있습니다.

이런 오류가 그대로 밖으로 나가면 사용자에게 불친절한 오류 화면이 보이거나 서버 로그만 남을 수 있습니다. 그래서 API Route에서는 `try/catch`로 오류를 잡고 500 응답을 반환합니다.

```js
catch (error) {
  console.error("Error fetching posts:", error);
  return NextResponse.json(
    { error: "Internal Server Error" },
    { status: 500 },
  );
}
```

`console.error`는 서버 터미널에서 원인을 확인하기 위한 로그입니다. 사용자에게는 자세한 내부 오류를 그대로 보여주지 않습니다.

## 직접 실습 순서

1. `app/api/post` 폴더를 만든다.
2. `app/api/post/route.js` 파일을 만든다.
3. `NextResponse`, `createPost`, `listPosts`를 import한다.
4. `GET` 함수로 게시글 목록을 반환한다.
5. `POST` 함수로 새 게시글을 생성한다.
6. `app/api/post/[id]` 폴더를 만든다.
7. `app/api/post/[id]/route.js` 파일을 만든다.
8. `getPostById`, `updatePost`를 import한다.
9. `GET` 함수로 게시글 하나를 반환한다.
10. `PUT` 함수로 게시글 하나를 수정한다.

## API 테스트 준비

실제로 API를 호출하려면 MongoDB가 실행 중이어야 하고 `.env.local`이 있어야 합니다.

```bash
cp .env.example .env.local
```

로컬 MongoDB를 사용한다면 `.env.local`은 다음처럼 둘 수 있습니다.

```txt
MONGODB_URI=mongodb://localhost:27017/blog
MONGODB_DB=blog
```

## 브라우저에서 GET 테스트

개발 서버를 실행합니다.

```bash
npm run dev
```

브라우저에서 다음 주소로 접속합니다.

```txt
http://localhost:3000/api/post
```

MongoDB가 정상 연결되어 있으면 JSON 배열이 표시됩니다. 처음에는 샘플 게시글 10개가 자동으로 들어갈 수 있습니다.

## curl로 POST 테스트

브라우저 주소창에서는 POST 요청을 보내기 어렵습니다. 터미널에서 `curl`을 사용할 수 있습니다.

```bash
curl -X POST http://localhost:3000/api/post \
  -H "Content-Type: application/json" \
  -d '{"title":"First API Post","content":"Created from curl"}'
```

성공하면 다음과 비슷한 응답을 받습니다.

```json
{
  "message": "Post created successfully",
  "postId": "..."
}
```

## 검증 명령

코드 구조 자체는 다음 명령으로 검증합니다.

```bash
npm run lint
npm run build
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

### API에서 화면 JSX를 반환하는 경우

API Route는 JSX가 아니라 응답 객체를 반환해야 합니다.

```js
return NextResponse.json(posts);
```

### MongoDB 환경 변수를 준비하지 않는 경우

API는 데이터 함수를 호출하고, 데이터 함수는 MongoDB에 연결합니다. `.env.local`이 없으면 `Please define MONGODB_URI in .env.local` 오류가 서버 로그에 나타납니다.

## 이 단계에서 아직 하지 않는 것

아직 홈 화면은 API를 호출하지 않습니다. `/api/post`는 준비됐지만 `/` 화면은 여전히 정적 안내 문구를 보여줍니다.

다음 단계에서 홈 화면을 클라이언트 컴포넌트로 바꾸고, `fetch("/api/post")`로 게시글 목록을 불러옵니다.
