# 14. Node.js, 환경 변수, MongoDB

## 확인할 내용

- 브라우저 JavaScript와 Node.js 서버 실행 환경을 구분합니다.
- 환경 변수에 둘 값과 공개 코드에 둘 값을 구분합니다.
- MongoDB의 database, collection, document와 CRUD method를 구분합니다.
- `ObjectId`를 사용하는 이유를 이해합니다.

## 1. JavaScript 실행 환경

같은 JavaScript라도 어디에서 실행되는지에 따라 사용할 수 있는 기능이 다릅니다.

| 실행 환경 | 사용할 수 있는 대표 기능 | 사용할 수 없는 대표 기능 |
| --- | --- | --- |
| 브라우저 | `window`, `document`, click 이벤트 | 서버의 비밀 환경 변수, 직접 DB 연결 |
| Node.js 서버 | 환경 변수, 서버 패키지, DB 연결 | 사용자의 실제 DOM과 브라우저 이벤트 |

Next.js는 두 실행 환경을 한 프로젝트에서 연결합니다. `"use client";` 경계와 서버 컴포넌트를 구분하는 이유입니다.

## 2. 환경 변수

환경마다 달라지거나 공개하면 안 되는 값은 코드에 직접 적지 않고 환경 변수로 전달합니다.

```txt
MONGODB_URI=mongodb://localhost:27017/next_blog_practice
MONGODB_DB=next_blog_practice
```

서버 코드에서 `process.env`로 읽습니다.

```js
const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || "next_blog_practice";
```

`.env.local`은 개발자 컴퓨터의 실제 값을 담고 Git에 올리지 않습니다. `.env.example`은 필요한 변수 이름과 안전한 예시를 공유합니다.

```txt
.env.example  -> Git에 포함할 수 있는 안내
.env.local    -> 각자 만든 실제 설정, Git에서 제외
```

환경 파일을 바꾼 뒤에는 개발 서버를 다시 시작해야 새 값이 반영되는 경우가 많습니다.

## 3. 공개 환경 변수 주의

Next.js에서 `NEXT_PUBLIC_` 접두사가 붙은 환경 변수는 브라우저 코드에 포함될 수 있습니다.

```txt
NEXT_PUBLIC_SITE_NAME=My Blog
```

DB 비밀번호나 비밀 key에는 `NEXT_PUBLIC_`을 붙이면 안 됩니다.

```txt
# 공개하면 안 되는 값의 예
MONGODB_URI=mongodb+srv://user:password@example...
```

## 4. MongoDB 구조

MongoDB는 데이터를 JSON과 비슷한 **document** 형태로 저장합니다.

```txt
MongoDB server
└── blog database
    └── posts collection
        ├── post document
        ├── post document
        └── post document
```

관계형 데이터베이스 용어와 비교하면 다음처럼 이해할 수 있습니다.

| MongoDB | 쉬운 뜻 | 관계형 DB의 비슷한 용어 |
| --- | --- | --- |
| database | 관련 데이터의 큰 묶음 | database |
| collection | 같은 종류 document의 묶음 | table |
| document | 게시글 하나 같은 데이터 | row |
| field | `title`, `content` 같은 속성 | column |

게시글 document 예입니다.

```js
{
  _id: ObjectId("..."),
  title: "첫 글",
  content: "본문입니다.",
  category: "general",
  createdAt: new Date()
}
```

## 5. MongoClient 연결

MongoDB driver의 `MongoClient`가 서버와 연결합니다.

```js
import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI);
await client.connect();
```

연결한 client에서 database와 collection을 선택합니다.

```js
const database = client.db("blog");
const collection = database.collection("posts");
```

Next.js 개발 환경에서는 파일이 여러 번 다시 평가될 수 있으므로 프로젝트 helper는 연결 Promise를 재사용합니다. 중요한 기초 원칙은 요청마다 불필요한 새 연결을 계속 만들지 않는 것입니다.

개발 환경에서는 `globalThis`에 Promise를 보관해 파일이 다시 평가되어도 같은 연결 작업을 재사용할 수 있습니다.

