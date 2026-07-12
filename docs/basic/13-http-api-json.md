# 13. HTTP, API, JSON, 검증

## 이번 장의 목표

- HTTP 요청의 method, URL, header, body를 구분합니다.
- CRUD와 GET/POST/PUT/DELETE의 관계를 이해합니다.
- 상태 코드와 일관된 JSON 응답을 읽습니다.
- 클라이언트 검증과 서버 검증의 차이를 알아봅니다.

## 1. HTTP 요청의 구성

브라우저와 서버는 HTTP로 요청과 응답을 주고받습니다.

```txt
POST /api/post HTTP/1.1
Content-Type: application/json

{
  "title": "새 글",
  "content": "본문"
}
```

- method: `POST`
- URL path: `/api/post`
- header: `Content-Type: application/json`
- body: 제목과 본문 데이터

GET 요청처럼 body가 없는 요청도 있습니다.

## 2. CRUD와 HTTP method

CRUD는 데이터를 다루는 네 가지 기본 행동의 첫 글자입니다.

| 행동 | CRUD | HTTP method | 예제 URL |
| --- | --- | --- | --- |
| 만들기 | Create | POST | `/api/post` |
| 읽기 | Read | GET | `/api/post`, `/api/post/abc` |
| 수정 | Update | PUT | `/api/post/abc` |
| 삭제 | Delete | DELETE | `/api/post/abc` |

같은 URL이라도 method가 다르면 다른 행동입니다.

```txt
GET    /api/post/abc -> abc 게시글 읽기
PUT    /api/post/abc -> abc 게시글 수정
DELETE /api/post/abc -> abc 게시글 삭제
```

## 3. JSON

JSON은 시스템 사이에서 데이터를 주고받을 때 자주 쓰는 문자열 형식입니다.

```json
{
  "title": "Next.js",
  "published": true,
  "tags": ["react", "web"],
  "author": {
    "name": "Kim"
  }
}
```

JSON의 key와 문자열은 큰따옴표를 사용합니다. 함수나 `undefined`는 JSON 값으로 표현하지 않습니다.

JavaScript 값과 JSON 문자열을 변환합니다.

```js
const post = { title: "Hello" };
const jsonText = JSON.stringify(post);
const parsedPost = JSON.parse(jsonText);
```

`fetch`의 `response.json()`은 응답 JSON을 읽어 JavaScript 값으로 바꾸는 일을 포함합니다.

## 4. HTTP 상태 코드

응답에는 처리 결과를 나타내는 숫자 상태 코드가 있습니다.

| 코드 | 의미 | 예제 |
| --- | --- | --- |
| 200 | 성공 | 조회/수정/삭제 성공 |
| 201 | 생성 성공 | 새 게시글 생성 |
| 400 | 잘못된 요청 | 필수 입력값 누락 |
| 404 | 찾을 수 없음 | id에 해당하는 게시글 없음 |
| 500 | 서버 내부 오류 | DB 연결 실패 등 예상하지 못한 실패 |

`2xx`는 성공, `4xx`는 요청 쪽 문제, `5xx`는 서버 처리 문제를 나타냅니다.

## 5. 일관된 응답 구조

API마다 전혀 다른 구조를 반환하면 클라이언트 코드가 복잡해집니다. 이 프로젝트는 최상위 필드를 통일합니다.

```json
{
  "success": true,
  "message": "Post created successfully",
  "data": {
    "postId": "abc123"
  }
}
```

실패 응답도 같은 모양을 유지합니다.

```json
{
  "success": false,
  "message": "Title and content are required",
  "data": null
}
```

클라이언트는 상태 코드와 message를 함께 확인합니다.

```js
const result = await response.json();

if (!response.ok) {
  throw new Error(result.message || "요청에 실패했습니다.");
}
```

## 6. API route의 입력과 출력

```js
import { NextResponse } from "next/server";

export async function POST(request) {
  const postData = await request.json();

  return NextResponse.json(
    {
      success: true,
      message: "Post created successfully",
      data: postData,
    },
    { status: 201 },
  );
}
```

`request.json()`은 요청 body를 읽습니다. Next.js의 `NextResponse.json()`은 JSON 응답과 상태 코드를 만듭니다.

같은 응답 모양을 반복하지 않도록 helper 함수로 분리할 수 있습니다.

```js
import { NextResponse } from "next/server";

export function apiSuccess(data, message = "OK", init = {}) {
  return NextResponse.json(
    { success: true, message, data },
    init,
  );
}

export function apiError(message, status = 500) {
  return NextResponse.json(
    { success: false, message, data: null },
    { status },
  );
}
```

## 7. 입력값 검증

HTML의 `required`는 사용자가 빈 form을 제출하는 것을 브라우저에서 먼저 막아 줍니다.

```jsx
<input id="title" required />
```

하지만 브라우저 검증만 믿을 수는 없습니다. 다른 프로그램이 API를 직접 호출할 수도 있고 브라우저 검증을 우회할 수도 있습니다. 서버가 데이터를 저장하기 전에 다시 검증해야 합니다.

```js
const title =
  typeof postData.title === "string" ? postData.title.trim() : "";
const content =
  typeof postData.content === "string" ? postData.content.trim() : "";

if (!title || !content) {
  return NextResponse.json(
    {
      success: false,
      message: "Title and content are required",
      data: null,
    },
    { status: 400 },
  );
}
```

검증 순서입니다.

1. 원하는 자료형인지 확인합니다.
2. 문자열 앞뒤 공백을 제거합니다.
3. 필수값이 비어 있는지 확인합니다.
4. 통과한 값만 데이터 함수에 전달합니다.

## 8. 오류를 숨기지 않되 내부 정보는 노출하지 않기

서버에서는 개발자가 원인을 찾도록 실제 오류를 기록할 수 있습니다.

```js
catch (error) {
  console.error("Error creating post:", error);
  return apiError("Internal Server Error", 500);
}
```

사용자 응답에는 비밀번호, 환경 변수, DB 연결 문자열, 긴 stack trace 같은 내부 정보를 넣지 않습니다.

## 프로젝트에서 다시 만나기

- `step-4`: CRUD API와 `{ success, message, data }` 구조를 만듭니다.
- `step-6`: form 데이터를 JSON body로 POST합니다.
- `step-7`: 동적 id URL에 PUT 요청을 보냅니다.
- `step-10`: 브라우저 검증과 별도로 서버 검증을 추가합니다.
- `step-13`: DELETE 요청과 404 응답을 처리합니다.

## 확인하기

1. 새 데이터를 만드는 데 주로 사용하는 HTTP method는 무엇인가요?
2. 필수 입력값 누락에는 400과 500 중 어느 상태 코드가 더 알맞나요?
3. HTML에 `required`가 있어도 서버 검증이 필요한 이유는 무엇인가요?

정답: POST입니다. 400입니다. API는 브라우저 밖에서도 호출할 수 있고 클라이언트 검증은 우회될 수 있기 때문입니다.
