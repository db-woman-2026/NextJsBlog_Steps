# 11. App Router와 컴포넌트 경계

## 확인할 내용

- Next.js와 React의 관계를 설명합니다.
- `app` 폴더의 `page.js`, `layout.js`, `route.js` 역할을 구분합니다.
- 서버 컴포넌트와 클라이언트 컴포넌트를 선택하는 기준을 적용합니다.

## 1. React와 Next.js

React는 컴포넌트로 UI를 만드는 library입니다. Next.js는 React를 사용해 routing, 서버 실행, build, image 최적화 같은 앱 전체 구조를 제공하는 framework입니다.

```txt
React
└── 컴포넌트, JSX, props, state

Next.js
└── React + 파일 기반 routing + 서버 기능 + build 도구
```

## 2. App Router의 파일 기반 routing

`app` 폴더 아래의 폴더와 파일 이름으로 URL 경로가 만들어집니다.

```txt
app/
├── layout.js             모든 화면의 공통 뼈대
├── page.js               /
├── about/
│   └── page.js           /about
└── post/
    ├── page.js           /post
    └── [id]/
        └── page.js       /post/변하는-id
```

폴더만 만들었다고 route가 완성되는 것은 아닙니다. 사용자가 볼 route에는 해당 위치의 `page.js`가 필요합니다.

## 3. page.js

`page.js`의 default export 컴포넌트가 그 URL의 화면입니다.

```jsx
// app/about/page.js
export default function AboutPage() {
  return (
    <main>
      <h1>About</h1>
    </main>
  );
}
```

`/about`을 열면 `AboutPage`가 렌더링됩니다. 함수 이름 자체가 URL을 정하는 것은 아니며 파일 위치가 URL을 정합니다.

## 4. layout.js와 children

layout은 여러 page가 공유할 UI를 정의합니다.

```jsx
// app/layout.js
export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
```

`{children}` 자리에 현재 URL의 page가 들어갑니다. Header와 Footer는 route가 바뀌어도 같은 위치에서 반복됩니다.

root layout은 `html`과 `body` 태그를 포함합니다.

## 5. metadata

페이지 제목과 설명 같은 문서 정보는 metadata로 정의할 수 있습니다.

```js
export const metadata = {
  title: "Next.js Blog",
  description: "Basic blog project",
};
```

정적인 metadata는 서버 컴포넌트 파일에서 export합니다.

## 6. route.js

`route.js`는 화면 대신 HTTP 요청을 처리합니다.

```js
// app/api/hello/route.js
export async function GET() {
  return Response.json({ message: "Hello" });
}
```

브라우저나 다른 코드가 `/api/hello`로 GET 요청을 보내면 `GET` 함수가 실행됩니다.

```js
export async function POST(request) {
  const data = await request.json();
  return Response.json(data, { status: 201 });
}
```

같은 `route.js`에서 HTTP method 이름으로 함수를 나눕니다.

## 7. 서버 컴포넌트

App Router의 컴포넌트는 기본적으로 서버 컴포넌트입니다.

```jsx
export default async function DetailPage() {
  const post = await getPostById("...");
  return <h1>{post.title}</h1>;
}
```

서버 컴포넌트의 특징입니다.

- 서버에서 실행할 수 있습니다.
- 데이터베이스나 서버 전용 코드를 직접 호출할 수 있습니다.
- 브라우저에 숨겨야 할 환경 변수를 다룰 수 있습니다.
- `useState`, `useEffect`, click handler 같은 브라우저 상호작용은 사용할 수 없습니다.

## 8. 클라이언트 컴포넌트

파일 맨 위에 `"use client";`를 적으면 클라이언트 컴포넌트 경계가 시작됩니다.

```jsx
"use client";

import { useState } from "react";

export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(count + 1)}>
      {count}
    </button>
  );
}
```

다음 기능이 필요할 때 클라이언트 컴포넌트를 사용합니다.

- `useState`, `useEffect` 같은 hook
- `onClick`, `onChange`, `onSubmit` 같은 이벤트
- `window`, `document`, `alert`, `confirm` 같은 브라우저 API

모든 파일에 `"use client";`를 붙일 필요는 없습니다. 상호작용이 필요한 작은 컴포넌트만 분리할 수 있습니다.

## 9. 서버와 클라이언트의 데이터 경계

서버 컴포넌트가 클라이언트 컴포넌트에 props를 전달할 수 있습니다. 이 값은 브라우저로 전달 가능하도록 직렬화할 수 있는 데이터여야 합니다.

```jsx
// 서버 컴포넌트
export default async function Page() {
  const post = await getPost();
  return <LikeButton postId={String(post._id)} />;
}
```

클라이언트 컴포넌트에서 MongoDB 연결 코드를 직접 import하지 않습니다. 브라우저가 필요로 하는 데이터는 서버 컴포넌트 props나 API를 통해 받습니다.

```txt
클라이언트 컴포넌트 -> API route -> 데이터 함수 -> MongoDB
```

## 10. Next.js의 Link와 Image

Next.js는 route 이동과 이미지 처리를 위한 컴포넌트를 제공합니다.

```jsx
import Link from "next/link";
import Image from "next/image";

export default function Profile() {
  return (
    <section>
      <Image
        src="https://example.com/profile.jpg"
        alt="작성자 프로필"
        width={160}
        height={160}
      />
      <Link href="/about">About</Link>
    </section>
  );
}
```

`Image`에는 이미지 주소를 설명하는 `alt`와 레이아웃 크기를 계산할 `width`, `height`를 지정합니다. 프로젝트 밖의 원격 이미지를 사용하면 허용할 host와 path를 `next.config.mjs`의 `images.remotePatterns`에 설정해야 합니다.

## 프로젝트 예시

- `step-1`: root layout, page, Header, Footer를 만듭니다.
- `step-2`: `next/image`와 원격 이미지 허용 설정을 사용합니다.
- `step-4`: `app/api/post/route.js`에 HTTP method 함수를 export합니다.
- 상세 읽기 page는 서버 컴포넌트에서 MongoDB 함수를 직접 호출합니다.
- 작성/수정 form과 삭제 버튼은 이벤트와 state가 필요해 클라이언트 컴포넌트입니다.

## 확인하기

1. `/about` URL은 컴포넌트 함수 이름과 `app` 안의 파일 위치 중 무엇으로 결정되나요?
2. `useState`가 필요한 파일 맨 위에는 무엇을 적나요?
3. 클라이언트 컴포넌트에서 MongoDB 연결 함수를 직접 import하면 안 되는 이유는 무엇인가요?

정답: 파일 위치입니다. `"use client";`를 적습니다. 데이터베이스 연결 정보와 서버 전용 코드가 브라우저 경계로 넘어가면 안 되기 때문입니다.
