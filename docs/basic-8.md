# Basic 8. 게시글 상세 화면 만들기

## 이 단계의 목표

`basic-8` 브랜치는 게시글 상세 화면을 추가하는 단계입니다.

이 단계에서 만드는 주소는 다음과 같습니다.

```txt
/detail/[id]
```

홈 화면의 게시글 목록은 이미 다음 링크를 가지고 있습니다.

```jsx
<Link href={`/detail/${post._id}`}>{post.title}</Link>
```

이제 그 링크가 실제 상세 화면으로 이동합니다.

이 단계에서 배우는 내용은 다음과 같습니다.

- 서버 컴포넌트에서 `params`를 받아 동적 라우트 id를 읽는다.
- 서버 컴포넌트에서 데이터 함수를 직접 호출한다.
- 게시글이 없을 때 `notFound()`를 사용한다.
- 본문의 줄바꿈을 유지하기 위해 `pre`와 `white-space: pre-wrap`을 사용한다.
- 상세 화면에서 수정 화면으로 이동하는 링크를 만든다.

## 왜 상세 화면은 서버 컴포넌트인가

홈 화면과 작성/수정 화면은 클라이언트 컴포넌트였습니다. `useState`, `useEffect`, form 이벤트가 필요했기 때문입니다.

상세 화면은 사용자가 입력하는 form이 없습니다. URL의 id로 게시글 하나를 조회하고 HTML을 보여주면 됩니다.

그래서 `"use client"`를 붙이지 않고 서버 컴포넌트로 둡니다.

서버 컴포넌트에서는 MongoDB를 사용하는 데이터 함수를 직접 호출할 수 있습니다.

```js
const post = await getPostById(id);
```

클라이언트 컴포넌트에서는 MongoDB 함수를 직접 import하지 않아야 합니다. 하지만 서버 컴포넌트에서는 가능합니다.

## 파일 위치

상세 페이지 파일은 다음 위치에 만듭니다.

```txt
app/detail/[id]/page.js
```

예를 들어 다음 주소로 접속하면

```txt
/detail/abc123
```

`id` 값은 `"abc123"`입니다.

## 상세 페이지 전체 코드

```jsx
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPostById } from "@/lib/posts";
import styles from "./page.module.css";

export default async function BlogDetail({ params }) {
  const { id } = await params;
  const post = await getPostById(id);

  if (!post) {
    notFound();
  }

  return (
    <main className={styles.container}>
      <article>
        <h1>{post.title}</h1>
        <pre className={styles.content}>{post.content}</pre>
      </article>
      <Link href={`/post/${id}`}>Edit</Link>
    </main>
  );
}
```

## params 읽기

App Router의 동적 라우트에서는 컴포넌트 인자로 `params`를 받을 수 있습니다.

```js
export default async function BlogDetail({ params }) {
  const { id } = await params;
}
```

최신 Next.js에서는 `params`를 비동기 값처럼 다루므로 `await params`를 사용합니다.

이 `id`가 URL의 `[id]` 자리에 들어온 값입니다.

## getPostById 호출

id를 얻은 뒤 데이터 함수를 호출합니다.

```js
const post = await getPostById(id);
```

`getPostById`는 `lib/posts.js`에 있습니다.

이 함수는 다음 일을 합니다.

1. id가 MongoDB ObjectId로 변환 가능한지 확인한다.
2. 가능하면 `new ObjectId(id)`로 변환한다.
3. `posts` 컬렉션에서 `_id`가 일치하는 문서를 찾는다.
4. 찾으면 게시글 객체를 반환한다.
5. 없으면 `null`을 반환한다.

## notFound 사용

게시글이 없으면 상세 화면을 정상적으로 그릴 수 없습니다.

```js
if (!post) {
  notFound();
}
```

`notFound()`는 Next.js의 404 페이지 흐름으로 이동시킵니다.

API Route에서는 게시글이 없을 때 JSON과 상태 코드 404를 반환했습니다.

```js
return NextResponse.json({ error: "Post not found" }, { status: 404 });
```

페이지 컴포넌트에서는 JSON이 아니라 화면 흐름이 필요하므로 `notFound()`를 사용합니다.

## 본문 줄바꿈 유지

