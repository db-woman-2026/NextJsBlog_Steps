# Step 14. 클라이언트 필터 검색

## 변경 내용

`step-14`는 홈 화면에 클라이언트 필터 검색을 추가하는 단계입니다.

검색할 때 서버에 다시 요청하지 않습니다. 처음 홈 화면에서 받아온 게시글 배열을 브라우저 메모리에 보관해두고, 그 배열 안에서 검색어와 일치하는 글만 보여줍니다.

다음을 구현합니다.

- 전체 게시글 배열을 저장하는 `allPosts` 상태를 만든다.
- 현재 화면에 보여줄 게시글 배열을 `posts` 상태로 분리한다.
- 검색어를 저장하는 `keyword` 상태를 만든다.
- 검색 결과 안내 문구를 저장하는 `searchMessage` 상태를 만든다.
- 제목 또는 본문에 검색어가 포함되어 있는지 확인한다.
- `Client Filter` 버튼으로 브라우저 안에서 필터링한다.
- `Show All` 버튼으로 전체 목록을 다시 보여준다.

## 클라이언트 필터란 무엇인가

클라이언트 필터는 이미 브라우저가 가지고 있는 데이터에서 원하는 항목만 골라 보여주는 방식입니다.

```txt
GET /api/post로 목록을 한 번 받음
-> 브라우저에 배열 저장
-> 검색어 입력
-> 배열에서 일치하는 글만 필터링
```

서버나 MongoDB에 다시 요청하지 않기 때문에 빠르고 단순합니다.

하지만 브라우저가 이미 가지고 있는 데이터 안에서만 검색할 수 있습니다. 데이터가 아주 많거나 페이지네이션이 있는 경우에는 서버 검색이 더 적합할 수 있습니다.

## allPosts와 posts 분리

기존에는 `posts` 상태 하나만 있었습니다.

```js
const [posts, setPosts] = useState([]);
```

상태를 둘로 나눕니다.

```js
const [allPosts, setAllPosts] = useState([]);
const [posts, setPosts] = useState([]);
```

`allPosts`는 API에서 처음 받아온 원본 배열입니다.

`posts`는 현재 화면에 보여줄 배열입니다.

처음 데이터를 불러올 때는 둘 다 같은 값으로 채웁니다.

```js
setAllPosts(result.data);
setPosts(result.data);
```

검색을 하면 `posts`만 바꿉니다. `allPosts`는 원본으로 남겨둡니다.

## 검색어 상태

검색 input은 `keyword` 상태와 연결합니다.

```js
const [keyword, setKeyword] = useState("");
```

```jsx
<input
  type="search"
  id="keyword"
  value={keyword}
  onChange={(event) => setKeyword(event.target.value)}
  disabled={isLoading}
/>
```

`type="search"`는 검색어 입력에 의미상 어울리는 input 타입입니다.

## postMatchesKeyword 함수

게시글 하나가 검색어와 맞는지 확인하는 함수를 만듭니다.

```js
function postMatchesKeyword(post, keyword) {
  const title = post.title || "";
  const content = post.content || "";
  const lowerKeyword = keyword.toLowerCase();

  return (
    title.toLowerCase().includes(lowerKeyword) ||
    content.toLowerCase().includes(lowerKeyword)
  );
}
```

제목이나 본문 중 하나라도 검색어를 포함하면 `true`를 반환합니다.

`toLowerCase()`를 사용하면 대소문자를 구분하지 않고 검색할 수 있습니다.

## Client Filter 버튼

검색 버튼은 form 제출이 아니라 버튼 클릭으로 처리합니다.

```jsx
<button type="button" onClick={handleClientFilter} disabled={isLoading}>
  Client Filter
</button>
```

`type="button"`을 쓰지 않으면 form 안의 버튼은 기본적으로 submit 버튼처럼 동작할 수 있습니다.

## handleClientFilter

검색어를 정리하고, 비어 있으면 전체 목록을 보여줍니다.

```js
const searchKeyword = keyword.trim();

if (!searchKeyword) {
  setPosts(allPosts);
  setSearchMessage("Showing all posts because the search keyword is empty.");
  return;
}
```

검색어가 있으면 `filter`를 사용합니다.

```js
const filteredPosts = allPosts.filter((post) =>
  postMatchesKeyword(post, searchKeyword),
);
```

그리고 결과를 화면용 상태에 넣습니다.

```js
setPosts(filteredPosts);
setSearchMessage(`Client filter result: ${filteredPosts.length} posts`);
```

## Show All 버튼

전체 목록으로 돌아가는 버튼도 만듭니다.

```js
function handleShowAll() {
  setError("");
  setKeyword("");
  setPosts(allPosts);
  setSearchMessage("");
}
```

검색어와 검색 메시지를 지우고, `posts`를 `allPosts`로 되돌립니다.

## 실습 순서

1. `allPosts`, `keyword`, `searchMessage` 상태를 추가한다.
2. API 목록을 불러올 때 `allPosts`와 `posts`를 함께 채운다.
3. `postMatchesKeyword` 함수를 만든다.
4. 검색 form을 추가한다.
5. 검색 input을 `keyword` 상태와 연결한다.
6. `handleClientFilter` 함수를 만든다.
7. `Client Filter` 버튼을 연결한다.
8. `handleShowAll` 함수를 만든다.
9. `Show All` 버튼을 연결한다.
10. 검색 결과가 없을 때 `No posts found.`를 표시한다.

## 결과 확인

홈 화면에서 검색어를 입력합니다.

```txt
http://localhost:3000/
```

`Client Filter`를 누르면 현재 브라우저가 가지고 있는 게시글 배열에서 제목 또는 본문이 검색됩니다.

`Show All`을 누르면 전체 목록으로 돌아옵니다.

## 검증 명령

> Windows 11에서는 [환경 준비](../windows-11.md) <span class="print-reference" data-print-reference="true">(Next.js · Windows 11 x64 실습 환경 준비 · 1. Windows Terminal 설치)</span>를 먼저 확인합니다. 명령은 이 교재의 PowerShell 코드 블록에 적힌 `git`, `node`, `npm` 형태를 그대로 사용합니다.

```powershell
npm run lint
npm run build
```

## 정리

클라이언트 필터는 서버 변경 없이 구현할 수 있습니다. 대신 브라우저가 이미 가지고 있는 데이터 안에서만 검색한다는 한계가 있습니다.
