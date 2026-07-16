# Step 9. 기본 블로그 흐름 점검하기

## 이번 단계에서 할 일

step-1부터 step-8까지 만든 기본 블로그 흐름을 점검하고, 다음 기능 확장 단계로 넘어갈 준비를 합니다.

- 이번 단계에서는 새 기능 코드를 추가하지 않습니다.
- 지금까지 만든 목록, 상세, 작성, 수정, Contact mockup 흐름을 사용자 입장에서 확인합니다.
- 다음 단계부터 입력 검증, 제출 상태, 삭제, 검색 같은 기능 확장으로 넘어갑니다.

## 작업 1. 기본 블로그 동작 점검

step-1부터 step-8까지 입력한 코드가 하나의 블로그 흐름으로 이어지는지 확인합니다. 이 작업은 학생이 새 코드를 타이핑하는 단계가 아니라, 지금까지 만든 화면과 API가 서로 맞물려 동작하는지 점검하는
단계입니다.

### 확인할 파일

- 확인: [app/page.js](../../app/page.js)
- 확인: [app/detail/[id]/page.js](../../app/detail/%5Bid%5D/page.js)
- 확인: [app/post/page.js](../../app/post/page.js)
- 확인: [app/post/[id]/page.js](../../app/post/%5Bid%5D/page.js)
- 확인: [app/contact/page.js](../../app/contact/page.js)
- 확인: [app/contact/ContactForm.js](../../app/contact/ContactForm.js)
- 확인: [app/api/post/route.js](../../app/api/post/route.js)
- 확인: [app/api/post/[id]/route.js](../../app/api/post/%5Bid%5D/route.js)

### 코드 변경

이 작업에는 학생이 직접 타이핑할 코드 diff가 없습니다. 위 설명과 확인 포인트를 기준으로 진행합니다.

### 설명과 확인

- 홈 목록에서 게시글 제목을 클릭해 상세 화면으로 이동되는지 확인합니다.
- 작성 화면에서 새 글을 저장하고, 상세 화면에서 Edit 링크로 수정 화면에 들어가는지 확인합니다.
- Contact form은 실제 메일 전송이 아니라 controlled input과 submit 이벤트 연습용 mockup입니다.
- 이번 단계는 실습 코드 입력 없이 기능 흐름을 확인하고 다음 단계로 넘어갑니다.

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

- `/`에서 게시글 목록이 보인다.
- 게시글 상세, 작성, 수정 흐름이 이어진다.
- `/contact`에서 mockup form 제출 메시지가 보인다.

## 마무리 확인

- 이번 단계에는 새로 입력할 코드가 없습니다.
- 위 체크리스트의 화면 흐름이 실제로 이어지는지 확인한 뒤 다음 단계로 넘어갑니다.
- 문제가 있으면 해당 화면의 `확인할 파일` 링크를 열어 이전 단계에서 입력한 코드와 비교합니다.
