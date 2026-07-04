# Step 3. MongoDB 연결과 게시글 데이터 함수 만들기

## 이번 스텝 주요 기능 Overview

MongoDB 연결, 환경 변수, 게시글 데이터 함수를 만들어 서버 데이터 계층을 준비합니다.

- MongoDB Node.js Driver를 설치하고 서버에서 MongoDB에 연결하는 helper를 만듭니다.
- 개인 환경 변수는 `.env.local`, 공유 예시는 `.env.example`로 분리합니다.
- 게시글 목록/생성/단건 조회/수정 함수를 `lib/posts.js`에 모아 다음 API 단계의 기반을 준비합니다.

## 작업 1. MongoDB 패키지 설치

Next.js가 MongoDB 드라이버를 기본 제공하지 않으므로 별도 패키지를 설치합니다. 이 작업은 명령 실행이 전부이며, 패키지 파일은 npm이 자동으로 갱신합니다.

### 직접 수정할 파일

- 직접 타이핑해서 수정할 파일은 없습니다.

### 명령으로 자동 변경되는 파일

- 수정: [package.json](../../package.json)
- 수정: [package-lock.json](../../package-lock.json)

위 파일들은 명령 실행 결과를 확인만 합니다. 강의 중 직접 타이핑할 대상은 아닙니다.

### 먼저 실행할 명령

```bash
npm install mongodb@^7.4.0
```

### 이전 단계와 달라지는 코드

이 작업에는 학생이 직접 타이핑할 코드 diff가 없습니다. 위 설명과 확인 포인트를 기준으로 진행합니다.

### 설명/확인 포인트

- `package.json`과 `package-lock.json`은 npm이 자동 갱신합니다.
- 설치 후 서버 코드에서 `MongoClient`와 `ObjectId`를 import할 수 있습니다.

## 작업 2. 환경 변수 예시와 Git 무시 규칙 정리

연결 문자열은 비밀번호를 포함할 수 있으므로 코드에 직접 쓰지 않습니다. 저장소에는 예시만 커밋하고 개인 값은 `.env.local`에 둡니다.

### 직접 수정할 파일

- 생성: [.env.example](../../.env.example)
- 수정: [.gitignore](../../.gitignore)

### 이전 단계와 달라지는 코드

아래 diff에서 `+`로 시작하는 줄을 추가하고, `-`로 시작하는 줄을 제거합니다. 새 파일은 diff에 보이는 전체 내용을 새로 입력합니다.

~~~diff
diff --git a/.env.example b/.env.example
new file mode 100644
index 0000000..3fd71bc
--- /dev/null
+++ b/.env.example
@@ -0,0 +1,2 @@
+MONGODB_URI=mongodb://localhost:27017/blog
+MONGODB_DB=blog
diff --git a/.gitignore b/.gitignore
index fae9af6..4c99480 100644
--- a/.gitignore
+++ b/.gitignore
@@ -33,6 +33,7 @@ yarn-error.log*

 # env files (can opt-in for committing if needed)
 .env*
+!.env.example

 # vercel
 .vercel
~~~

### 설명/확인 포인트

- 실습자는 `cp .env.example .env.local` 후 자기 MongoDB 주소를 넣습니다.
- `.env*`는 무시하되 `!.env.example`만 예외로 둡니다.

## 작업 3. MongoDB 연결 helper 추가

`lib/mongodb.js`는 연결 생성과 재사용만 담당합니다. 개발 서버가 파일 변경 때 코드를 다시 읽어도 연결 Promise를 재사용해 불필요한 연결 증가를 줄입니다.

### 직접 수정할 파일

- 생성: [lib/mongodb.js](../../lib/mongodb.js)

### 이전 단계와 달라지는 코드

아래 diff에서 `+`로 시작하는 줄을 추가하고, `-`로 시작하는 줄을 제거합니다. 새 파일은 diff에 보이는 전체 내용을 새로 입력합니다.

~~~diff
diff --git a/lib/mongodb.js b/lib/mongodb.js
new file mode 100644
index 0000000..070dacd
--- /dev/null
+++ b/lib/mongodb.js
@@ -0,0 +1,23 @@
+import { MongoClient } from "mongodb";
+
+let clientPromise;
+
+export default function getMongoClient() {
+  const uri = process.env.MONGODB_URI;
+
+  if (!uri) {
+    throw new Error("Please define MONGODB_URI in .env.local");
+  }
+
+  if (process.env.NODE_ENV === "development") {
+    if (!globalThis._mongoClientPromise) {
+      globalThis._mongoClientPromise = new MongoClient(uri).connect();
+    }
+
+    clientPromise = globalThis._mongoClientPromise;
+  } else if (!clientPromise) {
+    clientPromise = new MongoClient(uri).connect();
+  }
+
+  return clientPromise;
+}
~~~

