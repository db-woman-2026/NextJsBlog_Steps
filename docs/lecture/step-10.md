# Step 10. 입력값 검증 강화와 서버 오류 메시지 표시

## 변경 내용

작성/수정 API에 서버 검증을 추가하고 공백 입력 오류 메시지를 화면에 표시합니다.

- 작성/수정 API에서 title과 content가 문자열인지 확인합니다.
- 앞뒤 공백을 `trim()`으로 제거하고 공백뿐인 값은 거절합니다.
- 검증 실패 시 공통 오류 응답으로 화면에 표시 가능한 message를 반환합니다.

## 시작 전 확인

개인 실습 저장소의 `main`에서 직전 단계까지 마친 상태로 시작합니다. 코드 블록은 복사해 붙이지 않고 직접 입력합니다.

수정 전에 `git status --short`의 출력이 없는지 확인합니다. 변경이 남아 있다면 원인을 확인하고 시작 상태를 정리합니다.

## 작업 1. 작성 API에 서버 검증 추가

브라우저의 `required`는 편의 기능일 뿐 API 보호 장치가 아닙니다. `POST /api/post`에서 요청 body를 정리하고 빈 title/content를 400으로 거절합니다.

### 수정할 파일

- 수정: `app/api/post/route.js`

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

- 공백만 들어온 문자열은 `trim()` 후 빈 문자열이 됩니다.
- 검증된 `title`, `content`만 `createPost`에 전달합니다.

## 작업 2. 수정 API에도 같은 검증 적용

작성과 수정은 같은 데이터 규칙을 가져야 합니다. `PUT /api/post/[id]`에도 동일하게 문자열 확인과 trim 처리를 넣습니다.

### 수정할 파일

- 수정: [app/api/post/[id]/route.js](../../app/api/post/%5Bid%5D/route.js)

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
~~~

### 설명과 확인

- API는 브라우저 form 외에도 curl, Postman, 악의적 요청으로 호출될 수 있습니다.
- 검증 규칙이 작성/수정에 동시에 들어가야 데이터 품질이 유지됩니다.

## 실행 확인

기본 정적 검사는 다음 명령으로 확인합니다.

> Windows 11에서는 [환경 준비](../windows-11.md) <span class="print-reference" data-print-reference="true">(Next.js · Windows 11 x64 실습 환경 준비 · 1. Windows Terminal 설치)</span>를 먼저 확인합니다. 명령은 이 교재의 PowerShell 코드 블록에 적힌 `git`, `node`, `npm` 형태를 그대로 사용합니다.

```powershell
npm run lint
npm run build
```

브라우저 확인이 필요하면 개발 서버를 켠 뒤 해당 화면을 확인합니다.

```powershell
npm run dev
```

체크할 내용은 다음과 같습니다.

- `/post`에서 공백만 입력해 제출하면 오류 메시지가 보인다.
- 수정 화면에서도 공백 입력이 저장되지 않는다.

## 독립 확인

공백 문자열과 정상 문자열의 POST 응답을 비교합니다. 결과와 확인 방법을 한 문장으로 기록합니다. 실험값은 검사를 마치면 원래대로 복구합니다.

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
git commit -m "Complete Next.js step 10"
git push
git status --short --branch
```

현재 브랜치는 `main`이어야 합니다. 마지막 상태에서 `main...origin/main` 뒤에 `ahead`가 없고 작업 파일 목록도 비어 있어야 합니다.
