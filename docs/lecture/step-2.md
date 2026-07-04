# Step 2. simpledotcss와 이미지 설정으로 화면 정돈하기

이 문서는 `step-1`에서 시작해 `step-2`를 완성하는 실습 자료입니다.
원본 개요는 [docs/overview/step-2.md](../overview/step-2.md)에 보존되어 있습니다.
실제 완성 코드는 [step-2 브랜치](https://github.com/db-woman-2026/NextJsBlog_Steps/tree/step-2) 기준입니다.

## 이번 단계 목표

simpledotcss와 next/image를 적용해 기본 화면을 정돈하고 외부 이미지 도메인 설정을 추가합니다.

이번 단계에서 집중할 내용은 다음과 같습니다.

- simpledotcss를 설치해 기본 HTML 태그만으로 읽기 쉬운 화면을 만듭니다.
- next/image를 사용해 이미지 크기와 최적화 규칙을 명확히 둡니다.
- 외부 이미지 도메인을 next.config.mjs에 허용합니다.

## 시작 기준

이전 단계인 `step-1` 브랜치까지 완료된 상태에서 시작합니다.

```bash
git switch step-1
# 실습용 브랜치를 직접 만들 경우
git switch -c practice-step-2
```

수업 저장소의 정답 브랜치를 바로 확인하려면 다음 명령을 사용할 수 있습니다.

```bash
git switch step-2
```

## 패키지 명령

이 단계에서는 의존성이 바뀝니다. 먼저 아래 명령을 실행합니다.

```bash
npm install simpledotcss
```

`package-lock.json`은 npm 명령이 자동으로 갱신합니다. 직접 타이핑하지 않습니다.

## 수정 파일

| 상태 | 파일 | 확인 링크 |
| --- | --- | --- |
| 수정 | `app/about/page.js` | [app/about/page.js](https://github.com/db-woman-2026/NextJsBlog_Steps/blob/step-2/app/about/page.js) |
| 수정 | `app/globals.css` | [app/globals.css](https://github.com/db-woman-2026/NextJsBlog_Steps/blob/step-2/app/globals.css) |
| 수정 | `next.config.mjs` | [next.config.mjs](https://github.com/db-woman-2026/NextJsBlog_Steps/blob/step-2/next.config.mjs) |
| 수정 | `package.json` | [package.json](https://github.com/db-woman-2026/NextJsBlog_Steps/blob/step-2/package.json) |
| 자동 변경 | `package-lock.json` | npm 명령으로 자동 갱신 |

문서 파일은 이 강의 자료에서 별도로 관리하므로 위 표에는 기능 구현에 필요한 코드와 설정 파일만 넣었습니다.

## 코드 작성

아래 순서대로 파일을 만들거나 수정합니다. 각 코드 블록은 해당 단계 브랜치의 실제 파일 내용을 기준으로 합니다.

### 1. app/about/page.js

기존 `app/about/page.js` 파일을 열고 아래 최종 코드와 같게 수정합니다.

이 단계의 결과와 맞도록 파일 내용을 정리합니다.

```jsx
import Image from "next/image";

export default function AboutPage() {
  return (
    <main>
      <h1>About Me</h1>
      <Image
        src="https://picsum.photos/id/1047/600/500"
        alt="Office building"
        width={600}
        height={500}
        priority
      />
      <p>
        Hello! My name is [Your Name]. I&apos;m a professional working in [Your
        Industry] based in [Your Location].
      </p>
      <p>
        Here&apos;s a photo of our office building where I spend most of my
        working hours.
      </p>
      <p>I am passionate about [Your Passion], and I enjoy [Your Hobbies].</p>
      <p>
        If you wish to reach out, please contact me at [Your Contact
        Information].
      </p>
    </main>
  );
}
```

### 2. app/globals.css

기존 `app/globals.css` 파일을 열고 아래 최종 코드와 같게 수정합니다.

전역 스타일 파일입니다. 모든 페이지에 공통으로 적용되는 CSS 또는 Tailwind import를 둡니다.

```css
@import "simpledotcss/simple.min.css";

body {
  min-height: 100vh;
}

body > header {
  align-self: start;
  padding: 1rem;
}

body > header > nav:only-child {
  margin-block-start: 0;
}

header nav {
  padding: 0;
  line-height: 1;
}

header nav a,
header nav a:visited {
  margin-bottom: 0;
}
```

### 3. next.config.mjs

기존 `next.config.mjs` 파일을 열고 아래 최종 코드와 같게 수정합니다.

Next.js 프로젝트 설정 파일입니다. 외부 이미지 도메인 같은 프레임워크 설정을 관리합니다.

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
    ],
  },
};

export default nextConfig;
```

### 4. package.json

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
    "next": "16.2.10",
    "react": "19.2.4",
    "react-dom": "19.2.4",
    "simpledotcss": "^2.3.7"
  },
  "devDependencies": {
    "eslint": "^9",
    "eslint-config-next": "16.2.10"
  }
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

- npm run dev를 재시작합니다.
- /about에서 외부 이미지가 보이는지 확인합니다.
- 터미널에 이미지 도메인 관련 오류가 없는지 확인합니다.

## 자주 확인할 부분

- 파일 이름과 폴더 이름을 정확히 입력합니다. App Router에서는 `page.js`, `layout.js`, `route.js`, `not-found.js`, `error.js` 같은 파일명이 특별한 의미를 가집니다.
- 클라이언트 상태나 이벤트를 쓰는 파일에는 필요한 경우에만 `"use client";`를 둡니다. 서버에서 실행되어야 하는 MongoDB 코드는 클라이언트 컴포넌트로 가져오지 않습니다.
- API 응답은 가능한 한 `{ success, message, data }` 구조를 유지합니다. 화면 코드는 이 구조를 기준으로 `message`와 `data`를 읽습니다.
- 실습 중 막히면 먼저 이 문서의 코드 블록과 브랜치 링크의 실제 파일을 비교합니다.

## 개념 정리

아래 내용은 기존 단계 개요를 강의 문서 안에서도 바로 볼 수 있도록 가져온 것입니다. 코드 작성 후 다시 읽으면 각 변경의 이유를 확인하기 쉽습니다.

## 이 단계의 목표

`step-2` 브랜치는 `step-1`에서 만든 라우팅 껍데기에 기본 스타일과 이미지를 더합니다.

이 단계에서 배우는 내용은 다음과 같습니다.

- npm 패키지를 설치하면 `package.json`과 `package-lock.json`이 바뀐다는 점을 확인한다.
- `simpledotcss`를 전역 CSS에서 import해 기본 HTML 태그를 빠르게 정돈한다.
- `next/image`를 사용해 이미지를 렌더링한다.
- 외부 이미지 도메인을 사용하려면 `next.config.mjs`에 허용 규칙을 추가해야 한다.

아직 데이터베이스나 API는 만들지 않습니다. 이 단계의 목적은 화면을 구성하는 기본 도구를 익히는 것입니다.

## 왜 simpledotcss를 사용하는가

초급자 프로젝트에서 CSS를 처음부터 많이 작성하면 핵심 학습 주제가 흐려질 수 있습니다.

이 블로그 실습의 핵심은 다음 흐름입니다.

```txt
페이지 만들기 -> 데이터 연결하기 -> API 만들기 -> 화면에서 API 호출하기
```

따라서 디자인은 최소화합니다. `simpledotcss`는 기본 HTML 태그에 읽기 좋은 스타일을 적용해주는 작은 CSS 라이브러리입니다. 별도의 컴포넌트 사용법을 배울 필요가 없고, `h1`, `p`, `form`, `button` 같은 태그를 그대로 쓰면 됩니다.

## 패키지 설치

다음 명령으로 패키지를 설치합니다.

```bash
npm install simpledotcss@^2.3.7
```

설치 후 `package.json`의 `dependencies`에 다음 항목이 추가됩니다.

```json
"simpledotcss": "^2.3.7"
```

`package-lock.json`도 함께 바뀝니다. `package-lock.json`은 실제 설치된 패키지 버전과 의존성 트리를 기록하는 파일입니다. 팀 프로젝트에서는 이 파일도 보통 Git에 함께 커밋합니다.

## globals.css 수정

`app/globals.css`를 다음처럼 단순하게 바꿉니다.

```css
@import "simpledotcss/simple.min.css";

body {
  min-height: 100vh;
}

body > header {
  align-self: start;
  padding: 1rem;
}

body > header > nav:only-child {
  margin-block-start: 0;
}

header nav {
  padding: 0;
  line-height: 1;
}

header nav a,
header nav a:visited {
  margin-bottom: 0;
}
```

첫 줄은 `node_modules` 안에 설치된 CSS 파일을 가져옵니다.

```css
@import "simpledotcss/simple.min.css";
```

이 한 줄 때문에 직접 작성했던 `nav`, `footer`, `main` 스타일 대부분이 필요 없어집니다. 이후 form, input, button도 기본적으로 보기 좋은 형태로 표시됩니다.

다만 `simpledotcss`는 `header`와 `nav`에도 기본 여백을 넣습니다. 이 프로젝트의 Header는 모든 페이지에서 같은 높이로 보여야 하므로, 전역 CSS에서 Header와 nav의 여백만 짧게 덮어씁니다.

## next/image를 사용하는 이유

일반 HTML에서는 이미지를 다음처럼 표시합니다.

```html
<img src="https://picsum.photos/id/1047/600/500" alt="Office building" />
```

Next.js에서는 이미지 최적화를 위해 `next/image`의 `Image` 컴포넌트를 사용할 수 있습니다.

```jsx
import Image from "next/image";
```

그리고 JSX 안에서는 다음처럼 사용합니다.

```jsx
<Image
  src="https://picsum.photos/id/1047/600/500"
  alt="Office building"
  width={600}
  height={500}
  priority
/>
```

`width`와 `height`를 지정하면 브라우저가 이미지가 차지할 공간을 미리 알 수 있습니다. 그래서 이미지가 늦게 로딩되어도 화면 배치가 크게 흔들리지 않습니다.

## 외부 이미지 도메인 허용

Next.js는 아무 외부 이미지나 자동으로 최적화하지 않습니다. 어떤 도메인의 이미지를 사용할지 `next.config.mjs`에 명시해야 합니다.

이 프로젝트는 `https://picsum.photos/...` 이미지를 사용하므로 다음 설정을 추가합니다.

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
    ],
  },
};

