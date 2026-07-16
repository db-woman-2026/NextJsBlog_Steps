# Step 13. 게시글 삭제 기능 만들기

## 이번 단계에서 할 일

MongoDB 삭제 함수, DELETE /api/post/[id], 상세 화면 삭제 버튼으로 삭제 흐름을 완성합니다.

- MongoDB에서 id로 게시글을 삭제하는 함수를 추가합니다.
- `DELETE /api/post/[id]` API를 추가합니다.
- 상세 화면에 클라이언트 삭제 버튼을 붙여 삭제 후 홈으로 이동합니다.

## 시작 전 확인

권장 시간은 60분입니다. 이 문서의 diff는 `step-12` 완료 코드에 적용합니다. `step-13` branch는 아래 변경이 이미 반영된 완성본입니다.

수정 전에 `git status --short`의 출력이 없는지 확인합니다. 변경이 남아 있다면 원인을 확인하고 시작 상태를 정리합니다.

## 작업 1. 데이터 계층에 삭제 함수 추가

삭제 기능도 화면이나 API 안에 MongoDB 쿼리를 직접 쓰지 않고 `lib/posts.js`에 함수로 분리합니다.

### 수정할 파일

- 수정: [lib/posts.js](../../lib/posts.js)

### 코드 변경

아래 diff에서 `+`로 시작하는 줄을 추가하고, `-`로 시작하는 줄을 제거합니다. 새 파일은 diff에 보이는 전체 내용을 새로 입력합니다.

~~~diff
diff --git a/lib/posts.js b/lib/posts.js
index 050a428..2daf81e 100644
--- a/lib/posts.js
+++ b/lib/posts.js
@@ -51,6 +51,15 @@ export async function createPost(postData) {
   return result;
 }

