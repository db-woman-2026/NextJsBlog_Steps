# Step 9. 기본 블로그 흐름 점검하기

이 문서는 이전 단계 실습 결과에서 시작해 `step-9` 수준의 기능을 완성하는 실습 자료입니다.
원본 개요는 [docs/overview/step-9.md](../overview/step-9.md)에 보존되어 있습니다.
아래 파일 링크는 GitHub가 아니라 이 프로젝트 안의 현재 단계 파일을 여는 경로입니다.

## 이번 스텝 주요 기능 Overview

step-1부터 step-8까지 만든 기본 블로그 흐름을 점검하고, 다음 기능 확장 단계로 넘어갈 준비를 합니다.

- 이번 단계에서는 새 기능 코드를 추가하지 않습니다.
- 지금까지 만든 목록, 상세, 작성, 수정, Contact mockup 흐름을 사용자 입장에서 확인합니다.
- 다음 단계부터 입력 검증, 제출 상태, 삭제, 검색 같은 기능 확장으로 넘어갑니다.

## 시작 기준

이미 `step-8` 실습을 끝낸 코드에서 이어서 진행합니다.
단계별로 브랜치를 나눠 관리한다면 이전 실습 브랜치에서 새 브랜치를 만듭니다.

```bash
git switch practice-step-8
git switch -c practice-step-9
```

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

### 이전 단계와 달라지는 코드

이 작업에는 학생이 직접 타이핑할 코드 diff가 없습니다. 위 설명과 확인 포인트를 기준으로 진행합니다.

### 설명/확인 포인트

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

## 다음 단계로 넘어가기 전

- 이 문서의 각 작업 단위에서 설명을 먼저 읽고, 바로 아래 diff를 기준으로 파일을 수정합니다.
- 새 파일은 diff에 나온 전체 내용을 입력하고, 기존 파일은 diff의 `+`/`-` 줄만 비교하면서 수정합니다.
- 링크된 프로젝트 내부 파일을 열어 현재 단계의 완성본과 직접 비교할 수 있습니다.
