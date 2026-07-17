# Step 9. 최종 README와 프로젝트 정리

## 배울 내용

`step-9` 브랜치는 step 커리큘럼의 마지막 정리 단계입니다.

새로운 화면 기능은 `step-8`까지 모두 들어갔습니다. 저장소를 수업용 산출물로 보기 좋게 정리하고, 전체 흐름을 다시 점검합니다.

이 단계에서 하는 일은 다음과 같습니다.

- README를 단계별 브랜치 전략에 맞게 정리한다.
- 사용하지 않는 `create-next-app` 기본 이미지 자산을 제거한다.
- 최종 라우트 목록과 실행 방법을 문서화한다.
- API별 요청과 응답 형식이 `step-4`부터 끝까지 유지되는지 확인한다.
- step 전체 흐름을 검증한다.

## 최종 단계에서 기능을 더 넣지 않는 이유

초급자 교육용 단계 브랜치는 각 단계의 목적이 분명해야 합니다.

`step-5`에서는 읽기 흐름을 완성했습니다.

```txt
목록 -> 상세
```

`step-6`에서는 작성 흐름을 완성했습니다.

```txt
작성 form -> POST API -> 홈 목록
```

`step-7`에서는 수정 흐름을 완성했습니다.

```txt
상세 -> Edit -> 수정 form -> PUT API -> 홈 목록
```

`step-8`에서는 Contact mockup을 완성했습니다.

따라서 `step-9`에서는 새 개념을 추가하지 않고, 저장소를 마무리하는 데 집중합니다. 이렇게 해야 마지막 브랜치가 “기능을 하나 더 배우는 단계”가 아니라 “전체 산출물을 정리하고 확인하는 단계”가 됩니다.

## README 정리

README는 GitHub 저장소 첫 화면에서 가장 먼저 읽는 문서입니다.

최종 README에는 다음 내용이 있어야 합니다.

- 이 저장소가 단계별 실습 저장소라는 설명
- 브랜치별 학습 내용
- 사용 기술 스택
- 실행 방법
- 환경 변수 준비 방법
- 라우트 목록
- 자주 쓰는 검증 명령
- 초급자가 기억할 프로젝트 구조

브랜치 표는 실제 단계 순서와 일치해야 합니다.

```txt
main     -> Next.js 기본 프로젝트
step-1  -> 라우팅과 레이아웃 껍데기
step-2  -> 스타일과 이미지 설정
step-3  -> MongoDB 데이터 계층
step-4  -> API Route와 응답 형식 통일
step-5  -> 목록과 상세 읽기
step-6  -> 작성
step-7  -> 수정
step-8  -> Contact mockup
step-9  -> 최종 정리
```

특히 `step-5`에서 이미 `/detail/[id]` 상세 화면이 있어야 합니다. 홈 목록에 상세 링크가 생기는 단계와 상세 페이지가 생기는 단계가 달라지면 중간 브랜치에서 404가 발생합니다.

## 기본 이미지 자산 제거

`create-next-app`은 기본 랜딩 페이지에서 쓰는 SVG 파일들을 `public` 폴더에 만듭니다.

하지만 이 프로젝트는 기본 랜딩 페이지를 제거했고, 해당 SVG 파일을 더 이상 사용하지 않습니다.

그래서 마지막 단계에서 다음 파일을 제거합니다.

```txt
public/file.svg
public/globe.svg
public/next.svg
public/vercel.svg
public/window.svg
app/favicon.ico
```

사용하지 않는 파일을 정리하면 초급자가 프로젝트 구조를 볼 때 집중해야 할 파일이 줄어듭니다.

## 최종 라우트 목록

최종 기본 산출물에는 다음 페이지 라우트가 있습니다.

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

모든 API 응답은 `step-4`에서 만든 공통 형식을 사용합니다.

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

## 최종 기능 확인

`step-9` 브랜치에서 확인할 주요 흐름은 다음과 같습니다.

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

> Windows 11에서는 [환경 준비](../windows-11.md)를 먼저 확인합니다. `git`, `node`, `npm.cmd` 명령은 PowerShell에서도 같습니다. `npm.ps1` 오류가 나면 `npm.cmd`를 사용합니다.

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

## 단계형 브랜치 관리 원칙

이 저장소는 누적형 브랜치 구조입니다.

```txt
main -> step-1 -> step-2 -> ... -> step-9
```

어떤 단계에서 오류가 발견되면 그 오류가 처음 생긴 가장 이른 브랜치에서 고칩니다. 그리고 이후 브랜치로 순차 병합합니다.

예를 들어 홈 목록에 `/detail/[id]` 링크가 처음 생긴 단계는 `step-5`입니다. 따라서 상세 화면 404 문제는 `step-7`에서만 고치면 안 되고, `step-5`에서 상세 라우트를 함께 만들고 `step-6`, `step-7`, 이후 브랜치로 병합해야 합니다.

이 원칙을 지키면 각 브랜치를 따로 체크아웃해서 수업해도 중간 단계가 깨지지 않습니다.

## 이 단계 이후 확장 계획

기본 기능이 끝난 뒤에는 게시판을 실제 서비스에 조금 더 가깝게 만드는 기능을 단계별로 추가할 수 있습니다.

이 저장소에서는 다음 단계부터 확장 기능을 이어갑니다.

| 브랜치 | 주제 |
| --- | --- |
| `step-10` | 입력값 검증 강화와 서버 오류 메시지 표시 |
| `step-11` | 제출 중 상태와 작성/수정 후 상세 페이지 이동 |
| `step-12` | 작성일과 수정일 표시 |
| `step-13` | 삭제 기능 |
| `step-14` | 클라이언트 필터 검색 |
| `step-15` | 서버 검색 |
| `step-16` | 페이지네이션 |
| `step-17` | 정렬 기능 |
| `step-18` | Not Found와 Error UI 개선 |
| `step-19` | 카테고리 |

API 응답 형식 통일은 별도 확장 단계로 두지 않습니다. 이 프로젝트는 이미 `step-4`에서 `{ success, message, data }` 형식으로 API 응답을 통일했기 때문에, 이후 단계는 그 형식을 그대로 사용합니다.

이미지 업로드, 인증, 관리자 페이지, 실제 Contact 메일 전송, 테스트 코드는 더 뒤의 고급 과정으로 분리하는 편이 좋습니다.
