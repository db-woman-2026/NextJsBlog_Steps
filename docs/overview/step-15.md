# Step 15. 서버 검색

## 배울 내용

`step-15`는 MongoDB에서 직접 검색하는 서버 검색을 추가하는 단계입니다.

`step-14`의 클라이언트 필터는 브라우저가 이미 가진 배열 안에서만 검색했습니다. 검색어를 API로 보내고, 서버가 MongoDB에서 검색합니다.

다음을 구현합니다.

- `GET /api/post?keyword=...` query string을 읽는다.
- `listPosts(keyword)` 데이터 함수에서 MongoDB 검색 조건을 만든다.
- 제목 또는 본문에 검색어가 포함된 게시글을 찾는다.
- 홈 화면에 `Server Search` 버튼을 추가한다.
- `encodeURIComponent()`로 검색어를 안전하게 URL에 넣는다.
- 클라이언트 필터와 서버 검색의 차이를 비교한다.

## 클라이언트 필터와 서버 검색의 차이

클라이언트 필터는 브라우저가 이미 가진 배열에서 검색합니다.

```txt
브라우저 배열 -> filter()
```

서버 검색은 API에 검색어를 보내고, MongoDB에서 검색합니다.

```txt
브라우저
-> GET /api/post?keyword=react
-> API Route
-> MongoDB 검색
-> 검색 결과 응답
```

데이터가 많아질수록 서버 검색이 더 현실적인 구조입니다.

## API Route에서 검색어 읽기

`app/api/post/route.js`의 `GET` 함수는 `request` 인자를 받도록 바꿉니다.

```js
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const keyword = searchParams.get("keyword") || "";
  const posts = await listPosts(keyword);

  return apiSuccess(posts, "Posts fetched successfully");
}
```

`new URL(request.url)`을 사용하면 query string을 읽을 수 있습니다.

예를 들어 다음 주소에서

```txt
/api/post?keyword=react
```

`searchParams.get("keyword")`는 `"react"`를 반환합니다.

## listPosts(keyword)

`lib/posts.js`의 `listPosts` 함수는 검색어를 받을 수 있게 바꿉니다.

```js
export async function listPosts(keyword = "") {
  await seedPostsIfEmpty();

  const collection = await getPostsCollection();
  const searchKeyword = keyword.trim();

  if (!searchKeyword) {
    return collection.find({}).sort({ createdAt: -1 }).toArray();
  }

  return collection
    .find({
      $or: [
        { title: { $regex: searchKeyword, $options: "i" } },
        { content: { $regex: searchKeyword, $options: "i" } },
      ],
    })
    .sort({ createdAt: -1 })
    .toArray();
}
```

검색어가 없으면 전체 목록을 반환합니다.

검색어가 있으면 제목 또는 본문에 검색어가 포함된 글을 찾습니다.

## $regex와 $options

MongoDB의 `$regex`는 정규식 검색 조건입니다.

```js
{ title: { $regex: searchKeyword, $options: "i" } }
```

`$options: "i"`는 대소문자를 구분하지 않는다는 뜻입니다.

`$or`는 여러 조건 중 하나라도 맞으면 결과에 포함합니다.

```js
$or: [
  { title: ... },
  { content: ... },
]
```

## fetchPosts 공통 함수

홈 화면에서는 API 호출 로직을 함수로 분리합니다.

```js
async function fetchPosts(url) {
  const response = await fetch(url, { cache: "no-store" });
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to fetch posts");
  }

  return result.data;
}
```

API 응답이 통일되어 있으므로 성공 데이터는 항상 `result.data`에서 읽습니다.

## Server Search 버튼

검색어를 query string으로 만들어 API를 호출합니다.

```js
const searchKeyword = keyword.trim();
const url = searchKeyword
  ? `/api/post?keyword=${encodeURIComponent(searchKeyword)}`
  : "/api/post";
```

`encodeURIComponent()`는 검색어에 공백이나 특수문자가 들어가도 URL이 깨지지 않게 합니다.

## Show All은 다시 서버에서 불러오기

서버 검색 후 전체 목록으로 돌아갈 때는 `/api/post`를 다시 호출합니다.

```js
const data = await fetchPosts("/api/post");
setAllPosts(data);
setPosts(data);
setKeyword("");
setSearchMessage("");
```

이렇게 하면 다른 사용자가 추가한 글이나 방금 작성/삭제한 글도 최신 상태로 다시 받을 수 있습니다.

## 실습 순서

1. `lib/posts.js`의 `listPosts`가 `keyword`를 받도록 수정한다.
2. 검색어가 없으면 전체 목록을 반환한다.
3. 검색어가 있으면 `$regex`와 `$or`로 제목/본문을 검색한다.
4. `app/api/post/route.js`의 `GET` 함수에서 query string을 읽는다.
5. `listPosts(keyword)`를 호출한다.
6. 홈 화면에 `fetchPosts(url)` 공통 함수를 만든다.
7. `handleServerSearch` 함수를 만든다.
8. `Server Search` 버튼을 추가한다.
9. `Show All`은 서버에서 전체 목록을 다시 불러오도록 바꾼다.

## 확인 방법

홈 화면에서 검색어를 입력합니다.

```txt
http://localhost:3000/
```

`Client Filter`와 `Server Search`를 각각 눌러 결과를 비교합니다.

브라우저 주소창에서 API를 직접 확인할 수도 있습니다.

```txt
http://localhost:3000/api/post?keyword=Blog
```

## 검증 명령

> Windows 11에서는 [환경 준비](../windows-11.md)를 먼저 확인합니다. `git`, `node`, `npm` 명령은 PowerShell에서도 같습니다. `npm.ps1` 오류가 나면 `npm.cmd`를 사용합니다.

```bash
npm run lint
npm run build
```

## 정리

검색은 어디에서 실행되는지에 따라 의미가 달라집니다. 클라이언트 필터는 브라우저 배열 검색이고, 서버 검색은 API와 DB를 사용하는 검색입니다.
