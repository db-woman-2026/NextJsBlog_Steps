# Step 9. 최종 README와 프로젝트 정리

## 변경 내용

기본 블로그의 저장소 구조와 화면·API 흐름을 점검합니다.

- 화면과 API의 실행 순서를 기록한다.
- 사용하지 않는 `create-next-app` 기본 이미지 자산을 제거한다.
- 라우트 목록과 실행 방법을 문서화한다.
- API별 요청과 응답 형식이 일관적인지 확인한다.
- 기본 블로그 전체 흐름을 검증한다.

## README 정리

README는 GitHub 저장소 첫 화면에서 가장 먼저 읽는 문서입니다.

README에는 다음 내용이 있어야 합니다.

- 프로젝트 목적
- 사용 기술 스택
- 실행 방법
- 환경 변수 준비 방법
- 라우트 목록
- API 요청과 응답 형식
- 자주 쓰는 검증 명령
- 주요 폴더와 파일의 역할

## 기본 이미지 자산 제거

`create-next-app`은 기본 랜딩 페이지에서 쓰는 SVG 파일들을 `public` 폴더에 만듭니다.

하지만 이 프로젝트는 기본 랜딩 페이지를 제거했고, 해당 SVG 파일을 더 이상 사용하지 않습니다.

다음 파일을 제거합니다.

```txt
public/file.svg
public/globe.svg
public/next.svg
public/vercel.svg
public/window.svg
app/favicon.ico
```

사용하지 않는 파일을 정리하면 프로젝트 구조에서 확인할 대상이 줄어듭니다.

## 라우트 목록

프로젝트에는 다음 페이지 라우트가 있습니다.

| 주소 | 역할 |
| --- | --- |
| `/` | 게시글 목록 |
| `/detail/[id]` | 게시글 상세 |
| `/post` | 게시글 작성 |
| `/post/[id]` | 게시글 수정 |
| `/about` | 소개 페이지 |
| `/contact` | Contact mockup form |

API 라우트는 다음과 같습니다.

| Method | 주소 | 요청 데이터 | 성공 시 `data` |
| --- | --- | --- | --- |
| `GET` | `/api/post` | 없음 | 게시글 배열 |
| `POST` | `/api/post` | `{ title, content, image? }` | `{ postId }` |
| `GET` | `/api/post/[id]` | URL의 `id` | 게시글 하나 |
| `PUT` | `/api/post/[id]` | URL의 `id`, `{ title, content }` | `{ postId }` |

모든 API 응답은 다음 공통 형식을 사용합니다.

```json
{
  "success": true,
  "message": "Posts fetched successfully",
  "data": []
}
```

오류 응답도 같은 최상위 필드를 유지합니다.

```json
{
  "success": false,
  "message": "Post not found",
  "data": null
}
```

따라서 화면 코드는 `response.json()` 결과에서 항상 `message`와 `data`를 같은 방식으로 읽습니다. 홈 목록은 `data` 배열을 사용하고, 수정 화면의 단건 조회는 `data.title`, `data.content`를 form에 채웁니다.

## 기능 확인

주요 흐름은 다음과 같습니다.

1. `/`에서 게시글 목록을 본다.
2. 게시글 제목을 눌러 `/detail/[id]` 상세 화면으로 이동한다.
3. 상세 화면에서 `Edit`을 눌러 `/post/[id]` 수정 화면으로 이동한다.
4. 게시글을 수정하고 홈으로 돌아오는지 확인한다.
5. `/post`에서 새 게시글을 작성한다.
6. 작성 후 홈으로 이동하고, 새 글을 눌러 상세 화면에서 확인한다.
7. `/about`에서 소개 이미지가 보이는지 확인한다.
8. `/contact`에서 mockup form alert가 동작하는지 확인한다.
9. `/api/post`, `/api/post/[id]`의 성공/오류 응답이 모두 `{ success, message, data }` 형식인지 확인한다.

## 검증 명령

코드 규칙과 production build는 다음 명령으로 확인합니다.

> Windows 11에서는 [환경 준비](../windows-11.md) <span class="print-reference" data-print-reference="true">(인쇄본 위치: Next.js · 장 「Windows 11 x64 실습 환경 준비」 · 절 「1. Windows Terminal 설치」)</span>를 먼저 확인합니다. 명령은 이 교재의 PowerShell 코드 블록에 적힌 `git`, `node`, `npm.cmd` 형태를 그대로 사용합니다.

```powershell
npm.cmd run lint
npm.cmd run build
```

실제 게시글 흐름까지 확인하려면 MongoDB와 `.env.local`이 필요합니다.

```powershell
Copy-Item -LiteralPath .env.example -Destination .env.local
npm.cmd run dev
```

PowerShell에서는 다음 명령을 사용합니다.

```powershell
Copy-Item .env.example .env.local
npm.cmd run dev
```

로컬 MongoDB를 사용한다면 `.env.local`은 다음처럼 둘 수 있습니다.

```txt
MONGODB_URI=mongodb://localhost:27017/next_blog_practice
MONGODB_DB=next_blog_practice
```

## 저장소 확인

작업은 개인 저장소의 `main`에 기록합니다. 오류가 나면 `git status`와 마지막으로 통과한 commit을 먼저 확인합니다.

예를 들어 홈 목록의 `/detail/[id]` 링크가 열리지 않으면 상세 라우트와 현재 파일 경로를 먼저 확인합니다. 원인을 고친 뒤 `lint`, `build`, 브라우저 확인을 다시 통과시키고 commit합니다.
