# Step 1. App Router와 기본 페이지 껍데기 만들기

## 변경 내용

App Router의 기본 라우팅을 익히기 위해 Home, About, Post, Contact 페이지와 공통 Header/Footer를 만듭니다.

- create-next-app 기본 화면을 블로그 실습용 홈 화면으로 바꿉니다.
- `/about`, `/post`, `/contact` 라우트가 생기도록 각 폴더에 `page.js`를 추가합니다.
- 모든 화면에 공통으로 보이는 Header/Footer를 `app/layout.js`에 연결합니다.

## 시작 전 확인

환경 준비에서 직접 만든 `nextjs-blog` 프로젝트를 첫 commit하고 GitHub에 push한 상태로 시작합니다. 개인 저장소의 `main`에서 코드 전체를 직접 입력합니다.

> Windows 11에서는 [환경 준비](../windows-11.md) <span class="print-reference" data-print-reference="true">(인쇄본 위치: Next.js · 장 「Windows 11 x64 실습 환경 준비」 · 절 「1. Windows Terminal 설치」)</span>를 먼저 확인합니다. 명령은 이 교재의 PowerShell 코드 블록에 적힌 `git`, `node`, `npm` 형태를 그대로 사용합니다.

```powershell
Set-Location "$HOME\dongbu\nextjs-blog"
git status
```

현재 branch는 `main`이고 저장하지 않은 변경 파일은 없어야 합니다.

## 작업 1. 기본 화면과 전역 레이아웃 정리

먼저 Next.js 기본 예제 화면을 제거하고, 블로그 프로젝트에서 계속 사용할 전역 레이아웃과 기본 스타일을 만듭니다. `layout.js`의 `{children}` 자리는 현재 URL에 맞는 페이지가 들어오는
위치입니다.

### 수정할 파일

- 수정: `.gitignore`
- 수정: `app/layout.js`
- 수정: `app/page.js`
- 수정: `app/globals.css`
- 삭제: `app/page.module.css`

### 먼저 실행

```powershell
Remove-Item -LiteralPath 'app/page.module.css'
```

### 입력할 코드

아래 파일 경로를 확인하고 각 파일의 전체 내용을 입력합니다. 삭제로 표시된 파일은 PowerShell에서 제거합니다.

#### `.gitignore`

`.gitignore`를 열고 파일 전체를 다음 내용으로 맞춥니다.

~~~text
# See https://help.github.com/articles/ignoring-files/ for more about ignoring files.

