# Step 9. 기본 블로그 흐름 점검하기

## 이번 단계에서 할 일

step-1부터 step-8까지 만든 기본 블로그 흐름을 점검하고, 다음 기능 확장 단계로 넘어갈 준비를 합니다.

- 새 기능 코드는 추가하지 않습니다.
- 지금까지 만든 목록, 상세, 작성, 수정, Contact mockup 흐름을 사용자 입장에서 확인합니다.
- 다음 단계부터 입력 검증, 제출 상태, 삭제, 검색 같은 기능 확장으로 넘어갑니다.

## 시작 전 확인

권장 시간은 30분입니다. 개인 실습 저장소의 `main`에서 직전 단계까지 마친 상태로 시작합니다. 코드 블록은 복사해 붙이지 않고 직접 입력합니다.

수정 전에 `git status --short`의 출력이 없는지 확인합니다. 변경이 남아 있다면 원인을 확인하고 시작 상태를 정리합니다.

## 작업 1. 기본 블로그 동작 점검

step-1부터 step-8까지 입력한 코드가 하나의 블로그 흐름으로 이어지는지 확인합니다. 새 코드는 입력하지 않습니다. 지금까지 만든 화면과 API가 서로 맞물려 동작하는지 점검합니다.

### 확인할 파일

- 확인: `app/page.js`
- 확인: [app/detail/[id]/page.js](../../app/detail/%5Bid%5D/page.js)
- 확인: `app/post/page.js`
- 확인: [app/post/[id]/page.js](../../app/post/%5Bid%5D/page.js)
- 확인: `app/contact/page.js`
- 확인: `app/contact/ContactForm.js`
- 확인: `app/api/post/route.js`
- 확인: [app/api/post/[id]/route.js](../../app/api/post/%5Bid%5D/route.js)

### 코드 변경

이 작업에는 코드 diff가 없습니다. 위 설명과 확인 항목을 기준으로 진행합니다.

### 설명과 확인

- 홈 목록에서 게시글 제목을 클릭해 상세 화면으로 이동되는지 확인합니다.
- 작성 화면에서 새 글을 저장하고, 상세 화면에서 Edit 링크로 수정 화면에 들어가는지 확인합니다.
- Contact form은 실제 메일 전송이 아니라 controlled input과 submit 이벤트 연습용 mockup입니다.
- 코드 입력 없이 기능 흐름을 확인하고 다음 단계로 넘어갑니다.

## 작업 2. 점검 기록 입력하기

프로젝트 루트에 `learning-log.md`를 만들고 확인 결과를 직접 입력합니다. 이미 파일이 있다면 마지막 줄에 Step 9 기록을 추가합니다.

```md
# Learning Log

- Step 9: 목록, 상세, 작성, 수정, Contact 화면을 확인했습니다.
- 검사 결과: lint와 build를 통과했습니다.
```

실제로 확인하지 않은 결과를 먼저 적지 않습니다. 아래 검사를 마친 뒤 결과가 다르면 기록을 고칩니다.

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

- `/`에서 게시글 목록이 보인다.
- 게시글 상세, 작성, 수정 흐름이 이어진다.
- `/contact`에서 mockup form 제출 메시지가 보인다.

## 독립 확인

삭제한 기본 asset이 import되지 않는지 lint와 build로 확인합니다. 결과와 확인 방법을 한 문장으로 기록합니다. 실험을 위해 바꾼 값은 다음 단계 전에 복구합니다.

## 마무리 확인

- 이번 단계에는 애플리케이션 코드 변경이 없습니다.
- 위 체크리스트의 화면 흐름이 실제로 이어지는지 확인한 뒤 다음 단계로 넘어갑니다.
- 문제가 있으면 해당 화면의 `확인할 파일` 링크를 열어 이전 단계에서 입력한 코드와 비교합니다.
- `learning-log.md`에는 실제 확인한 결과만 남깁니다.

## 저장소에 기록하기

실험용 변경을 모두 복구한 뒤 검사 결과와 코드 변경을 함께 확인합니다.

```powershell
git branch --show-current
git status --short
git diff
npm.cmd run lint
npm.cmd run build
git add .
git diff --staged
git commit -m "Complete Next.js step 9"
git push origin main
git status --short --branch
```

현재 브랜치는 `main`이어야 합니다. 마지막 상태에서 `main...origin/main` 뒤에 `ahead`가 없고 작업 파일 목록도 비어 있어야 합니다.
