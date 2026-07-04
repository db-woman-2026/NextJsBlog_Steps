# Step 2. simpledotcss와 이미지 설정으로 화면 정돈하기

이 문서는 `step-1`에서 시작해 `step-2`를 완성하는 실습 자료입니다.
원본 개요는 [docs/overview/step-2.md](../overview/step-2.md)에 보존되어 있습니다.
아래 파일 링크는 GitHub가 아니라 이 프로젝트 안의 현재 단계 파일을 여는 경로입니다.

## 이번 스텝 주요 기능 Overview

simpledotcss와 next/image를 적용해 기본 화면을 정돈하고 외부 이미지 도메인 설정을 추가합니다.

- 직접 작성한 최소 CSS 대신 `simpledotcss`를 설치해 기본 HTML 태그 스타일을 정돈합니다.
- About 페이지에 `next/image` 이미지를 추가합니다.
- 외부 이미지인 `picsum.photos`를 사용할 수 있도록 `next.config.mjs`에 허용 도메인을 설정합니다.

## 시작 기준

이전 단계인 `step-1` 브랜치까지 완료된 상태에서 시작합니다.

```bash
git switch step-1
git switch -c practice-step-2
```

정답 브랜치는 확인용으로만 사용합니다.

```bash
git switch step-2
```

## 작업 1. simpledotcss 설치와 전역 CSS 교체

스타일링 자체보다 라우팅과 데이터 흐름에 집중하기 위해 작은 CSS 라이브러리를 도입합니다. npm 명령을 실행하면 `package.json`과 `package-lock.json`이 함께 바뀝니다.

### 수정할 파일

- 수정: [package.json](../../package.json)
- 수정: [package-lock.json](../../package-lock.json)
- 수정: [app/globals.css](../../app/globals.css)

### 먼저 실행하거나 삭제할 명령

```bash
npm install simpledotcss@^2.3.7
```

### 이전 단계와 달라지는 코드

아래 diff에서 `+`로 시작하는 줄을 추가하고, `-`로 시작하는 줄을 제거합니다. 새 파일은 diff에 보이는 전체 내용을 새로 입력합니다.

~~~diff
diff --git a/app/globals.css b/app/globals.css
index 7c249fa..a6f7b7a 100644
--- a/app/globals.css
+++ b/app/globals.css
@@ -1,26 +1,24 @@
+@import "simpledotcss/simple.min.css";
+
 body {
-  max-width: 48rem;
   min-height: 100vh;
-  margin: 0 auto;
-  padding: 2rem 1rem;
-  font-family: Arial, Helvetica, sans-serif;
-  line-height: 1.6;
 }

