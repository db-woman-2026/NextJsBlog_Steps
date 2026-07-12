# 07. HTML, form, CSS

## 이번 장의 목표

- 자주 쓰는 HTML 태그와 attribute를 알아봅니다.
- form의 label, input, button 관계를 이해합니다.
- CSS selector, box model, layout의 기본 문법을 읽습니다.

## 1. HTML은 내용의 구조를 표현합니다

HTML 태그는 여는 태그와 닫는 태그 사이에 내용을 둡니다.

```html
<h1>Blog Posts</h1>
<p>게시글 목록입니다.</p>
```

태그가 다른 태그를 포함할 수 있습니다.

```html
<main>
  <section>
    <h1>Blog Posts</h1>
    <p>게시글 목록입니다.</p>
  </section>
</main>
```

부모와 자식 관계는 들여쓰기로 드러냅니다. `main`이 부모, `section`이 자식입니다.

## 2. 의미가 있는 시맨틱 태그

| 태그 | 역할 |
| --- | --- |
| `header` | 페이지나 영역의 머리말 |
| `nav` | 주요 이동 링크 |
| `main` | 페이지의 핵심 내용 |
| `section` | 주제별 구역 |
| `article` | 독립적으로 읽을 수 있는 글 |
| `footer` | 페이지나 영역의 꼬리말 |
| `h1` ~ `h6` | 제목 단계 |
| `p` | 문단 |
| `ul`, `li` | 순서 없는 목록과 항목 |

```html
<article>
  <h2>첫 번째 게시글</h2>
  <p>게시글 본문입니다.</p>
</article>
```

화면 모양이 같더라도 의미에 맞는 태그는 접근성과 코드 이해에 도움이 됩니다.

## 3. attribute

attribute는 태그에 추가 정보를 줍니다.

```html
<a href="/about">About</a>
<img src="/profile.png" alt="작성자 프로필" />
```

- `href`: 링크가 이동할 주소
- `src`: 이미지 파일 주소
- `alt`: 이미지를 볼 수 없을 때 전달할 설명

## 4. form 구조

form은 사용자의 입력을 묶습니다.

```html
<form>
  <label for="title">Title</label>
  <input id="title" name="title" type="text" />

  <label for="content">Content</label>
  <textarea id="content" name="content"></textarea>

  <button type="submit">Save</button>
</form>
```

`label`의 `for`와 입력 요소의 `id`를 같게 연결합니다. label을 눌러도 입력 요소에 focus가 이동합니다.

자주 쓰는 입력 요소입니다.

```html
<input type="email" />
<input type="search" />
<textarea></textarea>
<select>
  <option value="general">General</option>
  <option value="tech">Tech</option>
</select>
```

button의 type을 명시하면 역할이 분명합니다.

```html
<button type="submit">저장</button>
<button type="button">취소</button>
```

## 5. CSS selector

CSS는 어떤 HTML을 어떻게 꾸밀지 정합니다.

```css
p {
  color: #3f3f46;
}
```

class로 특정 요소를 선택할 수 있습니다.

```html
<p class="description">게시글 설명</p>
```

```css
.description {
  color: #52525b;
  font-size: 14px;
}
```

## 6. box model

화면 요소는 내용 주위에 padding, border, margin을 가질 수 있습니다.

```txt
margin
└─ border
   └─ padding
      └─ content
```

```css
.card {
  padding: 16px;
  border: 1px solid #e4e4e7;
  margin-bottom: 12px;
}
```

- `padding`: 내용과 테두리 사이의 안쪽 여백
- `border`: 테두리
- `margin`: 다른 요소와의 바깥쪽 여백

## 7. flex와 grid

가로 또는 세로 한 방향 배치는 flex가 편리합니다.

```css
.actions {
  display: flex;
  gap: 8px;
  align-items: center;
}
```

행과 열을 함께 다루는 배치는 grid가 편리합니다.

```css
.post-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}
```

## 8. 반응형 화면

화면이 좁을 때와 넓을 때 배치를 다르게 할 수 있습니다.

```css
.post-list {
  display: grid;
  grid-template-columns: 1fr;
}

@media (min-width: 640px) {
  .post-list {
    grid-template-columns: repeat(2, 1fr);
  }
}
```

기본은 한 열이고, 화면 폭이 640px 이상이면 두 열이 됩니다.

## 9. 전역 CSS와 CSS Modules

전역 CSS는 앱 전체에 적용할 기본 스타일을 담습니다. root layout에서 한 번 import합니다.

```jsx
// app/layout.js
import "./globals.css";
```

CSS Module은 특정 컴포넌트에서 사용할 class 이름을 파일 단위로 관리합니다.

```css
/* page.module.css */
.form {
  display: grid;
  gap: 16px;
}
```

```jsx
import styles from "./page.module.css";

export default function Page() {
  return <form className={styles.form}>...</form>;
}
```

`styles.form`은 build 과정에서 다른 파일의 `.form`과 충돌하지 않는 class 이름으로 바뀝니다. 전역 기본값은 `globals.css`, 한 화면 전용 스타일은 `*.module.css`처럼 역할을 나눌 수 있습니다.

## 프로젝트에서 다시 만나기

- `step-1`: `header`, `nav`, `main`, `footer`로 공통 구조를 만듭니다.
- `step-6`: label, input, textarea, submit button으로 게시글 form을 만듭니다.
- `step-8`: email input을 포함한 Contact form을 만듭니다.
- 작성/수정 form 전용 스타일은 `page.module.css`에서 가져옵니다.
- `step-20` 이후: 같은 CSS 개념을 Tailwind utility class로 표현합니다.

## 확인하기

1. label과 input을 연결하는 두 attribute는 무엇인가요?
2. padding과 margin은 각각 어느 쪽 여백인가요?
3. 주요 이동 링크를 묶는 시맨틱 태그는 무엇인가요?

정답: label의 `for`와 input의 `id`입니다. padding은 안쪽, margin은 바깥쪽 여백입니다. `nav`입니다.
