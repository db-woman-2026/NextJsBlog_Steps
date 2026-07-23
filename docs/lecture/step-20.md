# Step 20. Tailwind CSS v4 설치와 공통 layout 정리

## 변경 내용

simpledotcss를 제거하고 Tailwind CSS v4를 설치한 뒤 공통 layout, nav, footer에 기본 utility class를 적용합니다.

- simpledotcss를 제거하고 Tailwind CSS v4와 PostCSS 설정을 추가합니다.
- 전역 CSS를 Tailwind import 중심으로 바꿉니다.
- 공통 layout, Header, Footer에 Tailwind utility class를 적용합니다.

## 시작 전 확인

개인 실습 저장소의 `main`에서 직전 단계까지 마친 상태로 시작합니다. 코드 블록은 복사해 붙이지 않고 직접 입력합니다.

수정 전에 `git status --short`의 출력이 없는지 확인합니다. 변경이 남아 있다면 원인을 확인하고 시작 상태를 정리합니다.

## 작업 1. Tailwind CSS v4 설치와 패키지 정리

화면 스타일링 방식을 simpledotcss에서 Tailwind utility class로 바꿉니다. 패키지 명령을 먼저 실행하고, PostCSS 설정 파일과 전역 CSS는 직접 작성합니다.

### 수정할 파일

- 생성: `postcss.config.mjs`
- 수정: `app/globals.css`

### 명령으로 자동 변경되는 파일

- 수정: `package.json`
- 수정: `package-lock.json`

위 파일들은 명령 실행 결과만 확인하며 직접 입력하지 않습니다.

### 먼저 실행

> Windows 11에서는 [환경 준비](../windows-11.md)를 먼저 확인합니다. `git`, `node`, `npm.cmd` 명령은 PowerShell에서도 같습니다. `npm.ps1` 오류가 나면 `npm.cmd`를 사용합니다.

```powershell
npm.cmd uninstall simpledotcss
npm.cmd install -D tailwindcss@4.3.2 @tailwindcss/postcss@4.3.2 postcss@8.5.22
```

위 명령은 `package.json`, `package-lock.json`, `node_modules`를 함께 갱신합니다. `Cannot find module '@tailwindcss/postcss'` 오류가 나오면 설치 명령이 성공했는지 확인한 뒤 `npm.cmd install`을 다시 실행합니다.

### 입력할 코드

아래 파일 경로를 확인하고 각 파일의 전체 내용을 입력합니다. 삭제로 표시된 파일은 PowerShell에서 제거합니다.

#### `app/globals.css`

`app/globals.css`를 열고 파일 전체를 다음 내용으로 맞춥니다.

~~~css
@import "tailwindcss";
~~~

#### `postcss.config.mjs`

`postcss.config.mjs`를 열고 파일 전체를 다음 내용으로 맞춥니다.

~~~js
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;
~~~

### 설명과 확인

- Tailwind v4에서는 이 프로젝트 기준으로 별도 `tailwind.config.js` 없이 시작합니다.
- `postcss.config.mjs`는 Tailwind PostCSS 플러그인을 Next.js 빌드에 연결합니다.
- `package.json`과 `package-lock.json`은 npm 명령이 자동 갱신하므로 수동으로 입력하지 않습니다.

## 작업 2. 공통 layout에 화면 폭과 배경 적용

모든 페이지가 같은 최대 폭과 배경색 안에서 보이도록 `app/layout.js`의 body 구조를 정리합니다. Header, 본문, Footer를 세로 flex 구조로 배치합니다.

### 수정할 파일

- 수정: `app/layout.js`

### 입력할 코드

아래 파일 경로를 확인하고 각 파일의 전체 내용을 입력합니다. 삭제로 표시된 파일은 PowerShell에서 제거합니다.

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
~~~

### 설명과 확인

- `flex-1`은 본문이 남은 높이를 채우게 합니다.
- `max-w-5xl`은 이후 카드형 목록과 form이 너무 넓어지지 않게 제한합니다.

## 작업 3. Header와 Footer를 Tailwind class로 정리

simpledotcss가 자동으로 꾸며주던 nav 스타일을 직접 utility class로 작성합니다. 메뉴 항목은 배열로 분리해 반복 렌더링합니다.

### 수정할 파일

- 수정: `app/components/Header.js`
- 수정: `app/components/Footer.js`

### 입력할 코드

아래 파일 경로를 확인하고 각 파일의 전체 내용을 입력합니다. 삭제로 표시된 파일은 PowerShell에서 제거합니다.

#### `app/components/Footer.js`

`app/components/Footer.js`를 열고 파일 전체를 다음 내용으로 맞춥니다.

~~~js
export default function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-white px-4 py-6 text-center text-sm text-zinc-500">
      &copy; 2026 News Website. All rights reserved.
    </footer>
  );
}
~~~

#### `app/components/Header.js`

`app/components/Header.js`를 열고 파일 전체를 다음 내용으로 맞춥니다.

~~~js
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
~~~

### 설명과 확인

- Header의 `navigationItems`는 링크가 늘어날 때 JSX 반복을 줄입니다.
- Footer는 얇은 border와 작은 텍스트로 공통 shell에 맞춥니다.

## 실행 확인

기본 정적 검사는 다음 명령으로 확인합니다.

```powershell
npm.cmd run lint
npm.cmd run build
```

브라우저 확인이 필요하면 개발 서버를 켠 뒤 해당 화면을 확인합니다.

```powershell
npm.cmd run dev
```

체크할 내용은 다음과 같습니다.

- `npm.cmd run build`가 Tailwind/PostCSS 설정 오류 없이 통과한다.
- Header, 본문, Footer가 같은 최대 폭 기준으로 정렬된다.

## 독립 확인

Tailwind 설치 전후 `package.json`과 PostCSS 설정을 비교합니다. 결과와 확인 방법을 한 문장으로 기록합니다. 실험값은 검사를 마치면 원래대로 복구합니다.

## 마무리 확인

- 각 작업 단위의 설명과 파일 경로를 먼저 확인합니다.
- 코드 블록은 해당 파일의 일부가 아니라 현재 단계에서 사용할 전체 내용입니다.

## 저장소에 기록하기

실험용 변경을 모두 복구한 뒤 검사 결과와 코드 변경을 함께 확인합니다.

```powershell
git branch --show-current
git status --short
npm.cmd run lint
npm.cmd run build
git add .
git commit -m "Complete Next.js step 20"
git push
git status --short --branch
```

현재 브랜치는 `main`이어야 합니다. 마지막 상태에서 `main...origin/main` 뒤에 `ahead`가 없고 작업 파일 목록도 비어 있어야 합니다.
