# Step 18. Not Found와 Error UI 추가하기

## 이번 단계에서 할 일

전역 404, 상세 전용 404, 전역 Error UI를 추가해 오류 상황의 사용자 경험을 개선합니다.

- 없는 주소를 위한 전역 `app/not-found.js`를 추가합니다.
- 없는 게시글을 위한 상세 전용 `app/detail/[id]/not-found.js`를 추가합니다.
- 예외 발생 시 보여줄 전역 `app/error.js`를 추가합니다.

## 시작 전 확인

권장 시간은 50분입니다. 개인 실습 저장소의 `main`에서 직전 단계까지 마친 상태로 시작합니다. 코드 블록은 복사해 붙이지 않고 직접 입력합니다.

수정 전에 `git status --short`의 출력이 없는지 확인합니다. 변경이 남아 있다면 원인을 확인하고 시작 상태를 정리합니다.

## 작업 1. 전역 Not Found 화면 추가

사용자가 존재하지 않는 주소로 들어왔을 때 기본 Next.js 404 대신 프로젝트 문구와 홈 링크를 보여줍니다.

### 수정할 파일

- 생성: `app/not-found.js`

### 코드 변경

아래 diff에서 `+`로 시작하는 줄을 추가하고, `-`로 시작하는 줄을 제거합니다. 새 파일은 diff에 보이는 전체 내용을 새로 입력합니다.

~~~diff
diff --git a/app/not-found.js b/app/not-found.js
new file mode 100644
index 0000000..d103271
--- /dev/null
+++ b/app/not-found.js
@@ -0,0 +1,11 @@
+import Link from "next/link";
+
+export default function NotFound() {
+  return (
+    <main>
+      <h1>Page Not Found</h1>
+      <p>The page you are looking for does not exist.</p>
+      <Link href="/">Back to post list</Link>
+    </main>
+  );
+}
~~~

### 설명과 확인

- `not-found.js`는 App Router의 특수 파일입니다.
- 홈으로 돌아갈 수 있는 링크를 제공해야 사용자가 막히지 않습니다.

## 작업 2. 상세 전용 Not Found 화면 추가

게시글 상세 화면에서 id는 형식상 맞지만 실제 게시글이 없을 수 있습니다. 이 경우 상세 라우트에 맞는 안내 화면을 따로 둡니다.

### 수정할 파일

- 생성: [app/detail/[id]/not-found.js](../../app/detail/%5Bid%5D/not-found.js)

### 코드 변경

아래 diff에서 `+`로 시작하는 줄을 추가하고, `-`로 시작하는 줄을 제거합니다. 새 파일은 diff에 보이는 전체 내용을 새로 입력합니다.

~~~diff
diff --git a/app/detail/[id]/not-found.js b/app/detail/[id]/not-found.js
new file mode 100644
index 0000000..000c84a
--- /dev/null
+++ b/app/detail/[id]/not-found.js
@@ -0,0 +1,11 @@
+import Link from "next/link";
+
+export default function PostNotFound() {
+  return (
+    <main>
+      <h1>Post Not Found</h1>
+      <p>This post does not exist or may have been deleted.</p>
+      <Link href="/">Back to post list</Link>
+    </main>
+  );
+}
~~~

### 설명과 확인

- 이 파일은 `app/detail/[id]` 아래에서 발생한 notFound 상황에 우선 사용됩니다.
- 목록으로 돌아가는 링크를 둡니다.

## 작업 3. 전역 Error 화면 추가

예상하지 못한 렌더링 오류가 발생했을 때 사용자에게 다시 시도 버튼을 보여줍니다. Error UI는 클라이언트 컴포넌트여야 합니다.

### 수정할 파일

- 생성: `app/error.js`

### 코드 변경

아래 diff에서 `+`로 시작하는 줄을 추가하고, `-`로 시작하는 줄을 제거합니다. 새 파일은 diff에 보이는 전체 내용을 새로 입력합니다.

~~~diff
diff --git a/app/error.js b/app/error.js
new file mode 100644
index 0000000..4602c89
--- /dev/null
+++ b/app/error.js
@@ -0,0 +1,13 @@
+"use client";
+
+export default function Error({ error, reset }) {
+  return (
+    <main>
+      <h1>Something went wrong</h1>
+      <p>{error.message || "An unexpected error occurred."}</p>
+      <button type="button" onClick={reset}>
+        Try again
+      </button>
+    </main>
+  );
+}
~~~

### 설명과 확인

- `error.js`에는 `"use client";`가 필요합니다.
- Next.js가 전달하는 `reset` 함수를 버튼에서 호출하면 해당 경로 렌더링을 다시 시도합니다.

## 실행 확인

기본 정적 검사는 다음 명령으로 확인합니다.

> Windows 11에서는 [환경 준비](../windows-11.md)를 먼저 확인합니다. `git`, `node`, `npm.cmd` 명령은 PowerShell에서도 같습니다. `npm.ps1` 오류가 나면 `npm.cmd`를 사용합니다.

```powershell
npm.cmd run lint
npm.cmd run build
```

브라우저 확인이 필요하면 개발 서버를 켠 뒤 해당 화면을 확인합니다.

```powershell
npm.cmd run dev
```

체크할 내용은 다음과 같습니다.

- 없는 주소로 들어가면 404 화면이 보인다.
- 없는 게시글 id로 들어가면 상세 전용 안내가 보인다.
- `npm.cmd run build`로 error/not-found 특수 파일 문법을 확인한다.

## 독립 확인

없는 URL, 없는 게시글, 렌더링 오류의 화면 경계를 구분합니다. 결과와 확인 방법을 한 문장으로 기록합니다. 실험을 위해 바꾼 값은 다음 단계 전에 복구합니다.

## 마무리 확인

- 이 문서의 각 작업 단위에서 설명을 먼저 읽고, 바로 아래 diff를 기준으로 파일을 수정합니다.
- 새 파일은 diff에 나온 전체 내용을 입력하고, 기존 파일은 diff의 `+`/`-` 줄만 비교하면서 수정합니다.

## 저장소에 기록하기

실험용 변경을 모두 복구한 뒤 검사 결과와 코드 변경을 함께 확인합니다.

```powershell
git branch --show-current
git status --short
git diff
npm.cmd run lint
npm.cmd run build
git add .
git diff --staged
git commit -m "Complete Next.js step 18"
git push origin main
git status --short --branch
```

현재 브랜치는 `main`이어야 합니다. 마지막 상태에서 `main...origin/main` 뒤에 `ahead`가 없고 작업 파일 목록도 비어 있어야 합니다.