-nav ul {
-  display: flex;
-  flex-wrap: wrap;
-  gap: 1rem;
-  list-style: none;
-  margin: 0;
-  padding: 0;
+body > header {
+  align-self: start;
+  padding: 1rem;
 }

-main {
-  margin: 2rem 0;
+body > header > nav:only-child {
+  margin-block-start: 0;
+}
+
+header nav {
+  padding: 0;
+  line-height: 1;
 }

-footer {
-  border-top: 1px solid #ddd;
-  padding-top: 1rem;
+header nav a,
+header nav a:visited {
+  margin-bottom: 0;
 }
diff --git a/package.json b/package.json
index 634e7f6..dcfc7eb 100644
--- a/package.json
+++ b/package.json
@@ -11,7 +11,8 @@
   "dependencies": {
     "next": "16.2.10",
     "react": "19.2.4",
-    "react-dom": "19.2.4"
+    "react-dom": "19.2.4",
+    "simpledotcss": "^2.3.7"
   },
   "devDependencies": {
     "eslint": "^9",
~~~

### 설명/확인 포인트

- `package-lock.json`은 npm이 자동 갱신하므로 직접 타이핑하지 않습니다.
- `@import "simpledotcss/simple.min.css";`가 전역 스타일의 출발점입니다.
- Header와 nav의 여백만 프로젝트에 맞게 짧게 덮어씁니다.

## 작업 2. About 페이지에 next/image 적용

소개 페이지에 외부 이미지를 넣어 `next/image` 사용법을 익힙니다. `Image`는 이미지 크기를 미리 알아야 하므로 `width`와 `height`를 함께 지정합니다.

### 수정할 파일

- 수정: [app/about/page.js](../../app/about/page.js)

### 이전 단계와 달라지는 코드

아래 diff에서 `+`로 시작하는 줄을 추가하고, `-`로 시작하는 줄을 제거합니다. 새 파일은 diff에 보이는 전체 내용을 새로 입력합니다.

~~~diff
diff --git a/app/about/page.js b/app/about/page.js
index 64b849a..c6e3f14 100644
--- a/app/about/page.js
+++ b/app/about/page.js
@@ -1,10 +1,28 @@
+import Image from "next/image";
+
 export default function AboutPage() {
   return (
     <main>
       <h1>About Me</h1>
+      <Image
+        src="https://picsum.photos/id/1047/600/500"
+        alt="Office building"
+        width={600}
+        height={500}
+        priority
+      />
       <p>
-        This page will introduce the blog owner. For now, it is a simple page
-        shell used to practice Next.js routing.
+        Hello! My name is [Your Name]. I&apos;m a professional working in [Your
+        Industry] based in [Your Location].
+      </p>
+      <p>
+        Here&apos;s a photo of our office building where I spend most of my
+        working hours.
+      </p>
+      <p>I am passionate about [Your Passion], and I enjoy [Your Hobbies].</p>
+      <p>
+        If you wish to reach out, please contact me at [Your Contact
+        Information].
       </p>
     </main>
   );
~~~

### 설명/확인 포인트

- `priority`는 첫 화면에서 중요한 이미지를 우선 로드하겠다는 표시입니다.
- `I&apos;m`처럼 HTML entity를 쓰면 JSX 린트 규칙에서 작은따옴표 문제가 나지 않습니다.

## 작업 3. 외부 이미지 도메인 허용

Next.js 이미지 최적화는 허용된 외부 도메인만 처리합니다. About 페이지의 이미지 출처가 `picsum.photos`이므로 설정 파일에 remote pattern을 추가합니다.

### 수정할 파일

- 수정: [next.config.mjs](../../next.config.mjs)

### 이전 단계와 달라지는 코드

아래 diff에서 `+`로 시작하는 줄을 추가하고, `-`로 시작하는 줄을 제거합니다. 새 파일은 diff에 보이는 전체 내용을 새로 입력합니다.

~~~diff
diff --git a/next.config.mjs b/next.config.mjs
index b108e1a..61900c1 100644
--- a/next.config.mjs
+++ b/next.config.mjs
@@ -1,6 +1,13 @@
 /** @type {import('next').NextConfig} */
 const nextConfig = {
-  /* config options here */
+  images: {
+    remotePatterns: [
+      {
+        protocol: "https",
+        hostname: "picsum.photos",
+      },
+    ],
+  },
 };

 export default nextConfig;
~~~

### 설명/확인 포인트

- 설정 파일을 바꾼 뒤에는 개발 서버를 재시작해야 반영이 확실합니다.
- 허용 도메인을 추가하지 않으면 이미지 렌더링 또는 빌드 중 오류가 발생할 수 있습니다.

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

- `/about`에 이미지와 소개 문장이 보인다.
- 개발 서버를 재시작해 외부 이미지 설정 오류가 없는지 확인한다.

## 다음 단계로 넘어가기 전

- 이 문서의 각 작업 단위에서 설명을 먼저 읽고, 바로 아래 diff를 기준으로 파일을 수정합니다.
- 새 파일은 diff에 나온 전체 내용을 입력하고, 기존 파일은 diff의 `+`/`-` 줄만 비교하면서 수정합니다.
- 링크된 프로젝트 내부 파일을 열어 현재 단계의 완성본과 직접 비교할 수 있습니다.
