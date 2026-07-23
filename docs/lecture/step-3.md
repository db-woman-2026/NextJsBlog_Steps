# Step 3. MongoDB 연결과 게시글 데이터 함수 만들기

## 변경 내용

MongoDB 연결, 환경 변수, 게시글 데이터 함수를 만들어 서버 데이터 계층을 준비합니다.

- MongoDB Node.js Driver를 설치하고 서버에서 MongoDB에 연결하는 helper를 만듭니다.
- 개인 환경 변수는 `.env.local`, 공유 예시는 `.env.example`로 분리합니다.
- 게시글 목록/생성/단건 조회/수정 함수를 `lib/posts.js`에 모아 API Route에서 재사용합니다.

## 시작 전 확인

개인 실습 저장소의 `main`에서 직전 단계까지 마친 상태로 시작합니다. 코드 블록은 복사해 붙이지 않고 직접 입력합니다.

수정 전에 `git status --short`의 출력이 없는지 확인합니다. 변경이 남아 있다면 원인을 확인하고 시작 상태를 정리합니다.

## 작업 1. MongoDB 패키지 설치

Next.js가 MongoDB 드라이버를 기본 제공하지 않으므로 별도 패키지를 설치합니다. 이 작업은 명령 실행이 전부이며, 패키지 파일은 npm이 자동으로 갱신합니다.

### 수정할 파일

- 입력해서 수정할 파일은 없습니다.

### 명령으로 자동 변경되는 파일

- 수정: `package.json`
- 수정: `package-lock.json`

위 파일들은 명령 실행 결과만 확인하며 직접 입력하지 않습니다.

### 먼저 실행

> Windows 11에서는 [환경 준비](../windows-11.md) <span class="print-reference" data-print-reference="true">(인쇄본 위치: Next.js · 장 「Windows 11 x64 실습 환경 준비」 · 절 「1. Windows Terminal 설치」)</span>를 먼저 확인합니다. 명령은 이 교재의 PowerShell 코드 블록에 적힌 `git`, `node`, `npm` 형태를 그대로 사용합니다.

```powershell
npm install mongodb@^7.4.0
```

### 입력할 코드

이 작업에는 코드 diff가 없습니다. 위 설명과 확인 항목으로 설치 결과를 검증합니다.

### 설명과 확인

- `package.json`과 `package-lock.json`은 npm이 자동 갱신합니다.
- 설치 후 서버 코드에서 `MongoClient`와 `ObjectId`를 import할 수 있습니다.

## 작업 2. 환경 변수 예시와 Git 무시 규칙 정리

연결 문자열은 비밀번호를 포함할 수 있으므로 코드에 직접 쓰지 않습니다. 저장소에는 예시만 커밋하고 개인 값은 `.env.local`에 둡니다.

### 수정할 파일

- 생성: `.env.example`
- 수정: `.gitignore`

### 입력할 코드

아래 파일 경로를 확인하고 각 파일의 전체 내용을 입력합니다. 삭제로 표시된 파일은 PowerShell에서 제거합니다.

#### `.env.example`

`.env.example`를 열고 파일 전체를 다음 내용으로 맞춥니다.

~~~text
MONGODB_URI=mongodb://localhost:27017/next_blog_practice
MONGODB_DB=next_blog_practice
~~~

#### `.gitignore`

`.gitignore`를 열고 파일 전체를 다음 내용으로 맞춥니다.

~~~text
# See https://help.github.com/articles/ignoring-files/ for more about ignoring files.

