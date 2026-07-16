# 03. 조건, 반복, 함수

## 배울 내용

- 조건에 따라 다른 코드를 실행합니다.
- 함수의 입력, 처리, 반환값을 구분합니다.
- 변수의 scope와 callback의 기본 모양을 알아봅니다.

## 1. if 조건문

조건이 true일 때 중괄호 안을 실행합니다.

```js
const title = "Hello";

if (title) {
  console.log("제목이 있습니다.");
}
```

`else`를 사용하면 조건이 false일 때 실행할 코드를 정할 수 있습니다.

```js
const postCount = 0;

if (postCount > 0) {
  console.log("게시글을 표시합니다.");
} else {
  console.log("게시글이 없습니다.");
}
```

여러 조건은 `else if`로 나눕니다.

```js
const status = 404;

if (status === 200) {
  console.log("성공");
} else if (status === 404) {
  console.log("찾을 수 없음");
} else {
  console.log("다른 상태");
}
```

## 2. switch로 여러 값 나누기

하나의 값에 따라 여러 경우를 나눌 때 `switch`를 사용할 수 있습니다.

```js
function getSortLabel(sort) {
  switch (sort) {
    case "created-asc":
      return "오래된순";
    case "title-asc":
      return "제목 오름차순";
    case "created-desc":
    default:
      return "최신순";
  }
}

console.log(getSortLabel("title-asc")); // 제목 오름차순
```

`case`가 일치하면 해당 코드를 실행합니다. 어떤 case도 일치하지 않을 때 `default`를 사용합니다. 위 예제는 각 case에서 바로 `return`하므로 `break`가 필요하지 않습니다.

## 3. 빠르게 함수 끝내기

`return`을 만나면 함수 실행이 끝납니다. 잘못된 조건을 먼저 검사하면 중첩을 줄일 수 있습니다.

```js
function printTitle(title) {
  if (!title) {
    console.log("제목이 없습니다.");
    return;
  }

  console.log(title);
}
```

## 4. 삼항 연산자

간단한 조건에 따라 값 하나를 고를 때 사용합니다.

```js
const isLoading = true;
const buttonText = isLoading ? "저장 중..." : "저장";

console.log(buttonText); // 저장 중...
```

구조는 `조건 ? true일 때 값 : false일 때 값`입니다. 조건이 복잡하면 `if`가 더 읽기 쉽습니다.

## 5. 함수 선언과 반환값

함수는 반복할 처리에 이름을 붙인 코드입니다.

```js
function makePostTitle(number) {
  return `Blog Post ${number}`;
}

const title = makePostTitle(2);
console.log(title); // Blog Post 2
```

- `number`: 함수가 받는 parameter
- `2`: 함수를 호출할 때 전달한 argument
- `return`: 함수 밖으로 돌려주는 결과

입력이 여러 개일 수도 있습니다.

```js
function add(a, b) {
  return a + b;
}

console.log(add(2, 3)); // 5
```

## 6. 기본 parameter와 객체 parameter

값이 생략될 때 사용할 기본값을 정할 수 있습니다.

```js
function greet(name = "Guest") {
  return `Hello, ${name}`;
}

console.log(greet()); // Hello, Guest
```

선택값이 많다면 객체 하나로 받으면 호출 코드를 읽기 쉽습니다.

```js
function listPosts({ page = 1, limit = 5 } = {}) {
  return `${page}페이지에서 ${limit}개 표시`;
}

console.log(listPosts({ page: 2, limit: 10 }));
console.log(listPosts());
```

마지막 `= {}`는 함수 자체를 argument 없이 호출했을 때 사용할 빈 객체입니다.

## 7. 화살표 함수와 callback

짧은 함수를 화살표 문법으로 표현할 수 있습니다.

```js
const double = (number) => number * 2;

console.log(double(4)); // 8
```

다른 함수에 전달하는 함수를 **callback**이라고 합니다.

```js
const numbers = [1, 2, 3];
const doubled = numbers.map((number) => number * 2);

console.log(doubled); // [2, 4, 6]
```

여기서 `(number) => number * 2`가 `map`에 전달한 callback입니다.

## 8. 반복문

같은 처리를 여러 번 실행할 수 있습니다.

```js
for (let number = 1; number <= 3; number += 1) {
  console.log(`Post ${number}`);
}
```

배열은 `for...of`로 값을 하나씩 읽을 수도 있습니다.

```js
const categories = ["general", "notice", "tech"];

for (const category of categories) {
  console.log(category);
}
```

React 화면에서는 반복문보다 배열의 `map`을 더 자주 사용합니다.

## 9. scope

변수를 사용할 수 있는 범위를 scope라고 합니다.

```js
const outside = "함수 밖";

function showScope() {
  const inside = "함수 안";
  console.log(outside); // 사용 가능
  console.log(inside);  // 사용 가능
}

// console.log(inside); // 함수 밖에서는 사용 불가
```

중괄호 안에서 만든 `const`, `let`도 보통 그 중괄호 밖에서는 사용할 수 없습니다.

## 프로젝트 예시

- `if (!response.ok)`: HTTP 요청 실패를 먼저 검사합니다.
- `isSubmitting ? "Updating..." : "Update Post"`: 상태에 따라 버튼 문구를 고릅니다.
- `listPosts({ page, limit, sort })`: 여러 선택값을 객체 하나로 전달합니다.
- `switch (sort)`: 정렬 이름에 맞는 MongoDB 정렬 객체를 선택합니다.
- `array.map((item) => ...)`: 배열 항목마다 화면이나 새 값을 만듭니다.

## 확인하기

1. 함수에서 `return`을 만나면 이후 줄은 실행되나요?
2. `isDone ? "완료" : "진행 중"`에서 `isDone`이 false면 어떤 값이 선택되나요?
3. 다른 함수에 argument로 전달하는 함수를 무엇이라고 하나요?

정답: 실행되지 않습니다. `"진행 중"`이 선택됩니다. callback이라고 합니다.
