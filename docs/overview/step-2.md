# Step 2. simpledotcss와 이미지 설정으로 화면 정돈하기

## 배울 내용

`step-2` 브랜치는 `step-1`에서 만든 라우팅 껍데기에 기본 스타일과 이미지를 더합니다.

이 단계에서 배우는 내용은 다음과 같습니다.

- npm 패키지를 설치하면 `package.json`과 `package-lock.json`이 바뀐다는 점을 확인한다.
- `simpledotcss`를 전역 CSS에서 import해 기본 HTML 태그를 빠르게 정돈한다.
- `next/image`를 사용해 이미지를 렌더링한다.
- 외부 이미지 도메인을 사용하려면 `next.config.mjs`에 허용 규칙을 추가해야 한다.

아직 데이터베이스나 API는 만들지 않습니다. 이 단계의 목적은 화면을 구성하는 기본 도구를 익히는 것입니다.

## 왜 simpledotcss를 사용하는가

초급자 프로젝트에서 CSS를 처음부터 많이 작성하면 핵심 학습 주제가 흐려질 수 있습니다.

다음 흐름을 만듭니다.

```txt
페이지 만들기 -> 데이터 연결하기 -> API 만들기 -> 화면에서 API 호출하기
```

따라서 디자인은 최소화합니다. `simpledotcss`는 기본 HTML 태그에 읽기 좋은 스타일을 적용해주는 작은 CSS 라이브러리입니다. 별도의 컴포넌트 사용법을 배울 필요가 없고, `h1`, `p`, `form`, `button` 같은 태그를 그대로 쓰면 됩니다.

## 패키지 설치

다음 명령으로 패키지를 설치합니다.

> Windows 11에서는 [환경 준비](../windows-11.md)를 먼저 확인합니다. `git`, `node`, `npm` 명령은 PowerShell에서도 같습니다. `npm.ps1` 오류가 나면 `npm.cmd`를 사용합니다.

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

`app/about/page.js`는 소개 페이지입니다. 텍스트만 있던 페이지에 이미지를 추가합니다.

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

## 실습 순서

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