# dependencies
/node_modules
/.pnp
.pnp.*
.yarn/*
!.yarn/patches
!.yarn/plugins
!.yarn/releases
!.yarn/versions

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
.idea/
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.pnpm-debug.log*

# env files (can opt-in for committing if needed)
.env*
!.env.example

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts
.obsidian/
~~~

### 설명과 확인

- `Copy-Item -LiteralPath .env.example -Destination .env.local` 후 자기 MongoDB 주소를 넣습니다.
- 로컬 MongoDB를 쓴다면 개발 서버를 실행하기 전에 MongoDB 서버가 `localhost:27017`에서 실행 중이어야 합니다.
- `MONGODB_DB`는 `next_blog_`로 시작하는 전용 이름을 사용합니다. 기존 프로젝트의 `blog` DB를 연결하지 않습니다.
- `.env*`는 무시하되 `!.env.example`만 예외로 둡니다.

## 작업 3. MongoDB 연결 helper 추가

`lib/mongodb.js`는 연결 생성과 재사용만 담당합니다. 개발 서버가 파일 변경 때 코드를 다시 읽어도 연결 Promise를 재사용해 불필요한 연결 증가를 줄입니다.

### 수정할 파일

- 생성: `lib/mongodb.js`

### 입력할 코드

아래 파일 경로를 확인하고 각 파일의 전체 내용을 입력합니다. 삭제로 표시된 파일은 PowerShell에서 제거합니다.

#### `lib/mongodb.js`

`lib/mongodb.js`를 열고 파일 전체를 다음 내용으로 맞춥니다.

~~~js
import { MongoClient } from "mongodb";

let clientPromise;

export default function getMongoClient() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("Please define MONGODB_URI in .env.local");
  }

  if (process.env.NODE_ENV === "development") {
    if (!globalThis._mongoClientPromise) {
      globalThis._mongoClientPromise = new MongoClient(uri).connect();
    }

    clientPromise = globalThis._mongoClientPromise;
  } else if (!clientPromise) {
    clientPromise = new MongoClient(uri).connect();
  }

  return clientPromise;
}
~~~

### 설명과 확인

- `MONGODB_URI`가 없으면 바로 에러를 던져 설정 누락을 빠르게 발견합니다.
- 이 파일은 서버에서만 import해야 하며 클라이언트 컴포넌트에 직접 연결하지 않습니다.

## 작업 4. 게시글 데이터 함수 추가

화면이나 API 코드가 MongoDB 쿼리를 직접 들고 있지 않도록 게시글 관련 작업을 `lib/posts.js`로 분리합니다. API Route는 이 함수들을 호출합니다.

### 수정할 파일

- 생성: `lib/posts.js`

### 입력할 코드

아래 파일 경로를 확인하고 각 파일의 전체 내용을 입력합니다. 삭제로 표시된 파일은 PowerShell에서 제거합니다.

#### `lib/posts.js`

`lib/posts.js`를 열고 파일 전체를 다음 내용으로 맞춥니다.

~~~js
import { ObjectId } from "mongodb";
import getMongoClient from "./mongodb";

const dbName = process.env.MONGODB_DB || "next_blog_practice";
const collectionName = "posts";

if (!dbName.startsWith("next_blog_")) {
  throw new Error("MONGODB_DB must start with next_blog_");
}

function createSeedPosts() {
  return Array.from({ length: 10 }, (_, index) => ({
    createdAt: new Date(),
    title: `Blog Post ${index + 1}`,
    content:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
    image: "https://picsum.photos/100",
  }));
}

async function getPostsCollection() {
  const client = await getMongoClient();
  return client.db(dbName).collection(collectionName);
}

export async function seedPostsIfEmpty() {
  const collection = await getPostsCollection();
  const count = await collection.countDocuments();

  if (count === 0) {
    await collection.insertMany(createSeedPosts());
  }
}

export async function listPosts() {
  await seedPostsIfEmpty();

  const collection = await getPostsCollection();
  return collection.find({}).sort({ createdAt: -1 }).toArray();
}

export async function createPost(postData) {
  const collection = await getPostsCollection();
  const result = await collection.insertOne({
    title: postData.title,
    content: postData.content,
    image: postData.image || "https://picsum.photos/100",
    createdAt: new Date(),
  });

  return result;
}

export async function getPostById(id) {
  if (!ObjectId.isValid(id)) {
    return null;
  }

  const collection = await getPostsCollection();
  return collection.findOne({ _id: new ObjectId(id) });
}

export async function updatePost(id, postData) {
  if (!ObjectId.isValid(id)) {
    return null;
  }

  const collection = await getPostsCollection();
  return collection.updateOne(
    { _id: new ObjectId(id) },
    {
      $set: {
        title: postData.title,
        content: postData.content,
        updatedAt: new Date(),
      },
    },
  );
}
~~~

### 설명과 확인

- `seedPostsIfEmpty`는 처음 목록 조회 시 샘플 데이터가 없으면 10개를 넣습니다.
- `getPostById`와 `updatePost`는 잘못된 id가 들어와도 `ObjectId.isValid`로 먼저 방어합니다.
- `MONGODB_DB`가 전용 접두사로 시작하지 않으면 샘플 생성과 변경 전에 중단합니다.

## 실행 확인

기본 정적 검사는 다음 명령으로 확인합니다.

```powershell
npm run lint
npm run build
```

브라우저 확인이 필요하면 개발 서버를 켠 뒤 해당 화면을 확인합니다.

```powershell
npm run dev
```

체크할 내용은 다음과 같습니다.

- `.env.example`를 복사해 `.env.local`을 준비하고, MongoDB 서버 또는 Atlas 연결 문자열이 실제로 준비되어 있는지 확인한다.
- `npm run lint`로 import/문법 오류가 없는지 확인한다.

## 독립 확인

전용 DB 이름을 바꿔 빈 collection에서 seed가 생기는지 확인합니다. 결과와 확인 방법을 한 문장으로 기록하고 바꾼 값은 원래대로 복구합니다.

## 마무리 확인

- 각 작업 단위의 설명과 파일 경로를 먼저 확인합니다.
- 코드 블록은 해당 파일의 일부가 아니라 현재 단계에서 사용할 전체 내용입니다.

## 저장소에 기록하기

실험용 변경을 모두 복구한 뒤 검사 결과와 코드 변경을 함께 확인합니다.

```powershell
git branch --show-current
git status --short
npm run lint
npm run build
git add .
git commit -m "Complete Next.js step 3"
git push
git status --short --branch
```

현재 브랜치는 `main`이어야 합니다. 마지막 상태에서 `main...origin/main` 뒤에 `ahead`가 없고 작업 파일 목록도 비어 있어야 합니다.
