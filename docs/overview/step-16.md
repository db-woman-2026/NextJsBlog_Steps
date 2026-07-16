# Step 16. 페이지네이션

## 배울 내용

`step-16`은 게시글 목록에 페이지네이션을 추가하는 단계입니다.

검색 기능까지 추가하면 게시글 목록은 점점 커질 수 있습니다. 모든 글을 한 번에 가져오면 데이터가 많아질수록 느려질 수 있습니다.

다음을 구현합니다.

- `GET /api/post?page=1&limit=5` 형식의 query string을 지원한다.
- MongoDB에서 `skip`, `limit`으로 일부 게시글만 가져온다.
- 전체 게시글 수와 전체 페이지 수를 계산한다.
- API 응답의 `data` 안에 `posts`와 `pagination`을 담는다.
- 홈 화면에 `Previous`, `Next` 버튼을 추가한다.
- 서버 검색 결과도 페이지 단위로 볼 수 있게 한다.

## API 응답 형식은 그대로 유지한다

이 프로젝트의 API 응답은 `step-4`부터 같은 최상위 형식을 사용합니다.

```json
{
  "success": true,
  "message": "Posts fetched successfully",
  "data": {}
}
```

페이지네이션을 추가해도 이 최상위 형식은 바꾸지 않습니다.

대신 `data` 내부 구조가 배열에서 객체로 확장됩니다.

```json
{
  "success": true,
  "message": "Posts fetched successfully",
  "data": {
    "posts": [],
    "pagination": {
      "page": 1,
      "limit": 5,
      "totalPosts": 10,
      "totalPages": 2,
      "hasPreviousPage": false,
      "hasNextPage": true
    }
  }
}
```

## listPosts 옵션 객체

`lib/posts.js`의 `listPosts`는 옵션 객체를 받도록 바꿉니다.

```js
export async function listPosts({ keyword = "", page = 1, limit = 5 } = {}) {
  // ...
}
```

검색어, 현재 페이지, 페이지 크기를 함께 다루기 위해서입니다.

## 검색 조건 분리

검색 조건은 별도 함수로 분리합니다.

```js
function buildPostQuery(keyword) {
  const searchKeyword = keyword.trim();

  if (!searchKeyword) {
    return {};
  }

  return {
    $or: [
      { title: { $regex: searchKeyword, $options: "i" } },
      { content: { $regex: searchKeyword, $options: "i" } },
    ],
  };
}
```

검색어가 없으면 빈 조건 `{}`을 반환합니다. MongoDB에서 빈 조건은 전체 문서 조회를 의미합니다.

## page와 limit 정리

query string으로 받은 값은 문자열입니다. 그래서 숫자로 바꿔야 합니다.

```js
const currentPage = Math.max(Number(page) || 1, 1);
const pageSize = Math.min(Math.max(Number(limit) || 5, 1), 20);
```

`page`는 최소 1입니다.

`limit`은 최소 1, 최대 20으로 제한합니다. 사용자가 너무 큰 값을 보내도 한 번에 과도한 데이터를 가져오지 않게 하기 위해서입니다.

## skip과 limit

MongoDB에서 일부 문서만 가져올 때 `skip`과 `limit`을 사용합니다.

```js
const skip = (currentPage - 1) * pageSize;
```

예를 들어 페이지 크기가 5일 때:

| page | skip | 가져오는 범위 |
| --- | --- | --- |
| 1 | 0 | 1번째부터 5개 |
| 2 | 5 | 6번째부터 5개 |
| 3 | 10 | 11번째부터 5개 |

실제 조회는 다음처럼 합니다.

```js
const posts = await collection
  .find(query)
  .sort({ createdAt: -1 })
  .skip(skip)
  .limit(pageSize)
  .toArray();
```

## 전체 개수 세기

페이지 정보를 만들려면 전체 게시글 수가 필요합니다.

```js
const totalPosts = await collection.countDocuments(query);
const totalPages = Math.max(Math.ceil(totalPosts / pageSize), 1);
```

검색어가 있으면 검색 조건에 맞는 글의 개수를 셉니다.

## API Route 수정

`app/api/post/route.js`에서 page와 limit을 읽습니다.

```js
const page = searchParams.get("page") || "1";
const limit = searchParams.get("limit") || "5";
const posts = await listPosts({ keyword, page, limit });
```

## 홈 화면 상태

홈 화면에는 페이지 정보를 담는 상태를 추가합니다.

```js
const [pagination, setPagination] = useState(null);
```

API 응답을 받으면 게시글과 페이지 정보를 각각 저장합니다.

```js
setAllPosts(data.posts);
setPosts(data.posts);
setPagination(data.pagination);
```

## 페이지 이동 버튼

페이지 정보가 있으면 버튼을 보여줍니다.

```jsx
<button
  type="button"
  onClick={() => handlePageChange(pagination.page - 1)}
  disabled={isLoading || !pagination.hasPreviousPage}
>
  Previous
</button>
```

다음 버튼도 같은 방식입니다.

```jsx
<button
  type="button"
  onClick={() => handlePageChange(pagination.page + 1)}
  disabled={isLoading || !pagination.hasNextPage}
>
  Next
</button>
```

이전 페이지가 없으면 `Previous`를 비활성화하고, 다음 페이지가 없으면 `Next`를 비활성화합니다.

## 검색과 페이지네이션

서버 검색을 한 뒤 다음 페이지로 이동할 때도 같은 검색어를 유지해야 합니다.

그래서 마지막 서버 검색어를 `serverKeyword` 상태로 저장합니다.

```js
const [serverKeyword, setServerKeyword] = useState("");
```

페이지 변경 시 이 값을 다시 API 요청에 넣습니다.

```js
await loadPosts({ page: nextPage, searchKeyword: serverKeyword });
```

## 실습 순서

1. `lib/posts.js`에서 검색 조건을 만드는 `buildPostQuery` 함수를 만든다.
2. `listPosts`가 `{ keyword, page, limit }` 옵션 객체를 받도록 바꾼다.
3. `countDocuments`, `skip`, `limit`을 사용해 페이지 단위 결과를 만든다.
4. API Route에서 `page`, `limit` query string을 읽는다.
5. 홈 화면의 `fetchPosts` 결과가 `{ posts, pagination }` 구조임을 반영한다.
6. `pagination` 상태를 추가한다.
7. `Previous`, `Next` 버튼을 만든다.
8. 서버 검색어를 유지하면서 페이지를 이동한다.

## 확인 방법

홈 화면을 엽니다.

```txt
http://localhost:3000/
```

게시글이 5개씩 보이고, `Next` 버튼으로 다음 페이지로 이동할 수 있어야 합니다.

검색어를 입력하고 `Server Search`를 누른 뒤에도 페이지 버튼이 검색 결과 기준으로 동작해야 합니다.

## 검증 명령

```bash
npm run lint
npm run build
```

## 정리

페이지네이션은 단순한 버튼 UI가 아니라 API, DB 조회 방식, 화면 상태가 함께 바뀌는 기능입니다. 검색 이후에 추가해야 검색 결과도 페이지 단위로 다룰 수 있습니다.
