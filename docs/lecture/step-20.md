# Step 20. Tailwind CSS v4 설치와 공통 layout 정리

## 이번 단계에서 할 일

simpledotcss를 제거하고 Tailwind CSS v4를 설치한 뒤 공통 layout, nav, footer에 기본 utility class를 적용합니다.

- simpledotcss를 제거하고 Tailwind CSS v4와 PostCSS 설정을 추가합니다.
- 전역 CSS를 Tailwind import 중심으로 바꿉니다.
- 공통 layout, Header, Footer에 Tailwind utility class를 적용합니다.

## 시작 전 확인

권장 시간은 70분입니다. 이 문서의 diff는 `step-19` 완료 코드에 적용합니다. `step-20` branch는 아래 변경이 이미 반영된 완성본입니다.

수정 전에 `git status --short`의 출력이 없는지 확인합니다. 변경이 남아 있다면 원인을 확인하고 시작 상태를 정리합니다.

## 작업 1. Tailwind CSS v4 설치와 패키지 정리

이 단계부터 화면 스타일링 방식을 simpledotcss에서 Tailwind utility class로 바꿉니다. 패키지 명령을 먼저 실행하고, 학생은 PostCSS 설정 파일과 전역 CSS만 직접 작성합니다.

### 수정할 파일

- 생성: [postcss.config.mjs](../../postcss.config.mjs)
- 수정: [app/globals.css](../../app/globals.css)

### 명령으로 자동 변경되는 파일

- 수정: [package.json](../../package.json)
- 수정: [package-lock.json](../../package-lock.json)

위 파일들은 명령 실행 결과만 확인합니다. 강의 중 입력할 대상은 아닙니다.

### 먼저 실행

> Windows 11에서는 [환경 준비](../windows-11.md)를 먼저 확인합니다. `git`, `node`, `npm.cmd` 명령은 PowerShell에서도 같습니다. `npm.ps1` 오류가 나면 `npm.cmd`를 사용합니다.

```powershell
npm.cmd uninstall simpledotcss
npm.cmd install -D tailwindcss @tailwindcss/postcss postcss
```

위 명령은 `package.json`, `package-lock.json`, `node_modules`를 함께 갱신합니다. 이전 단계의 `node_modules`가 남아 있거나 완성 브랜치를 바로 checkout해 확인하는 경우에는 lockfile 기준으로 의존성을 다시 맞춰야 하므로 `npm.cmd ci`를 실행합니다. `Cannot find module '@tailwindcss/postcss'` 오류가 나오면 Tailwind/PostCSS 의존성이 아직 설치되지 않은 상태입니다.

### 코드 변경

아래 diff에서 `+`로 시작하는 줄을 추가하고, `-`로 시작하는 줄을 제거합니다. 새 파일은 diff에 보이는 전체 내용을 새로 입력합니다.

~~~diff
diff --git a/app/globals.css b/app/globals.css
index 9582211..f1d8c73 100644
--- a/app/globals.css
+++ b/app/globals.css
@@ -1,32 +1 @@
-@import "simpledotcss/simple.min.css";
-
-body {
-  min-height: 100vh;
-}
-
-body > header {
-  align-self: start;
-  padding: 1rem;
-}
-
-body > header > nav:only-child {
-  margin-block-start: 0;
-}
-
-header nav {
-  padding: 0;
-  line-height: 1;
-}
-
-header nav a,
-header nav a:visited {
-  margin-bottom: 0;
-}
-
-form {
-  max-width: 42rem;
-}
-
-textarea {
-  min-height: 12rem;
-}
+@import "tailwindcss";
diff --git a/postcss.config.mjs b/postcss.config.mjs
new file mode 100644
index 0000000..61e3684
--- /dev/null
+++ b/postcss.config.mjs
@@ -0,0 +1,7 @@
+const config = {
+  plugins: {
+    "@tailwindcss/postcss": {},
+  },
+};
+
+export default config;
~~~

### 설명과 확인

- Tailwind v4에서는 이 프로젝트 기준으로 별도 `tailwind.config.js` 없이 시작합니다.
- `postcss.config.mjs`는 Tailwind PostCSS 플러그인을 Next.js 빌드에 연결합니다.
- `package.json`과 `package-lock.json`은 npm 명령이 자동 갱신하므로 수동으로 입력하지 않습니다.

## 작업 2. 공통 layout에 화면 폭과 배경 적용

모든 페이지가 같은 최대 폭과 배경색 안에서 보이도록 `app/layout.js`의 body 구조를 정리합니다. Header, 본문, Footer를 세로 flex 구조로 배치합니다.

### 수정할 파일

- 수정: [app/layout.js](../../app/layout.js)

### 코드 변경

아래 diff에서 `+`로 시작하는 줄을 추가하고, `-`로 시작하는 줄을 제거합니다. 새 파일은 diff에 보이는 전체 내용을 새로 입력합니다.

