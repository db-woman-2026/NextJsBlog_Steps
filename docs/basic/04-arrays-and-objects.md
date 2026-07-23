# 04. 배열과 객체

## 배울 내용

- 배열과 객체에서 값을 읽고 변경하지 않은 새 값을 만듭니다.
- `map`, `filter`, `find`의 차이를 구분합니다.
- 구조 분해, spread, optional chaining을 읽습니다.

## 1. 배열

배열은 순서가 있는 값의 목록입니다.

```js
const categories = ["general", "notice", "tech"];

console.log(categories[0]); // general
console.log(categories.length); // 3
```

배열의 첫 위치는 1이 아니라 0입니다.

`push`는 기존 배열에 값을 추가합니다.

```js
const tags = ["nextjs"];
tags.push("react");

console.log(tags); // ["nextjs", "react"]
```

React state에서는 기존 배열을 직접 바꾸기보다 새 배열을 만드는 방식을 주로 사용합니다.

```js
const oldTags = ["nextjs"];
const newTags = [...oldTags, "react"];
```

## 2. Array.from으로 배열 만들기

길이만 정하고 각 위치의 값으로 새 배열을 만들 수 있습니다.

```js
const postTitles = Array.from(
  { length: 3 },
  (_, index) => `Blog Post ${index + 1}`,
);

console.log(postTitles);
// ["Blog Post 1", "Blog Post 2", "Blog Post 3"]
```

- `{ length: 3 }`: 세 칸을 만듭니다.
- 첫 callback parameter `_`: 사용하지 않는 현재 값입니다.
- `index`: 0부터 시작하는 현재 위치입니다.
- `index + 1`: 화면 번호를 1부터 시작하게 만듭니다.

## 3. 객체

객체는 이름이 있는 속성의 묶음입니다.

```js
const post = {
  title: "첫 글",
  content: "반갑습니다.",
  published: true,
};

console.log(post.title);       // 첫 글
console.log(post["content"]); // 반갑습니다.
```

속성 값은 점 표기법으로 주로 읽습니다. 변수에 든 이름으로 속성을 고를 때는 대괄호를 사용합니다.

```js
const fieldName = "title";
console.log(post[fieldName]); // 첫 글
```

## 4. 객체가 들어 있는 배열

게시글 목록은 객체가 여러 개 들어 있는 배열로 표현할 수 있습니다.

```js
const posts = [
  { id: 1, title: "Hello", category: "general" },
  { id: 2, title: "Notice", category: "notice" },
  { id: 3, title: "React", category: "tech" },
];

console.log(posts[1].title); // Notice
```

## 5. map: 각 항목을 새 값으로 바꾸기

`map`은 배열의 모든 항목을 callback으로 처리해 같은 길이의 새 배열을 만듭니다.

```js
const titles = posts.map((post) => post.title);

console.log(titles); // ["Hello", "Notice", "React"]
```

React에서는 항목마다 JSX를 만드는 데 사용합니다.

```jsx
const listItems = posts.map((post) => (
  <li key={post.id}>{post.title}</li>
));
```

## 6. filter: 조건을 통과한 항목만 남기기

```js
const techPosts = posts.filter((post) => post.category === "tech");

console.log(techPosts);
// [{ id: 3, title: "React", category: "tech" }]
```

callback이 true를 반환한 항목만 새 배열에 남습니다.

## 7. find: 첫 항목 하나 찾기

```js
const selectedPost = posts.find((post) => post.id === 2);

console.log(selectedPost.title); // Notice
```

찾지 못하면 `undefined`를 반환합니다.

```js
const missingPost = posts.find((post) => post.id === 99);
console.log(missingPost); // undefined
```

## 8. 구조 분해 할당

객체에서 필요한 속성을 같은 이름의 변수로 꺼냅니다.

```js
const post = { title: "Hello", content: "Welcome" };
const { title, content } = post;

console.log(title);   // Hello
console.log(content); // Welcome
```

함수 parameter 자리에서도 사용합니다.

```js
function printPost({ title, category = "general" }) {
  console.log(`${title} / ${category}`);
}

printPost({ title: "첫 글" }); // 첫 글 / general
```

배열 구조 분해는 위치 순서대로 꺼냅니다.

```js
const [first, second] = ["general", "notice"];

console.log(first);  // general
console.log(second); // notice
```

React의 `useState`가 `[현재값, 변경함수]` 배열을 돌려주기 때문에 이 문법을 자주 봅니다.

## 9. spread로 복사하며 변경하기

```js
const original = { title: "Old", content: "Text" };
const updated = { ...original, title: "New" };

console.log(updated);
// { title: "New", content: "Text" }
```

앞에서 복사한 `title`을 뒤의 `title: "New"`가 덮어씁니다.

배열도 펼칠 수 있습니다.

```js
const firstPage = [1, 2];
const secondPage = [3, 4];
const allPages = [...firstPage, ...secondPage];

console.log(allPages); // [1, 2, 3, 4]
```

## 10. optional chaining

중간 값이 `null` 또는 `undefined`일 수 있을 때 `?.`로 안전하게 읽습니다.

```js
const response = { data: null };

console.log(response.data?.title); // undefined
```

`response.data.title`이었다면 `data`가 `null`이므로 오류가 발생합니다.

## 프로젝트 예시

- navigation과 category 선택지는 객체 배열로 정의합니다.
- `Array.from({ length: 10 }, ...)`으로 예제 게시글 배열을 만듭니다.
- `posts.map(...)`으로 게시글 목록 UI를 만듭니다.
- `posts.filter(...)`로 브라우저에 있는 게시글을 검색합니다.
- `const { id } = await params`로 동적 경로 값을 꺼냅니다.
- `{ ...oldValue, title: "New" }`와 같은 불변 업데이트 방식을 React에서 사용합니다.

## 확인하기

1. `map`과 `filter`는 각각 어떤 새 배열을 만드나요?
2. `find`가 값을 찾지 못하면 무엇을 반환하나요?
3. 객체를 복사하면서 속성 하나만 바꿀 때 사용하는 `...` 문법을 무엇이라고 하나요?

정답: `map`은 각 항목을 바꾼 같은 길이의 배열, `filter`는 조건을 통과한 항목의 배열을 만듭니다. `find`는 `undefined`를 반환합니다. spread 문법입니다.
