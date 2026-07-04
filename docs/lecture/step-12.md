# Step 12. 작성일과 수정일 표시하기

이 문서는 `step-11`에서 시작해 `step-12`를 완성하는 실습 자료입니다.
원본 개요는 [docs/overview/step-12.md](../overview/step-12.md)에 보존되어 있습니다.
아래 파일 링크는 GitHub가 아니라 이 프로젝트 안의 현재 단계 파일을 여는 경로입니다.

## 이번 스텝 주요 기능 Overview

홈 목록과 상세 화면에 작성일과 수정일을 표시합니다.

- 게시글 목록에 작성일과 수정일을 표시합니다.
- 상세 화면에도 같은 날짜 정보를 보여줍니다.
- `toLocaleString()`을 사용해 Date 값을 사람이 읽기 쉬운 문자열로 바꿉니다.

## 시작 기준

이전 단계인 `step-11` 브랜치까지 완료된 상태에서 시작합니다.

```bash
git switch step-11
git switch -c practice-step-12
```

정답 브랜치는 확인용으로만 사용합니다.

```bash
git switch step-12
```

## 작업 1. 홈 목록에 날짜 메타데이터 표시

글 제목과 요약만 있으면 언제 작성됐는지 알 수 없습니다. 목록 카드마다 작성일과 수정일을 표시해 글의 상태를 파악하게 합니다.

### 수정할 파일

- 수정: [app/page.js](../../app/page.js)

### 이전 단계와 달라지는 코드

아래 diff에서 `+`로 시작하는 줄을 추가하고, `-`로 시작하는 줄을 제거합니다. 새 파일은 diff에 보이는 전체 내용을 새로 입력합니다.

~~~diff
diff --git a/app/page.js b/app/page.js
index 21584c9..7f21c51 100644
--- a/app/page.js
+++ b/app/page.js
@@ -4,6 +4,14 @@ import Link from "next/link";
 import { useEffect, useState } from "react";
 import styles from "./page.module.css";

+function formatDate(dateValue) {
+  if (!dateValue) {
+    return "";
+  }
+
+  return new Date(dateValue).toLocaleString("ko-KR");
+}
+
 export default function Home() {
   const [posts, setPosts] = useState([]);
   const [error, setError] = useState("");
@@ -40,6 +48,8 @@ export default function Home() {
           {posts.map((post) => (
             <article key={post._id} className={styles.article}>
               <Link href={`/detail/${post._id}`}>{post.title}</Link>
+              <p>Created: {formatDate(post.createdAt)}</p>
+              {post.updatedAt && <p>Updated: {formatDate(post.updatedAt)}</p>}
             </article>
           ))}
         </section>
~~~

### 설명/확인 포인트

- `updatedAt`은 수정 전 게시글에는 없을 수 있으므로 조건부로 표시합니다.
- MongoDB Date 값은 화면에 출력할 때 문자열로 변환해야 합니다.

## 작업 2. 상세 화면에 날짜 메타데이터 표시

상세 화면에서도 목록과 같은 기준으로 작성일과 수정일을 보여줍니다. 사용자는 상세 화면만 열어도 글의 변경 이력을 대략 알 수 있습니다.

### 수정할 파일

- 수정: [app/detail/[id]/page.js](../../app/detail/%5Bid%5D/page.js)

### 이전 단계와 달라지는 코드

아래 diff에서 `+`로 시작하는 줄을 추가하고, `-`로 시작하는 줄을 제거합니다. 새 파일은 diff에 보이는 전체 내용을 새로 입력합니다.

~~~diff
diff --git a/app/detail/[id]/page.js b/app/detail/[id]/page.js
index b3e7f90..8fa71cd 100644
--- a/app/detail/[id]/page.js
+++ b/app/detail/[id]/page.js
@@ -3,6 +3,14 @@ import { notFound } from "next/navigation";
 import { getPostById } from "@/lib/posts";
 import styles from "./page.module.css";

+function formatDate(dateValue) {
+  if (!dateValue) {
+    return "";
+  }
+
+  return new Date(dateValue).toLocaleString("ko-KR");
+}
+
 export default async function BlogDetail({ params }) {
   const { id } = await params;
   const post = await getPostById(id);
@@ -15,6 +23,8 @@ export default async function BlogDetail({ params }) {
     <main className={styles.container}>
       <article>
         <h1>{post.title}</h1>
+        <p>Created: {formatDate(post.createdAt)}</p>
+        {post.updatedAt && <p>Updated: {formatDate(post.updatedAt)}</p>}
         <pre className={styles.content}>{post.content}</pre>
       </article>
       <Link href={`/post/${id}`}>Edit</Link>
~~~

### 설명/확인 포인트

- 날짜 표시 위치는 제목 아래가 읽기 쉽습니다.
- 수정일은 존재할 때만 렌더링합니다.

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

- 홈 목록에서 Created 날짜가 보인다.
- 수정한 글은 Updated 날짜도 보인다.
- 상세 화면에서도 같은 날짜 정보가 보인다.

## 다음 단계로 넘어가기 전

- 이 문서의 각 작업 단위에서 설명을 먼저 읽고, 바로 아래 diff를 기준으로 파일을 수정합니다.
- 새 파일은 diff에 나온 전체 내용을 입력하고, 기존 파일은 diff의 `+`/`-` 줄만 비교하면서 수정합니다.
- 링크된 프로젝트 내부 파일을 열어 현재 단계의 완성본과 직접 비교할 수 있습니다.
