# Step 10. 입력값 검증 강화와 서버 오류 메시지 표시

이 문서는 `step-9`에서 시작해 `step-10`를 완성하는 실습 자료입니다.
원본 개요는 [docs/overview/step-10.md](../overview/step-10.md)에 보존되어 있습니다.
실제 완성 코드는 [step-10 브랜치](https://github.com/db-woman-2026/NextJsBlog_Steps/tree/step-10) 기준입니다.

## 이번 단계 목표

작성/수정 API에 서버 검증을 추가하고 공백 입력 오류 메시지를 화면에 표시합니다.

이번 단계에서 집중할 내용은 다음과 같습니다.

- 브라우저 required만 믿지 않고 서버 API에서 다시 검증합니다.
- title과 content가 문자열인지 확인하고 trim 처리합니다.
- API 오류 message를 화면 오류 메시지로 보여줍니다.

## 시작 기준

이전 단계인 `step-9` 브랜치까지 완료된 상태에서 시작합니다.

```bash
git switch step-9
# 실습용 브랜치를 직접 만들 경우
git switch -c practice-step-10
```

수업 저장소의 정답 브랜치를 바로 확인하려면 다음 명령을 사용할 수 있습니다.

```bash
git switch step-10
```

## 수정 파일

| 상태 | 파일 | 확인 링크 |
| --- | --- | --- |
| 수정 | `app/api/post/[id]/route.js` | [app/api/post/[id]/route.js](https://github.com/db-woman-2026/NextJsBlog_Steps/blob/step-10/app/api/post/%5Bid%5D/route.js) |
| 수정 | `app/api/post/route.js` | [app/api/post/route.js](https://github.com/db-woman-2026/NextJsBlog_Steps/blob/step-10/app/api/post/route.js) |

문서 파일은 이 강의 자료에서 별도로 관리하므로 위 표에는 기능 구현에 필요한 코드와 설정 파일만 넣었습니다.

## 코드 작성

아래 순서대로 파일을 만들거나 수정합니다. 각 코드 블록은 해당 단계 브랜치의 실제 파일 내용을 기준으로 합니다.

### 1. app/api/post/[id]/route.js

기존 `app/api/post/[id]/route.js` 파일을 열고 아래 최종 코드와 같게 수정합니다.

서버에서 실행되는 API Route입니다. 브라우저 화면 코드가 이 주소로 요청을 보내 데이터를 읽거나 변경합니다.

```jsx
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

    const result = await updatePost(id, { title, content });

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

### 2. app/api/post/route.js

기존 `app/api/post/route.js` 파일을 열고 아래 최종 코드와 같게 수정합니다.

서버에서 실행되는 API Route입니다. 브라우저 화면 코드가 이 주소로 요청을 보내 데이터를 읽거나 변경합니다.

```jsx
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

## 실행 확인

기본 확인 명령은 다음과 같습니다.

```bash
npm run lint
npm run build
npm run dev
```

화면과 기능은 다음 순서로 확인합니다.

- /post에서 제목 또는 본문에 공백만 넣고 제출합니다.
- 작성/수정 화면에서 Title and content are required 메시지가 보이는지 확인합니다.

## 자주 확인할 부분

- 파일 이름과 폴더 이름을 정확히 입력합니다. App Router에서는 `page.js`, `layout.js`, `route.js`, `not-found.js`, `error.js` 같은 파일명이 특별한 의미를 가집니다.
- 클라이언트 상태나 이벤트를 쓰는 파일에는 필요한 경우에만 `"use client";`를 둡니다. 서버에서 실행되어야 하는 MongoDB 코드는 클라이언트 컴포넌트로 가져오지 않습니다.
- API 응답은 가능한 한 `{ success, message, data }` 구조를 유지합니다. 화면 코드는 이 구조를 기준으로 `message`와 `data`를 읽습니다.
- 실습 중 막히면 먼저 이 문서의 코드 블록과 브랜치 링크의 실제 파일을 비교합니다.

## 개념 정리

아래 내용은 기존 단계 개요를 강의 문서 안에서도 바로 볼 수 있도록 가져온 것입니다. 코드 작성 후 다시 읽으면 각 변경의 이유를 확인하기 쉽습니다.

## 이 단계의 목표

`step-10`은 작성/수정 API의 입력값 검증을 강화하는 단계입니다.

`step-6`과 `step-7`에서 form에는 `required` 속성이 들어갔습니다. 하지만 `required`는 브라우저에서만 동작합니다. API는 브라우저 form이 아닌 다른 방법으로도 호출할 수 있으므로 서버에서도 반드시 검증해야 합니다.

이 단계에서는 다음을 구현합니다.

- 제목과 본문이 문자열인지 확인한다.
- `trim()`으로 앞뒤 공백을 제거한다.
- 공백만 입력한 값은 빈 값으로 처리한다.
- 작성 API와 수정 API에 같은 검증 규칙을 적용한다.
- API가 반환한 `message`를 작성/수정 화면의 오류 메시지로 보여준다.

## 왜 required만으로 부족한가

다음 input은 빈 값 제출을 브라우저에서 막아줍니다.

```jsx
<input required />
```

하지만 사용자가 공백만 입력하면 브라우저 입장에서는 값이 있는 것으로 볼 수 있습니다.

```txt
"     "
```

또한 API는 브라우저 form 없이도 직접 호출될 수 있습니다.

```bash
curl -X POST http://localhost:3000/api/post \
  -H "Content-Type: application/json" \
  -d '{"title":"   ","content":"   "}'
```

따라서 서버 API가 최종 방어선이 되어야 합니다.

## 작성 API 검증

`app/api/post/route.js`의 `POST` 함수에서 요청 body를 읽은 뒤 값을 정리합니다.

```js
const postData = await request.json();
const title =
  typeof postData.title === "string" ? postData.title.trim() : "";
const content =
  typeof postData.content === "string" ? postData.content.trim() : "";
```

`typeof postData.title === "string"`은 값이 문자열인지 확인합니다.

문자열이면 `trim()`으로 앞뒤 공백을 제거합니다. 문자열이 아니면 빈 문자열로 처리합니다.

## 공백 입력 막기

정리한 값이 비어 있으면 API는 400 응답을 반환합니다.

```js
if (!title || !content) {
  return apiError("Title and content are required", 400);
}
```

이 프로젝트의 API는 `step-4`에서 응답 형식을 통일했습니다. 따라서 오류 응답도 다음 모양을 유지합니다.

```json
{
  "success": false,
  "message": "Title and content are required",
  "data": null
}
```

## 정리된 값 저장하기

MongoDB에는 공백이 제거된 값을 저장합니다.

```js
const result = await createPost({
  title,
  content,
  image: postData.image,
});
```

이렇게 하면 사용자가 `"  Hello  "`를 입력해도 DB에는 `"Hello"`가 저장됩니다.

## 수정 API에도 같은 규칙 적용

`app/api/post/[id]/route.js`의 `PUT` 함수도 같은 방식으로 바꿉니다.

```js
const title =
  typeof postData.title === "string" ? postData.title.trim() : "";
const content =
  typeof postData.content === "string" ? postData.content.trim() : "";
```

그리고 `updatePost`에는 정리된 값을 전달합니다.

```js
const result = await updatePost(id, { title, content });
```

작성과 수정의 검증 규칙이 다르면 사용자 입장에서 예측하기 어렵습니다. 같은 데이터 모델을 다루는 API는 가능한 한 같은 규칙을 사용하는 것이 좋습니다.

## 화면에서 오류 메시지 보기

작성 화면과 수정 화면은 이미 API 응답의 `message`를 읽고 있습니다.

```js
const result = await response.json();

if (!response.ok) {
  throw new Error(result.message || "Failed to create post");
}
```

따라서 이 단계에서는 클라이언트 코드를 크게 바꾸지 않아도 서버가 보낸 메시지가 화면에 표시됩니다.

## 직접 실습 순서

1. `app/api/post/route.js`의 `POST` 함수에서 `postData`를 읽는다.
2. `title`, `content`를 문자열인지 확인하고 `trim()`한다.
3. 둘 중 하나라도 비어 있으면 `apiError(..., 400)`을 반환한다.
4. `createPost`에는 정리된 `title`, `content`를 전달한다.
5. `app/api/post/[id]/route.js`의 `PUT` 함수도 같은 방식으로 수정한다.
6. 작성/수정 화면에서 공백만 입력했을 때 오류 메시지가 보이는지 확인한다.

## 확인 방법

개발 서버를 실행합니다.

```bash
npm run dev
```

작성 화면에서 제목이나 본문에 공백만 입력하고 제출합니다.

```txt
http://localhost:3000/post
```

화면에 다음 메시지가 표시되면 성공입니다.

```txt
Title and content are required
```

수정 화면에서도 같은 방식으로 확인합니다.

## 검증 명령

```bash
npm run lint
npm run build
```

## 이 단계의 핵심

브라우저 검증은 사용자 편의 기능이고, 서버 검증은 데이터 보호 장치입니다. 둘 다 필요하지만 최종 책임은 서버 API에 있습니다.
