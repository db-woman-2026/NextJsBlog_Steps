# Step 20. Tailwind CSS v4 설치와 공통 layout 정리

스타일링 체계를 `simpledotcss`에서 Tailwind CSS v4로 전환합니다.

기능은 유지하고 Tailwind 설치, PostCSS 연결, 공통 layout 변환 결과를 차례로 확인합니다.

## 변경 내용

- `simpledotcss` 패키지를 제거한다.
- Tailwind CSS v4와 PostCSS 플러그인을 설치한다.
- `postcss.config.mjs`를 만든다.
- `app/globals.css`에서 Tailwind CSS를 import한다.
- 공통 layout, nav, footer에만 Tailwind utility class를 적용한다.

기능 페이지의 세부 UI는 바꾸지 않습니다. Tailwind가 적용되고 모든 페이지가 같은 공통 shell 안에 보이는지 확인합니다.

## 왜 simpledotcss를 제거하는가

`simpledotcss`는 HTML 태그만으로도 기본 화면을 빠르게 정돈합니다. 기존 화면에서는 별도 class 없이 라우팅, API, 데이터 흐름을 확인했습니다.

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

> Windows 11에서는 [환경 준비](../windows-11.md) <span class="print-reference" data-print-reference="true">(인쇄본 위치: Next.js · 장 「Windows 11 x64 실습 환경 준비」 · 절 「1. Windows Terminal 설치」)</span>를 먼저 확인합니다. 명령은 이 교재의 PowerShell 코드 블록에 적힌 `git`, `node`, `npm` 형태를 그대로 사용합니다.

```powershell
npm uninstall simpledotcss
```

그리고 Tailwind CSS v4와 PostCSS 플러그인을 설치합니다.

```powershell
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

이 한 줄로 Tailwind의 기본 스타일과 utility class 생성을 시작합니다.

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

Header의 `min-h-16`은 nav 콘텐츠의 최소 높이를 확보해 페이지별 높이가 달라지는 현상을 줄입니다.

## Footer 정리

Footer도 공통 layout에 맞게 간단히 정리합니다.

```jsx
<footer className="border-t border-zinc-200 bg-white px-4 py-6 text-center text-sm text-zinc-500">
  &copy; 2026 News Website. All rights reserved.
</footer>
```

## 변경 범위

- 홈 목록 카드 디자인을 완성하지 않는다.
- 작성/수정 form 디자인을 완성하지 않는다.
- Error, Not Found 화면을 완성하지 않는다.
- Tailwind theme 커스터마이징을 하지 않는다.

한 번에 많은 화면을 바꾸면 Tailwind 설치 문제와 UI 변경 문제를 구분하기 어렵습니다. 공통 shell까지만 바꿉니다.

## 결과 확인

```powershell
npm run lint
npm run build
```

개발 서버를 실행한 뒤 `/`, `/about`, `/post`, `/contact`를 열어 Header와 Footer가 모든 페이지에서 같은 폭과 높이로 보이는지 확인합니다.

```powershell
npm run dev
```

## 체크리스트

1. `package.json`에서 `simpledotcss`가 제거됐는지 확인한다.
2. `tailwindcss`, `@tailwindcss/postcss`, `postcss`가 devDependencies에 들어갔는지 확인한다.
3. `postcss.config.mjs`가 있는지 확인한다.
4. `app/globals.css`가 `@import "tailwindcss";`만 import하는지 확인한다.
5. Header, 본문, Footer가 공통 폭 안에서 정렬되는지 확인한다.
