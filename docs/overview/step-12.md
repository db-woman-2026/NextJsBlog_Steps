# Step 12. 작성일과 수정일 표시

## 배울 내용

`step-12`는 게시글의 작성일과 수정일을 화면에 표시하는 단계입니다.

이전 단계까지는 게시글 제목과 본문만 보였습니다. 하지만 실제 게시판에서는 글이 언제 작성되었고, 나중에 수정되었는지도 중요한 정보입니다.

다음을 구현합니다.

- 날짜 값을 화면에 표시하기 위한 `formatDate` 함수를 만든다.
- 홈 목록에서 작성일을 표시한다.
- 홈 목록에서 수정일이 있을 때만 수정일을 표시한다.
- 상세 화면에서도 작성일/수정일을 표시한다.

## 날짜 데이터는 어디에서 생기는가

`lib/posts.js`의 `createPost` 함수는 새 글을 저장할 때 `createdAt`을 넣습니다.

```js
createdAt: new Date()
```

`updatePost` 함수는 글을 수정할 때 `updatedAt`을 넣습니다.

```js
updatedAt: new Date()
```

즉, 이 단계에서는 DB 구조를 새로 만들지 않고 이미 저장되는 값을 화면에 보여줍니다.

## formatDate 함수

MongoDB에서 온 날짜 값은 그대로 출력하면 읽기 어려울 수 있습니다.

그래서 화면 파일에 다음 함수를 추가합니다.

```js
function formatDate(dateValue) {
  if (!dateValue) {
    return "";
  }

  return new Date(dateValue).toLocaleString("ko-KR");
}
```

`dateValue`가 없으면 빈 문자열을 반환합니다. 값이 있으면 JavaScript `Date` 객체로 바꾼 뒤 한국어 로케일 문자열로 표시합니다.

## 홈 목록에서 날짜 표시

홈 목록의 게시글 article 안에 날짜를 추가합니다.

```jsx
<Link href={`/detail/${post._id}`}>{post.title}</Link>
<p>Created: {formatDate(post.createdAt)}</p>
{post.updatedAt && <p>Updated: {formatDate(post.updatedAt)}</p>}
```

`createdAt`은 새 글을 만들 때 항상 들어갑니다.

`updatedAt`은 수정한 적이 있는 글에만 있습니다. 그래서 조건부 렌더링을 사용합니다.

```jsx
{post.updatedAt && <p>Updated: {formatDate(post.updatedAt)}</p>}
```

## 상세 화면에서 날짜 표시

상세 화면도 같은 정보를 보여줍니다.

```jsx
<h1>{post.title}</h1>
<p>Created: {formatDate(post.createdAt)}</p>
{post.updatedAt && <p>Updated: {formatDate(post.updatedAt)}</p>}
<pre className={styles.content}>{post.content}</pre>
```

목록에서는 요약 정보를 보고, 상세에서는 본문과 함께 날짜를 확인할 수 있습니다.

## 실습 순서

1. `app/page.js`에 `formatDate` 함수를 만든다.
2. 홈 목록의 article에 `Created` 문구를 추가한다.
3. `updatedAt`이 있을 때만 `Updated` 문구를 보여준다.
4. `app/detail/[id]/page.js`에도 같은 `formatDate` 함수를 만든다.
5. 상세 화면 제목 아래에 작성일/수정일을 표시한다.

## 확인 방법

홈 화면에서 게시글 목록을 확인합니다.

```txt
http://localhost:3000/
```

각 게시글 제목 아래에 작성일이 보이면 성공입니다.

게시글을 수정한 뒤 홈이나 상세 화면으로 돌아오면 수정일도 표시되어야 합니다.

## 검증 명령

```bash
npm run lint
npm run build
```

## 정리

DB에 저장된 값은 화면에 그대로 보여주기보다 사용자가 읽기 좋은 형태로 가공해서 보여주는 경우가 많습니다. 날짜 표시 함수는 그런 가공의 가장 기본적인 예입니다.