```js
if (process.env.NODE_ENV === "development") {
  if (!globalThis._mongoClientPromise) {
    globalThis._mongoClientPromise = new MongoClient(uri).connect();
  }

  clientPromise = globalThis._mongoClientPromise;
}
```

- `process.env.NODE_ENV`: 현재 실행 환경이 개발인지 배포인지 구분합니다.
- `globalThis`: 현재 JavaScript 실행 환경의 전역 객체입니다.
- `_mongoClientPromise`: 이 프로젝트가 연결 Promise를 보관하기 위해 정한 속성 이름입니다.

처음 읽을 때는 “개발 중 파일이 다시 실행되어도 MongoDB 연결 Promise 하나를 재사용한다”는 목적만 이해하면 충분합니다.

## 6. document 만들기

```js
const result = await collection.insertOne({
  title: "새 글",
  content: "본문",
  createdAt: new Date(),
});

console.log(result.insertedId);
```

`insertedId`는 새 document에 만들어진 id입니다.

여러 document를 한 번에 추가할 수도 있습니다.

```js
await collection.insertMany([
  { title: "글 1" },
  { title: "글 2" },
]);
```

## 7. document 읽기

조건에 맞는 하나를 찾습니다.

```js
const post = await collection.findOne({ title: "새 글" });
```

여러 개를 찾고 배열로 바꿉니다.

```js
const posts = await collection
  .find({ category: "tech" })
  .sort({ createdAt: -1 })
  .toArray();
```

`find`는 query cursor를 반환하므로 목록 값이 필요할 때 `toArray()`까지 기다립니다.

## 8. 수정과 삭제

```js
const updateResult = await collection.updateOne(
  { title: "새 글" },
  { $set: { category: "notice" } },
);
```

`$set`은 지정한 field만 변경합니다. 결과의 `matchedCount`로 일치한 document가 있었는지 확인할 수 있습니다.

```js
const deleteResult = await collection.deleteOne({ title: "새 글" });
console.log(deleteResult.deletedCount);
```

`deletedCount`가 0이면 삭제할 document를 찾지 못한 것입니다.

## 9. ObjectId

MongoDB가 기본으로 만드는 `_id`는 일반 문자열이 아니라 `ObjectId`입니다. URL에서 받은 id는 문자열이므로 조회 전에 유효성을 검사하고 변환합니다.

```js
import { ObjectId } from "mongodb";

function makeIdQuery(id) {
  if (!ObjectId.isValid(id)) {
    return null;
  }

  return { _id: new ObjectId(id) };
}
```

유효하지 않은 문자열을 바로 `new ObjectId(id)`에 전달하면 오류가 날 수 있으므로 먼저 검사합니다.

## 10. 검색, 정렬, 페이지네이션

부분 문자열을 대소문자 구분 없이 검색하는 query 예입니다.

```js
const query = {
  title: { $regex: "next", $options: "i" },
};
```

최신순 정렬은 `-1`, 오래된순은 `1`을 사용합니다.

```js
.sort({ createdAt: -1 })
```

페이지네이션은 앞 항목을 건너뛰고 필요한 개수만 가져옵니다.

```js
const page = 2;
const pageSize = 5;
const skip = (page - 1) * pageSize;

const posts = await collection
  .find({})
  .skip(skip)
  .limit(pageSize)
  .toArray();
```

## 프로젝트 예시

- `step-3`: 환경 변수, MongoClient helper, 게시글 collection 함수를 만듭니다.
- 첫 목록 요청에서 collection이 비어 있으면 예제 document를 넣습니다.
- `step-13`: `ObjectId` 검증 뒤 id로 document를 삭제합니다.
- `step-15 ~ step-17`: MongoDB query, `sort`, `skip`, `limit`을 확장합니다.
- `step-19`: 기존 document에 없던 category field를 기본값으로 보완합니다.

## 확인하기

1. 실제 비밀번호가 포함된 `.env.local`을 Git에 올려도 되나요?
2. MongoDB에서 게시글 하나는 collection인가요, document인가요?
3. URL 문자열 id를 `ObjectId`로 바꾸기 전에 무엇을 확인하나요?

정답: 올리면 안 됩니다. 게시글 하나는 document입니다. `ObjectId.isValid(id)`로 유효성을 확인합니다.
