# NextJsBlog_Steps

Windows 11 x64에서 Next.js 블로그를 단계별로 만드는 초급 강의 저장소입니다. `main`은 시작 화면이고 `step-1`부터 `step-23`까지 기능과 강의 문서를 누적합니다.

## 브랜치 학습 구조

```text
main -> step-1 -> step-2 -> ... -> step-23
```

각 `step-N`은 바로 이전 branch를 부모로 가집니다. 특정 단계부터 필요한 수정은 가장 이른 branch에 commit하고 다음 branch로 차례대로 merge합니다.

```powershell
git merge-base --is-ancestor step-1 step-2
```

## Windows Terminal 설치

시작 메뉴에서 `Windows PowerShell`을 한 번 열고 Windows Terminal을 설치합니다.

```powershell
winget --version
winget install --id Microsoft.WindowsTerminal -e --source winget --accept-source-agreements --accept-package-agreements
```

설치가 끝나면 처음 열었던 창을 닫습니다. 시작 메뉴에서 `Windows Terminal`을 열고 `Windows PowerShell` 프로필을 선택합니다.

## 개발 프로그램 새로 설치

프로그램이 이미 보여도 다음 명령을 모두 실행해 설치 상태를 확인합니다.

```powershell
winget install --id OpenJS.NodeJS.LTS -e --source winget --architecture x64 --accept-source-agreements --accept-package-agreements
winget install --id Git.Git -e --source winget --architecture x64 --accept-source-agreements --accept-package-agreements
winget install --id Microsoft.VisualStudioCode -e --source winget --architecture x64 --accept-source-agreements --accept-package-agreements
```

Windows Terminal 창을 모두 닫고 새 창에서 버전을 확인합니다.

```powershell
node --version
npm.cmd --version
git --version
code --version
```

이 과정은 Node.js `22.13.0` 이상을 사용합니다. `npm.ps1` 실행 정책 오류가 나오면 시스템 정책을 바꾸지 말고 `npm.cmd`와 `npx.cmd`를 사용합니다.

> !@#windows11 test: [Windows 11 x64 초기화 PC에서 Windows Terminal, Node.js LTS x64, Git for Windows x64, VS Code x64를 위 winget 명령으로 신규 설치하고 Next.js 전체 단계를 다시 검증합니다.]@#

## 저장소 준비와 실행

강의 저장소는 현재 사용자 프로필의 `dongbu` 폴더 아래에 둡니다.

```powershell
New-Item -ItemType Directory -Path "$HOME\dongbu" -Force | Out-Null
Set-Location "$HOME\dongbu"
git clone https://github.com/db-woman-2026/NextJsBlog_Steps.git
Set-Location "$HOME\dongbu\NextJsBlog_Steps"
git switch main
git status --short
npm.cmd ci
npm.cmd run lint
npm.cmd run build
npm.cmd run dev
```

이미 저장소 폴더를 받았다면 `git clone`은 생략합니다. 브라우저에서 `http://localhost:3000`을 열고 개발 서버는 `Ctrl+C`로 종료합니다.

Windows 방화벽이 Node.js 연결을 물으면 공용 네트워크는 선택하지 않고 신뢰하는 개인 네트워크에서만 허용합니다. OneDrive가 관리하는 바탕 화면이나 문서 폴더 대신 `$HOME\dongbu\NextJsBlog_Steps`를 사용합니다.

## 다음 단계

```powershell
Set-Location "$HOME\dongbu\NextJsBlog_Steps"
git switch step-1
npm.cmd ci
npm.cmd run lint
npm.cmd run build
npm.cmd run dev
```

`step-1`부터는 [Windows 11 환경 준비](https://github.com/db-woman-2026/NextJsBlog_Steps/blob/step-1/docs/windows-11.md)와 단계별 강의 문서를 함께 확인합니다.

## 공식 안내

- [Windows Terminal 설치](https://learn.microsoft.com/windows/terminal/install)
- [winget install 명령](https://learn.microsoft.com/windows/package-manager/winget/install)
- [Node.js 다운로드](https://nodejs.org/en/download)
- [Git for Windows](https://git-scm.com/install/windows)
- [VS Code Windows 설치](https://code.visualstudio.com/docs/setup/windows)
- [Next.js 설치](https://nextjs.org/docs/app/getting-started/installation)
