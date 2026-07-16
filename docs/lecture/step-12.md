# Step 12. 작성일과 수정일 표시하기

## 이번 단계에서 할 일

홈 목록과 상세 화면에 작성일과 수정일을 표시합니다.

- 게시글 목록에 작성일과 수정일을 표시합니다.
- 상세 화면에도 같은 날짜 정보를 보여줍니다.
- `toLocaleString()`을 사용해 Date 값을 사람이 읽기 쉬운 문자열로 바꿉니다.

## 시작 전 확인

권장 시간은 40분입니다. 이 문서의 diff는 `step-11` 완료 코드에 적용합니다. `step-12` branch는 아래 변경이 이미 반영된 완성본입니다.

수정 전에 `git status --short`의 출력이 없는지 확인합니다. 변경이 남아 있다면 원인을 확인하고 시작 상태를 정리합니다.

## 작업 1. 홈 목록에 날짜 메타데이터 표시

글 제목과 요약만 있으면 언제 작성됐는지 알 수 없습니다. 목록 카드마다 작성일과 수정일을 표시해 글의 상태를 파악하게 합니다.

### 수정할 파일

- 수정: [app/page.js](../../app/page.js)

### 코드 변경

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

### 설명과 확인

- `updatedAt`은 수정 전 게시글에는 없을 수 있으므로 조건부로 표시합니다.
- MongoDB Date 값은 화면에 출력할 때 문자열로 변환해야 합니다.

## 작업 2. 상세 화면에 날짜 메타데이터 표시

상세 화면에서도 목록과 같은 기준으로 작성일과 수정일을 보여줍니다. 사용자는 상세 화면만 열어도 글의 변경 이력을 대략 알 수 있습니다.

### 수정할 파일

- 수정: [app/detail/[id]/page.js](../../app/detail/%5Bid%5D/page.js)

### 코드 변경

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

### 설명과 확인

- 날짜 표시 위치는 제목 아래가 읽기 쉽습니다.
- 수정일은 존재할 때만 렌더링합니다.

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

- 홈 목록에서 Created 날짜가 보인다.
- 수정한 글은 Updated 날짜도 보인다.
- 상세 화면에서도 같은 날짜 정보가 보인다.

## 독립 확인

작성일만 있는 글과 수정일이 있는 글의 표시를 비교합니다. 결과와 확인 방법을 한 문장으로 기록합니다. 실험을 위해 바꾼 값은 다음 단계 전에 복구합니다.

## 마무리 확인

- 이 문서의 각 작업 단위에서 설명을 먼저 읽고, 바로 아래 diff를 기준으로 파일을 수정합니다.
- 새 파일은 diff에 나온 전체 내용을 입력하고, 기존 파일은 diff의 `+`/`-` 줄만 비교하면서 수정합니다.
- 링크된 프로젝트 내부 파일을 열어 현재 단계의 완성본과 직접 비교할 수 있습니다.
