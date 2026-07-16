# Step 23. 남은 UI 조각 정리와 Tailwind 전환 마무리

## 이번 단계에서 할 일

삭제 버튼, 전역 404, 상세 404, Error 화면을 Tailwind로 정리해 기본 UI 전환을 마무리합니다.

- 상세 화면의 삭제 버튼과 삭제 오류 메시지를 danger UI로 정리합니다.
- 전역 404, 상세 404, Error 화면을 Tailwind 카드 UI로 바꿉니다.

## 시작 전 확인

권장 시간은 60분입니다. 이 문서의 diff는 `step-22` 완료 코드에 적용합니다. `step-23` branch는 아래 변경이 이미 반영된 완성본입니다.

수정 전에 `git status --short`의 출력이 없는지 확인합니다. 변경이 남아 있다면 원인을 확인하고 시작 상태를 정리합니다.

## 작업 1. 삭제 버튼과 삭제 오류 UI 정리

삭제는 데이터를 없애는 위험한 동작이므로 일반 버튼과 다른 색상 규칙이 필요합니다. 버튼은 red 계열 border/text로 표시하고, 실패 메시지는 alert 형태로 보여줍니다.

### 수정할 파일

- 수정: [app/detail/[id]/DeletePostButton.js](../../app/detail/%5Bid%5D/DeletePostButton.js)

### 코드 변경

아래 diff에서 `+`로 시작하는 줄을 추가하고, `-`로 시작하는 줄을 제거합니다. 새 파일은 diff에 보이는 전체 내용을 새로 입력합니다.

~~~diff
diff --git a/app/detail/[id]/DeletePostButton.js b/app/detail/[id]/DeletePostButton.js
index 02feb32..4ba7093 100644
--- a/app/detail/[id]/DeletePostButton.js
+++ b/app/detail/[id]/DeletePostButton.js
@@ -38,11 +38,23 @@ export default function DeletePostButton({ id }) {
   }

   return (
-    <>
-      <button type="button" onClick={handleDelete} disabled={isDeleting}>
+    <div className="space-y-2">
+      <button
+        className="rounded-md border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
+        type="button"
+        onClick={handleDelete}
+        disabled={isDeleting}
+      >
         {isDeleting ? "Deleting..." : "Delete"}
       </button>
-      {error && <p role="alert">{error}</p>}
-    </>
+      {error && (
+        <p
+          className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
+          role="alert"
+        >
+          {error}
+        </p>
+      )}
+    </div>
   );
 }
~~~

### 설명과 확인

- 삭제 중에는 버튼을 disabled 처리하고 문구를 바꿉니다.
- 오류 메시지는 `role="alert"`를 유지해 의미를 잃지 않습니다.

## 작업 2. Not Found 화면 카드 UI 적용

없는 주소와 없는 게시글 화면을 공통 카드 패턴으로 정리합니다. 사용자는 무엇이 잘못됐는지 보고 다시 이동할 링크를 찾을 수 있어야 합니다.

### 수정할 파일

- 수정: [app/not-found.js](../../app/not-found.js)
- 수정: [app/detail/[id]/not-found.js](../../app/detail/%5Bid%5D/not-found.js)

### 코드 변경

아래 diff에서 `+`로 시작하는 줄을 추가하고, `-`로 시작하는 줄을 제거합니다. 새 파일은 diff에 보이는 전체 내용을 새로 입력합니다.

~~~diff
diff --git a/app/detail/[id]/not-found.js b/app/detail/[id]/not-found.js
index 000c84a..e5cf11b 100644
--- a/app/detail/[id]/not-found.js
+++ b/app/detail/[id]/not-found.js
@@ -2,10 +2,22 @@ import Link from "next/link";

 export default function PostNotFound() {
   return (
-    <main>
-      <h1>Post Not Found</h1>
-      <p>This post does not exist or may have been deleted.</p>
-      <Link href="/">Back to post list</Link>
+    <main className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
+      <div className="space-y-4">
+        <p className="text-sm font-semibold uppercase text-zinc-500">404</p>
+        <h1 className="text-3xl font-bold tracking-tight text-zinc-950">
+          Post Not Found
+        </h1>
+        <p className="text-sm leading-6 text-zinc-600">
+          This post does not exist or may have been deleted.
+        </p>
+        <Link
+          className="inline-flex rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700"
+          href="/"
+        >
+          Back to post list
+        </Link>
+      </div>
     </main>
   );
 }
