# Step 8. Contact mockup form 만들기

## 배울 내용

`step-8` 브랜치는 Contact 페이지를 실제 form 구조로 바꾸는 단계입니다.

`step-7`까지 게시글 읽기, 작성, 수정 흐름을 완성했습니다. 핵심 CRUD와 별개인 Contact 페이지를 mockup form으로 구현합니다.

이 단계에서 배우는 내용은 다음과 같습니다.

- 페이지 컴포넌트와 form 컴포넌트를 분리한다.
- 클라이언트 상호작용이 필요한 컴포넌트에만 `"use client"`를 붙인다.
- `useState`로 여러 input 값을 관리한다.
- `event.preventDefault()`로 기본 form 제출을 막는다.
- 실제 메일 전송 대신 `alert()`로 mockup 동작을 만든다.
- 작성 form에서 배운 controlled input 패턴을 다른 form에 다시 적용한다.

## 왜 Contact는 mockup인가

실제 메일 전송 기능을 만들려면 추가로 결정해야 할 것이 많습니다.

- 어떤 메일 서비스를 사용할 것인가
- API key를 어디에 저장할 것인가
- 스팸 방지는 어떻게 할 것인가
- 서버 검증은 어떻게 할 것인가
- 성공/실패 메일 로그는 어디에 남길 것인가

이 프로젝트의 목표는 Next.js 기본 라우팅, API Route, MongoDB CRUD 흐름을 배우는 것입니다. Contact 메일 전송까지 실제로 구현하면 학습 범위가 커집니다.

그래서 Contact는 mockup으로 둡니다.

mockup은 실제 기능을 완성하지 않고, 사용자가 보게 될 화면과 기본 상호작용만 흉내 내는 구현입니다.

## 파일 구조

이 단계에서 Contact 관련 파일은 다음과 같습니다.

```txt
app/contact/page.js
app/contact/ContactForm.js
```

`page.js`는 페이지 구조만 담당합니다.

`ContactForm.js`는 입력 상태와 submit 이벤트를 담당합니다.

이렇게 나누면 페이지 컴포넌트는 단순해지고, 클라이언트 상호작용이 필요한 부분만 `"use client"`로 만들 수 있습니다.

## Contact 페이지

`app/contact/page.js`는 서버 컴포넌트로 둡니다.

```jsx
import ContactForm from "./ContactForm";

export default function ContactPage() {
  return (
    <main>
      <h1>Contact Us</h1>
      <ContactForm />
    </main>
  );
}
```

이 파일은 상태나 이벤트를 직접 사용하지 않습니다. 그래서 `"use client"`가 필요하지 않습니다.

## ContactForm 컴포넌트

`ContactForm.js`는 입력 상태와 submit 이벤트를 사용하므로 클라이언트 컴포넌트입니다.

```js
"use client";

import { useState } from "react";
```

이 컴포넌트는 세 가지 상태를 가집니다.

```js
const [name, setName] = useState("");
const [email, setEmail] = useState("");
const [message, setMessage] = useState("");
```

| 상태 | 역할 |
| --- | --- |
| `name` | 이름 입력값 |
| `email` | 이메일 입력값 |
| `message` | 문의 내용 입력값 |

## controlled input 복습

각 input은 React 상태와 연결되어 있습니다.

```jsx
<input
  type="text"
  id="name"
  value={name}
  onChange={(event) => setName(event.target.value)}
  required
/>
```

`value`는 화면에 표시할 값을 정하고, `onChange`는 사용자가 입력할 때 상태를 갱신합니다.

이 패턴은 `step-6`의 게시글 작성 form, `step-7`의 게시글 수정 form과 같습니다.

## submit 처리

Contact form은 실제 API를 호출하지 않습니다. 대신 `alert()`로 입력값을 확인합니다.

```js
function handleSubmit(event) {
  event.preventDefault();

  alert(
    `메일 전송 mockup입니다.\n\n이름: ${name}\n이메일: ${email}\n내용: ${message}`,
  );
}
```

`event.preventDefault()`는 작성 form에서 배웠던 것과 같은 이유로 사용합니다. 브라우저의 기본 form 제출과 새로고침을 막고, JavaScript로 submit 동작을 직접 처리합니다.

## template literal과 줄바꿈

alert 메시지는 백틱을 사용하는 template literal로 작성했습니다.

```js
`메일 전송 mockup입니다.\n\n이름: ${name}\n이메일: ${email}\n내용: ${message}`
```

`${name}`처럼 값을 문자열 안에 넣을 수 있습니다.

`\n`은 줄바꿈입니다. `\n\n`은 빈 줄 하나를 만드는 효과가 있습니다.

## input type

이름은 일반 텍스트입니다.

```jsx
<input type="text" id="name" />
```

이메일은 email 타입입니다.

```jsx
<input type="email" id="email" />
```

브라우저는 `type="email"` 입력값이 이메일 형식인지 기본적으로 검사해줍니다. 다만 이것은 클라이언트 편의 기능일 뿐, 실제 서비스에서는 서버에서도 검증해야 합니다.

## required 속성

각 입력에는 `required`가 있습니다.

```jsx
required
```

이 속성이 있으면 빈 값으로 submit하려고 할 때 브라우저가 기본 경고를 보여줍니다.

## 작성 form과 Contact form 비교

작성 form과 Contact form은 둘 다 controlled input을 사용합니다.

공통점은 다음과 같습니다.

- `"use client"`가 필요하다.
- `useState`로 입력값을 관리한다.
- `form onSubmit`을 사용한다.
- `event.preventDefault()`를 호출한다.
- `label`과 `input`을 `htmlFor`/`id`로 연결한다.

차이점은 다음과 같습니다.

| 화면 | submit 동작 |
| --- | --- |
| 게시글 작성 | `POST /api/post` 요청을 보냄 |
| Contact | `alert()`로 mockup 메시지만 보여줌 |

## 실습 순서

1. `app/contact/ContactForm.js` 파일을 만든다.
2. 파일 맨 위에 `"use client";`를 추가한다.
3. `useState`를 import한다.
4. `name`, `email`, `message` 상태를 만든다.
5. `handleSubmit` 함수를 만든다.
6. `event.preventDefault()`를 호출한다.
7. `alert()`로 mockup 메시지를 보여준다.
8. form 안에 name/email/message 입력을 만든다.
9. `app/contact/page.js`에서 `ContactForm`을 import해 렌더링한다.

## 실행 확인

개발 서버를 실행합니다.

```bash
npm run dev
```

브라우저에서 다음 주소를 엽니다.

```txt
http://localhost:3000/contact
```

이름, 이메일, 내용을 입력하고 `Submit` 버튼을 누릅니다.

입력값이 alert 창에 보이면 성공입니다.

## 검증 명령

```bash
npm run lint
npm run build
```

## 이 단계에서 아직 하지 않는 것

실제 메일을 보내지 않습니다. 다음 단계에서는 새 기능을 추가하기보다 README와 불필요한 기본 파일을 정리해 step 커리큘럼을 마무리합니다.
