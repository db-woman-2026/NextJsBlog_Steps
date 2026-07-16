# Step 1. App Router와 기본 페이지 껍데기 만들기

## 배울 내용

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

## App Router 기본 규칙

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

일반 HTML에서는 `<a href="/about">About</a>`를 사용할 수 있습니다. Next.js에서는 내부 페이지 이동에 `Link`를 자주 사용합니다. `Link`를 사용하면 Next.js가 내부 페이지 전환을 처리합니다.

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

아직 form을 만들지 않습니다. form을 먼저 만들면 "입력값을 어디에 저장하지?", "서버로 어떻게 보내지?" 같은 질문이 바로 생깁니다. 그래서 데이터와 API를 배운 뒤 form을 붙입니다.

## Contact 페이지 만들기

`app/contact/page.js`는 `/contact` 주소를 담당합니다. 최종 프로젝트에서는 mockup 문의 form이 들어갈 자리입니다.

mockup이라는 말은 실제 메일을 보내지는 않고, 화면 동작만 흉내 내는 기능을 뜻합니다.

## globals.css 정리하기

기본 생성 프로젝트의 CSS는 Next.js 시작 화면에 맞춰져 있습니다. 복잡한 디자인보다 읽기 쉬운 최소 스타일만 둡니다.

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

## 실습 순서

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

다음을 하지 않습니다.

- MongoDB 연결
- 게시글 목록 불러오기
- 게시글 작성 form
- 게시글 수정 form
- API Route
- 상세 페이지 동적 라우트

이 기능들은 뒤 단계에서 하나씩 붙입니다. 지금은 라우팅과 레이아웃 구조를 정확히 이해하는 것이 목표입니다.

## 다음 단계 예고

다음 단계에서는 화면을 조금 더 보기 좋게 만들고, `simpledotcss`를 적용합니다. 또한 소개 페이지에 이미지를 넣기 위해 Next.js 이미지 설정도 다룹니다.