+export async function deletePost(id) {
+  if (!ObjectId.isValid(id)) {
+    return null;
+  }
+
+  const collection = await getPostsCollection();
+  return collection.deleteOne({ _id: new ObjectId(id) });
+}
+
 export async function getPostById(id) {
   if (!ObjectId.isValid(id)) {
     return null;
~~~

### 설명과 확인

- 잘못된 ObjectId는 `null`을 반환하고, API route는 이 결과를 404 응답으로 변환합니다.
- 삭제 결과의 `deletedCount`로 실제 삭제 여부를 판단합니다.

## 작업 2. DELETE API 추가

기존 단건 API 파일에 `DELETE` handler를 추가합니다. URL의 id를 읽어 삭제하고, 삭제 대상이 없으면 404를 반환합니다.

### 수정할 파일

- 수정: [app/api/post/[id]/route.js](../../app/api/post/%5Bid%5D/route.js)

### 코드 변경

아래 diff에서 `+`로 시작하는 줄을 추가하고, `-`로 시작하는 줄을 제거합니다. 새 파일은 diff에 보이는 전체 내용을 새로 입력합니다.

~~~diff
diff --git a/app/api/post/[id]/route.js b/app/api/post/[id]/route.js
index f5f3b68..8a4a070 100644
--- a/app/api/post/[id]/route.js
+++ b/app/api/post/[id]/route.js
@@ -1,5 +1,5 @@
 import { apiError, apiSuccess } from "@/lib/apiResponse";
-import { getPostById, updatePost } from "@/lib/posts";
+import { deletePost, getPostById, updatePost } from "@/lib/posts";

 export async function GET(_request, { params }) {
   try {
@@ -42,3 +42,19 @@ export async function PUT(request, { params }) {
     return apiError("Internal Server Error", 500);
   }
 }
+
+export async function DELETE(_request, { params }) {
+  try {
+    const { id } = await params;
+    const result = await deletePost(id);
+
+    if (!result || result.deletedCount === 0) {
+      return apiError("Post not found", 404);
+    }
+
+    return apiSuccess({ postId: id }, "Post deleted successfully");
+  } catch (error) {
+    console.error("Error deleting post:", error);
+    return apiError("Internal Server Error", 500);
+  }
+}
~~~

### 설명과 확인

- HTTP method 이름과 export 함수 이름이 연결됩니다.
- 성공 응답에는 삭제한 id를 `postId`로 담습니다.

## 작업 3. 상세 화면에 삭제 버튼 연결

삭제 버튼은 클릭 이벤트와 상태가 필요하므로 별도 클라이언트 컴포넌트로 만듭니다. 상세 페이지는 서버 컴포넌트로 유지하고 버튼만 import합니다.

### 수정할 파일

- 생성: [app/detail/[id]/DeletePostButton.js](../../app/detail/%5Bid%5D/DeletePostButton.js)
- 수정: [app/detail/[id]/page.js](../../app/detail/%5Bid%5D/page.js)

### 코드 변경

아래 diff에서 `+`로 시작하는 줄을 추가하고, `-`로 시작하는 줄을 제거합니다. 새 파일은 diff에 보이는 전체 내용을 새로 입력합니다.

~~~diff
diff --git a/app/detail/[id]/DeletePostButton.js b/app/detail/[id]/DeletePostButton.js
new file mode 100644
index 0000000..02feb32
--- /dev/null
+++ b/app/detail/[id]/DeletePostButton.js
@@ -0,0 +1,48 @@
+"use client";
+
+import { useState } from "react";
+import { useRouter } from "next/navigation";
+
+export default function DeletePostButton({ id }) {
+  const [error, setError] = useState("");
+  const [isDeleting, setIsDeleting] = useState(false);
+  const router = useRouter();
+
+  async function handleDelete() {
+    const shouldDelete = window.confirm("Delete this post?");
+
+    if (!shouldDelete) {
+      return;
+    }
+
+    setError("");
+    setIsDeleting(true);
+
+    try {
+      const response = await fetch(`/api/post/${id}`, {
+        method: "DELETE",
+      });
+      const result = await response.json();
+
+      if (!response.ok) {
+        throw new Error(result.message || "Failed to delete post");
+      }
+
+      router.push("/");
+      router.refresh();
+    } catch (err) {
+      setError(err instanceof Error ? err.message : "Failed to delete post");
+    } finally {
+      setIsDeleting(false);
+    }
+  }
+
+  return (
+    <>
+      <button type="button" onClick={handleDelete} disabled={isDeleting}>
+        {isDeleting ? "Deleting..." : "Delete"}
+      </button>
+      {error && <p role="alert">{error}</p>}
+    </>
+  );
+}
diff --git a/app/detail/[id]/page.js b/app/detail/[id]/page.js
index 8fa71cd..3e7ae22 100644
--- a/app/detail/[id]/page.js
+++ b/app/detail/[id]/page.js
@@ -1,6 +1,7 @@
 import Link from "next/link";
 import { notFound } from "next/navigation";
 import { getPostById } from "@/lib/posts";
+import DeletePostButton from "./DeletePostButton";
 import styles from "./page.module.css";

 function formatDate(dateValue) {
@@ -28,6 +29,7 @@ export default async function BlogDetail({ params }) {
         <pre className={styles.content}>{post.content}</pre>
       </article>
       <Link href={`/post/${id}`}>Edit</Link>
+      <DeletePostButton id={id} />
     </main>
   );
 }
~~~

### 설명과 확인

- 삭제 전 `confirm`으로 사용자에게 한 번 더 확인합니다.
- 삭제 성공 후 `router.push("/")`와 `router.refresh()`로 목록을 다시 보게 합니다.

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

- 상세 화면에서 Delete 버튼이 보인다.
- 삭제 확인 후 홈으로 이동하고 글이 목록에서 사라진다.

## 독립 확인

잘못된 ObjectId, 없는 ObjectId, 정상 ObjectId의 응답을 비교합니다. 결과와 확인 방법을 한 문장으로 기록합니다. 실험을 위해 바꾼 값은 다음 단계 전에 복구합니다.

## 마무리 확인

- 이 문서의 각 작업 단위에서 설명을 먼저 읽고, 바로 아래 diff를 기준으로 파일을 수정합니다.
- 새 파일은 diff에 나온 전체 내용을 입력하고, 기존 파일은 diff의 `+`/`-` 줄만 비교하면서 수정합니다.
- 링크된 프로젝트 내부 파일을 열어 현재 단계의 완성본과 직접 비교할 수 있습니다.
