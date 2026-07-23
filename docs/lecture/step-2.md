# Step 2. simpledotcss와 이미지 설정으로 화면 정돈하기

## 변경 내용

simpledotcss와 next/image를 적용해 기본 화면을 정돈하고 외부 이미지 도메인 설정을 추가합니다.

- 직접 작성한 최소 CSS 대신 `simpledotcss`를 설치해 기본 HTML 태그 스타일을 정돈합니다.
- About 페이지에 `next/image` 이미지를 추가합니다.
- 외부 이미지인 `picsum.photos`를 사용할 수 있도록 `next.config.mjs`에 허용 도메인을 설정합니다.

## 시작 전 확인

개인 실습 저장소의 `main`에서 직전 단계까지 마친 상태로 시작합니다. 코드 블록은 복사해 붙이지 않고 직접 입력합니다.

수정 전에 `git status --short`의 출력이 없는지 확인합니다. 변경이 남아 있다면 원인을 확인하고 시작 상태를 정리합니다.

## 작업 1. simpledotcss 설치와 전역 CSS 교체

스타일링 자체보다 라우팅과 데이터 흐름에 집중하기 위해 작은 CSS 라이브러리를 도입합니다. npm 명령이 패키지 파일을 자동으로 바꾸므로, 명령 실행 뒤 전역 CSS를 직접 수정합니다.

### 수정할 파일

- 수정: `app/globals.css`

### 명령으로 자동 변경되는 파일

- 수정: `package.json`
- 수정: `package-lock.json`

위 파일들은 명령 실행 결과만 확인하며 직접 입력하지 않습니다.

### 먼저 실행

> Windows 11에서는 [환경 준비](../windows-11.md) <span class="print-reference" data-print-reference="true">(인쇄본 위치: Next.js · 장 「Windows 11 x64 실습 환경 준비」 · 절 「1. Windows Terminal 설치」)</span>를 먼저 확인합니다. 명령은 이 교재의 PowerShell 코드 블록에 적힌 `git`, `node`, `npm` 형태를 그대로 사용합니다.

```powershell
npm install simpledotcss@^2.3.7
```

### 입력할 코드

아래 파일 경로를 확인하고 각 파일의 전체 내용을 입력합니다. 삭제로 표시된 파일은 PowerShell에서 제거합니다.

#### `app/globals.css`

`app/globals.css`를 열고 파일 전체를 다음 내용으로 맞춥니다.

~~~css
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
~~~

### 설명과 확인

- `package.json`과 `package-lock.json`은 npm이 자동 갱신하므로 수동으로 입력하지 않습니다.
- `@import "simpledotcss/simple.min.css";`로 전역 스타일을 불러옵니다.
- Header와 nav의 여백만 프로젝트에 맞게 짧게 덮어씁니다.

## 작업 2. About 페이지에 next/image 적용

소개 페이지에 외부 이미지를 넣고 `next/image`의 출력 결과를 확인합니다. `Image`는 이미지 크기를 미리 알아야 하므로 `width`와 `height`를 함께 지정합니다.

### 수정할 파일

- 수정: `app/about/page.js`

### 입력할 코드

아래 파일 경로를 확인하고 각 파일의 전체 내용을 입력합니다. 삭제로 표시된 파일은 PowerShell에서 제거합니다.

#### `app/about/page.js`

`app/about/page.js`를 열고 파일 전체를 다음 내용으로 맞춥니다.

~~~js
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
~~~

### 설명과 확인

- `priority`는 첫 화면에서 중요한 이미지를 우선 로드하겠다는 표시입니다.
- `I&apos;m`처럼 HTML entity를 쓰면 JSX 린트 규칙에서 작은따옴표 문제가 나지 않습니다.

## 작업 3. 외부 이미지 도메인 허용

Next.js 이미지 최적화는 허용된 외부 도메인만 처리합니다. About 페이지의 이미지 출처가 `picsum.photos`이므로 설정 파일에 remote pattern을 추가합니다.

### 수정할 파일

- 수정: `next.config.mjs`

### 입력할 코드

아래 파일 경로를 확인하고 각 파일의 전체 내용을 입력합니다. 삭제로 표시된 파일은 PowerShell에서 제거합니다.

#### `next.config.mjs`

`next.config.mjs`를 열고 파일 전체를 다음 내용으로 맞춥니다.

~~~js
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
~~~

### 설명과 확인

- 설정 파일을 바꾼 뒤에는 개발 서버를 재시작해야 반영이 확실합니다.
- 허용 도메인을 추가하지 않으면 이미지 렌더링 또는 빌드 중 오류가 발생할 수 있습니다.

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

- `/about`에 이미지와 소개 문장이 보인다.
- 개발 서버를 재시작해 외부 이미지 설정 오류가 없는지 확인한다.

## 독립 확인

이미지 URL을 허용되지 않은 host로 바꿨을 때 오류를 읽고 원래 설정으로 복구합니다. 결과와 확인 방법을 한 문장으로 기록합니다. 실험값은 검사를 마치면 원래대로 복구합니다.

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
git commit -m "Complete Next.js step 2"
git push
git status --short --branch
```

현재 브랜치는 `main`이어야 합니다. 마지막 상태에서 `main...origin/main` 뒤에 `ahead`가 없고 작업 파일 목록도 비어 있어야 합니다.
