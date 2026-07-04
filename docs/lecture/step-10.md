# Step 10. 입력값 검증 강화와 서버 오류 메시지 표시

이 문서는 `step-9`에서 시작해 `step-10`를 완성하는 실습 자료입니다.
원본 개요는 [docs/overview/step-10.md](../overview/step-10.md)에 보존되어 있습니다.
아래 파일 링크는 GitHub가 아니라 이 프로젝트 안의 현재 단계 파일을 여는 경로입니다.

## 이번 스텝 주요 기능 Overview

작성/수정 API에 서버 검증을 추가하고 공백 입력 오류 메시지를 화면에 표시합니다.

- 작성/수정 API에서 title과 content가 문자열인지 확인합니다.
- 앞뒤 공백을 `trim()`으로 제거하고 공백뿐인 값은 거절합니다.
- 검증 실패 시 공통 오류 응답으로 화면에 표시 가능한 message를 반환합니다.

## 시작 기준

이전 단계인 `step-9` 브랜치까지 완료된 상태에서 시작합니다.

```bash
git switch step-9
git switch -c practice-step-10
```

정답 브랜치는 확인용으로만 사용합니다.

```bash
git switch step-10
```

## 작업 1. 작성 API에 서버 검증 추가

브라우저의 `required`는 편의 기능일 뿐 API 보호 장치가 아닙니다. `POST /api/post`에서 요청 body를 정리하고 빈 title/content를 400으로 거절합니다.

### 수정할 파일

- 수정: [app/api/post/route.js](../../app/api/post/route.js)

### 이전 단계와 달라지는 코드

아래 diff에서 `+`로 시작하는 줄을 추가하고, `-`로 시작하는 줄을 제거합니다. 새 파일은 diff에 보이는 전체 내용을 새로 입력합니다.

~~~diff
diff --git a/app/api/post/route.js b/app/api/post/route.js
index 98fabfd..346044d 100644
--- a/app/api/post/route.js
+++ b/app/api/post/route.js
@@ -14,12 +14,20 @@ export async function GET() {
 export async function POST(request) {
   try {
     const postData = await request.json();
+    const title =
+      typeof postData.title === "string" ? postData.title.trim() : "";
+    const content =
+      typeof postData.content === "string" ? postData.content.trim() : "";

-    if (!postData.title || !postData.content) {
+    if (!title || !content) {
       return apiError("Title and content are required", 400);
     }

-    const result = await createPost(postData);
+    const result = await createPost({
+      title,
+      content,
+      image: postData.image,
+    });

     return apiSuccess(
       { postId: result.insertedId },
~~~

### 설명/확인 포인트

- 공백만 들어온 문자열은 `trim()` 후 빈 문자열이 됩니다.
- 검증된 `title`, `content`만 `createPost`에 전달합니다.

## 작업 2. 수정 API에도 같은 검증 적용

작성과 수정은 같은 데이터 규칙을 가져야 합니다. `PUT /api/post/[id]`에도 동일하게 문자열 확인과 trim 처리를 넣습니다.

### 수정할 파일

- 수정: [app/api/post/[id]/route.js](../../app/api/post/%5Bid%5D/route.js)

### 이전 단계와 달라지는 코드

아래 diff에서 `+`로 시작하는 줄을 추가하고, `-`로 시작하는 줄을 제거합니다. 새 파일은 diff에 보이는 전체 내용을 새로 입력합니다.

~~~diff
diff --git a/app/api/post/[id]/route.js b/app/api/post/[id]/route.js
index 0525348..f5f3b68 100644
--- a/app/api/post/[id]/route.js
+++ b/app/api/post/[id]/route.js
@@ -21,12 +21,16 @@ export async function PUT(request, { params }) {
   try {
     const { id } = await params;
     const postData = await request.json();
+    const title =
+      typeof postData.title === "string" ? postData.title.trim() : "";
+    const content =
+      typeof postData.content === "string" ? postData.content.trim() : "";

-    if (!postData.title || !postData.content) {
+    if (!title || !content) {
       return apiError("Title and content are required", 400);
     }

-    const result = await updatePost(id, postData);
+    const result = await updatePost(id, { title, content });

     if (!result || result.matchedCount === 0) {
       return apiError("Post not found", 404);
~~~

### 설명/확인 포인트

- API는 브라우저 form 외에도 curl, Postman, 악의적 요청으로 호출될 수 있습니다.
- 검증 규칙이 작성/수정에 동시에 들어가야 데이터 품질이 유지됩니다.

## 실행 확인

기본 정적 검사는 다음 명령으로 확인합니다.

```bash
npm run lint
npm run build
```

브라우저 확인이 필요하면 개발 서버를 켠 뒤 해당 화면을 확인합니다.

```bash
npm run dev
```

체크할 내용은 다음과 같습니다.

- `/post`에서 공백만 입력해 제출하면 오류 메시지가 보인다.
- 수정 화면에서도 공백 입력이 저장되지 않는다.

## 다음 단계로 넘어가기 전

- 이 문서의 각 작업 단위에서 설명을 먼저 읽고, 바로 아래 diff를 기준으로 파일을 수정합니다.
- 새 파일은 diff에 나온 전체 내용을 입력하고, 기존 파일은 diff의 `+`/`-` 줄만 비교하면서 수정합니다.
- 링크된 프로젝트 내부 파일을 열어 현재 단계의 완성본과 직접 비교할 수 있습니다.
