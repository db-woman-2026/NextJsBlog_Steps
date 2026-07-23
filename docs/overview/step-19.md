# Step 19. 카테고리

## 배울 내용

`step-19`는 게시글에 카테고리를 추가하는 단계입니다.

이 단계는 확장 과정의 마지막 단계입니다. 카테고리는 데이터 모델, 작성 form, 수정 form, 목록 필터, 상세 표시가 모두 연결되어야 하므로 앞 단계들이 준비된 뒤에 추가하는 것이 좋습니다.

다음을 구현합니다.

- 게시글 데이터에 `category` 필드를 추가한다.
- 샘플 게시글에도 카테고리를 넣는다.
- 작성 화면에서 카테고리를 선택한다.
- 수정 화면에서 기존 카테고리를 불러오고 변경한다.
- 상세 화면과 목록 화면에 카테고리를 표시한다.
- 목록 API에서 `category` query string을 읽는다.
- 검색/페이지네이션/정렬과 카테고리 필터를 함께 사용한다.

## 왜 마지막 단계에 두는가

카테고리는 단순한 화면 장식이 아닙니다.

다음 파일들이 함께 바뀝니다.

```txt
lib/posts.js
app/api/post/route.js
app/api/post/[id]/route.js
app/post/page.js
app/post/[id]/page.js
app/detail/[id]/page.js
app/page.js
```

데이터 모델과 여러 화면이 동시에 바뀌기 때문에 초반 단계에 넣으면 학습 분량이 커집니다.

검색, 페이지네이션, 정렬에 카테고리 조건을 추가해 목록 API를 확장합니다.

## 카테고리 기본값

기존 게시글에는 `category`가 없을 수 있습니다.

그래서 서버에서는 기본값을 `general`로 처리합니다. 저장할 수 있는 값도 네 가지로 제한합니다.

```js
const postCategories = ["general", "notice", "daily", "tech"];

function normalizeCategory(category) {
  const normalized = typeof category === "string" ? category.trim() : "";
  return postCategories.includes(normalized) ? normalized : "general";
}
```

작성/수정 요청에 카테고리가 없거나 허용되지 않은 값이 들어오면 `general`을 저장합니다. 화면의 select만 믿지 않고 데이터 계층에서도 규칙을 지킵니다.

## 샘플 게시글 카테고리

샘플 게시글에는 여러 카테고리를 번갈아 넣습니다.

```js
const postCategories = ["general", "notice", "daily", "tech"];
```

```js
category: postCategories[index % postCategories.length],
```

이렇게 하면 처음 데이터를 만들었을 때도 카테고리 필터를 바로 실습할 수 있습니다.

## 목록 검색 조건 확장

`buildPostQuery`는 검색어와 카테고리를 함께 처리합니다.

```js
function buildPostQuery(keyword, category) {
  const searchKeyword = escapeRegex(keyword.trim());
  const selectedCategory = category.trim();
  const query = {};

  if (searchKeyword) {
    query.$or = [
      { title: { $regex: searchKeyword, $options: "i" } },
      { content: { $regex: searchKeyword, $options: "i" } },
    ];
  }

  if (selectedCategory && selectedCategory !== "all") {
    query.category = selectedCategory;
  }

  return query;
}
```

`category`가 `"all"`이면 카테고리 조건을 넣지 않습니다.

특정 카테고리를 선택하면 해당 카테고리 조건이 MongoDB query에 추가됩니다.

## API Route의 category query string

목록 API는 카테고리를 query string으로 받습니다.

```js
const category = searchParams.get("category") || "all";
const posts = await listPosts({ keyword, page, limit, sort, category });
```

예시는 다음과 같습니다.

```txt
/api/post?category=tech&page=1&limit=5
```

검색, 정렬과 함께 사용할 수도 있습니다.

```txt
/api/post?keyword=next&category=tech&sort=created-desc&page=1&limit=5
```

## 작성 화면 select

작성 화면에는 카테고리 select를 추가합니다.

```js
const [category, setCategory] = useState("general");
```

```jsx
<select
  id="category"
  value={category}
  onChange={(event) => setCategory(event.target.value)}
  disabled={isSubmitting}
>
  {CATEGORY_OPTIONS.map((option) => (
    <option key={option.value} value={option.value}>
      {option.label}
    </option>
  ))}
</select>
```

작성 요청 body에도 카테고리를 포함합니다.

```js
body: JSON.stringify({
  title,
  content,
  category,
  image: "https://picsum.photos/100",
})
```

## 수정 화면 select

수정 화면은 기존 게시글의 카테고리를 불러와야 합니다.

```js
setCategory(post.category || "general");
```

기존 데이터에 `category`가 없으면 `general`로 보여줍니다.

수정 요청에도 카테고리를 포함합니다.

```js
body: JSON.stringify({ title, content, category })
```

## 목록 화면 카테고리 필터

홈 화면에는 카테고리 필터 select를 추가합니다.

```js
const [categoryFilter, setCategoryFilter] = useState("all");
```

카테고리가 바뀌면 서버에서 1페이지를 다시 불러옵니다.

```js
async function handleCategoryChange(event) {
  const nextCategory = event.target.value;

  setCategoryFilter(nextCategory);
  await loadPosts({
    page: 1,
    searchKeyword: serverKeyword,
    categoryValue: nextCategory,
  });
}
```

검색어, 정렬, 페이지네이션과 함께 동작하도록 `buildPostsUrl`에 category를 추가합니다.

## 실습 순서

1. `lib/posts.js`에 카테고리 기본값 처리 함수를 만든다.
2. seed 게시글에 카테고리를 넣는다.
3. `buildPostQuery`가 카테고리 조건을 받을 수 있게 수정한다.
4. `listPosts` 옵션에 `category`를 추가한다.
5. 목록 API에서 `category` query string을 읽는다.
6. 작성 API와 수정 API가 category를 데이터 함수에 전달하도록 수정한다.
7. 작성 화면에 category 상태와 select를 추가한다.
8. 수정 화면에 category 상태와 select를 추가한다.
9. 상세 화면에 카테고리를 표시한다.
10. 홈 화면에 카테고리 필터 select를 추가한다.
11. 검색/정렬/페이지 이동 시 카테고리 조건이 유지되는지 확인한다.

## 확인 방법

새 글을 작성할 때 카테고리를 선택합니다.

```txt
http://localhost:3000/post
```

작성 후 상세 화면에서 카테고리가 보이는지 확인합니다.

홈 화면에서 카테고리 필터를 바꿉니다.

```txt
http://localhost:3000/
```

선택한 카테고리의 글만 보이면 성공입니다.

검색어와 정렬을 함께 사용해도 카테고리 조건이 유지되는지 확인합니다.

API 도구나 브라우저 개발자 도구에서 허용 목록에 없는 category로 작성 요청도 보냅니다. 저장된 값을 다시 조회했을 때 `general`이어야 합니다. 확인용 게시글은 테스트가 끝나면 삭제합니다.

## 검증 명령

> Windows 11에서는 [환경 준비](../windows-11.md)를 먼저 확인합니다. `git`, `node`, `npm.cmd` 명령은 PowerShell에서도 같습니다. `npm.ps1` 오류가 나면 `npm.cmd`를 사용합니다.

```powershell
npm.cmd run lint
npm.cmd run build
```

## 정리

카테고리는 데이터 모델을 확장하는 기능입니다. 필드를 하나 추가하는 것처럼 보이지만, 작성/수정/목록/상세/API/DB 조회 조건이 모두 함께 바뀌어야 완성됩니다.