diff --git a/app/not-found.js b/app/not-found.js
index d103271..0b148a3 100644
--- a/app/not-found.js
+++ b/app/not-found.js
@@ -2,10 +2,22 @@ import Link from "next/link";

 export default function NotFound() {
   return (
-    <main>
-      <h1>Page Not Found</h1>
-      <p>The page you are looking for does not exist.</p>
-      <Link href="/">Back to post list</Link>
+    <main className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
+      <div className="space-y-4">
+        <p className="text-sm font-semibold uppercase text-zinc-500">404</p>
+        <h1 className="text-3xl font-bold tracking-tight text-zinc-950">
+          Page Not Found
+        </h1>
+        <p className="text-sm leading-6 text-zinc-600">
+          The page you are looking for does not exist.
+        </p>
+        <Link
+          className="inline-flex rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700"
+          href="/"
+        >
+          Back to post list
+        </Link>
+      </div>
     </main>
   );
 }
~~~

### 설명과 확인

- 전역 404는 Home으로, 상세 404는 Blog posts 목록으로 돌아가는 링크를 제공합니다.
- 404 label, 제목, 설명, 링크 순서로 읽히게 구성합니다.

## 작업 3. 전역 Error 화면 카드 UI 적용

예외 화면도 Tailwind 기준으로 정리합니다. Error 화면은 클라이언트 컴포넌트이며, `reset` 버튼으로 현재 경로 렌더링을 다시 시도할 수 있어야 합니다.

### 수정할 파일

- 수정: [app/error.js](../../app/error.js)

### 코드 변경

아래 diff에서 `+`로 시작하는 줄을 추가하고, `-`로 시작하는 줄을 제거합니다. 새 파일은 diff에 보이는 전체 내용을 새로 입력합니다.

~~~diff
diff --git a/app/error.js b/app/error.js
index 4602c89..152cee4 100644
--- a/app/error.js
+++ b/app/error.js
@@ -2,12 +2,23 @@

 export default function Error({ error, reset }) {
   return (
-    <main>
-      <h1>Something went wrong</h1>
-      <p>{error.message || "An unexpected error occurred."}</p>
-      <button type="button" onClick={reset}>
-        Try again
-      </button>
+    <main className="rounded-lg border border-red-200 bg-white p-6 shadow-sm">
+      <div className="space-y-4">
+        <p className="text-sm font-semibold uppercase text-red-600">Error</p>
+        <h1 className="text-3xl font-bold tracking-tight text-zinc-950">
+          Something went wrong
+        </h1>
+        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
+          {error.message || "An unexpected error occurred."}
+        </p>
+        <button
+          className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700"
+          type="button"
+          onClick={reset}
+        >
+          Try again
+        </button>
+      </div>
     </main>
   );
 }
~~~

### 설명과 확인

- 문제 상황은 red 계열 border와 label로 표시합니다.
- 다시 시도 버튼은 다른 주요 버튼과 같은 형태로 유지합니다.

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

- Delete 버튼과 삭제 실패 메시지가 danger UI로 보인다.
- 없는 주소와 없는 게시글 화면이 카드 형태로 보인다.
- Error 화면에서 Try again 버튼이 보인다.

## 독립 확인

삭제와 오류 상태의 button disabled와 `role="alert"`를 확인합니다. 결과와 확인 방법을 한 문장으로 기록합니다. 실험을 위해 바꾼 값은 다음 단계 전에 복구합니다.

## 마무리 확인

- 이 문서의 각 작업 단위에서 설명을 먼저 읽고, 바로 아래 diff를 기준으로 파일을 수정합니다.
- 새 파일은 diff에 나온 전체 내용을 입력하고, 기존 파일은 diff의 `+`/`-` 줄만 비교하면서 수정합니다.
- 링크된 프로젝트 내부 파일을 열어 현재 단계의 완성본과 직접 비교할 수 있습니다.
