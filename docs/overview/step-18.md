# Step 18. Not Found와 Error UI 개선

## 변경 내용

오류 상황에 맞는 안내 화면을 직접 만듭니다.

잘못된 주소나 삭제된 게시글에 접근했을 때 Next.js 기본 오류 화면 대신 프로젝트에 맞는 내용을 표시합니다.

다음을 구현합니다.

- 전역 404 화면 `app/not-found.js`를 만든다.
- 예상치 못한 렌더링 오류를 처리하는 `app/error.js`를 만든다.
- 게시글 상세 전용 404 화면 `app/detail/[id]/not-found.js`를 만든다.
- 삭제된 글 상세 주소로 접근했을 때 목록으로 돌아갈 수 있게 한다.

## 삭제된 게시글의 404 흐름

삭제 기능이 있으면 다음 상황이 발생합니다.

```txt
1. 게시글 상세 화면을 연다.
2. 글을 삭제한다.
3. 이전 상세 주소로 다시 접속한다.
```

이때 게시글은 이미 없으므로 상세 화면은 `notFound()`를 호출합니다.

사용자에게 기본 404 화면만 보여주기보다, 게시글이 없거나 삭제되었을 수 있다는 안내를 보여주는 편이 좋습니다.

## 전역 not-found.js

`app/not-found.js`는 존재하지 않는 페이지에 접근했을 때 보여줄 화면입니다.

```jsx
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
```

예를 들어 `/wrong-url` 같은 주소로 접속하면 이 화면이 보입니다.

## 게시글 상세 전용 not-found.js

상세 페이지에는 더 구체적인 404 화면을 둘 수 있습니다.

```txt
app/detail/[id]/not-found.js
```

```jsx
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
```

`app/detail/[id]/page.js`는 게시글을 찾지 못하면 이미 `notFound()`를 호출합니다.

```js
if (!post) {
  notFound();
}
```

이때 같은 라우트 근처에 있는 `not-found.js`가 사용됩니다.

## error.js

`app/error.js`는 렌더링 중 예상치 못한 오류가 발생했을 때 보여줄 화면입니다.

```jsx
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
```

`error.js`는 클라이언트 컴포넌트여야 합니다. 그래서 `"use client"`가 필요합니다.

`reset`은 오류가 난 라우트를 다시 렌더링하려고 시도하는 함수입니다.

## API 오류와 페이지 오류의 차이

API Route에서 게시글을 찾지 못하면 JSON 오류를 반환합니다.

```json
{
  "success": false,
  "message": "Post not found",
  "data": null
}
```

페이지에서 게시글을 찾지 못하면 HTML 화면이 필요합니다.

```js
notFound();
```

API는 데이터 응답을 반환하고, 페이지는 사용자 화면을 보여준다는 차이를 기억해야 합니다.

## 실습 순서

1. `app/not-found.js`를 만든다.
2. 존재하지 않는 전체 페이지에 대한 안내와 홈 링크를 작성한다.
3. `app/detail/[id]/not-found.js`를 만든다.
4. 게시글이 없거나 삭제되었을 수 있다는 안내를 작성한다.
5. `app/error.js`를 만든다.
6. `"use client"`를 추가한다.
7. 오류 메시지와 `Try again` 버튼을 작성한다.

## 결과 확인

없는 페이지로 접속합니다.

```txt
http://localhost:3000/no-page
```

전역 404 화면이 보여야 합니다.

존재하지 않는 게시글 상세 주소로 접속합니다.

```txt
http://localhost:3000/detail/000000000000000000000000
```

게시글 전용 404 화면이 보여야 합니다.

## 검증 명령

> Windows 11에서는 [환경 준비](../windows-11.md) <span class="print-reference" data-print-reference="true">(인쇄본 위치: Next.js · 장 「Windows 11 x64 실습 환경 준비」 · 절 「1. Windows Terminal 설치」)</span>를 먼저 확인합니다. 명령은 이 교재의 PowerShell 코드 블록에 적힌 `git`, `node`, `npm` 형태를 그대로 사용합니다.

```powershell
npm run lint
npm run build
```

## 정리

오류 처리는 기능의 부속물이 아니라 사용자 경험의 일부입니다. 특히 삭제 기능이 생긴 뒤에는 “없는 데이터에 접근하는 상황”을 처리해야 합니다.
