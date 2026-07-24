# Windows 11 x64 실습 환경 준비

아래 명령은 Windows 11 x64와 Windows Terminal의 `Windows PowerShell` 프로필에서 실행합니다. 프로그램이 이미 설치되어 있어도 `winget install` 명령으로 설치 상태와 최신 안정판 여부를 확인합니다.

## 1. Windows Terminal 설치

시작 메뉴에서 `Windows PowerShell`을 한 번 열고 다음 명령을 실행합니다.

```powershell
winget --version
winget install --id Microsoft.WindowsTerminal -e --source winget --accept-source-agreements --accept-package-agreements
```

`winget`을 찾지 못하면 [App Installer 공식 안내](https://learn.microsoft.com/windows/msix/app-installer/install-update-app-installer) <span class="print-url" data-print-url="true">(https://learn.microsoft.com/windows/msix/app-installer/install-update-app-installer)</span>에 따라 App Installer를 설치하거나 업데이트합니다. 설치 후 처음 열었던 창을 닫고 시작 메뉴에서 `Windows Terminal`을 엽니다.

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
winget install --id GitHub.cli -e --source winget --architecture x64 --accept-source-agreements --accept-package-agreements
winget install --id MongoDB.Server -e --source winget --architecture x64 --accept-source-agreements --accept-package-agreements
winget install --id MongoDB.Shell -e --source winget --architecture x64 --accept-source-agreements --accept-package-agreements
```

설치가 끝나면 Windows Terminal 창을 모두 닫고 새 창을 엽니다.

```powershell
node --version
npm --version
git --version
code --version
gh --version
mongosh --version
```

Node.js `22.13.0` 이상을 사용합니다. Next.js의 현재 최소 버전보다 높은 프로젝트 기준입니다.

명령을 찾지 못하면 새 Windows Terminal 창인지 확인한 뒤 실행 파일 경로를 확인합니다.

```powershell
(Get-Command node).Source
(Get-Command git).Source
(Get-Command code).Source
(Get-Command mongosh).Source
```

> !@#windows11 test: [Windows 11 x64 초기화 PC에서 Windows Terminal, Node.js LTS x64, Git for Windows x64, VS Code x64, MongoDB Community Server x64, mongosh x64를 위 winget 명령으로 신규 설치하고 Next.js 전체 단계를 다시 검증합니다.]@#

## 3. Git과 GitHub 계정 연결

```powershell
git config --global user.name "Student Name"
git config --global user.email "student@example.com"
git config --global --get user.name
git config --global --get user.email
gh auth login --hostname github.com --web
gh auth status --hostname github.com
```

## 4. 개인 Next.js 프로젝트 만들기

이 저장소를 clone하지 않고 지정된 버전의 `create-next-app`으로 JavaScript App Router 프로젝트를 만듭니다. `--disable-git`을 사용해 Git 저장소는 다음 절에서 직접 초기화합니다.

```powershell
New-Item -ItemType Directory -Path "$HOME\dongbu" -Force | Out-Null
Set-Location "$HOME\dongbu"
npx create-next-app@16.2.11 nextjs-blog --use-npm --js --eslint --app --no-src-dir --no-tailwind --no-react-compiler --no-agents-md --disable-git --import-alias "@/*"
Set-Location "$HOME\dongbu\nextjs-blog"
New-Item -ItemType File -Path .gitattributes -Force | Out-Null
code .
```

프로젝트 폴더 이름은 `nextjs-blog`입니다. OneDrive가 관리하는 바탕 화면이나 문서 폴더는 사용하지 않습니다.

VS Code에서 `.gitattributes` 전체를 입력합니다.

```text
* text=auto

*.js text eol=lf
*.mjs text eol=lf
*.json text eol=lf
*.md text eol=lf
*.css text eol=lf
*.env.example text eol=lf

*.png binary
*.jpg binary
*.jpeg binary
*.gif binary
*.ico binary
*.woff binary
*.woff2 binary
```

## 5. 생성된 프로젝트 확인

```powershell
Set-Location "$HOME\dongbu\nextjs-blog"
npm run lint
npm run build
npm run dev
```

브라우저에서 `http://localhost:3000`을 엽니다. create-next-app 기본 화면이 보이면 생성이 끝났습니다. 개발 서버는 `Ctrl+C`로 종료합니다. Windows 방화벽이 Node.js 연결을 물으면 공용 네트워크는 선택하지 않고 신뢰하는 개인 네트워크에서만 허용합니다.

## 6. 첫 commit과 GitHub 저장소 만들기

```powershell
Set-Location "$HOME\dongbu\nextjs-blog"
git init -b main
git add .
git commit -m "Create Next.js blog project"
gh repo create nextjs-blog --private --source . --remote origin --push
git branch --show-current
git status --short --branch
git remote -v
```

현재 branch는 `main`이어야 합니다. 작업 파일 목록은 비어 있어야 하며 `origin`에는 본인 GitHub 계정의 저장소 주소가 표시되어야 합니다.

같은 저장소 이름이 이미 있으면 `gh repo create`의 이름을 `nextjs-blog-이름`처럼 바꿉니다. 로컬 폴더 이름은 그대로 사용해도 됩니다.

## 7. MongoDB Windows 서비스

MongoDB Community Server는 `MongoDB`라는 Windows 서비스로 설치됩니다.

```powershell
Get-Service MongoDB
Test-NetConnection 127.0.0.1 -Port 27017
mongosh "mongodb://127.0.0.1:27017" --eval 'db.runCommand({ ping: 1 })'
```

서비스가 `Running`이고 `TcpTestSucceeded : True`가 나오면 준비됐습니다. 서비스가 멈춰 있으면 Windows Terminal을 관리자 권한으로 한 번 열어 `Start-Service MongoDB`를 실행한 뒤 관리자 창을 닫습니다.

Step 3부터 환경 파일을 준비합니다.

```powershell
Set-Location "$HOME\dongbu\nextjs-blog"
git branch --show-current
Copy-Item -LiteralPath .env.example -Destination .env.local
Get-Content -LiteralPath .env.local -Encoding utf8
```

`MONGODB_DB`는 `next_blog_`로 시작하는 전용 실습 DB를 사용합니다. 비밀번호가 포함된 연결 문자열은 화면 공유, 문서, commit에 넣지 않습니다.

## 8. Windows 개발 서버와 프로덕션 빌드

Step 4부터 MongoDB 패키지가 서버 bundle에 포함됩니다. Next.js 16의 기본 Turbopack 개발 서버와 빌드는 Windows에서 MongoDB용 junction 생성 오류 87을 일으킬 수 있으므로 `dev`와 `build` script는 공식 `--webpack` 옵션을 사용합니다.

```powershell
Set-Location "$HOME\dongbu\nextjs-blog"
git branch --show-current
npm install
npm run lint
npm run build
npm run dev
```

`next build --webpack`과 route 목록이 오류 없이 끝난 뒤 API가 JSON을 반환하면 성공입니다. `package.json`의 `dev`와 `build` script에서 `--webpack`을 임의로 제거하지 않습니다.

## 9. API 요청 확인

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

HTTP 상태와 JSON 결과를 확인합니다. 문서에서 ID가 필요한 명령은 직전 응답의 실제 ID를 사용합니다.

## 10. App Router 대괄호 경로

`[id]`가 들어간 경로는 PowerShell wildcard로 해석되지 않도록 `-LiteralPath`를 사용합니다.

```powershell
Get-Content -LiteralPath 'app/detail/[id]/page.js' -Encoding utf8
Remove-Item -LiteralPath 'app/detail/[id]/page.module.css'
Test-Path -LiteralPath 'app/api/post/[id]/route.js'
```

## 11. VS Code와 파일 상태

```powershell
Set-Location "$HOME\dongbu\nextjs-blog"
code .
git config --global --get core.autocrlf
git diff --check
```

VS Code 오른쪽 아래에서 인코딩이 `UTF-8`인지 확인합니다. 저장소의 `.gitattributes`가 소스와 문서의 줄바꿈을 관리하므로 전체 파일의 줄바꿈을 한꺼번에 바꾸지 않습니다.

## 공식 안내

- [Windows Terminal 설치](https://learn.microsoft.com/windows/terminal/install) <span class="print-url" data-print-url="true">(https://learn.microsoft.com/windows/terminal/install)</span>
- [winget install 명령](https://learn.microsoft.com/windows/package-manager/winget/install) <span class="print-url" data-print-url="true">(https://learn.microsoft.com/windows/package-manager/winget/install)</span>
- [Node.js 다운로드](https://nodejs.org/en/download) <span class="print-url" data-print-url="true">(https://nodejs.org/en/download)</span>
- [Git for Windows](https://git-scm.com/install/windows) <span class="print-url" data-print-url="true">(https://git-scm.com/install/windows)</span>
- [GitHub CLI 설치](https://github.com/cli/cli/blob/trunk/docs/install_windows.md) <span class="print-url" data-print-url="true">(https://github.com/cli/cli/blob/trunk/docs/install_windows.md)</span>
- [VS Code Windows 설치](https://code.visualstudio.com/docs/setup/windows) <span class="print-url" data-print-url="true">(https://code.visualstudio.com/docs/setup/windows)</span>
- [Next.js 설치](https://nextjs.org/docs/app/getting-started/installation) <span class="print-url" data-print-url="true">(https://nextjs.org/docs/app/getting-started/installation)</span>
- [MongoDB Community Server Windows 설치](https://www.mongodb.com/docs/v8.0/tutorial/install-mongodb-on-windows/) <span class="print-url" data-print-url="true">(https://www.mongodb.com/docs/v8.0/tutorial/install-mongodb-on-windows/)</span>
