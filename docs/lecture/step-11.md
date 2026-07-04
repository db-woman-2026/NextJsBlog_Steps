# Step 11. 제출 중 상태와 상세 페이지 이동 개선하기

## 이번 스텝 주요 기능 Overview

제출 중 상태를 추가하고 작성/수정 성공 후 해당 게시글 상세 페이지로 이동합니다.

- 작성/수정 form에 `isSubmitting` 상태를 추가합니다.
- 제출 중에는 입력칸과 버튼을 비활성화하고 버튼 문구를 바꿉니다.
- 작성 성공 시 API가 반환한 새 id로 상세 페이지에 이동합니다.

## 작업 1. 작성 form 제출 상태 추가

중복 제출을 막기 위해 요청이 진행되는 동안 form 요소를 disabled 처리합니다. 성공 후에는 홈이 아니라 새 게시글 상세 페이지로 이동합니다.

### 직접 수정할 파일

- 수정: [app/post/page.js](../../app/post/page.js)

### 이전 단계와 달라지는 코드

아래 diff에서 `+`로 시작하는 줄을 추가하고, `-`로 시작하는 줄을 제거합니다. 새 파일은 diff에 보이는 전체 내용을 새로 입력합니다.

~~~diff
diff --git a/app/post/page.js b/app/post/page.js
index 54ca12e..b6d7668 100644
--- a/app/post/page.js
+++ b/app/post/page.js
@@ -8,11 +8,13 @@ export default function NewPost() {
   const [title, setTitle] = useState("");
   const [content, setContent] = useState("");
   const [error, setError] = useState("");
+  const [isSubmitting, setIsSubmitting] = useState(false);
   const router = useRouter();

   async function handleSubmit(event) {
     event.preventDefault();
     setError("");
+    setIsSubmitting(true);

     try {
       const response = await fetch("/api/post", {
@@ -32,10 +34,12 @@ export default function NewPost() {
         throw new Error(result.message || "Failed to create post");
       }

-      router.push("/");
+      router.push(`/detail/${result.data.postId}`);
       router.refresh();
     } catch (err) {
       setError(err instanceof Error ? err.message : "Failed to create post");
+    } finally {
+      setIsSubmitting(false);
     }
   }

@@ -50,6 +54,7 @@ export default function NewPost() {
           id="title"
           value={title}
           onChange={(event) => setTitle(event.target.value)}
+          disabled={isSubmitting}
           required
         />

@@ -58,10 +63,13 @@ export default function NewPost() {
           id="content"
           value={content}
           onChange={(event) => setContent(event.target.value)}
+          disabled={isSubmitting}
           required
         />

-        <button type="submit">Create Post</button>
+        <button type="submit" disabled={isSubmitting}>
+          {isSubmitting ? "Creating..." : "Create Post"}
+        </button>
       </form>
     </main>
   );
~~~

### 설명/확인 포인트

- 응답의 `data.postId`를 읽어 `/detail/${postId}`로 이동합니다.
- `finally`에서 `isSubmitting`을 false로 되돌려 실패 시 다시 제출할 수 있게 합니다.

## 작업 2. 수정 form 제출 상태 추가

수정 화면도 같은 방식으로 중복 제출을 막습니다. 이미 id를 알고 있으므로 성공 후 기존 상세 주소로 돌아갑니다.

### 직접 수정할 파일

- 수정: [app/post/[id]/page.js](../../app/post/%5Bid%5D/page.js)

### 이전 단계와 달라지는 코드

아래 diff에서 `+`로 시작하는 줄을 추가하고, `-`로 시작하는 줄을 제거합니다. 새 파일은 diff에 보이는 전체 내용을 새로 입력합니다.

~~~diff
diff --git a/app/post/[id]/page.js b/app/post/[id]/page.js
index 26ef794..ca96d6a 100644
--- a/app/post/[id]/page.js
+++ b/app/post/[id]/page.js
@@ -8,6 +8,7 @@ export default function EditPost() {
   const [title, setTitle] = useState("");
   const [content, setContent] = useState("");
   const [error, setError] = useState("");
+  const [isSubmitting, setIsSubmitting] = useState(false);
   const { id } = useParams();
   const router = useRouter();

@@ -37,6 +38,7 @@ export default function EditPost() {
   async function handleSubmit(event) {
     event.preventDefault();
     setError("");
+    setIsSubmitting(true);

     try {
       const response = await fetch(`/api/post/${id}`, {
@@ -52,10 +54,12 @@ export default function EditPost() {
         throw new Error(result.message || "Failed to update post");
       }

-      router.replace("/");
+      router.replace(`/detail/${result.data.postId}`);
       router.refresh();
     } catch (err) {
       setError(err instanceof Error ? err.message : "Failed to update post");
+    } finally {
+      setIsSubmitting(false);
     }
   }

@@ -70,6 +74,7 @@ export default function EditPost() {
           id="title"
           value={title}
           onChange={(event) => setTitle(event.target.value)}
+          disabled={isSubmitting}
           required
         />

@@ -78,10 +83,13 @@ export default function EditPost() {
           id="content"
           value={content}
           onChange={(event) => setContent(event.target.value)}
+          disabled={isSubmitting}
           required
         />

-        <button type="submit">Update Post</button>
+        <button type="submit" disabled={isSubmitting}>
+          {isSubmitting ? "Updating..." : "Update Post"}
+        </button>
       </form>
     </main>
   );
~~~

### 설명/확인 포인트

- 작성 화면과 수정 화면의 UX 규칙을 맞춥니다.
- 입력 disabled, 버튼 disabled, 버튼 문구 변경이 함께 들어가야 사용자가 상태를 이해합니다.

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

- 작성 중 버튼 문구가 바뀌고 입력칸이 비활성화된다.
- 작성 성공 후 새 글 상세 화면으로 이동한다.
- 수정 성공 후 해당 글 상세 화면으로 이동한다.

## 다음 단계로 넘어가기 전

- 이 문서의 각 작업 단위에서 설명을 먼저 읽고, 바로 아래 diff를 기준으로 파일을 수정합니다.
- 새 파일은 diff에 나온 전체 내용을 입력하고, 기존 파일은 diff의 `+`/`-` 줄만 비교하면서 수정합니다.
- 링크된 프로젝트 내부 파일을 열어 현재 단계의 완성본과 직접 비교할 수 있습니다.
