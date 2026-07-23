# Step 8. Contact mockup form 만들기

## 변경 내용

Contact 페이지를 mockup form으로 바꾸고 controlled input과 submit 이벤트를 복습합니다.

- Contact 페이지에 controlled input 기반 form을 추가합니다.
- 실제 메일 전송 없이 submit 이벤트와 상태 초기화 흐름을 연습합니다.
- 페이지 파일과 form 컴포넌트를 분리해 클라이언트 코드 범위를 좁힙니다.

## 시작 전 확인

개인 실습 저장소의 `main`에서 직전 단계까지 마친 상태로 시작합니다. 코드 블록은 복사해 붙이지 않고 직접 입력합니다.

수정 전에 `git status --short`의 출력이 없는지 확인합니다. 변경이 남아 있다면 원인을 확인하고 시작 상태를 정리합니다.

## 작업 1. ContactForm 클라이언트 컴포넌트 추가

입력 상태와 submit 이벤트를 쓰는 부분만 별도 클라이언트 컴포넌트로 만듭니다. 제출하면 현재 값으로 안내 메시지를 만들고 입력값을 비웁니다.

### 수정할 파일

- 생성: `app/contact/ContactForm.js`

### 입력할 코드

아래 파일 경로를 확인하고 각 파일의 전체 내용을 입력합니다. 삭제로 표시된 파일은 PowerShell에서 제거합니다.

#### `app/contact/ContactForm.js`

`app/contact/ContactForm.js`를 열고 파일 전체를 다음 내용으로 맞춥니다.

~~~js
"use client";

import { useState } from "react";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    alert(
      `메일 전송 mockup입니다.\n\n이름: ${name}\n이메일: ${email}\n내용: ${message}`,
    );

    setName("");
    setEmail("");
    setMessage("");
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="name">Name:</label>
      <input
        type="text"
        id="name"
        value={name}
        onChange={(event) => setName(event.target.value)}
        required
      />

      <label htmlFor="email">Email:</label>
      <input
        type="email"
        id="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        required
      />

      <label htmlFor="message">Message:</label>
      <textarea
        id="message"
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        required
      />

      <button type="submit">Submit</button>
    </form>
  );
}
~~~

### 설명과 확인

- 이 form은 mockup이라 네트워크 요청을 보내지 않습니다.
- `required` 속성으로 브라우저 기본 빈 값 검사를 사용합니다.

## 작업 2. Contact 페이지에 form 연결

`app/contact/page.js`는 서버 컴포넌트로 유지하고, 실제 상호작용이 필요한 `ContactForm`만 import해서 렌더링합니다.

### 수정할 파일

- 수정: `app/contact/page.js`

### 입력할 코드

아래 파일 경로를 확인하고 각 파일의 전체 내용을 입력합니다. 삭제로 표시된 파일은 PowerShell에서 제거합니다.

#### `app/contact/page.js`

`app/contact/page.js`를 열고 파일 전체를 다음 내용으로 맞춥니다.

~~~js
import ContactForm from "./ContactForm";

export default function ContactPage() {
  return (
    <main>
      <h1>Contact Us</h1>
      <ContactForm />
    </main>
  );
}
~~~

### 설명과 확인

- 클라이언트 상태가 필요한 파일에만 `"use client";`를 둡니다.
- 페이지는 Server Component로 유지하고, 상태와 이벤트가 필요한 form만 Client Component로 분리합니다.

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

- `/contact`에서 이름, 이메일, 메시지를 입력하고 제출한다.
- 제출 후 안내 메시지가 보이고 입력칸이 비워진다.

## 독립 확인

email 형식과 빈 필드에 대한 브라우저 기본 검증을 구분합니다. 결과와 확인 방법을 한 문장으로 기록합니다. 실험값은 검사를 마치면 원래대로 복구합니다.

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
git commit -m "Complete Next.js step 8"
git push
git status --short --branch
```

현재 브랜치는 `main`이어야 합니다. 마지막 상태에서 `main...origin/main` 뒤에 `ahead`가 없고 작업 파일 목록도 비어 있어야 합니다.
