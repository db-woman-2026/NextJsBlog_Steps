# 00. 기초 개념과 개발 환경

## 확인할 내용

- 프로젝트, 파일, 폴더, 터미널의 관계를 설명합니다.
- `package.json`, `package-lock.json`, `node_modules`의 역할을 구분합니다.
- 설치, 개발 서버, 검사 명령의 결과를 구분합니다.

## 1. 프로젝트는 여러 파일이 모인 폴더입니다

프로젝트 폴더에는 대략 다음 항목이 있습니다.

```txt
nextjs-blog/
├── app/                 화면과 API 코드
├── public/              이미지 같은 공개 파일
├── package.json         실행 명령과 주요 패키지 목록
├── package-lock.json    설치 버전을 고정한 기록
└── next.config.mjs      Next.js 설정
```

경로는 파일의 위치를 나타냅니다. `app/about/page.js`는 프로젝트 폴더 안의 `app`, 그 안의 `about`, 그 안의 `page.js`라는 뜻입니다.

## 2. 터미널은 명령을 입력하는 창입니다

터미널의 현재 위치가 프로젝트 폴더인지 먼저 확인해야 합니다.

> Windows 11에서는 [환경 준비](../windows-11.md) <span class="print-reference" data-print-reference="true">(인쇄본 위치: Next.js · 장 「Windows 11 x64 실습 환경 준비」 · 절 「1. Windows Terminal 설치」)</span>를 먼저 확인합니다. 명령은 이 교재의 PowerShell 코드 블록에 적힌 `git`, `node`, `npm.cmd` 형태를 그대로 사용합니다.

```powershell
Get-Location
```

현재 폴더의 파일 목록을 확인합니다.

```powershell
Get-ChildItem
```

명령 앞의 `$` 기호가 문서에 보이더라도 보통 `$`는 입력하지 않습니다. 이 문서의 코드 블록에는 입력할 명령만 표시합니다.

## 3. npm과 의존성

Next.js 프로젝트는 다른 사람이 만든 패키지를 조합해 사용합니다. 이처럼 프로젝트가 필요로 하는 외부 패키지를 **의존성(dependency)** 이라고 합니다.

```json
{
  "dependencies": {
    "next": "16.2.11",
    "react": "19.2.4"
  }
}
```

`package.json`은 필요한 패키지와 실행 명령을 사람이 읽기 쉽게 기록합니다. `package-lock.json`은 실제 설치할 세부 버전을 더 자세하게 고정합니다.

다음 명령은 `package.json`을 읽고 의존성을 설치하며 `package-lock.json`을 갱신합니다.

```powershell
npm.cmd install
```

설치 결과는 `node_modules/` 폴더에 만들어집니다. 이 폴더는 크기가 크고 다시 만들 수 있으므로 Git에 보통 저장하지 않습니다.

```txt
package.json + package-lock.json
              │
              │ npm.cmd install
              ▼
         node_modules/
```

`Cannot find module ...` 오류가 나거나 `node_modules`가 없다면 먼저 `npm.cmd install`을 실행합니다. 패키지가 `package.json`에 적혀 있어도 설치 폴더가 자동으로 생기는 것은 아닙니다.

## 4. 자주 쓰는 npm 명령

```powershell
npm.cmd run dev
```

개발 서버를 실행합니다. 서버가 켜져 있는 동안 터미널은 계속 로그를 출력합니다. 종료할 때는 터미널에서 `Control + C`를 누릅니다.

```powershell
npm.cmd run lint
```

오타, 잘못된 React 사용법, 프로젝트 코드 규칙 등을 검사합니다.

```powershell
npm.cmd run build
```

배포용 결과물을 만들 수 있는지 검사합니다. 개발 화면이 열리더라도 build에서만 발견되는 오류가 있을 수 있습니다.

## 5. 명령과 코드 구분하기

터미널 명령은 터미널에 입력합니다.

```powershell
npm.cmd run dev
```

JavaScript 코드는 `.js` 파일 안에 입력합니다.

```js
const title = "Hello";
console.log(title);
```

환경 변수는 `.env.local`처럼 환경 파일에 입력합니다.

```txt
MONGODB_DB=next_blog_practice
```

문서의 코드 블록 오른쪽 위 언어 이름이 `powershell`, `js`, `json`, `txt` 중 무엇인지 확인하면 입력 위치를 구분하기 쉽습니다.

## 프로젝트 예시

- 환경 준비: `create-next-app`으로 프로젝트를 만들고 `npm.cmd run dev`, `npm.cmd run lint`를 처음 사용합니다.
- `step-3`: MongoDB 패키지를 추가하고 환경 파일을 만듭니다.
- `step-20`: Tailwind 패키지가 추가되므로 설치 명령으로 의존성을 갱신합니다.

## 확인하기

1. `package.json`에 패키지 이름이 있다고 해서 바로 import할 수 없는 이유는 무엇인가요?
2. 터미널 명령과 JavaScript 코드는 각각 어디에 입력하나요?
3. 개발 서버를 종료하는 키는 무엇인가요?

정답: 패키지가 `node_modules`에 설치되어야 하기 때문입니다. 터미널 명령은 터미널에, JavaScript는 `.js` 파일에 입력합니다. 개발 서버는 `Control + C`로 종료합니다.
