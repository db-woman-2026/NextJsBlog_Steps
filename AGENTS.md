# AGENTS.md

- Preserve the branch chain: `main -> step-1 -> ... -> step-23`.
- For project-wide changes, commit first on `step-1`, then merge upward one branch at a time through `step-23`.
- For step-specific changes, commit on the earliest affected step branch, then merge upward sequentially through `step-23`.
- Do not apply the same change independently to multiple step branches.
- After propagation, verify adjacent ancestry with `git merge-base --is-ancestor step-N step-(N+1)`.

## 강의 문서 문체

`docs/**/*.md`를 작성하거나 수정할 때 아래 기준을 적용합니다.

### 기본 원칙

- 강사가 학생에게 설명하듯 짧고 분명한 `합니다`체를 사용합니다.
- 한 문장에는 한 가지 내용만 담고, 한 문단은 2~3문장을 넘기지 않습니다.
- 먼저 할 일과 확인할 결과를 적고, 필요한 이유는 그다음에 설명합니다.
- 본문은 한국어를 기본으로 합니다. 제품명, API, 명령, 코드 식별자만 원문을 쓰고 리터럴은 백틱으로 표시합니다.
- 같은 개념은 문서 전체에서 같은 용어로 부릅니다.
- 코드 블록, diff, 명령, 파일명, 링크 대상은 문체 수정 대상으로 삼지 않습니다.

### 피할 패턴

- `Overview`, `Course`, `Detailed Lecture`처럼 한국어와 영어를 겹쳐 쓴 제목
- `이 문서는 ... 구성합니다`, `이 폴더에는 ... 누적됩니다`처럼 문서 자체를 설명하는 도입부
- 모든 문단에서 반복되는 `이번 단계에서는`, `이 단계가 끝나면`, `직접 경험합니다`
- `단순히 A가 아니라 B`, `핵심은`, `~를 넘어`, `여정`, `완주`, `튼튼한 기반`, `자연스럽게` 같은 상투적 대비와 수사
- 구체적인 동작 없이 쓰는 `할 수 있게 합니다`, `도와줍니다`, `중요합니다`, `살펴봅니다`
- `목표`, `핵심`, `흐름`, `포인트`가 여러 절에서 같은 뜻으로 반복되는 구성
- 필요 이상으로 나눈 `지식/기능/태도`, 산출물, 체크포인트, 회고 목록
- `강력한`, `견고한`, `풍부한`, `원활한`, `효율적인` 같은 근거 없는 평가 표현
- 도구가 사람처럼 판단하거나 기억한다고 쓰는 의인화

### 표현 기준

| 피할 표현 | 권장 표현 |
| --- | --- |
| 이번 스텝 주요 기능 Overview | 이번 단계에서 할 일 |
| 이 문서는 1일차 수업을 그대로 진행할 수 있게 구성합니다. | 1일차에는 테이블을 만들고 저장 결과를 확인합니다. |
| 이번 단계에서는 입력 검증을 추가합니다. | 입력값의 공백과 길이를 검사합니다. |
| 이 단계가 끝나면 화면이 완성되어 있어야 합니다. | 완료 후 화면과 오류 메시지를 확인합니다. |
| 직접 수정할 파일 / 직접 타이핑할 내용 | 수정할 파일 / 입력할 내용 |
| 이전 단계와 달라지는 코드 | 코드 변경 |

### 수정 전후 확인

- 제목과 첫 두 문단을 소리 내어 읽었을 때 수업 안내처럼 들리는지 확인합니다.
- 위의 상투 표현이 새로 들어오지 않았는지 `/docs` 전체에서 검색합니다.
- 설명을 줄인 뒤에도 실행 순서, 예상 결과, 오류 조건이 남아 있는지 확인합니다.
- 코드 블록과 diff가 원본 코드와 같은지 확인합니다.

## Windows 11 병기

- 강의의 Windows 기준 터미널은 Windows Terminal의 PowerShell입니다. WSL이나 Git Bash만 제시하지 않습니다.
- `git`, `node`, `npm`, `npx`처럼 PowerShell에서도 같은 명령은 문서 앞에서 한 번만 안내합니다.
- `cp`, `rm`, `cat`, `ls`, `grep`, `which`, `pwd`, `curl`처럼 문법이 다른 명령에는 바로 이어지는 `powershell` 코드 블록을 둡니다.
- PowerShell에서는 `Copy-Item`, `Remove-Item`, `Get-Content`, `Get-ChildItem`, `Select-String`, `Get-Command`, `Get-Location`, `Invoke-RestMethod`를 사용합니다.
- 설치 안내는 Node.js, Git, VS Code, Next.js, MongoDB의 공식 문서 링크와 이 과정의 최소 버전을 함께 적습니다.
- 경로 예시는 `C:\workspace\...`를 사용하고, 공백 경로의 따옴표, `.env.local` 복사, UTF-8, CRLF/LF, 방화벽 안내를 확인합니다.
- 대괄호가 들어간 App Router 경로는 PowerShell에서 `-LiteralPath`로 처리합니다.
- `npm.ps1` 실행 정책 오류가 나면 먼저 `npm.cmd`와 `npx.cmd`를 안내합니다. 실행 정책 변경을 필수 절차로 두지 않습니다.
- Windows 전용 MongoDB는 공식 MSI 설치와 서비스 실행을 기준으로 설명합니다. Windows의 WSL 안에 MongoDB Community Server를 설치하도록 안내하지 않습니다.
- 새 셸 블록을 추가한 뒤 `/docs` 전체에서 운영체제 의존 명령을 다시 검색합니다.

## 강의 품질 기준

- 각 `step-N` 문서는 diff의 기준이 `step-(N-1)`임을 밝히고, 현재 branch가 완성본이라는 점을 구분합니다.
- 단계마다 권장 시간, 시작 상태, 관찰 가능한 결과, 실행 확인, 독립 확인 과제를 둡니다.
- `diff` 블록은 실제 인접 branch diff와 파일 내용, hunk 위치까지 비교합니다.
- 자동 생성된 `package-lock.json`은 직접 입력시키지 않고 실행 명령과 확인할 `package.json` 변경을 설명합니다.
- API 실습은 정상 요청뿐 아니라 빈 값, 잘못된 ID, 범위를 벗어난 query string, 서버 오류를 확인합니다.
- MongoDB 예제는 강의 전용 데이터베이스 이름을 사용하고 사용자 검색어를 정규식으로 해석할지 문자 그대로 찾을지 명시합니다.
- 비동기 화면은 loading, success, empty, error 중 해당 상태를 빠뜨리지 않습니다.
- 브라우저 확인 항목은 주소, 입력 동작, Network 응답 상태, 저장 결과 중 관련 항목을 구체적으로 적습니다.
- 새 단계가 앞 단계의 코드를 다시 고치면 처음 도입한 문서의 설명과 과정 계획도 함께 갱신합니다.
