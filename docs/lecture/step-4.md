# Step 4. API Route와 통일된 JSON 응답 만들기

## 변경 내용

게시글 목록/작성/단건조회/수정 API Route를 만들고 { success, message, data } 응답 형식을 통일합니다.

- `lib/posts.js`의 데이터 함수를 HTTP API로 노출합니다.
- 목록/작성 API인 `/api/post`와 단건 조회/수정 API인 `/api/post/[id]`를 만듭니다.
- 모든 성공/실패 응답을 `{ success, message, data }` 구조로 통일합니다.

## 시작 전 확인

개인 실습 저장소의 `main`에서 직전 단계까지 마친 상태로 시작합니다. 코드 블록은 복사해 붙이지 않고 직접 입력합니다.

수정 전에 `git status --short`의 출력이 없는지 확인합니다. 변경이 남아 있다면 원인을 확인하고 시작 상태를 정리합니다.

## 작업 0. Windows용 실행 script 설정

MongoDB Driver가 포함된 Next.js 프로젝트를 Windows에서 안정적으로 build하도록 공식 webpack 옵션을 사용합니다. npm 명령으로 `package.json`의 script를 바꾸며 파일을 직접 입력하지 않습니다.

```powershell
npm.cmd pkg set "scripts.dev=next dev --webpack" "scripts.build=next build --webpack"
```

`package.json`에서 `dev`와 `build` 값에 `--webpack`이 추가되었는지 확인합니다.

## 작업 1. 공통 API 응답 helper 추가

API마다 응답 모양이 달라지면 화면 코드가 복잡해집니다. 성공과 실패 응답을 만드는 helper를 먼저 두고 route handler에서 재사용합니다.

### 수정할 파일

- 생성: `lib/apiResponse.js`

### 입력할 코드

아래 파일 경로를 확인하고 각 파일의 전체 내용을 입력합니다. 삭제로 표시된 파일은 PowerShell에서 제거합니다.

#### `lib/apiResponse.js`

`lib/apiResponse.js`를 열고 파일 전체를 다음 내용으로 맞춥니다.

~~~js
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
~~~

### 설명과 확인

- 성공 응답은 기본 status 200, 오류 응답은 전달한 status를 사용합니다.
- 화면 코드는 `success`, `message`, `data`를 같은 방식으로 읽습니다.

## 작업 2. 게시글 목록/작성 API 추가

`app/api/post/route.js`는 `/api/post` 주소를 담당합니다. `GET`은 목록을 반환하고, `POST`는 요청 body를 받아 새 게시글을 저장합니다.

### 수정할 파일

- 생성: `app/api/post/route.js`

### 입력할 코드

아래 파일 경로를 확인하고 각 파일의 전체 내용을 입력합니다. 삭제로 표시된 파일은 PowerShell에서 제거합니다.

#### `app/api/post/route.js`

`app/api/post/route.js`를 열고 파일 전체를 다음 내용으로 맞춥니다.

~~~js
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
~~~

### 설명과 확인

- App Router의 API 파일명은 `route.js`입니다.
- 현재 API는 제목과 본문의 공백 검증을 하지 않습니다.

## 작업 3. 게시글 단건 조회/수정 API 추가

`[id]` 폴더는 동적 라우트입니다. `/api/post/abc123`처럼 들어온 URL 조각을 `params`에서 읽어 단건 조회와 수정을 처리합니다.

### 수정할 파일

- 생성: [app/api/post/[id]/route.js](../../app/api/post/%5Bid%5D/route.js)

### 입력할 코드

아래 파일 경로를 확인하고 각 파일의 전체 내용을 입력합니다. 삭제로 표시된 파일은 PowerShell에서 제거합니다.

#### `app/api/post/[id]/route.js`

`app/api/post/[id]/route.js`를 열고 파일 전체를 다음 내용으로 맞춥니다.

~~~js
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
~~~

### 설명과 확인

- 없는 게시글은 404 응답을 반환합니다.
- 서버 오류는 console에 기록하고 클라이언트에는 공통 오류 메시지를 보냅니다.

## 실행 확인

기본 정적 검사는 다음 명령으로 확인합니다.

> Windows 11에서는 [환경 준비](../windows-11.md) <span class="print-reference" data-print-reference="true">(인쇄본 위치: Next.js · 장 「Windows 11 x64 실습 환경 준비」 · 절 「1. Windows Terminal 설치」)</span>를 먼저 확인합니다. 명령은 이 교재의 PowerShell 코드 블록에 적힌 `git`, `node`, `npm.cmd` 형태를 그대로 사용합니다.

```powershell
npm.cmd run lint
npm.cmd run build
```

브라우저 확인이 필요하면 개발 서버를 켠 뒤 해당 화면을 확인합니다.

```powershell
npm.cmd run dev
```

체크할 내용은 다음과 같습니다.

- 브라우저나 API 클라이언트에서 `/api/post`가 JSON을 반환하는지 확인한다.
- 잘못된 id로 `/api/post/잘못된값` 요청 시 오류 응답 구조가 유지되는지 확인한다.

## 독립 확인

존재하지 않는 ID와 빈 제목 요청의 상태 코드와 JSON을 기록합니다. 결과와 확인 방법을 한 문장으로 기록합니다. 실험값은 검사를 마치면 원래대로 복구합니다.

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
git commit -m "Complete Next.js step 4"
git push
git status --short --branch
```

현재 브랜치는 `main`이어야 합니다. 마지막 상태에서 `main...origin/main` 뒤에 `ahead`가 없고 작업 파일 목록도 비어 있어야 합니다.
