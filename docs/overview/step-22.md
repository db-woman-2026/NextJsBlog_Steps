# Step 22. 작성, 수정, Contact form UI 정리

이전 단계에서는 홈 목록과 상세 읽기 화면을 카드형 UI로 바꿨습니다. 이번 단계에서는 사용자가 직접 입력하는 form 화면을 정리합니다.

## 이번 단계에서 하는 일

- 게시글 작성 페이지에 제목 영역과 form 카드 UI를 적용한다.
- 게시글 수정 페이지에 같은 form UI 패턴을 적용한다.
- Contact mockup form에도 같은 입력 패턴을 적용한다.
- 오류 메시지를 눈에 띄는 alert 형태로 표시한다.
- `app/post/page.module.css`를 제거한다.

## form을 따로 분리해서 다루는 이유

form은 단순한 텍스트 화면보다 고려할 요소가 많습니다.

- label과 input의 관계
- 입력칸의 focus 상태
- disabled 상태
- submit 버튼
- 오류 메시지
- textarea 높이

그래서 읽기 화면과 같은 단계에서 한꺼번에 바꾸기보다, form만 따로 다루는 편이 학습하기 쉽습니다.

## 반복되는 class를 상수로 두기

작성 페이지와 수정 페이지에서는 같은 입력 스타일이 여러 번 반복됩니다. 이럴 때는 문자열 상수를 만들어 재사용할 수 있습니다.

```js
const fieldClassName = "grid gap-1.5";
const labelClassName = "text-sm font-medium text-zinc-700";
const inputClassName =
  "rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm outline-none focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200 disabled:bg-zinc-100";
```

이 방식은 CSS 파일을 새로 만들지 않으면서도 긴 class 문자열을 여러 곳에 반복 작성하지 않게 해줍니다.

## label과 input 묶기

각 입력 필드는 label과 input을 하나의 `div`로 묶습니다.

```jsx
<div className={fieldClassName}>
  <label className={labelClassName} htmlFor="title">
    Title
  </label>
  <input
    className={inputClassName}
    type="text"
    id="title"
    value={title}
    onChange={(event) => setTitle(event.target.value)}
    disabled={isSubmitting}
    required
  />
</div>
```

`htmlFor`와 `id`가 연결되어 있으므로 label을 클릭해도 input에 focus가 갑니다. 스타일을 바꿔도 접근성 기본 구조는 유지해야 합니다.

## focus 상태

입력칸 class에는 focus 관련 class가 들어 있습니다.

```txt
focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200
```

사용자가 입력칸을 클릭하면 border와 ring이 바뀌어 현재 입력 위치를 더 쉽게 알 수 있습니다.

## disabled 상태

게시글 작성/수정 중에는 input과 button이 disabled 됩니다.

```txt
disabled:bg-zinc-100
disabled:cursor-not-allowed
disabled:opacity-50
```

Tailwind의 `disabled:` 접두사는 HTML 요소가 `disabled` 상태일 때만 적용됩니다.

## textarea 높이

본문 입력칸은 일반 input보다 높아야 합니다.

```js
const textareaClassName = `${inputClassName} min-h-48 resize-y`;
```

`min-h-48`은 최소 높이를 확보하고, `resize-y`는 사용자가 세로 방향으로만 크기를 조절할 수 있게 합니다.

## 오류 메시지

오류 메시지는 빨간색 계열의 alert 패턴으로 표시합니다.

```jsx
{error && (
  <p className={errorClassName} role="alert">
    {error}
  </p>
)}
```

`role="alert"`는 화면 낭독기에도 오류 메시지임을 알려주는 역할을 합니다. 스타일을 입히더라도 기존 의미를 잃지 않는 것이 중요합니다.

## Contact form

Contact form은 실제 메일을 보내지는 않지만 controlled input과 submit 이벤트를 연습하기 좋은 예제입니다. 게시글 form과 같은 카드, label, input, button 패턴을 적용해 화면 전체의 일관성을 맞춥니다.

## 이번 단계의 기준

이번 단계의 완성 기준은 "사용자가 입력하는 화면들이 같은 form 패턴을 가진다"입니다.

아직 삭제 버튼, not-found, error 화면은 따로 정리하지 않습니다. 다음 단계에서 남은 작은 UI 조각들을 정리해 Tailwind 전환을 마무리합니다.

## 확인 방법

```bash
npm run lint
npm run build
```

브라우저에서는 다음 주소를 확인합니다.

```txt
/post
/post/[id]
/contact
```

`/post/[id]`는 실제 게시글 ID가 필요하므로 홈 목록에서 상세 화면으로 들어간 뒤 Edit 링크를 클릭하면 됩니다.

## 체크리스트

1. 작성 페이지의 입력칸과 버튼이 카드 안에 정리되어 있다.
2. 수정 페이지도 작성 페이지와 같은 form 패턴을 사용한다.
3. Contact form도 같은 입력 패턴을 사용한다.
4. 작성/수정 중 disabled 상태가 눈에 보인다.
5. 오류 메시지는 `role="alert"`를 유지하면서 alert 스타일로 보인다.
6. `app/post/page.module.css`를 import하는 코드가 남아 있지 않다.

다음 단계에서는 삭제 버튼, Not Found, Error 화면과 문서 인덱스를 정리해 Tailwind 기본 UI 전환을 마무리합니다.
