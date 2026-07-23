# 01. 웹과 프로젝트 용어

## 확인할 내용

- 클라이언트, 서버, 요청, 응답을 구분합니다.
- URL, route, page, API의 관계를 설명합니다.
- 렌더링과 컴포넌트라는 말을 낯설지 않게 만듭니다.

## 1. 브라우저와 서버

사용자가 Chrome 같은 브라우저에서 주소를 열면 브라우저가 서버에 **요청(request)** 을 보냅니다. 서버는 요청을 처리하고 **응답(response)** 을 돌려줍니다.

```txt
브라우저(클라이언트)  -- 요청 -->  Next.js 서버
브라우저(클라이언트)  <-- 응답 --  Next.js 서버
```

- **클라이언트(client)**: 서비스를 요청하는 쪽입니다. 이 프로젝트에서는 주로 브라우저입니다.
- **서버(server)**: 요청을 받아 코드 실행, 데이터 조회, 응답 생성을 담당합니다.
- **프론트엔드(frontend)**: 사용자가 보고 조작하는 화면 쪽입니다.
- **백엔드(backend)**: API, 데이터 검증, 데이터베이스 연결처럼 서버에서 처리하는 쪽입니다.

Next.js는 한 프로젝트 안에 프론트엔드와 백엔드 코드를 함께 둘 수 있습니다.

## 2. URL을 나누어 읽기

```txt
http://localhost:3000/detail/abc123?mode=preview
└─┬─┘ └────┬─────┘└┬─┘└─────┬──────┘└────┬─────┘
 scheme     host    port      path        query string
```

- `http`: 통신 방법
- `localhost`: 현재 컴퓨터를 뜻하는 host
- `3000`: 프로그램이 사용하는 port
- `/detail/abc123`: 자원의 위치를 나타내는 path
- `?mode=preview`: 추가 선택값을 전달하는 query string

## 3. route와 page

**route(라우트)** 는 URL 경로와 그 경로를 처리할 코드를 연결한 것입니다. 화면을 돌려주는 route에는 보통 page가 있습니다.

```txt
app/page.js                -> /
app/about/page.js          -> /about
app/detail/[id]/page.js    -> /detail/abc123
```

`[id]`처럼 대괄호로 감싼 폴더는 값이 바뀔 수 있는 **동적 경로(dynamic route)** 입니다.

## 4. 화면 route와 API route

화면 route의 응답은 사용자가 볼 UI입니다.

```txt
GET /about -> About 화면
```

API route의 응답은 다른 코드가 읽을 데이터인 경우가 많습니다.

```txt
GET /api/post -> 게시글 JSON 데이터
```

JSON은 다음처럼 키와 값으로 데이터를 표현합니다.

```json
{
  "success": true,
  "message": "Posts fetched successfully",
  "data": []
}
```

## 5. 렌더링과 컴포넌트

**렌더링(rendering)** 은 데이터를 바탕으로 화면에 표시할 결과를 만드는 과정입니다.

```jsx
function Greeting() {
  return <h1>Hello</h1>;
}
```

**컴포넌트(component)** 는 화면의 한 부분을 맡는 JavaScript 함수입니다. 위 `Greeting`은 제목 하나를 렌더링하는 컴포넌트입니다.

여러 컴포넌트를 조합해 한 화면을 만듭니다.

```jsx
function Page() {
  return (
    <main>
      <Header />
      <Greeting />
      <Footer />
    </main>
  );
}
```

## 6. 자주 만나는 프로젝트 용어

| 용어 | 쉬운 뜻 |
| --- | --- |
| framework | 앱을 만드는 구조와 규칙을 제공하는 도구 |
| library | 특정 기능을 가져다 쓰는 코드 묶음 |
| runtime | 코드가 실제로 실행되는 환경. 브라우저나 Node.js가 예입니다. |
| build | 소스 코드를 배포 가능한 결과로 준비하는 과정 |
| dependency | 프로젝트가 사용하기 위해 설치한 외부 패키지 |
| config | 프로그램의 동작 방식을 정하는 설정 |
| deploy | 다른 사용자가 접속할 수 있는 서버에 앱을 올리는 일 |

## 프로젝트 예시

- `step-1`: `/`, `/about`, `/post`, `/contact` 화면 route를 만듭니다.
- `step-4`: `/api/post` API route를 만듭니다.
- `step-5`: 브라우저가 API를 요청하고 받은 게시글을 렌더링합니다.

## 확인하기

1. 브라우저가 서버에 보내는 것은 요청인가요, 응답인가요?
2. `/detail/abc123`에서 `abc123`처럼 바뀔 수 있는 부분을 무엇이라고 하나요?
3. `/about`과 `/api/post`가 주로 돌려주는 결과는 어떻게 다른가요?

정답: 브라우저가 요청을 보냅니다. 바뀌는 경로는 동적 경로 값입니다. `/about`은 화면을, `/api/post`는 코드가 읽을 데이터를 주로 돌려줍니다.
