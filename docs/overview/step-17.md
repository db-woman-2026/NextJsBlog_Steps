# Step 17. 정렬 기능

## 변경 내용

게시글 목록 정렬 기능을 추가합니다.

`step-16`의 페이지네이션 전체 결과에 정렬을 적용하려면 MongoDB가 정렬한 뒤 현재 페이지를 조회해야 합니다. 정렬 기준이 바뀌면 조회 순서를 바꾸고 첫 페이지부터 다시 보여줍니다.

다음을 구현합니다.

- `sort` query string을 API에서 읽는다.
- MongoDB `sort` 조건을 선택하는 함수를 만든다.
- 홈 화면에 정렬 select를 추가한다.
- 정렬 기준이 바뀌면 서버에서 1페이지를 다시 불러온다.
- 검색, 페이지네이션, 정렬 조건이 함께 동작하도록 만든다.

## 정렬 옵션

네 가지 정렬을 제공합니다.

| 값 | 의미 |
| --- | --- |
| `created-desc` | 최신순 |
| `created-asc` | 오래된순 |
| `title-asc` | 제목 A-Z |
| `title-desc` | 제목 Z-A |

기본값은 최신순입니다.

```js
const DEFAULT_SORT = "created-desc";
```

## MongoDB sort 조건 만들기

`lib/posts.js`에 정렬 조건을 만드는 함수를 추가합니다.

```js
function buildPostSort(sort) {
  switch (sort) {
    case "created-asc":
      return { createdAt: 1 };
    case "title-asc":
      return { title: 1 };
    case "title-desc":
      return { title: -1 };
    case "created-desc":
    default:
      return { createdAt: -1 };
  }
}
```

MongoDB에서 `1`은 오름차순, `-1`은 내림차순입니다.

## listPosts에 sort 추가

`listPosts` 옵션 객체에 `sort`를 추가합니다.

```js
export async function listPosts({
  keyword = "",
  page = 1,
  limit = 5,
  sort = "created-desc",
} = {}) {
  // ...
}
```

조회할 때 고정된 최신순 대신 선택된 정렬 조건을 사용합니다.

```js
.sort(buildPostSort(sort))
```

## API Route에서 sort 읽기

`app/api/post/route.js`에서 query string을 읽습니다.

```js
const sort = searchParams.get("sort") || "created-desc";
const posts = await listPosts({ keyword, page, limit, sort });
```

이제 API 주소는 다음처럼 사용할 수 있습니다.

```txt
/api/post?page=1&limit=5&sort=title-asc
```

검색과 함께 사용할 수도 있습니다.

```txt
/api/post?keyword=react&page=1&limit=5&sort=created-desc
```

## 홈 화면 select

정렬 기준은 select로 선택합니다.

```jsx
<select
  id="sortOrder"
  value={sortOrder}
  onChange={handleSortChange}
  disabled={isLoading}
>
  <option value="created-desc">Newest first</option>
  <option value="created-asc">Oldest first</option>
  <option value="title-asc">Title A-Z</option>
  <option value="title-desc">Title Z-A</option>
</select>
```

`sortOrder` 상태는 현재 선택된 정렬 기준입니다.

```js
const [sortOrder, setSortOrder] = useState(DEFAULT_SORT);
```

## 정렬 변경 처리

정렬 기준이 바뀌면 1페이지부터 다시 불러옵니다.

```js
async function handleSortChange(event) {
  const nextSortOrder = event.target.value;

  setSortOrder(nextSortOrder);
  setSearchMessage("Sorted posts from the server.");
  await loadPosts({
    page: 1,
    searchKeyword: serverKeyword,
    sortValue: nextSortOrder,
  });
}
```

정렬 기준을 바꿨는데 기존 페이지 번호를 유지하면 사용자가 예상하기 어려울 수 있습니다. 그래서 1페이지로 돌아갑니다.

## URL 만들기

홈 화면의 `buildPostsUrl` 함수도 정렬 조건을 포함합니다.

```js
function buildPostsUrl({ keyword, page, sort }) {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(PAGE_SIZE),
    sort,
  });

  if (keyword) {
    params.set("keyword", keyword);
  }

  return `/api/post?${params.toString()}`;
}
```

`URLSearchParams`를 사용하면 query string을 직접 문자열로 이어 붙이는 것보다 안전합니다.

## 실습 순서

1. `lib/posts.js`에 `buildPostSort` 함수를 만든다.
2. `listPosts` 옵션에 `sort`를 추가한다.
3. MongoDB 조회의 `.sort()`에 `buildPostSort(sort)`를 사용한다.
4. API Route에서 `sort` query string을 읽는다.
5. 홈 화면에 `DEFAULT_SORT`와 `sortOrder` 상태를 만든다.
6. `buildPostsUrl`이 `sort`를 포함하도록 수정한다.
7. 정렬 select를 추가한다.
8. `handleSortChange`에서 정렬 기준을 바꾸고 서버 목록을 다시 불러온다.

## 결과 확인

홈 화면에서 정렬 select를 바꿉니다.

```txt
http://localhost:3000/
```

최신순, 오래된순, 제목순이 각각 다르게 보이면 성공입니다.

서버 검색을 한 뒤에도 정렬 기준이 유지되는지 확인합니다.

## 검증 명령

> Windows 11에서는 [환경 준비](../windows-11.md)를 먼저 확인합니다. `git`, `node`, `npm.cmd` 명령은 PowerShell에서도 같습니다. `npm.ps1` 오류가 나면 `npm.cmd`를 사용합니다.

```powershell
npm.cmd run lint
npm.cmd run build
```

## 정리

서버에서 전체 결과를 정렬한 뒤 `skip`과 `limit`을 적용해야 각 페이지가 같은 정렬 기준을 유지합니다.
