# Windows 11 환경 준비

Windows 11에서는 Windows Terminal의 PowerShell로 실습합니다. 명령은 저장소 루트에서 실행합니다.

## 1. 프로그램 설치

다음 프로그램을 설치합니다.

- [Node.js](https://nodejs.org/en/download): 이 과정은 `22.13.0` 이상을 기준으로 합니다.
- [Git for Windows](https://git-scm.com/install/windows.html)
- [Visual Studio Code](https://code.visualstudio.com/docs/setup/windows)
- [MongoDB Community Server](https://www.mongodb.com/docs/v8.0/tutorial/install-mongodb-on-windows/): 데이터베이스 단계부터 필요합니다. Atlas를 사용한다면 로컬 서버를 설치하지 않아도 됩니다.

Next.js 자체의 최소 요구 버전은 [공식 설치 안내](https://nextjs.org/docs/app/getting-started/installation)에서 확인합니다. 여러 강의 프로젝트를 같은 환경에서 실행하기 위해 이 과정은 Node.js `22.13.0` 이상으로 맞춥니다.

Git과 VS Code는 `winget`으로 설치할 수도 있습니다.

```powershell
winget install --id Git.Git -e --source winget
winget install --id Microsoft.VisualStudioCode -e --source winget
```

설치 후 터미널을 새로 열고 확인합니다.

```powershell
node --version
npm.cmd --version
git --version
code --version
```

## 2. 프로젝트 실행

OneDrive 동기화 폴더보다 `C:\workspace`처럼 짧은 작업 경로를 권장합니다.

```powershell
Set-Location C:\workspace\NextJsBlog_Steps
npm.cmd ci
npm.cmd run dev
```

브라우저에서 `http://localhost:3000`을 엽니다. 개발 서버는 `Ctrl+C`로 종료합니다. Windows 방화벽 창이 뜨면 개인 네트워크에서만 Node.js 접근을 허용합니다.

빌드와 lint도 같은 터미널에서 확인합니다.

```powershell
npm.cmd run lint
npm.cmd run build
```

## 3. MongoDB와 환경 변수

로컬 MongoDB를 쓴다면 공식 MSI 설치 프로그램에서 Windows 서비스로 등록합니다. MongoDB Community Server를 WSL 안에 설치하지 않습니다.

```powershell
Get-Service MongoDB
Test-NetConnection 127.0.0.1 -Port 27017
Copy-Item .env.example .env.local
Get-Content .env.local -Encoding utf8
```

서비스가 멈춰 있다면 관리자 PowerShell에서 `Start-Service MongoDB`를 실행합니다. Atlas를 쓸 때는 Atlas 연결 문자열을 `.env.local`에 입력하고 개발 서버를 다시 시작합니다.

강의 데이터베이스 이름은 `next_blog_`로 시작하게 정합니다. 예시는 `next_blog_practice`입니다. 기존 프로젝트에서 사용하던 `blog` 데이터베이스를 그대로 연결하지 않습니다.

## 4. PowerShell 명령 대응

| macOS·Linux 예제 | PowerShell |
| --- | --- |
| `pwd` | `Get-Location` |
| `ls` | `Get-ChildItem` |
| `cp A B` | `Copy-Item A B` |
| `rm FILE` | `Remove-Item FILE` |
| `rm app/detail/[id]/page.module.css` | `Remove-Item -LiteralPath 'app/detail/[id]/page.module.css'` |
| `cat FILE` | `Get-Content FILE -Encoding utf8` |
| `curl ...` | `Invoke-RestMethod ...` |

`git`, `node`, `npm`, `npx` 명령은 PowerShell에서도 같은 형식으로 실행합니다. PowerShell이 `npm.ps1`이나 `npx.ps1`을 차단하면 실행 정책을 바꾸기 전에 `npm.cmd`와 `npx.cmd`를 사용합니다.

## 5. 경로와 줄바꿈

JavaScript에서 경로를 조합할 때는 `node:path`를 사용합니다. 저장소의 `.gitattributes`는 소스와 문서의 줄바꿈을 LF로 맞춥니다. VS Code 오른쪽 아래에서 파일 인코딩이 UTF-8인지 확인합니다.
