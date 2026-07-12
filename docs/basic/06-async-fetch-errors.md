# 06. 비동기와 오류 처리

## 이번 장의 목표

- 동기 처리와 비동기 처리의 차이를 이해합니다.
- Promise, `async`, `await`가 함께 쓰이는 모양을 읽습니다.
- `fetch`, `try/catch/finally`, `throw`의 흐름을 설명합니다.

## 1. 기다려야 하는 작업

다음 작업은 결과가 즉시 나오지 않을 수 있습니다.

- 서버에 데이터 요청하기
- MongoDB에서 게시글 찾기
- 파일 읽기
- 사용자의 입력 기다리기

JavaScript는 이런 작업을 **비동기(asynchronous)** 로 다룰 수 있습니다. 기다리는 동안 프로그램 전체를 멈추지 않고, 결과가 준비된 뒤 이어서 처리합니다.

## 2. Promise

Promise는 “나중에 성공 값이나 실패 이유가 결정될 작업”을 나타내는 객체입니다.

```js
const promisedMessage = Promise.resolve("완료");

promisedMessage.then((message) => {
  console.log(message);
});
```

직접 Promise를 만드는 일보다, Promise를 반환하는 `fetch`나 MongoDB 함수를 사용하는 일이 더 많습니다.

## 3. async와 await

`async` 함수 안에서는 Promise 결과를 `await`로 기다릴 수 있습니다.

```js
async function readMessage() {
  const message = await Promise.resolve("완료");
  console.log(message);
}

readMessage();
```

`await`가 있는 줄의 결과가 준비된 뒤 다음 줄로 이동하므로 위에서 아래로 읽기 쉽습니다.

`async` 함수는 일반 값을 반환해도 그 값을 담은 Promise를 반환합니다.

```js
async function getNumber() {
  return 3;
}

async function printNumber() {
  const number = await getNumber();
  console.log(number); // 3
}

printNumber();
```

## 4. fetch로 요청 보내기

`fetch`는 URL에 HTTP 요청을 보내고 Response 객체를 Promise로 반환합니다.

```js
async function loadPosts() {
  const response = await fetch("/api/post");
  const result = await response.json();

  console.log(result);
}
```

두 번 기다리는 이유는 다음과 같습니다.

1. `await fetch(...)`: 응답의 header와 상태가 도착하기를 기다립니다.
2. `await response.json()`: 응답 body를 읽고 JavaScript 값으로 변환하기를 기다립니다.

항상 최신 서버 응답을 다시 요청해야 하는 화면은 cache 선택값을 줄 수 있습니다.

```js
const response = await fetch("/api/post", {
  cache: "no-store",
});
```

`cache: "no-store"`는 이전 응답을 재사용하지 말고 요청할 때마다 새 응답을 받겠다는 뜻입니다.

## 5. GET 이외의 요청

새 게시글 데이터를 JSON으로 보내는 예입니다.

```js
const postData = {
  title: "새 글",
  content: "본문입니다.",
};

const response = await fetch("/api/post", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(postData),
});
```

- `JSON.stringify`: JavaScript 객체를 JSON 문자열로 바꿉니다.
- `Content-Type`: body가 어떤 형식인지 서버에 알려 줍니다.

## 6. 성공 상태 확인하기

`fetch`는 서버가 404나 500을 반환해도 네트워크 응답을 받았다면 Promise 자체는 보통 성공합니다. HTTP 성공 여부는 `response.ok`로 따로 확인합니다.

```js
const response = await fetch("/api/post/unknown");
const result = await response.json();

if (!response.ok) {
  throw new Error(result.message || "요청에 실패했습니다.");
}
```

`throw`는 현재 처리를 중단하고 오류를 발생시킵니다.

## 7. try, catch, finally

오류가 날 수 있는 코드를 `try`에 두고, 오류가 발생하면 `catch`에서 처리합니다.

```js
async function loadPost() {
  try {
    const response = await fetch("/api/post/123");
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "불러오기에 실패했습니다.");
    }

    console.log(result.data);
  } catch (error) {
    console.error(error);
  } finally {
    console.log("성공 또는 실패 후 항상 실행");
  }
}
```

- `try`: 정상 흐름을 시도합니다.
- `catch`: `try`에서 발생한 오류를 받습니다.
- `finally`: 성공과 실패에 관계없이 마지막에 실행합니다.

로딩 상태는 `finally`에서 종료하면 중복을 줄일 수 있습니다.

```js
setIsLoading(true);

try {
  await loadData();
} catch (error) {
  setError(error.message);
} finally {
  setIsLoading(false);
}
```

## 8. 순차 실행과 동시 실행

서로의 결과가 필요한 작업은 순서대로 기다립니다.

```js
const response = await fetch("/api/post");
const result = await response.json();
```

서로 독립적인 작업은 `Promise.all`로 함께 기다릴 수 있습니다.

```js
const [postsResponse, profileResponse] = await Promise.all([
  fetch("/api/post"),
  fetch("/api/profile"),
]);
```

이 프로젝트의 기본 실습에서는 먼저 순차 실행을 확실히 읽는 데 집중합니다.

## 9. catch에서 안전하게 메시지 읽기

JavaScript에서는 문자열처럼 Error 객체가 아닌 값도 throw할 수 있습니다. `instanceof Error`로 확인하면 `message`를 안전하게 읽을 수 있습니다.

```js
try {
  throw new Error("저장 실패");
} catch (error) {
  const message =
    error instanceof Error ? error.message : "알 수 없는 오류";

  console.log(message); // 저장 실패
}
```

`error instanceof Error`는 error가 `Error`로 만든 객체인지 확인합니다.

## 프로젝트에서 다시 만나기

- MongoDB 연결, 조회, 저장 함수는 Promise를 반환하므로 `await`합니다.
- 화면에서 `fetch`로 API를 호출하고 `response.json()`을 다시 `await`합니다.
- `response.ok`가 false면 응답의 `message`로 Error를 만듭니다.
- `finally`에서 `isLoading` 또는 `isSubmitting`을 false로 되돌립니다.
- `err instanceof Error`로 확인한 뒤 사용자에게 보여 줄 message를 고릅니다.

## 확인하기

1. `await`는 어떤 함수 안에서 사용할 수 있나요?
2. `fetch` 다음에 `response.json()`도 기다리는 이유는 무엇인가요?
3. 성공과 실패 모두에서 실행할 코드는 어디에 두나요?

정답: `async` 함수 안에서 사용합니다. 응답 body를 읽어 JavaScript 값으로 변환하는 작업도 비동기이기 때문입니다. `finally`에 둡니다.