export default nextConfig;
```

이 설정이 없으면 개발 서버나 빌드 과정에서 외부 이미지 도메인이 허용되지 않았다는 오류가 날 수 있습니다.

## About 페이지 수정

`app/about/page.js`는 소개 페이지입니다. 이 단계에서는 텍스트만 있던 페이지에 이미지를 추가합니다.

```jsx
import Image from "next/image";

export default function AboutPage() {
  return (
    <main>
      <h1>About Me</h1>
      <Image
        src="https://picsum.photos/id/1047/600/500"
        alt="Office building"
        width={600}
        height={500}
        priority
      />
      <p>
        Hello! My name is [Your Name]. I&apos;m a professional working in [Your
        Industry] based in [Your Location].
      </p>
    </main>
  );
}
```

`I&apos;m`은 HTML에서 작은따옴표를 안전하게 표시하기 위한 표현입니다. JSX에서는 문자열 안의 특수 문자를 그대로 쓸 때 린트 규칙에 걸릴 수 있으므로 이런 HTML entity를 사용합니다.

## 직접 실습 순서

1. `npm install simpledotcss@^2.3.7`을 실행한다.
2. `package.json`에 `simpledotcss`가 추가됐는지 확인한다.
3. `app/globals.css` 맨 위에 `@import "simpledotcss/simple.min.css";`를 작성한다.
4. 기존에 직접 작성했던 메뉴/본문/푸터 스타일을 제거한다.
5. `app/about/page.js`에서 `Image`를 import한다.
6. 소개 페이지 본문 위에 `Image` 컴포넌트를 추가한다.
7. `next.config.mjs`에 `picsum.photos` 원격 이미지 허용 설정을 추가한다.
8. 개발 서버를 재시작한다.

## 개발 서버 재시작이 필요한 이유

`app/page.js` 같은 페이지 파일을 바꾸면 보통 개발 서버가 자동으로 반영합니다.

하지만 `next.config.mjs`는 Next.js 실행 설정입니다. 설정 파일을 바꾼 뒤에는 개발 서버를 껐다가 다시 켜는 습관을 들이는 것이 좋습니다.

```bash
npm run dev
```

## 확인할 화면

브라우저에서 다음 주소를 확인합니다.

```txt
http://localhost:3000/about
```

소개 페이지에 이미지와 소개 문장이 보이면 성공입니다.

또한 메뉴, 본문, 버튼 같은 기본 요소의 스타일이 `step-1`보다 정돈되어 보이는지 확인합니다.

## 검증 명령

```bash
npm run lint
npm run build
```

`build`가 통과하면 외부 이미지 설정도 정상적으로 반영된 것입니다.

## 자주 발생하는 실수

### CSS import 경로를 틀리는 경우

다음처럼 정확히 작성해야 합니다.

```css
@import "simpledotcss/simple.min.css";
```

패키지 이름은 `simpledotcss`이고, CSS 파일 경로는 `simple.min.css`입니다.

### Image import를 빼먹는 경우

`<Image />`를 쓰려면 반드시 다음 import가 필요합니다.

```jsx
import Image from "next/image";
```

### width와 height를 문자열로 쓰는 경우

다음처럼 숫자 표현식을 사용합니다.

```jsx
width={600}
height={500}
```

`width="600"`처럼 문자열로 써도 동작할 수는 있지만, React 컴포넌트 속성으로 숫자를 전달한다는 감각을 익히기 위해 숫자 표현식을 권장합니다.

### next.config.mjs 수정 후 dev 서버를 재시작하지 않는 경우

외부 이미지 설정을 바꾸고도 오류가 계속 보이면 개발 서버를 완전히 종료한 뒤 다시 실행합니다.

## 이 단계에서 아직 하지 않는 것

아직 게시글 데이터는 없습니다. 홈 화면도 실제 게시글 목록을 보여주지 않습니다. 다음 단계에서 MongoDB 연결과 게시글 데이터 함수를 만들고, 그 다음 API와 화면을 연결합니다.
