# Step 21. 홈 목록과 상세 읽기 화면 UI 정리

공통 layout, nav, footer에 Tailwind CSS v4가 적용된 상태에서 읽기 화면을 정리합니다.

## 변경 내용

- 홈 화면에 제목 영역을 추가한다.
- 검색/필터 영역을 흰색 패널로 묶는다.
- 게시글 목록을 카드 형태로 바꾼다.
- 상세 페이지를 하나의 article 카드로 정리한다.
- About 페이지의 텍스트와 이미지를 간단한 2열 레이아웃으로 바꾼다.
- 더 이상 쓰지 않는 `app/page.module.css`, `app/detail/[id]/page.module.css`를 제거한다.

## 읽기 화면 우선 적용

글 목록과 글 상세 화면의 읽기 UI를 정리합니다.

사용자가 블로그를 열면 목록을 먼저 확인합니다. 목록과 상세 화면에 같은 카드 규칙을 적용하면 반복되는 class와 반응형 동작을 함께 확인할 수 있습니다.

## CSS module에서 utility class로 이동

기존 홈 화면은 CSS module을 import했습니다.

```js
import styles from "./page.module.css";
```

그리고 JSX에서는 다음처럼 사용했습니다.

```jsx
<section className={styles.articleList}>
  <article className={styles.article}>...</article>
</section>
```

이 파일을 제거하고 JSX에 Tailwind class를 직접 작성합니다.

```jsx
<section className="grid gap-4" aria-label="Blog posts">
  <article className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
    ...
  </article>
</section>
```

## 홈 화면 제목 영역

홈 화면에는 이제 간단한 제목과 설명이 있습니다.

```jsx
<section className="space-y-2">
  <p className="text-sm font-semibold uppercase text-zinc-500">
    Next.js Blog
  </p>
  <h1 className="text-3xl font-bold tracking-tight text-zinc-950">
    Blog Posts
  </h1>
  <p className="max-w-2xl text-sm leading-6 text-zinc-600">
    MongoDB에 저장된 게시글을 검색, 정렬, 카테고리 필터와 함께 확인합니다.
  </p>
</section>
```

주요 class는 다음과 같습니다.

| class | 의미 |
| --- | --- |
| `space-y-2` | 자식 요소 사이의 세로 간격을 일정하게 만듭니다. |
| `text-3xl` | 큰 제목 크기를 적용합니다. |
| `font-bold` | 굵은 글자를 적용합니다. |
| `tracking-tight` | 제목 글자 간격을 조금 좁혀 제목처럼 보이게 합니다. |
| `max-w-2xl` | 설명 문장이 너무 길게 퍼지지 않도록 폭을 제한합니다. |

## 게시글 카드

목록의 각 게시글은 카드 형태로 바뀝니다.

```jsx
<article className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm transition hover:border-zinc-300">
  <Link className="text-xl font-semibold text-zinc-950 hover:text-zinc-700">
    {post.title}
  </Link>
  ...
</article>
```

여기서 `hover:border-zinc-300`은 마우스를 올렸을 때 border 색을 조금 진하게 바꿉니다. 기능에는 영향을 주지 않지만 클릭 가능한 카드라는 느낌을 줄 수 있습니다.

## 카테고리 배지

카테고리는 작은 pill 형태로 표시합니다.

```jsx
<span className="rounded-full bg-zinc-100 px-2.5 py-1 font-medium text-zinc-700">
  {post.category || "general"}
</span>
```

`rounded-full`은 좌우가 둥근 배지를 만들 때 자주 사용합니다.

## 상세 페이지 article 카드

상세 페이지는 글 하나를 읽는 화면이므로 하나의 큰 카드로 정리합니다.

```jsx
<article className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
  <div className="space-y-3">
    <span className="inline-flex rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium uppercase text-zinc-600">
      {post.category || "general"}
    </span>
    <h1 className="text-3xl font-bold tracking-tight text-zinc-950">
      {post.title}
    </h1>
  </div>
  <pre className="mt-6 whitespace-pre-wrap rounded-md bg-zinc-50 p-4 text-sm leading-7 text-zinc-700">
    {post.content}
  </pre>
</article>
```

게시글 본문은 줄바꿈을 유지해야 하므로 `pre` 태그를 그대로 사용합니다. 대신 `whitespace-pre-wrap`으로 긴 줄이 화면 밖으로 나가지 않고 줄바꿈되게 합니다.

## About 페이지

About 페이지는 텍스트와 이미지를 나란히 배치합니다.

```jsx
<main className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
  ...
</main>
```

`lg:` 접두사는 큰 화면에서만 적용되는 responsive class입니다. 모바일에서는 한 열로 보이고, 큰 화면에서는 텍스트와 이미지가 2열로 보입니다.

## 완료 확인

읽기 화면이 같은 카드형 UI 규칙을 사용하는지 확인합니다.

작성 form, 수정 form, Contact form, 오류 화면은 현재 변경 범위에 포함하지 않습니다.

## 결과 확인

> Windows 11에서는 [환경 준비](../windows-11.md)를 먼저 확인합니다. `git`, `node`, `npm.cmd` 명령은 PowerShell에서도 같습니다. `npm.ps1` 오류가 나면 `npm.cmd`를 사용합니다.

```powershell
npm.cmd run lint
npm.cmd run build
```

브라우저에서는 다음 주소를 확인합니다.

```txt
/
/detail/[id]
/about
```

`/detail/[id]`는 실제 게시글 ID가 필요합니다. 홈 목록에서 글 제목을 클릭해 들어가면 됩니다.

## 체크리스트

1. 홈 화면에 제목과 설명이 보인다.
2. 검색/필터 영역이 흰색 패널로 보인다.
3. 게시글 목록이 카드 형태로 보인다.
4. 상세 화면의 제목, 카테고리, 날짜, 본문이 하나의 카드 안에 정리된다.
5. About 페이지가 모바일에서는 1열, 큰 화면에서는 2열로 보인다.
6. 삭제한 CSS module을 import하는 코드가 남아 있지 않다.