게시글 본문에는 사용자가 textarea에서 입력한 줄바꿈이 들어갈 수 있습니다.

일반 `<p>` 태그는 줄바꿈을 그대로 보여주지 않습니다.

그래서 상세 화면에서는 `<pre>`를 사용합니다.

```jsx
<pre className={styles.content}>{post.content}</pre>
```

하지만 `<pre>`는 긴 줄이 화면 밖으로 넘칠 수 있습니다. 그래서 CSS에서 다음 규칙을 추가합니다.

```css
.content {
  white-space: pre-wrap;
}
```

`pre-wrap`은 줄바꿈은 유지하되, 긴 줄은 화면 너비에 맞게 감싸도록 합니다.

## 상세 화면에서 수정 화면으로 이동

상세 화면 아래에는 수정 링크가 있습니다.

```jsx
<Link href={`/post/${id}`}>Edit</Link>
```

`basic-7`에서 만든 수정 화면 주소가 `/post/[id]`였기 때문에, 같은 id를 사용해 수정 화면으로 이동합니다.

흐름은 다음과 같습니다.

```txt
홈 목록
-> /detail/[id]
-> 상세 화면
-> Edit 링크
-> /post/[id]
-> 수정 화면
```

## CSS Module

상세 페이지 전용 스타일은 `app/detail/[id]/page.module.css`에 둡니다.

```css
.container {
  display: grid;
  gap: 1rem;
}

.content {
  white-space: pre-wrap;
}
```

상세 화면의 스타일은 작성/수정 form 스타일과 다르므로 별도 CSS Module을 사용합니다.

## 직접 실습 순서

1. `app/detail/[id]` 폴더를 만든다.
2. `app/detail/[id]/page.js` 파일을 만든다.
3. `Link`, `notFound`, `getPostById`, CSS Module을 import한다.
4. `BlogDetail` 컴포넌트를 async 함수로 만든다.
5. `const { id } = await params;`로 URL id를 읽는다.
6. `getPostById(id)`로 게시글을 조회한다.
7. 게시글이 없으면 `notFound()`를 호출한다.
8. 게시글 제목과 본문을 렌더링한다.
9. 상세에서 수정 화면으로 가는 `Edit` 링크를 만든다.
10. `page.module.css`에서 본문 줄바꿈 스타일을 작성한다.

## 실행 확인

MongoDB와 개발 서버를 실행합니다.

```bash
npm run dev
```

브라우저에서 홈 화면을 엽니다.

```txt
http://localhost:3000/
```

게시글 제목을 클릭했을 때 `/detail/[id]` 상세 화면으로 이동하면 성공입니다.

상세 화면에서 `Edit` 링크를 누르면 `/post/[id]` 수정 화면으로 이동해야 합니다.

## 검증 명령

```bash
npm run lint
npm run build
```

빌드 출력에 다음 route가 보이면 상세 동적 라우트가 추가된 것입니다.

```txt
/detail/[id]
```

## 자주 발생하는 실수

### 상세 페이지에 "use client"를 붙이는 경우

이 상세 페이지는 서버 컴포넌트입니다. MongoDB 데이터 함수를 직접 호출하려면 `"use client"`를 붙이지 않습니다.

### params를 await하지 않는 경우

이 프로젝트의 Next.js 버전에서는 다음처럼 작성합니다.

```js
const { id } = await params;
```

### getPostById import 경로를 틀리는 경우

이 프로젝트는 `jsconfig.json`에서 `@/*` alias를 사용합니다.

```js
import { getPostById } from "@/lib/posts";
```

### 본문을 p 태그로 출력해 줄바꿈이 사라지는 경우

textarea에서 입력한 줄바꿈을 보여주려면 `pre`와 `white-space: pre-wrap` 조합을 사용합니다.

### Edit 링크 주소를 잘못 만드는 경우

수정 화면은 `/post/[id]`입니다. 상세 화면은 `/detail/[id]`입니다.

```jsx
<Link href={`/post/${id}`}>Edit</Link>
```

## 이 단계에서 아직 하지 않는 것

블로그의 핵심 CRUD 흐름은 대부분 연결됐습니다. 마지막 단계에서는 Contact 페이지를 mockup form으로 바꾸고, README를 단계별 실습 저장소에 맞게 정리합니다.
