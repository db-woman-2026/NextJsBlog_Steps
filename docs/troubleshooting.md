# Next.js 실습 문제 해결

오류가 나면 파일을 여러 개 바꾸기 전에 다음 순서로 범위를 줄입니다.

1. 현재 코드가 어느 단계의 시작 상태인지 확인합니다.
2. 개발 서버 터미널의 첫 오류를 읽습니다.
3. 브라우저 Console과 Network에서 실패한 요청을 찾습니다.
4. API 응답 상태와 JSON을 확인합니다.
5. MongoDB 연결과 저장 데이터를 확인합니다.

## diff가 현재 파일에 맞지 않습니다

`step-N.md`의 diff는 `step-(N-1)` 완료 코드에 적용합니다. `step-N` branch를 checkout했다면 변경이 이미 들어 있습니다.

> Windows 11에서는 [환경 준비](./windows-11.md)를 먼저 확인합니다. `git`, `node`, `npm` 명령은 PowerShell에서도 같습니다. `npm.ps1` 오류가 나면 `npm.cmd`를 사용합니다.

```bash
git status --short
git branch --show-current
```

현재 branch와 문서 번호가 같다면 완성본 확인 모드인지 먼저 판단합니다. 충돌하는 줄을 억지로 중복 입력하지 않습니다.

## package를 찾지 못합니다

branch를 바꾼 뒤 `package.json`이나 lockfile이 달라졌다면 의존성을 다시 맞춥니다.

```bash
npm ci
npm run lint
```

Windows의 `npm.ps1` 오류는 `npm.cmd ci`, `npm.cmd run lint`로 실행합니다. package 이름을 보고 임의 버전을 추가하기 전에 현재 단계의 `package.json`을 확인합니다.

## MongoDB에 연결되지 않습니다

`.env.local` 파일과 서버 상태를 확인합니다.

```powershell
Get-Content .env.local -Encoding utf8
Test-NetConnection 127.0.0.1 -Port 27017
```

`MONGODB_URI`와 `MONGODB_DB`의 철자를 확인합니다. 실습 DB는 `next_blog_`로 시작하는 전용 이름을 사용합니다. `.env.local`을 바꾼 뒤에는 개발 서버를 다시 시작합니다.

## useState 또는 event를 사용할 수 없습니다

App Router의 component는 기본적으로 Server Component입니다. `useState`, `useEffect`, event handler를 쓰는 파일의 첫 줄에 `"use client"`가 있는지 확인합니다. 모든 파일에 무조건 추가하지 않고 브라우저 상호작용이 필요한 경계에만 둡니다.

## params 또는 searchParams 값이 예상과 다릅니다

현재 과정의 Next.js 버전에서는 Server Component와 Route Handler의 동적 `params`를 비동기로 받는 예제가 있습니다. 문서의 현재 단계 코드처럼 `await params`를 사용했는지 확인합니다. Client Component에서는 `useParams`, `useSearchParams`를 구분합니다.

## API가 500을 반환합니다

브라우저 화면의 문구만 보지 말고 개발 서버 터미널의 원래 오류를 확인합니다. Network에서 요청 URL, method, request body, response JSON을 기록합니다.

```powershell
Invoke-RestMethod -Method Get -Uri "http://localhost:3000/api/post"
```

잘못된 ObjectId, JSON 문법, MongoDB 연결, 누락된 환경 변수를 차례로 확인합니다. 서버 내부 오류 내용을 그대로 사용자 응답에 노출하지 않습니다.

## 화면이 갱신되지 않습니다

요청 성공 여부를 먼저 확인한 뒤 `router.push` 또는 `router.replace`, `router.refresh`의 실행 순서를 봅니다. DB에 값이 저장되지 않았는데 refresh만 반복하지 않습니다.

## Tailwind class가 적용되지 않습니다

`package.json`, `postcss.config.mjs`, `app/globals.css`의 import를 현재 단계 완성본과 비교합니다. 개발 서버를 재시작하고 `npm run build`에서도 같은 오류가 나는지 확인합니다.

## 복구 후 확인

```bash
npm run lint
npm run build
git status --short
```

정적 검사를 통과한 뒤 관련 주소와 API를 다시 확인합니다. 오류가 사라졌다는 사실과 함께 원인이 어느 계층이었는지 한 문장으로 기록합니다.
