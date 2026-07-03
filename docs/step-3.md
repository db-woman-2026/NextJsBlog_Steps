# Step 3. MongoDB 연결과 게시글 데이터 함수 만들기

## 이 단계의 목표

`step-3` 브랜치는 블로그의 데이터 계층을 만드는 단계입니다.

화면은 아직 게시글을 보여주지 않습니다. API Route도 아직 없습니다. 대신 서버 코드에서 MongoDB에 연결하고, 게시글을 조회/생성/수정할 수 있는 함수를 준비합니다.

이 단계에서 배우는 내용은 다음과 같습니다.

- 환경 변수를 왜 사용하는지 이해한다.
- `.env.local`과 `.env.example`의 차이를 이해한다.
- MongoDB Node.js Driver를 설치한다.
- MongoDB 연결 코드를 `lib/mongodb.js`로 분리한다.
- 게시글 관련 데이터 작업을 `lib/posts.js`로 분리한다.
- 화면 코드, API 코드, 데이터 코드를 나누는 이유를 이해한다.

## 왜 데이터 계층을 먼저 만드는가

게시글 목록 화면을 바로 만들 수도 있습니다. 하지만 그러면 한 파일 안에 다음 내용이 뒤섞이기 쉽습니다.

- MongoDB 연결
- 게시글 조회
- API 응답 처리
- React 화면 상태
- 로딩/오류 표시

초급자에게는 이 구조가 너무 복잡합니다. 그래서 먼저 서버 쪽 데이터 함수를 분리합니다.

이 단계의 목표 구조는 다음과 같습니다.

```txt
lib/mongodb.js  -> MongoDB에 연결하는 일만 담당
lib/posts.js    -> posts 컬렉션에서 게시글을 다루는 일만 담당
```

다음 단계에서 API Route를 만들면 API 코드는 이 데이터 함수를 호출하기만 하면 됩니다.

## MongoDB 패키지 설치

다음 명령으로 MongoDB Node.js Driver를 설치합니다.

```bash
npm install mongodb@^7.4.0
```

설치 후 `package.json`의 `dependencies`에 다음 항목이 추가됩니다.

```json
"mongodb": "^7.4.0"
```

이 패키지는 Next.js가 자동으로 제공하는 기능이 아닙니다. MongoDB에 직접 연결하려면 별도로 설치해야 합니다.

## 환경 변수 파일 준비

MongoDB 연결 문자열은 코드에 직접 적지 않습니다.

나쁜 예시는 다음과 같습니다.

```js
const uri = "mongodb://localhost:27017/blog";
```

처음에는 편해 보이지만, 실제 서비스에서는 비밀번호가 포함된 주소를 사용할 수 있습니다. 그런 값을 코드에 직접 쓰면 GitHub에 노출될 수 있습니다.

그래서 환경 변수를 사용합니다.

이 저장소에는 `.env.example`만 커밋합니다.

```txt
MONGODB_URI=mongodb://localhost:27017/blog
MONGODB_DB=blog
```

개발자는 이 파일을 복사해서 `.env.local`을 만듭니다.

```bash
cp .env.example .env.local
```

그리고 개인 환경에 맞게 `.env.local`을 수정합니다.

`.env.local`은 Git에 올리지 않습니다. 그래서 `.gitignore`에는 다음 규칙이 있습니다.

```txt
.env*
!.env.example
```

첫 줄은 `.env`로 시작하는 파일을 모두 무시합니다. 둘째 줄은 그중 `.env.example`만 예외로 커밋할 수 있게 합니다.

## lib/mongodb.js의 역할

`lib/mongodb.js`는 MongoDB에 연결하는 함수만 제공합니다.

```js
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
```

`process.env.MONGODB_URI`는 `.env.local`에 있는 `MONGODB_URI` 값을 읽습니다.

값이 없으면 다음 오류를 던집니다.

```js
throw new Error("Please define MONGODB_URI in .env.local");
```

이 오류는 일부러 빠르게 실패하게 만드는 장치입니다. 연결 문자열이 없는데 조용히 넘어가면 나중에 더 이해하기 어려운 오류가 생깁니다.

## 개발 환경에서 연결을 재사용하는 이유

Next.js 개발 서버는 파일을 수정할 때 코드를 다시 로드합니다. 그때마다 MongoDB 연결을 새로 만들면 연결 수가 불필요하게 늘어날 수 있습니다.

그래서 개발 환경에서는 `globalThis._mongoClientPromise`에 연결 Promise를 저장해 재사용합니다.

이 코드는 초급자에게 처음에는 어려울 수 있습니다. 지금은 다음 문장만 기억해도 됩니다.

> 개발 중에는 MongoDB 연결을 계속 새로 만들지 않도록 전역 공간에 저장해 재사용한다.

## lib/posts.js의 역할

`lib/posts.js`는 블로그 게시글 데이터 작업을 담당합니다.

이 파일은 다음 함수를 export합니다.

| 함수 | 역할 |
| --- | --- |
| `seedPostsIfEmpty` | 게시글이 하나도 없으면 샘플 게시글 10개를 넣는다 |
| `listPosts` | 게시글 목록을 최신순으로 가져온다 |
| `createPost` | 새 게시글을 저장한다 |
| `getPostById` | id로 게시글 하나를 찾는다 |
| `updatePost` | id로 게시글 하나를 수정한다 |