~~~diff
diff --git a/app/layout.js b/app/layout.js
index e041f0f..6f5244d 100644
--- a/app/layout.js
+++ b/app/layout.js
@@ -10,10 +10,14 @@ export const metadata = {
 export default function RootLayout({ children }) {
   return (
     <html lang="ko">
-      <body>
-        <Header />
-        {children}
-        <Footer />
+      <body className="min-h-screen bg-zinc-50 text-zinc-900 antialiased">
+        <div className="flex min-h-screen flex-col">
+          <Header />
+          <div className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
+            {children}
+          </div>
+          <Footer />
+        </div>
       </body>
     </html>
   );
~~~

### 설명과 확인

- `flex-1`은 본문이 남은 높이를 채우게 합니다.
- `max-w-5xl`은 이후 카드형 목록과 form이 너무 넓어지지 않게 제한합니다.

## 작업 3. Header와 Footer를 Tailwind class로 정리

simpledotcss가 자동으로 꾸며주던 nav 스타일을 직접 utility class로 작성합니다. 메뉴 항목은 배열로 분리해 반복 렌더링합니다.

### 수정할 파일

- 수정: [app/components/Header.js](../../app/components/Header.js)
- 수정: [app/components/Footer.js](../../app/components/Footer.js)

### 코드 변경

아래 diff에서 `+`로 시작하는 줄을 추가하고, `-`로 시작하는 줄을 제거합니다. 새 파일은 diff에 보이는 전체 내용을 새로 입력합니다.

~~~diff
diff --git a/app/components/Footer.js b/app/components/Footer.js
index ca4168c..5046ed3 100644
--- a/app/components/Footer.js
+++ b/app/components/Footer.js
@@ -1,3 +1,7 @@
 export default function Footer() {
-  return <footer>&copy; 2026 News Website. All rights reserved.</footer>;
+  return (
+    <footer className="border-t border-zinc-200 bg-white px-4 py-6 text-center text-sm text-zinc-500">
+      &copy; 2026 News Website. All rights reserved.
+    </footer>
+  );
 }
diff --git a/app/components/Header.js b/app/components/Header.js
index eb664b1..a744ef8 100644
--- a/app/components/Header.js
+++ b/app/components/Header.js
@@ -1,22 +1,30 @@
 import Link from "next/link";

+const navigationItems = [
+  { href: "/", label: "Home" },
+  { href: "/about", label: "About" },
+  { href: "/post", label: "Post" },
+  { href: "/contact", label: "Contact" },
+];
+
 export default function Header() {
   return (
-    <header>
-      <nav>
-        <ul>
-          <li>
-            <Link href="/">Home</Link>
-          </li>
-          <li>
-            <Link href="/about">About</Link>
-          </li>
-          <li>
-            <Link href="/post">Post</Link>
-          </li>
-          <li>
-            <Link href="/contact">Contact</Link>
-          </li>
+    <header className="border-b border-zinc-200 bg-white">
+      <nav className="mx-auto flex min-h-16 w-full max-w-5xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
+        <Link className="text-base font-semibold text-zinc-950" href="/">
+          NextJsBlog
+        </Link>
+        <ul className="flex flex-wrap items-center gap-1">
+          {navigationItems.map((item) => (
+            <li key={item.href}>
+              <Link
+                className="rounded-md px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 hover:text-zinc-950"
+                href={item.href}
+              >
+                {item.label}
+              </Link>
+            </li>
+          ))}
         </ul>
       </nav>
     </header>
~~~

### 설명과 확인

- Header의 `navigationItems`는 링크가 늘어날 때 JSX 반복을 줄입니다.
- Footer는 얇은 border와 작은 텍스트로 공통 shell에 맞춥니다.

## 실행 확인

기본 정적 검사는 다음 명령으로 확인합니다.

```powershell
npm.cmd run lint
npm.cmd run build
```

브라우저 확인이 필요하면 개발 서버를 켠 뒤 해당 화면을 확인합니다.

```powershell
npm.cmd run dev
```

체크할 내용은 다음과 같습니다.

- `npm.cmd run build`가 Tailwind/PostCSS 설정 오류 없이 통과한다.
- Header, 본문, Footer가 같은 최대 폭 기준으로 정렬된다.

## 독립 확인

Tailwind 설치 전후 `package.json`과 PostCSS 설정을 비교합니다. 결과와 확인 방법을 한 문장으로 기록합니다. 실험을 위해 바꾼 값은 다음 단계 전에 복구합니다.

## 마무리 확인

- 이 문서의 각 작업 단위에서 설명을 먼저 읽고, 바로 아래 diff를 기준으로 파일을 수정합니다.
- 새 파일은 diff에 나온 전체 내용을 입력하고, 기존 파일은 diff의 `+`/`-` 줄만 비교하면서 수정합니다.
- 링크된 프로젝트 내부 파일을 열어 현재 단계의 완성본과 직접 비교할 수 있습니다.
