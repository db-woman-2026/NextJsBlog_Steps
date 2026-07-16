# 10. effect와 데이터 로딩

## 배울 내용

- 렌더링과 effect의 역할을 구분합니다.
- `useEffect`의 의존성 배열을 읽습니다.
- 데이터 로딩의 loading, success, error 상태를 나눕니다.

## 1. 렌더링 밖의 작업

컴포넌트 함수의 주된 역할은 현재 props와 state로 JSX를 계산하는 것입니다. 다음처럼 화면 계산 밖의 시스템과 동기화하는 작업을 **effect**라고 합니다.

- API에서 데이터 가져오기
- 브라우저 document title 바꾸기
- timer 시작하고 정리하기
- 외부 이벤트 구독하기

React에서는 `useEffect`로 이런 작업을 표현할 수 있습니다.

## 2. 처음 화면이 나타난 뒤 한 번 실행

```jsx
"use client";

import { useEffect, useState } from "react";

export default function Example() {
  const [message, setMessage] = useState("준비");

  useEffect(() => {
    setMessage("화면이 나타났습니다.");
  }, []);

  return <p>{message}</p>;
}
```

빈 의존성 배열 `[]`은 이 컴포넌트가 처음 화면에 연결된 뒤 effect를 실행한다는 뜻입니다.

개발 환경의 Strict Mode에서는 잘못 정리된 effect를 찾기 위해 effect가 추가로 실행되는 것처럼 보일 수 있습니다. 따라서 effect는 다시 실행되어도 안전하게 작성하는 습관이 필요합니다.

## 3. 값이 바뀔 때 실행

```jsx
useEffect(() => {
  document.title = `검색어: ${keyword}`;
}, [keyword]);
```

첫 실행 뒤 `keyword`가 바뀔 때마다 effect가 다시 실행됩니다.

```jsx
useEffect(() => {
  console.log("category 또는 page가 바뀜");
}, [category, page]);
```

effect 안에서 읽는 외부 props/state는 일반적으로 의존성 배열에도 포함합니다.

## 4. 정리 함수

effect가 만든 timer나 구독은 컴포넌트가 사라지거나 effect가 다시 실행되기 전에 정리해야 합니다.

```jsx
useEffect(() => {
  const timerId = setInterval(() => {
    console.log("1초 경과");
  }, 1000);

  return () => {
    clearInterval(timerId);
  };
}, []);
```

effect callback 자체를 `async`로 만들기보다 안쪽에 async 함수를 선언하고 호출합니다.

## 5. API 데이터 불러오기

```jsx
"use client";

import { useEffect, useState } from "react";

export default function PostList() {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadPosts() {
      try {
        const response = await fetch("/api/post");
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "불러오기에 실패했습니다.");
        }

        setPosts(result.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    }

    loadPosts();
  }, []);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p role="alert">{error}</p>;
  }

  return (
    <ul>
      {posts.map((post) => (
        <li key={post._id}>{post.title}</li>
      ))}
    </ul>
  );
}
```

데이터 요청 화면은 최소 세 상태를 가집니다.

| 상태 | 대표 값 | 화면 |
| --- | --- | --- |
| loading | `isLoading === true` | Loading 메시지 |
| success | `posts`에 데이터 있음 | 게시글 목록 |
| error | `error`에 메시지 있음 | 오류 안내 |

데이터가 비어 있는 성공 상태도 따로 표시할 수 있습니다.

```jsx
if (posts.length === 0) {
  return <p>게시글이 없습니다.</p>;
}
```

## 6. effect가 필요하지 않은 계산

기존 state로 바로 계산할 수 있는 값은 별도 state와 effect 없이 렌더링 중 계산합니다.

```jsx
const filteredPosts = posts.filter((post) =>
  post.title.toLowerCase().includes(keyword.toLowerCase()),
);
```

다음처럼 계산 결과를 다시 state에 복사하는 effect는 상태가 어긋날 가능성을 늘립니다.

```jsx
// 단순 계산이라면 보통 필요하지 않음
useEffect(() => {
  setCount(posts.length);
}, [posts]);
```

대신 바로 계산합니다.

```js
const count = posts.length;
```

## 프로젝트 예시

- `step-5`: 홈 화면이 처음 나타난 뒤 게시글 목록을 요청합니다.
- `step-7`: 수정 화면의 URL id가 준비되면 기존 게시글을 불러옵니다.
- `step-14`: 이미 받은 배열을 state로 보관하고 버튼 이벤트에서 필터링합니다.
- 목록 화면은 loading, error, empty, success 상태를 각각 렌더링합니다.

## 확인하기

1. 빈 의존성 배열을 가진 effect는 언제 실행되나요?
2. effect에서 만든 interval은 어디에서 정리하나요?
3. `posts.length`처럼 기존 state에서 바로 구할 수 있는 값도 반드시 별도 state로 저장해야 하나요?

정답: 컴포넌트가 처음 화면에 연결된 뒤 실행됩니다. effect가 반환하는 정리 함수에서 정리합니다. 바로 계산할 수 있다면 별도 state가 필요하지 않습니다.
