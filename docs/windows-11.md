# Windows 11 x64 실습 환경 준비

이 강의는 Windows 11 x64와 Windows Terminal의 `Windows PowerShell` 프로필을 기준으로 진행합니다. 수업 PC에 프로그램이 이미 보여도 아래 `winget install` 명령을 모두 실행해 설치 상태와 최신 안정판 여부를 확인합니다.

## 1. Windows Terminal 설치

시작 메뉴에서 `Windows PowerShell`을 한 번 열고 다음 명령을 실행합니다.

```powershell
winget --version
winget install --id Microsoft.WindowsTerminal -e --source winget --accept-source-agreements --accept-package-agreements
```

`winget`을 찾지 못하면 [App Installer 공식 안내](https://learn.microsoft.com/windows/msix/app-installer/install-update-app-installer)에 따라 App Installer를 설치하거나 업데이트합니다. 설치 후 처음 열었던 창을 닫고 시작 메뉴에서 `Windows Terminal`을 엽니다.

탭 오른쪽의 화살표에서 `Windows PowerShell` 프로필을 선택합니다. 이후 모든 명령은 이 탭에서 실행합니다.

```powershell
$PSVersionTable.PSVersion
(Get-CimInstance Win32_OperatingSystem) | Select-Object Caption, BuildNumber, OSArchitecture
[System.Runtime.InteropServices.RuntimeInformation]::OSArchitecture
```

대상 PC에서는 Windows 11과 `X64`가 표시되어야 합니다.

## 2. 개발 프로그램 새로 설치

다음 명령을 위에서부터 한 줄씩 실행합니다.

```powershell
winget install --id OpenJS.NodeJS.LTS -e --source winget --architecture x64 --accept-source-agreements --accept-package-agreements
winget install --id Git.Git -e --source winget --architecture x64 --accept-source-agreements --accept-package-agreements
winget install --id Microsoft.VisualStudioCode -e --source winget --architecture x64 --accept-source-agreements --accept-package-agreements
winget install --id MongoDB.Server -e --source winget --architecture x64 --accept-source-agreements --accept-package-agreements
winget install --id MongoDB.Shell -e --source winget --architecture x64 --accept-source-agreements --accept-package-agreements
```

설치가 끝나면 Windows Terminal 창을 모두 닫고 새 창을 엽니다.

```powershell
node --version
npm.cmd --version
git --version
code --version
mongosh --version
```

이 과정은 Node.js `22.13.0` 이상을 사용합니다. Next.js의 현재 최소 버전보다 높은 강의 공통 기준입니다.

명령을 찾지 못하면 새 Windows Terminal 창인지 확인한 뒤 실행 파일 경로를 확인합니다.

```powershell
(Get-Command node).Source
(Get-Command git).Source
(Get-Command code).Source
(Get-Command mongosh).Source
```

> !@#windows11 test: [Windows 11 x64 초기화 PC에서 Windows Terminal, Node.js LTS x64, Git for Windows x64, VS Code x64, MongoDB Community Server x64, mongosh x64를 위 winget 명령으로 신규 설치하고 Next.js 전체 단계를 다시 검증합니다.]@#

## 3. 강의 저장소 준비

모든 강의 저장소는 현재 사용자 프로필의 `dongbu` 폴더 아래에 둡니다.

```powershell
New-Item -ItemType Directory -Path "$HOME\dongbu" -Force | Out-Null
Set-Location "$HOME\dongbu"
git clone https://github.com/db-woman-2026/NextJsBlog_Steps.git
Set-Location "$HOME\dongbu\NextJsBlog_Steps"
git status
```

이미 `$HOME\dongbu\NextJsBlog_Steps` 폴더를 받았다면 `git clone`은 생략하고 `Set-Location`부터 실행합니다. OneDrive가 관리하는 바탕 화면이나 문서 폴더는 파일 잠금과 동기화 충돌이 생길 수 있으므로 사용하지 않습니다.

## 4. 첫 단계 실행

저장소 루트에서 branch와 변경 상태를 확인하고 잠금 파일에 고정된 패키지를 설치합니다.

```powershell
Set-Location "$HOME\dongbu\NextJsBlog_Steps"
git switch step-1
git status --short
npm.cmd ci
npm.cmd run lint
npm.cmd run build
npm.cmd run dev
```

브라우저에서 `http://localhost:3000`을 엽니다. 개발 서버는 `Ctrl+C`로 종료합니다. Windows 방화벽이 Node.js 연결을 물으면 공용 네트워크는 선택하지 않고 신뢰하는 개인 네트워크에서만 허용합니다.

PowerShell에서 `npm.ps1` 실행 정책 오류가 나오면 정책을 바꾸지 말고 `npm.cmd`를 사용합니다. `npx`가 필요한 경우에도 `npx.cmd`를 사용합니다.

## 5. MongoDB Windows 서비스

MongoDB Community Server는 `MongoDB`라는 Windows 서비스로 설치됩니다.

```powershell
Get-Service MongoDB
Test-NetConnection 127.0.0.1 -Port 27017
mongosh "mongodb://127.0.0.1:27017" --eval 'db.runCommand({ ping: 1 })'
```

서비스가 `Running`이고 `TcpTestSucceeded : True`가 나오면 준비됐습니다. 서비스가 멈춰 있으면 Windows Terminal을 관리자 권한으로 한 번 열어 `Start-Service MongoDB`를 실행한 뒤 관리자 창을 닫습니다.

`step-3`부터 환경 파일을 준비합니다.

```powershell
Set-Location "$HOME\dongbu\NextJsBlog_Steps"
git switch step-3
Copy-Item -LiteralPath .env.example -Destination .env.local
Get-Content -LiteralPath .env.local -Encoding utf8
```

`MONGODB_DB`는 `next_blog_`로 시작하는 전용 실습 DB를 사용합니다. 비밀번호가 포함된 연결 문자열은 화면 공유, 문서, commit에 넣지 않습니다.

## 6. Windows 프로덕션 빌드

`step-4`부터 MongoDB 패키지가 서버 bundle에 포함됩니다. Next.js 16의 기본 Turbopack 빌드는 Windows에서 MongoDB용 junction 생성 오류 87을 일으킬 수 있으므로 이 강의의 `build` script는 공식 `--webpack` 옵션을 사용합니다.

```powershell
Set-Location "$HOME\dongbu\NextJsBlog_Steps"
git switch step-4
npm.cmd ci
npm.cmd run lint
npm.cmd run build
```

`next build --webpack`과 route 목록이 오류 없이 끝나면 성공입니다. `package.json`의 `build` script에서 `--webpack`을 임의로 제거하지 않습니다.

## 7. API 요청 확인

개발 서버를 실행한 Windows Terminal 탭은 그대로 둡니다. 새 PowerShell 탭에서 요청합니다.

```powershell
$post = @{
    title = 'Windows API 확인'
    content = 'PowerShell에서 보낸 본문'
} | ConvertTo-Json

Invoke-RestMethod `
    -Method Post `
    -Uri 'http://localhost:3000/api/post' `
    -ContentType 'application/json' `
    -Body $post

Invoke-RestMethod -Uri 'http://localhost:3000/api/post'
```

HTTP 상태와 JSON 결과를 확인합니다. 강의 문서에 ID가 필요한 명령이 나오면 직전 응답의 실제 ID를 사용합니다.

## 8. App Router 대괄호 경로

`[id]`가 들어간 경로는 PowerShell wildcard로 해석되지 않도록 `-LiteralPath`를 사용합니다.

```powershell
Get-Content -LiteralPath 'app/detail/[id]/page.js' -Encoding utf8
Remove-Item -LiteralPath 'app/detail/[id]/page.module.css'
Test-Path -LiteralPath 'app/api/post/[id]/route.js'
```

## 9. VS Code와 파일 상태

```powershell
Set-Location "$HOME\dongbu\NextJsBlog_Steps"
code .
git config --global --get core.autocrlf
git diff --check
```

VS Code 오른쪽 아래에서 인코딩이 `UTF-8`인지 확인합니다. 저장소의 `.gitattributes`가 소스와 문서의 줄바꿈을 관리하므로 전체 파일의 줄바꿈을 한꺼번에 바꾸지 않습니다.

## 공식 안내

- [Windows Terminal 설치](https://learn.microsoft.com/windows/terminal/install)
- [winget install 명령](https://learn.microsoft.com/windows/package-manager/winget/install)
- [Node.js 다운로드](https://nodejs.org/en/download)
- [Git for Windows](https://git-scm.com/install/windows)
- [VS Code Windows 설치](https://code.visualstudio.com/docs/setup/windows)
- [Next.js 설치](https://nextjs.org/docs/app/getting-started/installation)
- [MongoDB Community Server Windows 설치](https://www.mongodb.com/docs/v8.0/tutorial/install-mongodb-on-windows/)
