# 08. JSX와 컴포넌트

## 확인할 내용

- HTML과 비슷한 JSX의 기본 규칙을 구분합니다.
- 컴포넌트와 props로 UI를 나누고 조합하는 코드를 읽습니다.
- 조건과 배열을 JSX로 렌더링합니다.

## 1. JSX

JSX는 JavaScript 안에서 화면 구조를 표현하는 문법입니다.

```jsx
const heading = <h1>Blog Posts</h1>;
```

HTML과 비슷하지만 JavaScript 문법에 맞춘 차이가 있습니다.

```jsx
<div className="card">
  <label htmlFor="title">Title</label>
  <input id="title" />
</div>
```

| HTML | JSX |
| --- | --- |
| `class` | `className` |
| `for` | `htmlFor` |
| `<img>` | `<img />` |

JSX 태그는 반드시 닫아야 합니다.

## 2. JavaScript 값을 JSX에 넣기

중괄호 안에서 JavaScript 표현식을 사용합니다.

```jsx
const title = "첫 번째 글";
const heading = <h1>{title}</h1>;
```

계산 결과도 넣을 수 있습니다.

```jsx
const posts = ["A", "B", "C"];
const countLabel = <p>게시글 수: {posts.length}</p>;
```

`if`문 자체는 중괄호 안에 바로 넣을 수 없지만, 삼항 연산자나 `&&` 표현식은 사용할 수 있습니다.

## 3. 하나의 부모 요소 반환하기

컴포넌트는 JSX 요소 하나를 반환해야 합니다. 여러 형제를 반환하려면 부모로 감쌉니다.

```jsx
function Page() {
  return (
    <main>
      <h1>Title</h1>
      <p>Description</p>
    </main>
  );
}
```

화면에 불필요한 태그를 만들고 싶지 않으면 Fragment를 사용합니다.

```jsx
function Labels() {
  return (
    <>
      <span>New</span>
      <span>Tech</span>
    </>
  );
}
```

## 4. 컴포넌트

React 컴포넌트는 이름이 대문자로 시작하는 함수입니다.

```jsx
function Header() {
  return <header>My Blog</header>;
}
```

다른 JSX 안에서는 태그처럼 사용합니다.

```jsx
function Page() {
  return (
    <main>
      <Header />
      <h1>Home</h1>
    </main>
  );
}
```

소문자로 시작하는 `<header>`는 HTML 요소이고, 대문자로 시작하는 `<Header />`는 직접 만든 컴포넌트입니다.

## 5. props

props는 부모 컴포넌트가 자식 컴포넌트에 전달하는 입력값입니다.

```jsx
function PostTitle({ title }) {
  return <h2>{title}</h2>;
}

function Page() {
  return <PostTitle title="Next.js 시작" />;
}
```

여러 값을 전달할 수 있습니다.

```jsx
function PostMeta({ category, count }) {
  return (
    <p>
      {category} / 댓글 {count}개
    </p>
  );
}

<PostMeta category="tech" count={3} />;
```

문자열은 따옴표로, 숫자와 boolean 같은 JavaScript 값은 중괄호로 전달합니다.

props는 읽는 값입니다. 자식 컴포넌트가 전달받은 props를 직접 바꾸지 않습니다.

## 6. children

컴포넌트 태그 사이에 넣은 내용은 `children` prop으로 전달됩니다.

```jsx
function Card({ children }) {
  return <article className="card">{children}</article>;
}

function Page() {
  return (
    <Card>
      <h2>첫 글</h2>
      <p>본문입니다.</p>
    </Card>
  );
}
```

Next.js의 root layout도 `{children}` 자리에 현재 route의 page를 렌더링합니다.

## 7. 조건부 렌더링

삼항 연산자로 둘 중 하나를 보여 줍니다.

```jsx
function Status({ isLoading }) {
  return <p>{isLoading ? "불러오는 중..." : "완료"}</p>;
}
```

조건이 true일 때만 보여 주려면 `&&`를 사용할 수 있습니다.

```jsx
function ErrorMessage({ error }) {
  return <>{error && <p role="alert">{error}</p>}</>;
}
```

빈 문자열은 falsy이므로 아무것도 렌더링하지 않습니다.

## 8. 목록 렌더링과 key

```jsx
const posts = [
  { id: "a1", title: "Hello" },
  { id: "b2", title: "Next.js" },
];

function PostList() {
  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
}
```

`key`는 React가 각 항목을 구분하도록 돕는 안정적인 고유값입니다. 배열 위치인 index보다 데이터의 `id`를 우선 사용합니다.

## 프로젝트 예시

- `Header`, `Footer`, `ContactForm`, `DeletePostButton`을 컴포넌트로 나눕니다.
- root layout의 `{children}` 자리에 각 page가 들어갑니다.
- `{error && <p>...</p>}`로 오류가 있을 때만 메시지를 표시합니다.
- `posts.map(...)`과 `navigationItems.map(...)`으로 목록을 렌더링합니다.
- MongoDB의 `_id`를 목록 key와 상세 링크에 사용합니다.

## 확인하기

1. JSX에서 HTML의 `class`와 `for`는 각각 무엇으로 쓰나요?
2. 사용자 정의 컴포넌트 이름은 어떤 문자로 시작하나요?
3. 목록의 `key`에는 어떤 값을 사용하는 것이 좋은가요?

정답: `className`, `htmlFor`입니다. 대문자로 시작합니다. 각 데이터의 안정적인 고유 id가 좋습니다.
