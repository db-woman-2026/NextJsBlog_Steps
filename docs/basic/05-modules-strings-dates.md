# 05. 모듈, 문자열, 날짜

## 확인할 내용

- 파일 사이에서 값을 내보내고 가져오는 문법을 읽습니다.
- 프로젝트에 자주 나오는 문자열 method를 사용합니다.
- `Date` 값과 화면용 날짜 문자열을 구분합니다.

## 1. 파일을 모듈로 나누는 이유

모든 코드를 한 파일에 두면 찾기 어렵고 재사용하기도 어렵습니다. JavaScript 파일은 필요한 값을 밖으로 내보내고 다른 파일에서 가져올 수 있는 **모듈(module)** 입니다.

```txt
lib/posts.js       게시글 데이터 처리
app/page.js        게시글 목록 화면
```

화면 파일은 데이터 처리 함수의 내부 구현을 몰라도 함수 이름과 사용법을 알면 호출할 수 있습니다.

## 2. named export와 import

이름을 붙여 여러 값을 내보낼 수 있습니다.

```js
// math.js
export function add(a, b) {
  return a + b;
}

export const zero = 0;
```

가져올 때 같은 이름을 중괄호 안에 적습니다.

```js
// page.js
import { add, zero } from "./math";

console.log(add(zero, 3)); // 3
```

## 3. default export와 import

파일의 대표 값 하나는 `default`로 내보낼 수 있습니다.

```jsx
// Header.js
export default function Header() {
  return <header>My Blog</header>;
}
```

가져올 때 중괄호를 사용하지 않으며, 가져오는 쪽에서 이름을 정할 수 있습니다.

```js
import Header from "./Header";
```

| 내보내기 | 가져오기 |
| --- | --- |
| `export function add() {}` | `import { add } from "./math"` |
| `export default Header` | `import Header from "./Header"` |

## 4. 상대 경로와 alias

현재 파일을 기준으로 한 경로는 `.`으로 시작합니다.

```js
import Header from "./components/Header";
import helper from "../lib/helper";
```

- `./`: 현재 폴더
- `../`: 한 단계 위 폴더

이 프로젝트의 `@/` alias는 프로젝트 최상위 폴더를 가리킵니다.

```js
import { getPostById } from "@/lib/posts";
```

폴더가 깊어져도 `../../../lib/posts`처럼 긴 상대 경로를 쓰지 않아도 됩니다.

## 5. 문자열 다듬기

`trim()`은 문자열 앞뒤 공백을 제거한 새 문자열을 반환합니다.

```js
const input = "  Next.js Blog  ";
const cleanInput = input.trim();

console.log(cleanInput); // "Next.js Blog"
```

원래 문자열은 바뀌지 않습니다.

```js
console.log(input); // "  Next.js Blog  "
```

## 6. 대소문자와 포함 여부

대소문자 차이를 무시하고 검색하려면 양쪽을 같은 형태로 바꿉니다.

```js
const title = "Learning Next.js";
const keyword = "next";

const matches = title.toLowerCase().includes(keyword.toLowerCase());
console.log(matches); // true
```

- `toLowerCase()`: 소문자로 바꾼 새 문자열
- `includes(value)`: 특정 문자열을 포함하면 true

문자열 시작이나 끝을 확인할 수도 있습니다.

```js
console.log("app/page.js".startsWith("app/")); // true
console.log("page.js".endsWith(".js"));       // true
```

## 7. 문자열을 숫자로, 숫자를 문자열로

```js
const pageText = "2";
const pageNumber = Number(pageText);
const queryValue = String(pageNumber);

console.log(pageNumber); // 2
console.log(queryValue); // "2"
```

`Number("hello")`처럼 숫자로 바꿀 수 없는 값은 `NaN`이 됩니다.

```js
console.log(Number.isNaN(Number("hello"))); // true
```

## 8. Date 객체

현재 시각을 나타내는 값을 만듭니다.

```js
const createdAt = new Date();
console.log(createdAt);
```

서버와 데이터베이스에서는 날짜 값을 유지하고, 화면에 보여줄 때 사람이 읽기 쉬운 문자열로 바꿉니다.

```js
const date = new Date("2026-07-05T12:30:00.000Z");
const label = date.toLocaleString("ko-KR");

console.log(label);
```

날짜 값이 없을 가능성을 먼저 확인합니다.

```js
function formatDate(dateValue) {
  if (!dateValue) {
    return "";
  }

  return new Date(dateValue).toLocaleString("ko-KR");
}
```

## 프로젝트 예시

- 컴포넌트는 보통 `export default function ...`으로 내보냅니다.
- 데이터 함수는 `export async function ...`으로 여러 개 내보냅니다.
- API route는 `GET`, `POST`, `PUT`, `DELETE`를 named export합니다.
- `trim()`으로 제목과 본문의 앞뒤 공백을 제거합니다.
- `toLowerCase().includes(...)`로 클라이언트 검색을 구현합니다.
- `new Date()`로 작성/수정 시각을 저장하고 `toLocaleString()`으로 표시합니다.

## 확인하기

1. named export를 import할 때 이름 주위에 무엇을 사용하나요?
2. `trim()`은 문자열 중간의 공백도 모두 지우나요?
3. 저장용 날짜 값과 화면용 날짜 문자열을 구분하는 이유는 무엇인가요?

정답: 중괄호를 사용합니다. `trim()`은 앞뒤 공백만 지웁니다. 날짜 값은 계산과 정렬에 적합한 형태로 유지하고 표시할 때만 읽기 쉬운 문자열로 바꾸기 위해서입니다.