### 설명/확인 포인트

- `MONGODB_URI`가 없으면 바로 에러를 던져 설정 누락을 빠르게 발견합니다.
- 이 파일은 서버에서만 import해야 하며 클라이언트 컴포넌트에 직접 연결하지 않습니다.

## 작업 4. 게시글 데이터 함수 추가

화면이나 API 코드가 MongoDB 쿼리를 직접 들고 있지 않도록 게시글 관련 작업을 `lib/posts.js`로 분리합니다. 다음 단계의 API Route는 이 함수들을 호출하기만 하면 됩니다.

### 직접 수정할 파일

- 생성: [lib/posts.js](../../lib/posts.js)

### 이전 단계와 달라지는 코드

아래 diff에서 `+`로 시작하는 줄을 추가하고, `-`로 시작하는 줄을 제거합니다. 새 파일은 diff에 보이는 전체 내용을 새로 입력합니다.

~~~diff
diff --git a/lib/posts.js b/lib/posts.js
new file mode 100644
index 0000000..c9aa495
--- /dev/null
+++ b/lib/posts.js
@@ -0,0 +1,75 @@
+import { ObjectId } from "mongodb";
+import getMongoClient from "./mongodb";
+
+const dbName = process.env.MONGODB_DB || "blog";
+const collectionName = "posts";
+
+function createSeedPosts() {
+  return Array.from({ length: 10 }, (_, index) => ({
+    createdAt: new Date(),
+    title: `Blog Post ${index + 1}`,
+    content:
+      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
+    image: "https://picsum.photos/100",
+  }));
+}
+
+async function getPostsCollection() {
+  const client = await getMongoClient();
+  return client.db(dbName).collection(collectionName);
+}
+
+export async function seedPostsIfEmpty() {
+  const collection = await getPostsCollection();
+  const count = await collection.countDocuments();
+
+  if (count === 0) {
+    await collection.insertMany(createSeedPosts());
+  }
+}
+
+export async function listPosts() {
+  await seedPostsIfEmpty();
+
+  const collection = await getPostsCollection();
+  return collection.find({}).sort({ createdAt: -1 }).toArray();
+}
+
+export async function createPost(postData) {
+  const collection = await getPostsCollection();
+  const result = await collection.insertOne({
+    title: postData.title,
+    content: postData.content,
+    image: postData.image || "https://picsum.photos/100",
+    createdAt: new Date(),
+  });
+
+  return result;
+}
+
+export async function getPostById(id) {
+  if (!ObjectId.isValid(id)) {
+    return null;
+  }
+
+  const collection = await getPostsCollection();
+  return collection.findOne({ _id: new ObjectId(id) });
+}
+
+export async function updatePost(id, postData) {
+  if (!ObjectId.isValid(id)) {
+    return null;
+  }
+
+  const collection = await getPostsCollection();
+  return collection.updateOne(
+    { _id: new ObjectId(id) },
+    {
+      $set: {
+        title: postData.title,
+        content: postData.content,
+        updatedAt: new Date(),
+      },
+    },
+  );
+}
~~~

### 설명/확인 포인트

- `seedPostsIfEmpty`는 처음 목록 조회 시 샘플 데이터가 없으면 10개를 넣습니다.
- `getPostById`와 `updatePost`는 잘못된 id가 들어와도 `ObjectId.isValid`로 먼저 방어합니다.

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

- `.env.example`를 복사해 `.env.local`을 준비한다.
- `npm run lint`로 import/문법 오류가 없는지 확인한다.

## 다음 단계로 넘어가기 전

- 이 문서의 각 작업 단위에서 설명을 먼저 읽고, 바로 아래 diff를 기준으로 파일을 수정합니다.
- 새 파일은 diff에 나온 전체 내용을 입력하고, 기존 파일은 diff의 `+`/`-` 줄만 비교하면서 수정합니다.
- 링크된 프로젝트 내부 파일을 열어 현재 단계의 완성본과 직접 비교할 수 있습니다.
