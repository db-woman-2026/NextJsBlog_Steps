# 15. Tailwind CSS 읽기

## 배울 내용

- 일반 CSS와 Tailwind utility class의 관계를 이해합니다.
- spacing, color, typography, layout class를 묶어 읽습니다.
- hover, disabled, responsive prefix를 구분합니다.

## 1. utility class

일반 CSS는 class 이름을 정한 뒤 별도 CSS 규칙을 작성합니다.

```html
<button class="primary-button">Save</button>
```

```css
.primary-button {
  padding: 8px 16px;
  background: #18181b;
  color: white;
  border-radius: 6px;
}
```

Tailwind는 한 가지 스타일 역할을 가진 utility class를 JSX에서 조합합니다.

```jsx
<button className="rounded-md bg-zinc-900 px-4 py-2 text-white">
  Save
</button>
```

| class | 뜻 |
| --- | --- |
| `rounded-md` | 중간 크기 모서리 둥글기 |
| `bg-zinc-900` | 진한 zinc 배경색 |
| `px-4` | 좌우 padding |
| `py-2` | 위아래 padding |
| `text-white` | 흰색 글자 |

## 2. spacing

Tailwind spacing class는 방향과 크기를 조합합니다.

```txt
p-4   모든 방향 padding
px-4  좌우 padding
py-2  위아래 padding
pt-6  위 padding
m-4   모든 방향 margin
mt-6  위 margin
gap-3 flex/grid 자식 사이 간격
```

```jsx
<section className="space-y-4 p-6">
  <h1>Title</h1>
  <p>Description</p>
</section>
```

`space-y-4`는 자식 요소 사이에 세로 간격을 만듭니다.

## 3. 글자와 색상

```jsx
<h1 className="text-3xl font-bold text-zinc-950">Blog Posts</h1>
<p className="text-sm leading-6 text-zinc-600">Description</p>
```

- `text-3xl`: 글자 크기
- `font-bold`: 굵기
- `text-zinc-950`: 글자 색상
- `leading-6`: 줄 높이

배경과 border 색상은 prefix가 다릅니다.

```txt
bg-white         흰색 배경
border-zinc-200  연한 zinc 테두리
text-red-700     진한 red 글자
```

## 4. 크기와 폭

```jsx
<main className="mx-auto min-h-screen max-w-5xl px-4">
  ...
</main>
```

- `max-w-5xl`: 최대 폭 제한
- `mx-auto`: 좌우 margin을 자동으로 두어 가운데 배치
- `min-h-screen`: 최소 높이를 화면 높이로 설정
- `w-full`: 사용 가능한 전체 폭
- `min-h-48`: 최소 높이 지정

## 5. flex와 grid

```jsx
<div className="flex items-center justify-between gap-3">
  <span>Title</span>
  <button>Save</button>
</div>
```

- `flex`: flex layout
- `items-center`: 교차축 가운데 정렬
- `justify-between`: 주축 양끝 배치
- `gap-3`: 자식 사이 간격

```jsx
<div className="grid gap-4 sm:grid-cols-2">
  <article>Post 1</article>
  <article>Post 2</article>
</div>
```

기본은 한 열이고 `sm` 화면부터 두 열입니다.

## 6. 상태 prefix

특정 상태에서만 적용할 class 앞에 prefix를 붙입니다.

```jsx
<button className="bg-zinc-900 hover:bg-zinc-700 disabled:opacity-50">
  Save
</button>
```

- `hover:`: 마우스를 올렸을 때
- `focus:`: 키보드나 클릭으로 focus되었을 때
- `disabled:`: 요소가 비활성일 때

```jsx
<input className="border focus:border-zinc-500 focus:ring-2" />
```

상태 prefix 뒤의 utility만 해당 상태에서 적용됩니다.

## 7. 반응형 prefix

Tailwind는 작은 화면 스타일을 기본으로 적고, 더 넓은 화면에서 바뀔 부분에 prefix를 붙이는 mobile-first 방식을 사용합니다.

```jsx
<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
  ...
</div>
```

- 기본: 한 열
- `sm` 이상: 두 열
- `lg` 이상: 세 열

## 8. class 문자열 재사용

같은 입력 스타일이 여러 번 반복되면 문자열 변수로 둘 수 있습니다.

```js
const inputClassName =
  "rounded-md border border-zinc-300 px-3 py-2 text-sm";
```

```jsx
<input className={inputClassName} />
<select className={inputClassName} />
```

기본 문자열에 class를 더할 때 template literal을 사용합니다.

```js
const textareaClassName = `${inputClassName} min-h-48 resize-y`;
```

## 9. 긴 className 읽는 순서

다음 코드를 왼쪽부터 모두 외우려 하지 말고 역할별로 나눕니다.

```jsx
<article className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
  ...
</article>
```

```txt
모양      rounded-lg
테두리    border border-zinc-200
배경      bg-white
간격      p-6
효과      shadow-sm
```

모르는 class 하나 때문에 전체 JSX를 이해하지 못할 필요는 없습니다. 먼저 layout, spacing, color처럼 큰 역할을 찾습니다.

## 프로젝트 예시

- `step-20`: Tailwind CSS v4를 설치하고 layout, Header, Footer에 적용합니다.
- `step-21`: 목록과 상세 화면에 card, grid, 반응형 배치를 적용합니다.
- `step-22`: form 입력과 button class 문자열을 재사용합니다.
- `step-23`: 오류 화면과 삭제 버튼의 상태 스타일을 마무리합니다.

## 확인하기

1. `px-4`와 `py-2`는 각각 어느 방향 padding인가요?
2. `hover:bg-zinc-700`은 언제 적용되나요?
3. `sm:grid-cols-2`가 있어도 작은 화면에서는 몇 열인가요?

정답: `px`는 좌우, `py`는 위아래입니다. 마우스를 올렸을 때 적용됩니다. 기본 class가 한 열이라면 작은 화면에서는 한 열입니다.
