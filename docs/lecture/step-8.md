# Step 8. Contact mockup form 만들기

이 문서는 이전 단계 실습 결과에서 시작해 `step-8` 수준의 기능을 완성하는 실습 자료입니다.
원본 개요는 [docs/overview/step-8.md](../overview/step-8.md)에 보존되어 있습니다.
아래 파일 링크는 GitHub가 아니라 이 프로젝트 안의 현재 단계 파일을 여는 경로입니다.

## 이번 스텝 주요 기능 Overview

Contact 페이지를 mockup form으로 바꾸고 controlled input과 submit 이벤트를 복습합니다.

- Contact 페이지에 controlled input 기반 form을 추가합니다.
- 실제 메일 전송 없이 submit 이벤트와 상태 초기화 흐름을 연습합니다.
- 페이지 파일과 form 컴포넌트를 분리해 클라이언트 코드 범위를 좁힙니다.

## 시작 기준

이미 `step-7` 실습을 끝낸 코드에서 이어서 진행합니다.
단계별로 브랜치를 나눠 관리한다면 이전 실습 브랜치에서 새 브랜치를 만듭니다.

```bash
git switch practice-step-7
git switch -c practice-step-8
```

## 작업 1. ContactForm 클라이언트 컴포넌트 추가

입력 상태와 submit 이벤트를 쓰는 부분만 별도 클라이언트 컴포넌트로 만듭니다. 제출하면 현재 값으로 안내 메시지를 만들고 입력값을 비웁니다.

### 직접 수정할 파일

- 생성: [app/contact/ContactForm.js](../../app/contact/ContactForm.js)

### 이전 단계와 달라지는 코드

아래 diff에서 `+`로 시작하는 줄을 추가하고, `-`로 시작하는 줄을 제거합니다. 새 파일은 diff에 보이는 전체 내용을 새로 입력합니다.

~~~diff
diff --git a/app/contact/ContactForm.js b/app/contact/ContactForm.js
new file mode 100644
index 0000000..8bf074b
--- /dev/null
+++ b/app/contact/ContactForm.js
@@ -0,0 +1,49 @@
+"use client";
+
+import { useState } from "react";
+
+export default function ContactForm() {
+  const [name, setName] = useState("");
+  const [email, setEmail] = useState("");
+  const [message, setMessage] = useState("");
+
+  function handleSubmit(event) {
+    event.preventDefault();
+
+    alert(
+      `메일 전송 mockup입니다.\n\n이름: ${name}\n이메일: ${email}\n내용: ${message}`,
+    );
+  }
+
+  return (
+    <form onSubmit={handleSubmit}>
+      <label htmlFor="name">Name:</label>
+      <input
+        type="text"
+        id="name"
+        value={name}
+        onChange={(event) => setName(event.target.value)}
+        required
+      />
+
+      <label htmlFor="email">Email:</label>
+      <input
+        type="email"
+        id="email"
+        value={email}
+        onChange={(event) => setEmail(event.target.value)}
+        required
+      />
+
+      <label htmlFor="message">Message:</label>
+      <textarea
+        id="message"
+        value={message}
+        onChange={(event) => setMessage(event.target.value)}
+        required
+      />
+
+      <button type="submit">Submit</button>
+    </form>
+  );
+}
~~~

### 설명/확인 포인트

- 이 form은 mockup이라 네트워크 요청을 보내지 않습니다.
- `required` 속성으로 브라우저 기본 빈 값 검사를 사용합니다.

## 작업 2. Contact 페이지에 form 연결

`app/contact/page.js`는 서버 컴포넌트로 유지하고, 실제 상호작용이 필요한 `ContactForm`만 import해서 렌더링합니다.

### 직접 수정할 파일

- 수정: [app/contact/page.js](../../app/contact/page.js)

### 이전 단계와 달라지는 코드

아래 diff에서 `+`로 시작하는 줄을 추가하고, `-`로 시작하는 줄을 제거합니다. 새 파일은 diff에 보이는 전체 내용을 새로 입력합니다.

~~~diff
diff --git a/app/contact/page.js b/app/contact/page.js
index 41c1fad..c14ed86 100644
--- a/app/contact/page.js
+++ b/app/contact/page.js
@@ -1,8 +1,10 @@
+import ContactForm from "./ContactForm";
+
 export default function ContactPage() {
   return (
     <main>
       <h1>Contact Us</h1>
-      <p>The contact form will be added in a later step.</p>
+      <ContactForm />
     </main>
   );
 }
~~~

### 설명/확인 포인트

- 클라이언트 상태가 필요한 파일에만 `"use client";`를 둡니다.
- 이 분리는 이후 Next.js 서버/클라이언트 컴포넌트 구분을 이해하는 데 중요합니다.

## 실행 확인

기본 정적 검사는 다음 명령으로 확인합니다.

```bash
npm run lint
npm run build
```

브라우저 확인이 필요하면 개발 서버를 켠 뒤 해당 화면을 확인합니다.

```bash
npm run dev
```

체크할 내용은 다음과 같습니다.

- `/contact`에서 이름, 이메일, 메시지를 입력하고 제출한다.
- 제출 후 안내 메시지가 보이고 입력칸이 비워진다.

## 다음 단계로 넘어가기 전

- 이 문서의 각 작업 단위에서 설명을 먼저 읽고, 바로 아래 diff를 기준으로 파일을 수정합니다.
- 새 파일은 diff에 나온 전체 내용을 입력하고, 기존 파일은 diff의 `+`/`-` 줄만 비교하면서 수정합니다.
- 링크된 프로젝트 내부 파일을 열어 현재 단계의 완성본과 직접 비교할 수 있습니다.
