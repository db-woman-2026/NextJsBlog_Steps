# Step 1. App Router와 기본 페이지 껍데기 만들기

이 문서는 `main`에서 시작해 `step-1`를 완성하는 실습 자료입니다.
원본 개요는 [docs/overview/step-1.md](../overview/step-1.md)에 보존되어 있습니다.
실제 완성 코드는 [step-1 브랜치](https://github.com/db-woman-2026/NextJsBlog_Steps/tree/step-1) 기준입니다.

## 이번 단계 목표

App Router의 기본 라우팅을 익히기 위해 Home, About, Post, Contact 페이지와 공통 Header/Footer를 만듭니다.

이번 단계에서 집중할 내용은 다음과 같습니다.

- app 폴더의 page.js가 URL이 되는 규칙을 확인합니다.
- 공통 Header와 Footer를 layout.js에 연결합니다.
- next/link의 Link 컴포넌트로 내부 페이지를 이동합니다.

## 시작 기준

`main` 브랜치의 create-next-app 기본 상태에서 시작합니다.

```bash
git switch main
# 실습용 브랜치를 직접 만들 경우
git switch -c practice-step-1
```

수업 저장소의 정답 브랜치를 바로 확인하려면 다음 명령을 사용할 수 있습니다.

```bash
git switch step-1
```

## 수정 파일

| 상태 | 파일 | 확인 링크 |
| --- | --- | --- |
| 생성 | `app/about/page.js` | [app/about/page.js](https://github.com/db-woman-2026/NextJsBlog_Steps/blob/step-1/app/about/page.js) |
| 생성 | `app/components/Footer.js` | [app/components/Footer.js](https://github.com/db-woman-2026/NextJsBlog_Steps/blob/step-1/app/components/Footer.js) |
| 생성 | `app/components/Header.js` | [app/components/Header.js](https://github.com/db-woman-2026/NextJsBlog_Steps/blob/step-1/app/components/Header.js) |
| 생성 | `app/contact/page.js` | [app/contact/page.js](https://github.com/db-woman-2026/NextJsBlog_Steps/blob/step-1/app/contact/page.js) |
| 수정 | `app/globals.css` | [app/globals.css](https://github.com/db-woman-2026/NextJsBlog_Steps/blob/step-1/app/globals.css) |
| 수정 | `app/layout.js` | [app/layout.js](https://github.com/db-woman-2026/NextJsBlog_Steps/blob/step-1/app/layout.js) |
| 수정 | `app/page.js` | [app/page.js](https://github.com/db-woman-2026/NextJsBlog_Steps/blob/step-1/app/page.js) |
| 삭제 | `app/page.module.css` | [app/page.module.css](https://github.com/db-woman-2026/NextJsBlog_Steps/blob/main/app/page.module.css) |
| 생성 | `app/post/page.js` | [app/post/page.js](https://github.com/db-woman-2026/NextJsBlog_Steps/blob/step-1/app/post/page.js) |

문서 파일은 이 강의 자료에서 별도로 관리하므로 위 표에는 기능 구현에 필요한 코드와 설정 파일만 넣었습니다.

## 코드 작성

아래 순서대로 파일을 만들거나 수정합니다. 각 코드 블록은 해당 단계 브랜치의 실제 파일 내용을 기준으로 합니다.

### 1. app/about/page.js

새 파일 `app/about/page.js`을 만들고 아래 내용을 입력합니다.

이 단계의 결과와 맞도록 파일 내용을 정리합니다.

```jsx
export default function AboutPage() {
  return (
    <main>
      <h1>About Me</h1>
      <p>
        This page will introduce the blog owner. For now, it is a simple page
        shell used to practice Next.js routing.
      </p>
    </main>
  );
}
```

### 2. app/components/Footer.js

새 파일 `app/components/Footer.js`을 만들고 아래 내용을 입력합니다.

이 단계의 결과와 맞도록 파일 내용을 정리합니다.

```jsx
export default function Footer() {
  return <footer>&copy; 2026 News Website. All rights reserved.</footer>;
}
```

### 3. app/components/Header.js

새 파일 `app/components/Header.js`을 만들고 아래 내용을 입력합니다.

이 단계의 결과와 맞도록 파일 내용을 정리합니다.

```jsx
import Link from "next/link";

export default function Header() {
  return (
    <header>
      <nav>
        <ul>
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/about">About</Link>
          </li>
          <li>
            <Link href="/post">Post</Link>
          </li>
          <li>
            <Link href="/contact">Contact</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
```

### 4. app/contact/page.js

새 파일 `app/contact/page.js`을 만들고 아래 내용을 입력합니다.

이 단계의 결과와 맞도록 파일 내용을 정리합니다.

```jsx
export default function ContactPage() {
  return (
    <main>
      <h1>Contact Us</h1>
      <p>The contact form will be added in a later step.</p>
    </main>
  );
}
```

### 5. app/globals.css

기존 `app/globals.css` 파일을 열고 아래 최종 코드와 같게 수정합니다.

전역 스타일 파일입니다. 모든 페이지에 공통으로 적용되는 CSS 또는 Tailwind import를 둡니다.

```css
body {
  max-width: 48rem;
  min-height: 100vh;
  margin: 0 auto;
  padding: 2rem 1rem;
  font-family: Arial, Helvetica, sans-serif;
  line-height: 1.6;
}

nav ul {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  list-style: none;
  margin: 0;
  padding: 0;
}

main {
  margin: 2rem 0;
}

footer {
  border-top: 1px solid #ddd;
  padding-top: 1rem;
}
```

### 6. app/layout.js

기존 `app/layout.js` 파일을 열고 아래 최종 코드와 같게 수정합니다.

모든 페이지를 감싸는 공통 레이아웃입니다. Header, Footer, 전체 화면 구조처럼 페이지마다 반복되는 부분을 여기에 둡니다.

```jsx
import "./globals.css";
import Footer from "./components/Footer";
import Header from "./components/Header";

export const metadata = {
  title: "Next.js Blog",
  description: "A beginner-friendly blog built with Next.js.",
};

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

### 7. app/page.js

기존 `app/page.js` 파일을 열고 아래 최종 코드와 같게 수정합니다.

홈 화면입니다. 단계가 진행되면서 소개 화면에서 게시글 목록, 검색, 페이지네이션, 정렬 UI로 확장됩니다.

```jsx
import Link from "next/link";

export default function Home() {
  return (
    <main>
      <h1>Next.js Blog</h1>
      <p>
        This project will become a small blog through beginner-friendly
        practice steps.
      </p>
      <p>
        In this first step, focus on moving between pages with the navigation
        menu.
      </p>
      <p>
        <Link href="/post">Create a post page shell</Link>
      </p>
    </main>
  );
}
```

### 8. app/page.module.css

이 단계에서는 `app/page.module.css` 파일을 삭제합니다.

이 단계의 결과와 맞도록 파일 내용을 정리합니다.

```bash
rm app/page.module.css
```

삭제 전 파일은 [main의 app/page.module.css](https://github.com/db-woman-2026/NextJsBlog_Steps/blob/main/app/page.module.css)에서 확인할 수 있습니다.

### 9. app/post/page.js

새 파일 `app/post/page.js`을 만들고 아래 내용을 입력합니다.

게시글 작성 또는 수정 화면입니다. form 상태와 API 요청 흐름을 집중해서 봅니다.

```jsx
export default function NewPostPage() {
  return (
    <main>
      <h1>Create New Post</h1>
      <p>The post form will be added after the data and API layers are ready.</p>
    </main>
  );
}
```

## 실행 확인

기본 확인 명령은 다음과 같습니다.

```bash
npm run lint
npm run build
npm run dev
```

화면과 기능은 다음 순서로 확인합니다.

- npm run dev 실행 후 /, /about, /post, /contact 주소를 각각 엽니다.
- Header 메뉴를 눌러 모든 페이지가 이동되는지 확인합니다.

## 자주 확인할 부분

- 파일 이름과 폴더 이름을 정확히 입력합니다. App Router에서는 `page.js`, `layout.js`, `route.js`, `not-found.js`, `error.js` 같은 파일명이 특별한 의미를 가집니다.
- 클라이언트 상태나 이벤트를 쓰는 파일에는 필요한 경우에만 `"use client";`를 둡니다. 서버에서 실행되어야 하는 MongoDB 코드는 클라이언트 컴포넌트로 가져오지 않습니다.
- API 응답은 가능한 한 `{ success, message, data }` 구조를 유지합니다. 화면 코드는 이 구조를 기준으로 `message`와 `data`를 읽습니다.
- 실습 중 막히면 먼저 이 문서의 코드 블록과 브랜치 링크의 실제 파일을 비교합니다.

## 개념 정리

아래 내용은 기존 단계 개요를 강의 문서 안에서도 바로 볼 수 있도록 가져온 것입니다. 코드 작성 후 다시 읽으면 각 변경의 이유를 확인하기 쉽습니다.

## 이 단계의 목표

`step-1` 브랜치는 `create-next-app`으로 만든 기본 프로젝트를 블로그 프로젝트의 첫 화면 구조로 바꾸는 단계입니다.

아직 데이터베이스, API, 게시글 작성 기능은 만들지 않습니다. 이 단계에서 중요한 것은 다음 세 가지입니다.

- `app` 폴더 안의 파일 위치가 브라우저 주소와 어떻게 연결되는지 이해한다.
- 모든 페이지에 공통으로 보이는 `Header`와 `Footer`를 만든다.
- `next/link`의 `Link` 컴포넌트로 페이지 사이를 이동한다.

초급자에게는 처음부터 데이터베이스나 API를 붙이는 것보다, 먼저 "파일을 만들면 주소가 생긴다"는 감각을 잡는 편이 좋습니다. 그래서 이 단계는 의도적으로 화면 껍데기만 만듭니다.

## 이 단계의 결과

이 브랜치에서 확인할 수 있는 주소는 다음과 같습니다.

| 주소 | 파일 | 역할 |
| --- | --- | --- |
| `/` | `app/page.js` | 홈 화면 |
| `/about` | `app/about/page.js` | 소개 화면 |
| `/post` | `app/post/page.js` | 글 작성 화면 껍데기 |
| `/contact` | `app/contact/page.js` | 문의 화면 껍데기 |

또한 모든 페이지 위에는 `Header`, 아래에는 `Footer`가 공통으로 표시됩니다. 이 공통 구조는 `app/layout.js`에서 관리합니다.

## App Router의 핵심 규칙

Next.js App Router에서는 `app` 폴더 아래의 폴더와 특수 파일이 라우트를 만듭니다.

가장 중요한 파일 이름은 `page.js`입니다.

```txt
app/page.js              -> /
app/about/page.js        -> /about
app/post/page.js         -> /post
app/contact/page.js      -> /contact
```

여기서 `about`, `post`, `contact` 같은 폴더 이름이 URL의 한 조각이 됩니다. 폴더만 만들고 `page.js`를 만들지 않으면 화면 주소가 생기지 않습니다.

## 왜 layout.js를 수정하는가

`app/layout.js`는 모든 페이지를 감싸는 공통 레이아웃입니다. 기본 생성 상태에서는 `children`만 보여줍니다.

블로그에서는 모든 페이지에 같은 메뉴와 푸터가 보여야 하므로 다음과 같은 구조로 바꿉니다.

```jsx
<body>
  <Header />
  {children}
  <Footer />
</body>
```

여기서 `{children}`은 현재 주소에 맞는 페이지 컴포넌트가 들어오는 자리입니다.

예를 들어 `/about`으로 접속하면 전체 구조는 개념적으로 다음과 같습니다.

```jsx
<Header />
<AboutPage />
<Footer />
```

`/contact`로 접속하면 다음처럼 바뀝니다.

```jsx
<Header />
<ContactPage />
<Footer />
```

따라서 `Header`와 `Footer`를 각 페이지마다 반복해서 import하지 않아도 됩니다.

## Header 컴포넌트 만들기

`app/components/Header.js` 파일을 만들고 메뉴를 작성합니다.

```jsx
import Link from "next/link";

export default function Header() {
  return (
    <header>
      <nav>
        <ul>
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/about">About</Link>
          </li>
          <li>
            <Link href="/post">Post</Link>
          </li>
          <li>
            <Link href="/contact">Contact</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
```

일반 HTML에서는 `<a href="/about">About</a>`를 사용할 수 있습니다. Next.js에서는 내부 페이지 이동에 `Link`를 자주 사용합니다. `Link`는 페이지 전환을 Next.js가 효율적으로 처리할 수 있게 도와줍니다.

## Footer 컴포넌트 만들기

`app/components/Footer.js`는 아주 단순합니다.

```jsx
export default function Footer() {
  return <footer>&copy; 2026 News Website. All rights reserved.</footer>;
}
```

처음에는 간단한 문구만 둡니다. 나중에 필요하면 저작권, GitHub 링크, 회사 정보 등을 넣을 수 있습니다.

## 홈 페이지 수정하기

기본 생성 상태의 홈 화면은 Next.js 로고와 배포 링크를 보여줍니다. 실습 프로젝트에서는 그 내용이 필요하지 않으므로 블로그 소개 화면으로 바꿉니다.

`app/page.js`는 `/` 주소를 담당합니다.

```jsx
import Link from "next/link";

export default function Home() {
  return (
    <main>
      <h1>Next.js Blog</h1>
      <p>
        This project will become a small blog through beginner-friendly
        practice steps.
      </p>
      <p>
        In this first step, focus on moving between pages with the navigation
        menu.
      </p>
      <p>
        <Link href="/post">Create a post page shell</Link>
      </p>
    </main>
  );
}
```

여기서도 `Link`를 사용합니다. 메뉴뿐 아니라 본문 안에서도 내부 페이지 이동이 필요하면 `Link`를 사용할 수 있습니다.

## About 페이지 만들기

`app/about/page.js`를 만들면 `/about` 주소가 생깁니다.

```jsx
export default function AboutPage() {
  return (
    <main>
      <h1>About Me</h1>
      <p>
        This page will introduce the blog owner. For now, it is a simple page
        shell used to practice Next.js routing.
      </p>
    </main>
  );
}
```

컴포넌트 이름은 반드시 `AboutPage`일 필요는 없습니다. 하지만 파일의 역할이 드러나는 이름을 쓰면 코드를 읽기 쉽습니다.

## Post 페이지 만들기

`app/post/page.js`는 `/post` 주소를 담당합니다. 최종 프로젝트에서는 새 글 작성 form이 들어갈 자리입니다.

이 단계에서는 아직 form을 만들지 않습니다. form을 먼저 만들면 "입력값을 어디에 저장하지?", "서버로 어떻게 보내지?" 같은 질문이 바로 생깁니다. 그래서 데이터와 API를 배운 뒤 form을 붙입니다.

## Contact 페이지 만들기

`app/contact/page.js`는 `/contact` 주소를 담당합니다. 최종 프로젝트에서는 mockup 문의 form이 들어갈 자리입니다.

mockup이라는 말은 실제 메일을 보내지는 않고, 화면 동작만 흉내 내는 기능을 뜻합니다.

## globals.css 정리하기

기본 생성 프로젝트의 CSS는 Next.js 시작 화면에 맞춰져 있습니다. 이 단계에서는 복잡한 디자인보다 읽기 쉬운 최소 스타일만 둡니다.

```css
body {
  max-width: 48rem;
  min-height: 100vh;
  margin: 0 auto;
  padding: 2rem 1rem;
  font-family: Arial, Helvetica, sans-serif;
  line-height: 1.6;
}
```

이 코드는 본문 너비를 제한하고 화면 가운데에 배치합니다.

메뉴는 다음처럼 가로로 배치합니다.

```css
nav ul {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  list-style: none;
  margin: 0;
  padding: 0;
}
```

`display: flex`는 자식 요소들을 한 줄 방향으로 배치할 때 자주 사용합니다. `flex-wrap: wrap`은 화면이 좁을 때 메뉴가 다음 줄로 내려갈 수 있게 합니다.

## 직접 실습 순서

처음부터 완성 코드를 복사하지 말고 다음 순서로 진행해보면 좋습니다.

1. `app/components` 폴더를 만든다.
2. `app/components/Header.js`를 만든다.
3. `Header` 안에 `Home`, `About`, `Post`, `Contact` 링크를 만든다.
4. `app/components/Footer.js`를 만든다.
5. `app/layout.js`에서 `Header`, `Footer`를 import한다.
6. `body` 안에 `<Header />`, `{children}`, `<Footer />` 순서로 넣는다.
7. `app/about/page.js`를 만든다.
8. `app/post/page.js`를 만든다.
9. `app/contact/page.js`를 만든다.
10. `app/page.js`의 기본 생성 내용을 블로그 홈 내용으로 바꾼다.
11. `app/globals.css`를 단순한 전역 스타일로 정리한다.

## 실행과 확인

개발 서버를 실행합니다.

```bash
npm run dev
```

브라우저에서 다음 주소를 확인합니다.

```txt
http://localhost:3000/
http://localhost:3000/about
http://localhost:3000/post
http://localhost:3000/contact
```

각 페이지에서 공통 메뉴와 푸터가 보이면 성공입니다.

## 검증 명령

코드 문법과 빌드 가능 여부는 다음 명령으로 확인합니다.

```bash
npm run lint
npm run build
```

`lint`는 코드 규칙 위반을 찾고, `build`는 실제 배포용으로 컴파일할 수 있는지 확인합니다.

## 자주 발생하는 실수

### page.js 파일명을 다르게 쓰는 경우

`app/about/AboutPage.js`처럼 파일을 만들면 `/about` 페이지가 생기지 않습니다. App Router에서 화면 라우트 파일 이름은 `page.js`여야 합니다.

### Link를 import하지 않는 경우

`<Link href="/about">About</Link>`를 사용하려면 파일 위에 다음 import가 있어야 합니다.

```jsx
import Link from "next/link";
```

import가 빠지면 `Link is not defined` 같은 오류가 납니다.

### layout.js에서 children을 지우는 경우

`layout.js`에서 `{children}`을 지우면 현재 페이지 내용이 표시되지 않습니다. 공통 레이아웃 안에서 실제 페이지가 들어갈 자리가 바로 `{children}`입니다.

### components 폴더가 URL이 된다고 착각하는 경우

`app/components/Header.js`는 페이지가 아닙니다. `page.js`가 아니기 때문에 `/components` 같은 주소가 생기지 않습니다.

## 이 단계에서 아직 하지 않는 것

이 단계에서는 다음을 하지 않습니다.

- MongoDB 연결
- 게시글 목록 불러오기
- 게시글 작성 form
- 게시글 수정 form
- API Route
- 상세 페이지 동적 라우트

이 기능들은 뒤 단계에서 하나씩 붙입니다. 지금은 라우팅과 레이아웃 구조를 정확히 이해하는 것이 목표입니다.

## 다음 단계 예고

다음 단계에서는 화면을 조금 더 보기 좋게 만들고, `simpledotcss`를 적용합니다. 또한 소개 페이지에 이미지를 넣기 위해 Next.js 이미지 설정도 다룹니다.