# dependencies
/node_modules
/.pnp
.pnp.*
.yarn/*
!.yarn/patches
!.yarn/plugins
!.yarn/releases
!.yarn/versions

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
.idea/
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.pnpm-debug.log*

# env files (can opt-in for committing if needed)
.env*

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts
.obsidian/
~~~

#### `app/globals.css`

`app/globals.css`를 열고 파일 전체를 다음 내용으로 맞춥니다.

~~~css
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
~~~

#### `app/layout.js`

`app/layout.js`를 열고 파일 전체를 다음 내용으로 맞춥니다.

~~~js
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
~~~

#### `app/page.js`

`app/page.js`를 열고 파일 전체를 다음 내용으로 맞춥니다.

~~~js
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
~~~

### 설명과 확인

- `app/page.module.css`는 기본 홈 화면에서만 쓰던 CSS module이므로 삭제합니다.
- `app/layout.js`는 모든 페이지의 공통 틀입니다. Header와 Footer는 뒤의 작업에서 만든 뒤 import합니다.
- `.obsidian/`은 개인 문서 도구 폴더가 Git에 올라가지 않도록 무시합니다.

## 작업 2. Header와 Footer 컴포넌트 추가

페이지마다 메뉴를 반복해서 작성하지 않도록 공통 컴포넌트를 만듭니다. 내부 이동은 새로고침 없는 페이지 전환을 위해 `next/link`의 `Link`를 사용합니다.

### 수정할 파일

- 생성: `app/components/Header.js`
- 생성: `app/components/Footer.js`

### 입력할 코드

아래 파일 경로를 확인하고 각 파일의 전체 내용을 입력합니다. 삭제로 표시된 파일은 PowerShell에서 제거합니다.

#### `app/components/Footer.js`

`app/components/Footer.js`를 열고 파일 전체를 다음 내용으로 맞춥니다.

~~~js
export default function Footer() {
  return <footer>&copy; 2026 News Website. All rights reserved.</footer>;
}
~~~

#### `app/components/Header.js`

`app/components/Header.js`를 열고 파일 전체를 다음 내용으로 맞춥니다.

~~~js
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
~~~

### 설명과 확인

- `Header`의 링크는 새 라우트(`/`, `/about`, `/post`, `/contact`)와 정확히 맞아야 합니다.
- Footer에는 단순한 문구만 둡니다.

## 작업 3. About, Post, Contact 페이지 껍데기 추가

App Router에서는 폴더 안의 `page.js`가 실제 URL을 만듭니다. 아직 데이터 저장이나 form 동작은 만들지 않고, 각 주소가 열리는지 확인할 수 있는 화면 껍데기만 둡니다.

### 수정할 파일

- 생성: `app/about/page.js`
- 생성: `app/post/page.js`
- 생성: `app/contact/page.js`

### 입력할 코드

아래 파일 경로를 확인하고 각 파일의 전체 내용을 입력합니다. 삭제로 표시된 파일은 PowerShell에서 제거합니다.

#### `app/about/page.js`

`app/about/page.js`를 열고 파일 전체를 다음 내용으로 맞춥니다.

~~~js
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
~~~

#### `app/contact/page.js`

`app/contact/page.js`를 열고 파일 전체를 다음 내용으로 맞춥니다.

~~~js
export default function ContactPage() {
  return (
    <main>
      <h1>Contact Us</h1>
      <p>The contact form will be added in a later step.</p>
    </main>
  );
}
~~~

#### `app/post/page.js`

`app/post/page.js`를 열고 파일 전체를 다음 내용으로 맞춥니다.

~~~js
export default function NewPostPage() {
  return (
    <main>
      <h1>Create New Post</h1>
      <p>The post form will be added after the data and API layers are ready.</p>
    </main>
  );
}
~~~

### 설명과 확인

- `app/about/page.js`는 `/about`, `app/post/page.js`는 `/post`, `app/contact/page.js`는 `/contact`가 됩니다.
- `/post`와 `/contact`는 form을 붙일 빈 화면으로 둡니다.

## 독립 확인

diff를 보지 않고 `/about`의 설명 문장 하나를 본인 확인 문장으로 바꿉니다. 브라우저에서 결과를 확인하고 검사용 변경이면 원래 문장으로 복구합니다.

## 실행 확인

기본 정적 검사는 다음 명령으로 확인합니다.

```powershell
npm run lint
npm run build
```

브라우저 확인이 필요하면 개발 서버를 켠 뒤 해당 화면을 확인합니다.

```powershell
npm run dev
```

체크할 내용은 다음과 같습니다.

- `/`, `/about`, `/post`, `/contact`가 모두 열린다.
- 모든 페이지 위에는 Header, 아래에는 Footer가 보인다.

## 마무리 확인

- 각 작업 단위의 설명과 파일 경로를 먼저 확인합니다.
- 코드 블록은 해당 파일의 일부가 아니라 현재 단계에서 사용할 전체 내용입니다.

## 저장소에 기록하기

실험용 변경을 모두 복구한 뒤 검사 결과와 코드 변경을 함께 확인합니다.

```powershell
git branch --show-current
git status --short
npm run lint
npm run build
git add .
git commit -m "Complete Next.js step 1"
git push
git status --short --branch
```

현재 브랜치는 `main`이어야 합니다. 마지막 상태에서 `main...origin/main` 뒤에 `ahead`가 없고 작업 파일 목록도 비어 있어야 합니다.
