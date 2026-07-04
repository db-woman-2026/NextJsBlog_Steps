# Step 20. Tailwind CSS v4 설치와 공통 layout 정리

이 문서는 `step-19`에서 시작해 `step-20`를 완성하는 실습 자료입니다.
원본 개요는 [docs/overview/step-20.md](../overview/step-20.md)에 보존되어 있습니다.
실제 완성 코드는 [step-20 브랜치](https://github.com/db-woman-2026/NextJsBlog_Steps/tree/step-20) 기준입니다.

## 이번 단계 목표

simpledotcss를 제거하고 Tailwind CSS v4를 설치한 뒤 공통 layout, nav, footer에 기본 utility class를 적용합니다.

이번 단계에서 집중할 내용은 다음과 같습니다.

- simpledotcss import를 제거하고 Tailwind CSS v4를 설정합니다.
- PostCSS 설정 파일을 추가합니다.
- layout, Header, Footer에 공통 utility class를 적용합니다.

## 시작 기준

이전 단계인 `step-19` 브랜치까지 완료된 상태에서 시작합니다.

```bash
git switch step-19
# 실습용 브랜치를 직접 만들 경우
git switch -c practice-step-20
```

수업 저장소의 정답 브랜치를 바로 확인하려면 다음 명령을 사용할 수 있습니다.

```bash
git switch step-20
```

## 패키지 명령

이 단계에서는 의존성이 바뀝니다. 먼저 아래 명령을 실행합니다.

```bash
npm uninstall simpledotcss
npm install -D tailwindcss @tailwindcss/postcss postcss
```

`package-lock.json`은 npm 명령이 자동으로 갱신합니다. 직접 타이핑하지 않습니다.

## 수정 파일

| 상태 | 파일 | 확인 링크 |
| --- | --- | --- |
| 수정 | `README.md` | [README.md](https://github.com/db-woman-2026/NextJsBlog_Steps/blob/step-20/README.md) |
| 수정 | `app/components/Footer.js` | [app/components/Footer.js](https://github.com/db-woman-2026/NextJsBlog_Steps/blob/step-20/app/components/Footer.js) |
| 수정 | `app/components/Header.js` | [app/components/Header.js](https://github.com/db-woman-2026/NextJsBlog_Steps/blob/step-20/app/components/Header.js) |
| 수정 | `app/globals.css` | [app/globals.css](https://github.com/db-woman-2026/NextJsBlog_Steps/blob/step-20/app/globals.css) |
| 수정 | `app/layout.js` | [app/layout.js](https://github.com/db-woman-2026/NextJsBlog_Steps/blob/step-20/app/layout.js) |
| 수정 | `package.json` | [package.json](https://github.com/db-woman-2026/NextJsBlog_Steps/blob/step-20/package.json) |
| 생성 | `postcss.config.mjs` | [postcss.config.mjs](https://github.com/db-woman-2026/NextJsBlog_Steps/blob/step-20/postcss.config.mjs) |
| 자동 변경 | `package-lock.json` | npm 명령으로 자동 갱신 |

문서 파일은 이 강의 자료에서 별도로 관리하므로 위 표에는 기능 구현에 필요한 코드와 설정 파일만 넣었습니다.

## 코드 작성

아래 순서대로 파일을 만들거나 수정합니다. 각 코드 블록은 해당 단계 브랜치의 실제 파일 내용을 기준으로 합니다.

### 1. README.md

기존 `README.md` 파일을 열고 아래 최종 코드와 같게 수정합니다.

저장소 첫 화면에서 프로젝트 목적, 실행 방법, 단계 흐름을 설명하는 문서입니다.

````markdown
# NextJsBlog_Steps

초급 개발자 교육용 Next.js 블로그 프로젝트를 단계별 브랜치로 나눈 저장소입니다.

`main`은 `create-next-app` 직후의 기본 프로젝트 상태입니다. `step-1`부터는 이전 단계 위에 코드를 누적해서 실습합니다. `step-9`는 기본 블로그 기능의 마무리이고, `step-10`부터는 기능 확장 단계입니다.

## Branch Flow

| 브랜치 | 내용 |
| --- | --- |
| `main` | Next.js 기본 프로젝트 생성 상태 |
| `step-1` | App Router 기본 페이지, Header, Footer, nav 구성 |
| `step-2` | `simpledotcss`, 전역 스타일, About 이미지, 이미지 도메인 설정 |
| `step-3` | MongoDB 연결, 환경 변수 예시, 게시글 데이터 함수 |
| `step-4` | 게시글 목록/작성/단건조회/수정 API Route와 통일된 응답 형식 |
| `step-5` | 홈 화면 게시글 목록과 `/detail/[id]` 상세 읽기 화면 |
| `step-6` | 새 게시글 작성 form과 POST 요청 |
| `step-7` | 상세 화면에서 진입하는 게시글 수정 form과 PUT 요청 |
| `step-8` | Contact mockup form |
| `step-9` | README 정리, 불필요한 기본 파일 제거, 최종 기본 기능 |
| `step-10` | 입력값 검증 강화와 서버 오류 메시지 표시 |
| `step-11` | 제출 중 상태와 작성/수정 후 상세 페이지 이동 |
| `step-12` | 작성일과 수정일 표시 |
| `step-13` | 삭제 기능 |
| `step-14` | 클라이언트 필터 검색 |
| `step-15` | 서버 검색 |
| `step-16` | 페이지네이션 |
| `step-17` | 정렬 기능 |
| `step-18` | Not Found와 Error UI 개선 |
| `step-19` | 카테고리 |
| `step-20` | `simpledotcss` 제거, Tailwind CSS v4 설치, 공통 layout/nav/footer 정리 |

전체 단계 개요는 `/docs/overview/index.md`에 있고, 실습형 강의 자료는 `/docs/lecture/index.md`와 `/docs/lecture/step-N.md`에 있습니다.

## Stack

- Next.js 16
- React 19
- MongoDB Node.js Driver 7
- ESLint 9 flat config
- Tailwind CSS v4

## Getting Started

의존성을 설치합니다.

```bash
npm install
```

환경 변수 예시 파일을 복사합니다.

```bash
cp .env.example .env.local
```

로컬 MongoDB를 사용한다면 `.env.local`을 다음처럼 둡니다.

```txt
MONGODB_URI=mongodb://localhost:27017/blog
MONGODB_DB=blog
```

개발 서버를 실행합니다.

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 엽니다.

## Routes

| 주소 | 역할 |
| --- | --- |
| `/` | 게시글 목록 |
| `/detail/[id]` | 게시글 상세 |
| `/post` | 게시글 작성 |
| `/post/[id]` | 게시글 수정 |
| `/about` | 소개 페이지 |
| `/contact` | Contact mockup form |
| `/api/post` | 게시글 목록/작성 API |
| `/api/post/[id]` | 게시글 단건 조회/수정/삭제 API |

## API Response Format

모든 API 응답은 같은 최상위 필드를 사용합니다.

```json
{
  "success": true,
  "message": "Posts fetched successfully",
  "data": []
}
```

오류도 같은 형식으로 반환합니다.

```json
{
  "success": false,
  "message": "Post not found",
  "data": null
}
```

| Method | 주소 | 요청 데이터 | 성공 시 `data` |
| --- | --- | --- | --- |
| `GET` | `/api/post` | query string: `keyword`, `page`, `limit`, `sort`, `category` | `{ posts, pagination }` |
| `POST` | `/api/post` | `{ title, content, image?, category? }` | `{ postId }` |
| `GET` | `/api/post/[id]` | URL의 `id` | 게시글 하나 |
| `PUT` | `/api/post/[id]` | URL의 `id`, `{ title, content, category? }` | `{ postId }` |
| `DELETE` | `/api/post/[id]` | URL의 `id` | `{ postId }` |

## Useful Commands

```bash
npm run lint
npm run build
```

`lint`는 코드 규칙을 확인하고, `build`는 실제 배포용 빌드가 가능한지 확인합니다.

## Notes For Beginners

- 페이지 라우트는 `app` 폴더의 `page.js` 파일로 만듭니다.
- API 라우트는 `app/api` 폴더의 `route.js` 파일로 만듭니다.
- API 응답은 `lib/apiResponse.js`의 `apiSuccess`, `apiError`로 통일합니다.
- MongoDB 연결은 `lib/mongodb.js`에 있습니다.
- 게시글 데이터 함수는 `lib/posts.js`에 있습니다.
- 클라이언트 컴포넌트에서 MongoDB를 직접 import하지 않습니다.
- 첫 `/api/post` 요청은 `posts` 컬렉션이 비어 있으면 샘플 게시글 10개를 넣습니다.
- Contact form은 실제 메일을 보내지 않는 mockup입니다.
````

### 2. app/components/Footer.js

기존 `app/components/Footer.js` 파일을 열고 아래 최종 코드와 같게 수정합니다.

이 단계의 결과와 맞도록 파일 내용을 정리합니다.

```jsx
export default function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-white px-4 py-6 text-center text-sm text-zinc-500">
      &copy; 2026 News Website. All rights reserved.
    </footer>
  );
}
```

### 3. app/components/Header.js

기존 `app/components/Header.js` 파일을 열고 아래 최종 코드와 같게 수정합니다.

이 단계의 결과와 맞도록 파일 내용을 정리합니다.

```jsx
import Link from "next/link";

const navigationItems = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/post", label: "Post" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  return (
    <header className="border-b border-zinc-200 bg-white">
      <nav className="mx-auto flex min-h-16 w-full max-w-5xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <Link className="text-base font-semibold text-zinc-950" href="/">
          NextJsBlog
        </Link>
        <ul className="flex flex-wrap items-center gap-1">
          {navigationItems.map((item) => (
            <li key={item.href}>
              <Link
                className="rounded-md px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 hover:text-zinc-950"
                href={item.href}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
```

### 4. app/globals.css

기존 `app/globals.css` 파일을 열고 아래 최종 코드와 같게 수정합니다.

전역 스타일 파일입니다. 모든 페이지에 공통으로 적용되는 CSS 또는 Tailwind import를 둡니다.

```css
@import "tailwindcss";
```

### 5. app/layout.js

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
      <body className="min-h-screen bg-zinc-50 text-zinc-900 antialiased">
        <div className="flex min-h-screen flex-col">
          <Header />
          <div className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
            {children}
          </div>
          <Footer />
        </div>
      </body>
    </html>
  );
}
```

### 6. package.json

기존 `package.json` 파일을 열고 아래 최종 코드와 같게 수정합니다.

프로젝트 의존성과 실행 스크립트를 관리합니다. 직접 손으로 lock 파일을 고치지 말고 npm 명령으로 갱신합니다.

```json
{
  "name": "nextjsblog-steps",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint"
  },
  "dependencies": {
    "mongodb": "^7.4.0",
    "next": "16.2.10",
    "react": "19.2.4",
    "react-dom": "19.2.4"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4.3.2",
    "eslint": "^9",
    "eslint-config-next": "16.2.10",
    "postcss": "^8.5.16",
    "tailwindcss": "^4.3.2"
  }
}
```

### 7. postcss.config.mjs

새 파일 `postcss.config.mjs`을 만들고 아래 내용을 입력합니다.

Tailwind CSS v4를 Next.js 빌드 과정에 연결하는 PostCSS 설정입니다.

```js
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;
```

## 실행 확인

기본 확인 명령은 다음과 같습니다.

```bash
npm run lint
npm run build
npm run dev
```

화면과 기능은 다음 순서로 확인합니다.

- npm run dev를 재시작합니다.
- Header, layout, Footer가 Tailwind class로 정리된 기본 화면을 확인합니다.

## 자주 확인할 부분

- 파일 이름과 폴더 이름을 정확히 입력합니다. App Router에서는 `page.js`, `layout.js`, `route.js`, `not-found.js`, `error.js` 같은 파일명이 특별한 의미를 가집니다.
- 클라이언트 상태나 이벤트를 쓰는 파일에는 필요한 경우에만 `"use client";`를 둡니다. 서버에서 실행되어야 하는 MongoDB 코드는 클라이언트 컴포넌트로 가져오지 않습니다.
- API 응답은 가능한 한 `{ success, message, data }` 구조를 유지합니다. 화면 코드는 이 구조를 기준으로 `message`와 `data`를 읽습니다.
- 실습 중 막히면 먼저 이 문서의 코드 블록과 브랜치 링크의 실제 파일을 비교합니다.

## 개념 정리

아래 내용은 기존 단계 개요를 강의 문서 안에서도 바로 볼 수 있도록 가져온 것입니다. 코드 작성 후 다시 읽으면 각 변경의 이유를 확인하기 쉽습니다.

이번 단계부터는 `simpledotcss`를 벗어나 Tailwind CSS v4를 사용합니다.

목표는 화려한 디자인이 아닙니다. CSS 자체를 깊게 배우기보다, 실무에서 자주 쓰는 스타일링 라이브러리를 프로젝트에 붙이고 작은 단위로 화면을 정리하는 흐름을 익히는 것이 목적입니다.

## 이번 단계에서 하는 일

- `simpledotcss` 패키지를 제거한다.
- Tailwind CSS v4와 PostCSS 플러그인을 설치한다.
- `postcss.config.mjs`를 만든다.
- `app/globals.css`에서 Tailwind CSS를 import한다.
- 공통 layout, nav, footer에만 Tailwind utility class를 적용한다.

기능 페이지의 세부 UI는 아직 크게 바꾸지 않습니다. 이 단계의 완성 기준은 "Tailwind가 프로젝트에 정상 적용되고, 모든 페이지가 같은 공통 shell 안에서 보인다"입니다.

## 왜 simpledotcss를 제거하는가

`simpledotcss`는 HTML 태그만으로도 기본 화면을 빠르게 정돈해주는 장점이 있습니다. 초반 단계에서는 라우팅, API, 데이터 흐름에 집중하기 좋았습니다.

하지만 프로젝트가 커지면 특정 영역만 원하는 방식으로 세밀하게 조정해야 합니다. 예를 들어 nav 높이, 버튼 색상, 카드 간격, form 입력칸 상태 등을 화면마다 다르게 조절하고 싶어집니다.

Tailwind CSS는 다음과 같은 방식으로 이 문제를 해결합니다.

```jsx
<button className="rounded-md bg-zinc-900 px-4 py-2 text-white">
  Save
</button>
```

별도의 CSS 파일에 class를 만들지 않고, JSX에서 필요한 스타일을 utility class로 조합합니다.

## 설치

먼저 기존 `simpledotcss`를 제거합니다.

```bash
npm uninstall simpledotcss
```

그리고 Tailwind CSS v4와 PostCSS 플러그인을 설치합니다.

```bash
npm install -D tailwindcss @tailwindcss/postcss postcss
```

Tailwind CSS v4에서는 기본적인 Next.js 프로젝트라면 별도의 `tailwind.config.js` 없이 시작할 수 있습니다.

## PostCSS 설정

프로젝트 루트에 `postcss.config.mjs`를 만듭니다.

```js
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;
```

Next.js는 CSS를 빌드할 때 PostCSS 설정을 읽습니다. 이 설정을 통해 Tailwind CSS가 `globals.css`의 Tailwind import를 실제 CSS로 변환할 수 있습니다.

## globals.css 변경

기존에는 `simpledotcss`를 import했습니다.

```css
@import "simpledotcss/simple.min.css";
```

이제 Tailwind CSS를 import합니다.

```css
@import "tailwindcss";
```

이 한 줄이 Tailwind의 기본 스타일과 utility class 생성을 시작하는 출발점입니다.

## layout에 공통 화면 폭 적용

`app/layout.js`는 모든 페이지를 감싸는 최상위 layout입니다.

```jsx
<body className="min-h-screen bg-zinc-50 text-zinc-900 antialiased">
  <div className="flex min-h-screen flex-col">
    <Header />
    <div className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
      {children}
    </div>
    <Footer />
  </div>
</body>
```

주요 class의 의미는 다음과 같습니다.

| class | 의미 |
| --- | --- |
| `min-h-screen` | 화면 높이만큼 최소 높이를 확보합니다. |
| `bg-zinc-50` | 아주 옅은 회색 배경을 적용합니다. |
| `text-zinc-900` | 기본 글자색을 진한 회색으로 맞춥니다. |
| `antialiased` | 글자가 조금 더 부드럽게 보이도록 합니다. |
| `flex min-h-screen flex-col` | Header, 본문, Footer를 세로로 배치합니다. |
| `flex-1` | 본문 영역이 남은 높이를 채우게 합니다. |
| `mx-auto w-full max-w-5xl` | 본문을 가운데 정렬하고 최대 폭을 제한합니다. |
| `px-4 py-8` | 모바일 기준 안쪽 여백을 줍니다. |
| `sm:px-6 lg:px-8` | 화면이 넓어질수록 좌우 여백을 조금 키웁니다. |

## Header 정리

기존 Header는 `simpledotcss`가 `nav`, `ul`, `a` 태그를 알아서 꾸며줬습니다. 이제는 필요한 class를 직접 붙입니다.

```jsx
<header className="border-b border-zinc-200 bg-white">
  <nav className="mx-auto flex min-h-16 w-full max-w-5xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
    <Link className="text-base font-semibold text-zinc-950" href="/">
      NextJsBlog
    </Link>
    <ul className="flex flex-wrap items-center gap-1">
      ...
    </ul>
  </nav>
</header>
```

Header에서 특히 중요한 부분은 `min-h-16`입니다. nav 내부 콘텐츠가 적어도 일정 높이를 확보하므로 페이지별로 nav 높이가 흔들리는 문제를 줄일 수 있습니다.

## Footer 정리

Footer도 공통 layout에 맞게 간단히 정리합니다.

```jsx
<footer className="border-t border-zinc-200 bg-white px-4 py-6 text-center text-sm text-zinc-500">
  &copy; 2026 News Website. All rights reserved.
</footer>
```

## 이번 단계에서 일부러 하지 않는 일

- 홈 목록 카드 디자인을 완성하지 않는다.
- 작성/수정 form 디자인을 완성하지 않는다.
- Error, Not Found 화면을 완성하지 않는다.
- Tailwind theme 커스터마이징을 하지 않는다.

한 번에 많은 화면을 바꾸면 Tailwind 설치 문제와 UI 변경 문제를 구분하기 어렵습니다. 그래서 이번 단계는 공통 shell까지만 다룹니다.

## 확인 방법

```bash
npm run lint
npm run build
```

개발 서버를 실행한 뒤 `/`, `/about`, `/post`, `/contact`를 열어 Header와 Footer가 모든 페이지에서 같은 폭과 높이로 보이는지 확인합니다.

```bash
npm run dev
```

## 체크리스트

1. `package.json`에서 `simpledotcss`가 제거됐는지 확인한다.
2. `tailwindcss`, `@tailwindcss/postcss`, `postcss`가 devDependencies에 들어갔는지 확인한다.
3. `postcss.config.mjs`가 있는지 확인한다.
4. `app/globals.css`가 `@import "tailwindcss";`만 import하는지 확인한다.
5. Header, 본문, Footer가 공통 폭 안에서 정렬되는지 확인한다.

다음 단계에서는 홈 목록과 상세 화면을 Tailwind utility class로 정리합니다.
