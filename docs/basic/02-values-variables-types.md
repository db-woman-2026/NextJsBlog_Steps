# 02. 값, 변수, 자료형, 연산자

## 배울 내용

- 값을 변수에 저장하고 다시 사용하는 코드를 읽습니다.
- 문자열, 숫자, boolean, `null`, `undefined`를 구분합니다.
- 비교, 논리, 기본값 연산자의 결과를 예상합니다.

## 1. 값과 변수

값은 코드가 다루는 데이터입니다. 변수는 값에 붙인 이름입니다.

```js
const title = "첫 번째 글";
let viewCount = 0;
```

- `const`: 변수에 다른 값을 다시 대입하지 않을 때 사용합니다.
- `let`: 실행 중 다른 값을 대입해야 할 때 사용합니다.

```js
let page = 1;
page = 2;

const pageSize = 5;
// pageSize = 10; // const에는 다시 대입할 수 없습니다.
```

기본은 `const`를 사용하고, 값 자체를 다시 대입해야 할 때만 `let`을 사용하면 읽기 쉽습니다.

## 2. 기본 자료형

```js
const title = "Next.js 기초"; // string
const page = 1;               // number
const isPublished = true;     // boolean
const selectedPost = null;    // 의도적으로 값이 없음
let errorMessage;             // 아직 값이 정해지지 않아 undefined
```

`typeof`로 값의 기본 자료형을 확인할 수 있습니다.

```js
console.log(typeof "hello"); // "string"
console.log(typeof 10);      // "number"
console.log(typeof false);   // "boolean"
```

## 3. 문자열 만들기

따옴표로 문자열을 만듭니다.

```js
const firstName = "Next";
const lastName = "Blog";
const fullName = firstName + " " + lastName;
```

backtick을 사용하는 template literal에서는 `${}` 안에 값을 넣습니다.

```js
const postCount = 3;
const message = `게시글이 ${postCount}개 있습니다.`;

console.log(message); // 게시글이 3개 있습니다.
```

## 4. 숫자 계산과 변환

```js
const page = 2;
const pageSize = 5;
const skip = (page - 1) * pageSize;

console.log(skip); // 5
```

URL에서 읽은 값은 문자열인 경우가 많습니다. 숫자로 계산하기 전에 변환합니다.

```js
const pageFromUrl = "3";
const pageNumber = Number(pageFromUrl);

console.log(pageNumber + 1); // 4
```

## 5. 비교 연산자

```js
console.log(3 === 3);   // true
console.log(3 === "3"); // false
console.log(5 > 2);     // true
console.log(5 <= 4);    // false
console.log("a" !== "b"); // true
```

같은지 비교할 때는 값과 자료형을 함께 비교하는 `===`를 기본으로 사용합니다.

## 6. 나머지와 Math

`%`는 나눈 뒤 나머지를 구합니다. 몇 개의 값을 순서대로 반복할 때 유용합니다.

```js
const categories = ["general", "notice", "tech"];

console.log(categories[0 % 3]); // general
console.log(categories[1 % 3]); // notice
console.log(categories[3 % 3]); // general
```

`Math`에는 숫자를 다루는 기본 함수가 있습니다.

```js
console.log(Math.max(2, 5));   // 5
console.log(Math.min(2, 5));   // 2
console.log(Math.ceil(2.1));   // 3: 올림
console.log(Math.floor(2.9));  // 2: 내림
```

전체 항목 수를 페이지 크기로 나누고 올림하면 전체 페이지 수가 됩니다.

```js
const totalPosts = 11;
const pageSize = 5;
const totalPages = Math.ceil(totalPosts / pageSize);

console.log(totalPages); // 3
```

## 7. 논리 연산자

```js
const hasTitle = true;
const hasContent = false;

console.log(hasTitle && hasContent); // false: 둘 다 true여야 함
console.log(hasTitle || hasContent); // true: 하나라도 true면 됨
console.log(!hasTitle);              // false: true/false를 반대로
```

문자열 `""`, 숫자 `0`, `null`, `undefined`, `false`는 조건에서 false처럼 처리됩니다. 이를 **falsy 값**이라고 합니다.

```js
const title = "";
console.log(!title); // true
```

## 8. 기본값 정하기

`||`는 왼쪽 값이 falsy이면 오른쪽 값을 사용합니다.

```js
const image = "";
const imageUrl = image || "https://picsum.photos/100";

console.log(imageUrl); // 기본 이미지 주소
```

`??`는 왼쪽 값이 `null` 또는 `undefined`일 때만 오른쪽 값을 사용합니다.

```js
const count = 0;

console.log(count || 10); // 10
console.log(count ?? 10); // 0
```

## 프로젝트 예시

- `const PAGE_SIZE = 5`: 한 페이지 크기를 바뀌지 않는 값으로 둡니다.
- `let` 대신 React state를 사용해 화면 값을 바꾸는 경우가 많습니다.
- `post.category || "general"`: 카테고리가 없을 때 기본값을 표시합니다.
- `Number(page) || 1`: URL의 문자열을 숫자로 바꾸고 기본값을 둡니다.
- `Math.ceil(totalPosts / pageSize)`: 전체 페이지 수를 올림해 계산합니다.

## 확인하기

1. 다시 대입하지 않을 변수에는 `const`와 `let` 중 무엇을 사용하나요?
2. `3 === "3"`의 결과는 무엇인가요?
3. `0 || 5`와 `0 ?? 5`의 결과는 각각 무엇인가요?

정답: `const`, `false`, 각각 `5`와 `0`입니다.
