# Step 18. Not Found와 Error UI 추가하기

## 변경 내용

전역 404, 상세 전용 404, 전역 Error UI를 추가해 오류 상황의 사용자 경험을 개선합니다.

- 없는 주소를 위한 전역 `app/not-found.js`를 추가합니다.
- 없는 게시글을 위한 상세 전용 `app/detail/[id]/not-found.js`를 추가합니다.
- 예외 발생 시 보여줄 전역 `app/error.js`를 추가합니다.

## 시작 전 확인

개인 실습 저장소의 `main`에서 직전 단계까지 마친 상태로 시작합니다. 코드 블록은 복사해 붙이지 않고 직접 입력합니다.

수정 전에 `git status --short`의 출력이 없는지 확인합니다. 변경이 남아 있다면 원인을 확인하고 시작 상태를 정리합니다.

## 작업 1. 전역 Not Found 화면 추가

사용자가 존재하지 않는 주소로 들어왔을 때 기본 Next.js 404 대신 프로젝트 문구와 홈 링크를 보여줍니다.

### 수정할 파일

- 생성: `app/not-found.js`

### 입력할 코드

아래 파일 경로를 확인하고 각 파일의 전체 내용을 입력합니다. 삭제로 표시된 파일은 PowerShell에서 제거합니다.

#### `app/not-found.js`

`app/not-found.js`를 열고 파일 전체를 다음 내용으로 맞춥니다.

~~~js
import Link from "next/link";

export default function NotFound() {
  return (
    <main>
      <h1>Page Not Found</h1>
      <p>The page you are looking for does not exist.</p>
      <Link href="/">Back to post list</Link>
    </main>
  );
}
~~~

### 설명과 확인

- `not-found.js`는 App Router의 특수 파일입니다.
- 홈으로 돌아갈 수 있는 링크를 제공해야 사용자가 막히지 않습니다.

## 작업 2. 상세 전용 Not Found 화면 추가

게시글 상세 화면에서 id는 형식상 맞지만 실제 게시글이 없을 수 있습니다. 이 경우 상세 라우트에 맞는 안내 화면을 따로 둡니다.

### 수정할 파일

- 생성: [app/detail/[id]/not-found.js](../../app/detail/%5Bid%5D/not-found.js)

### 입력할 코드

아래 파일 경로를 확인하고 각 파일의 전체 내용을 입력합니다. 삭제로 표시된 파일은 PowerShell에서 제거합니다.

#### `app/detail/[id]/not-found.js`

`app/detail/[id]/not-found.js`를 열고 파일 전체를 다음 내용으로 맞춥니다.

~~~js
import Link from "next/link";

export default function PostNotFound() {
  return (
    <main>
      <h1>Post Not Found</h1>
      <p>This post does not exist or may have been deleted.</p>
      <Link href="/">Back to post list</Link>
    </main>
  );
}
~~~

### 설명과 확인

- 이 파일은 `app/detail/[id]` 아래에서 발생한 notFound 상황에 우선 사용됩니다.
- 목록으로 돌아가는 링크를 둡니다.

## 작업 3. 전역 Error 화면 추가

예상하지 못한 렌더링 오류가 발생했을 때 사용자에게 다시 시도 버튼을 보여줍니다. Error UI는 클라이언트 컴포넌트여야 합니다.

### 수정할 파일

- 생성: `app/error.js`

### 입력할 코드

아래 파일 경로를 확인하고 각 파일의 전체 내용을 입력합니다. 삭제로 표시된 파일은 PowerShell에서 제거합니다.

#### `app/error.js`

`app/error.js`를 열고 파일 전체를 다음 내용으로 맞춥니다.

~~~js
"use client";

export default function Error({ error, reset }) {
  return (
    <main>
      <h1>Something went wrong</h1>
      <p>{error.message || "An unexpected error occurred."}</p>
      <button type="button" onClick={reset}>
        Try again
      </button>
    </main>
  );
}
~~~

### 설명과 확인

- `error.js`에는 `"use client";`가 필요합니다.
- Next.js가 전달하는 `reset` 함수를 버튼에서 호출하면 해당 경로 렌더링을 다시 시도합니다.

## 실행 확인

기본 정적 검사는 다음 명령으로 확인합니다.

> Windows 11에서는 [환경 준비](../windows-11.md)를 먼저 확인합니다. `git`, `node`, `npm.cmd` 명령은 PowerShell에서도 같습니다. `npm.ps1` 오류가 나면 `npm.cmd`를 사용합니다.

```powershell
npm.cmd run lint
npm.cmd run build
```

브라우저 확인이 필요하면 개발 서버를 켠 뒤 해당 화면을 확인합니다.

```powershell
npm.cmd run dev
```

체크할 내용은 다음과 같습니다.

- 없는 주소로 들어가면 404 화면이 보인다.
- 없는 게시글 id로 들어가면 상세 전용 안내가 보인다.
- `npm.cmd run build`로 error/not-found 특수 파일 문법을 확인한다.

## 독립 확인

없는 URL, 없는 게시글, 렌더링 오류의 화면 경계를 구분합니다. 결과와 확인 방법을 한 문장으로 기록합니다. 실험값은 검사를 마치면 원래대로 복구합니다.

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
git commit -m "Complete Next.js step 18"
git push
git status --short --branch
```

현재 브랜치는 `main`이어야 합니다. 마지막 상태에서 `main...origin/main` 뒤에 `ahead`가 없고 작업 파일 목록도 비어 있어야 합니다.
