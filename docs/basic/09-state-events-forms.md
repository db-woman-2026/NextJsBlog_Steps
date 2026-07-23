# 09. state, 이벤트, controlled form

## 배울 내용

- 일반 변수와 React state의 차이를 이해합니다.
- `useState`의 현재값과 변경 함수를 구분합니다.
- 이벤트와 controlled input의 데이터 흐름을 읽습니다.

## 1. 화면이 기억해야 하는 값

사용자가 입력하거나 버튼을 누르면 화면이 기억해야 하는 값이 생깁니다.

- input에 입력한 제목
- 서버에서 받은 게시글 배열
- 로딩 중인지 나타내는 boolean
- 화면에 표시할 오류 메시지

React는 이런 값을 **state**로 관리합니다. state가 바뀌면 React가 컴포넌트를 다시 렌더링해 화면을 갱신합니다.

## 2. useState

state를 사용하는 파일은 React에서 `useState`를 가져옵니다.

```jsx
"use client";

import { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0);

  return <p>{count}</p>;
}
```

`useState(0)`은 두 값이 든 배열을 반환합니다.

- `count`: 현재값
- `setCount`: 값을 변경해 다시 렌더링하게 하는 함수
- `0`: 첫 렌더링의 초기값

Next.js에서 state와 이벤트를 사용하는 파일은 클라이언트 컴포넌트여야 하므로 맨 위에 `"use client";`를 둡니다.

## 3. Hook을 호출하는 위치

이름이 `use`로 시작하는 `useState`, `useEffect` 같은 함수를 Hook이라고 합니다. Hook은 컴포넌트 함수의 최상위에서 호출합니다.

```jsx
function Example() {
  const [count, setCount] = useState(0);

  if (count > 0) {
    // 이 조건문 안에서 새 useState를 호출하지 않습니다.
  }

  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

조건문, 반복문, 일반 중첩 함수 안에서 Hook을 호출하면 렌더링마다 호출 순서가 달라질 수 있습니다.

## 4. 이벤트

이벤트는 클릭, 입력, 제출처럼 브라우저에서 일어난 일입니다.

```jsx
function Counter() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return <button onClick={handleClick}>{count}</button>;
}
```

`onClick={handleClick}`은 함수를 전달합니다. `onClick={handleClick()}`처럼 괄호를 붙이면 렌더링 중 즉시 호출되므로 의미가 달라집니다.

## 5. 이전 state를 기준으로 바꾸기

다음 값이 이전 값에 의존한다면 callback 형태를 사용할 수 있습니다.

```jsx
setCount((previousCount) => previousCount + 1);
```

짧은 시간에 여러 변경이 모이더라도 가장 최근 값을 기준으로 계산합니다.

## 6. controlled input

React state가 input의 값을 결정하고, 입력 이벤트가 state를 변경하는 구조를 controlled input이라고 합니다.

```jsx
function TitleInput() {
  const [title, setTitle] = useState("");

  function handleChange(event) {
    setTitle(event.target.value);
  }

  return (
    <div>
      <input value={title} onChange={handleChange} />
      <p>입력한 제목: {title}</p>
    </div>
  );
}
```

흐름은 다음과 같습니다.

```txt
키보드 입력
  -> onChange 실행
  -> event.target.value 읽기
  -> setTitle로 state 변경
  -> 다시 렌더링
  -> input의 value와 문단 갱신
```

짧게 inline callback으로 적을 수도 있습니다.

```jsx
<input
  value={title}
  onChange={(event) => setTitle(event.target.value)}
/>
```

## 7. form 제출

HTML form은 제출하면 기본적으로 페이지를 새로 불러옵니다. React에서 JavaScript로 처리하려면 기본 동작을 막습니다.

```jsx
function PostForm() {
  const [title, setTitle] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    console.log({ title });
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={title}
        onChange={(event) => setTitle(event.target.value)}
      />
      <button type="submit">Save</button>
    </form>
  );
}
```

button 클릭뿐 아니라 input에서 Enter를 눌러도 form의 `onSubmit` 흐름을 사용합니다.

## 8. 여러 입력 상태

초급 단계에서는 각 입력을 별도 state로 관리하면 흐름이 명확합니다.

```jsx
const [title, setTitle] = useState("");
const [content, setContent] = useState("");
const [category, setCategory] = useState("general");
```

제출할 때 객체로 묶습니다.

```js
const postData = { title, content, category };
```

## 9. 로딩과 오류 state

```jsx
const [error, setError] = useState("");
const [isSubmitting, setIsSubmitting] = useState(false);
```

제출 흐름에서 상태를 바꿉니다.

```js
async function handleSubmit(event) {
  event.preventDefault();
  setError("");
  setIsSubmitting(true);

  try {
    await savePost();
  } catch (error) {
    setError(error.message);
  } finally {
    setIsSubmitting(false);
  }
}
```

상태에 따라 button과 오류 UI를 바꿉니다.

```jsx
{error && <p role="alert">{error}</p>}

<button type="submit" disabled={isSubmitting}>
  {isSubmitting ? "Saving..." : "Save Post"}
</button>
```

## 10. 배열과 객체 state를 바꾸는 원칙

기존 state를 직접 수정하지 않고 새 값을 전달합니다.

```js
// 피할 코드
posts.push(newPost);
setPosts(posts);

// 새 배열 전달
setPosts([...posts, newPost]);
```

객체도 spread로 새 객체를 만듭니다.

```js
setPost({ ...post, title: "새 제목" });
```

## 프로젝트 예시

- `step-6`: title/content controlled form과 submit 이벤트를 만듭니다.
- `step-8`: name/email/message state로 Contact form을 만듭니다.
- `step-11`: `isSubmitting`으로 중복 제출을 막고 버튼 문구를 바꿉니다.
- `step-14`: keyword와 필터 결과를 state로 관리합니다.

## 확인하기

1. state 변경 함수가 호출되면 React 화면에는 어떤 일이 일어나나요?
2. input의 현재값은 이벤트 객체의 어디에 있나요?
3. form의 기본 새로고침을 막는 코드는 무엇인가요?

정답: 컴포넌트가 다시 렌더링됩니다. `event.target.value`에 있습니다. `event.preventDefault()`입니다.