이 함수들은 화면에서 직접 호출하지 않습니다. 서버 컴포넌트나 API Route에서 호출합니다.

## 데이터베이스와 컬렉션 이름

```js
const dbName = process.env.MONGODB_DB || "blog";
const collectionName = "posts";
```

`dbName`은 환경 변수 `MONGODB_DB`가 있으면 그 값을 사용하고, 없으면 `"blog"`를 사용합니다.

`collectionName`은 `"posts"`로 고정했습니다. MongoDB에서 collection은 관계형 데이터베이스의 table과 비슷하게 생각할 수 있습니다.

## 샘플 게시글을 넣는 이유

처음 MongoDB를 연결하면 `posts` 컬렉션이 비어 있을 수 있습니다. 그러면 홈 화면에서 아무것도 보이지 않아서 기능이 잘못된 것처럼 느껴질 수 있습니다.

그래서 `listPosts`를 처음 호출할 때 게시글이 비어 있으면 샘플 게시글을 넣습니다.

```js
export async function listPosts() {
  await seedPostsIfEmpty();

  const collection = await getPostsCollection();
  return collection.find({}).sort({ createdAt: -1 }).toArray();
}
```

`seedPostsIfEmpty`는 실습 편의를 위한 코드입니다. 실제 서비스에서는 자동 샘플 데이터 삽입을 사용하지 않을 수도 있습니다.

## ObjectId가 필요한 이유

MongoDB의 `_id`는 보통 `ObjectId` 타입입니다. URL에서 받는 id는 문자열입니다.

예를 들어 URL은 다음과 같습니다.

```txt
/detail/64f...
```

여기서 `64f...`는 문자열입니다. MongoDB에서 `_id`로 검색하려면 이 문자열을 `ObjectId`로 바꿔야 합니다.

```js
return collection.findOne({ _id: new ObjectId(id) });
```

잘못된 id가 들어올 수도 있으므로 먼저 확인합니다.

```js
if (!ObjectId.isValid(id)) {
  return null;
}
```

## 직접 실습 순서

1. `npm install mongodb@^7.4.0`을 실행한다.
2. `.gitignore`에서 `.env.example`은 커밋 가능하도록 예외 규칙을 추가한다.
3. `.env.example`을 만든다.
4. `.env.example`을 복사해서 `.env.local`을 만든다.
5. `lib` 폴더를 만든다.
6. `lib/mongodb.js`를 만들고 `getMongoClient` 함수를 작성한다.
7. `lib/posts.js`를 만들고 게시글 데이터 함수를 작성한다.
8. 아직 화면에서는 호출하지 않는다.

## 로컬 실행 전 준비

MongoDB가 로컬에서 실행 중이어야 실제 데이터 조회가 가능합니다.

예시 환경 변수는 다음과 같습니다.

```txt
MONGODB_URI=mongodb://localhost:27017/blog
MONGODB_DB=blog
```

MongoDB Atlas를 사용한다면 `MONGODB_URI`에는 Atlas에서 제공하는 연결 문자열을 넣습니다. 이 값은 비밀번호를 포함할 수 있으므로 `.env.local`에만 저장하고 Git에 올리지 않습니다.

## 검증 명령

이 단계의 파일은 아직 화면에서 호출되지 않으므로 MongoDB가 실행 중이 아니어도 빌드는 통과해야 합니다.

```bash
npm run lint
npm run build
```

만약 이 단계에서 빌드가 실패한다면 대부분 import 경로, 문법 오류, 패키지 설치 누락 문제입니다.

## 자주 발생하는 실수

### mongodb 패키지를 설치하지 않는 경우

`lib/mongodb.js`에서 다음 import를 사용합니다.

```js
import { MongoClient } from "mongodb";
```

패키지를 설치하지 않으면 `Module not found: Can't resolve 'mongodb'` 오류가 납니다.

### .env.local을 Git에 올리는 경우

`.env.local`에는 비밀번호나 개인 연결 문자열이 들어갈 수 있습니다. 이 파일은 절대 커밋하지 않습니다.

### 클라이언트 컴포넌트에서 MongoDB를 직접 import하는 경우

`"use client"`가 붙은 파일에서 `mongodb`를 직접 import하면 안 됩니다. 브라우저에는 MongoDB 연결 권한과 비밀 정보가 없어야 합니다.

MongoDB 연결은 서버 쪽 코드에서만 사용합니다.

### ObjectId 검사를 빼먹는 경우

잘못된 id 문자열을 바로 `new ObjectId(id)`에 넣으면 오류가 날 수 있습니다. 그래서 `ObjectId.isValid(id)`로 먼저 검사합니다.

## 이 단계에서 아직 하지 않는 것

아직 API Route를 만들지 않았습니다. 따라서 브라우저에서 `/api/post`로 접속해도 게시글 목록이 나오지 않습니다.

다음 단계에서 `app/api/post/route.js`와 `app/api/post/[id]/route.js`를 만들고, 이 단계에서 만든 데이터 함수를 연결합니다.
