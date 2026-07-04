# Step 9. README와 기본 자산 정리하기

이 문서는 `step-8`에서 시작해 `step-9`를 완성하는 실습 자료입니다.
원본 개요는 [docs/overview/step-9.md](../overview/step-9.md)에 보존되어 있습니다.
아래 파일 링크는 GitHub가 아니라 이 프로젝트 안의 현재 단계 파일을 여는 경로입니다.

## 이번 스텝 주요 기능 Overview

README, 불필요한 기본 자산, 최종 라우트/API 설명을 정리해 기본 블로그 단계를 마무리합니다.

- 기본 블로그 기능이 갖춰진 상태를 README에 정리합니다.
- create-next-app 기본 아이콘과 SVG 자산을 제거합니다.
- 다음 확장 단계로 넘어가기 전에 현재 라우트, API, 실행 방법을 문서화합니다.

## 시작 기준

이전 단계인 `step-8` 브랜치까지 완료된 상태에서 시작합니다.

```bash
git switch step-8
git switch -c practice-step-9
```

정답 브랜치는 확인용으로만 사용합니다.

```bash
git switch step-9
```

## 작업 1. README를 프로젝트 기준 문서로 교체

README는 저장소 첫 화면에서 실습 목적, 브랜치 흐름, 실행 방법, API 형식을 빠르게 확인하는 문서입니다. 기본 Next.js 안내를 이 프로젝트 설명으로 바꿉니다.

### 수정할 파일

- 수정: [README.md](../../README.md)

### 이전 단계와 달라지는 코드

아래 diff에서 `+`로 시작하는 줄을 추가하고, `-`로 시작하는 줄을 제거합니다. 새 파일은 diff에 보이는 전체 내용을 새로 입력합니다.

~~~diff
diff --git a/README.md b/README.md
index 09a8a4d..4f2ff32 100644
--- a/README.md
+++ b/README.md
@@ -1,36 +1,131 @@
-This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).
+# NextJsBlog_Steps
+
+초급 개발자 교육용 Next.js 블로그 프로젝트를 단계별 브랜치로 나눈 저장소입니다.
+
+`main`은 `create-next-app` 직후의 기본 프로젝트 상태입니다. `step-1`부터는 이전 단계 위에 코드를 누적해서 실습합니다. `step-9`는 기본 블로그 기능의 마무리이고, `step-10`부터는 기능 확장 단계입니다.
+
+## Branch Flow
+
+| 브랜치 | 내용 |
+| --- | --- |
+| `main` | Next.js 기본 프로젝트 생성 상태 |
+| `step-1` | App Router 기본 페이지, Header, Footer, nav 구성 |
+| `step-2` | `simpledotcss`, 전역 스타일, About 이미지, 이미지 도메인 설정 |
+| `step-3` | MongoDB 연결, 환경 변수 예시, 게시글 데이터 함수 |
+| `step-4` | 게시글 목록/작성/단건조회/수정 API Route와 통일된 응답 형식 |
+| `step-5` | 홈 화면 게시글 목록과 `/detail/[id]` 상세 읽기 화면 |
+| `step-6` | 새 게시글 작성 form과 POST 요청 |
+| `step-7` | 상세 화면에서 진입하는 게시글 수정 form과 PUT 요청 |
+| `step-8` | Contact mockup form |
+| `step-9` | README 정리, 불필요한 기본 파일 제거, 최종 기본 기능 |
+| `step-10` | 입력값 검증 강화와 서버 오류 메시지 표시 |
+| `step-11` | 제출 중 상태와 작성/수정 후 상세 페이지 이동 |
+| `step-12` | 작성일과 수정일 표시 |
+| `step-13` | 삭제 기능 |
+| `step-14` | 클라이언트 필터 검색 |
+| `step-15` | 서버 검색 |
+| `step-16` | 페이지네이션 |
+| `step-17` | 정렬 기능 |
+| `step-18` | Not Found와 Error UI 개선 |
+| `step-19` | 카테고리 |
+
+각 단계 개요는 `/docs/overview/step-N.md`에 있고, 실습형 강의 자료는 `/docs/lecture/step-N.md`에 있습니다.
+
+## Stack
+
+- Next.js 16
+- React 19
+- MongoDB Node.js Driver 7
+- ESLint 9 flat config
+- simple.css

 ## Getting Started

-First, run the development server:
+의존성을 설치합니다.
+
+```bash
+npm install
+```
+
+환경 변수 예시 파일을 복사합니다.
+
+```bash
+cp .env.example .env.local
+```
+
+로컬 MongoDB를 사용한다면 `.env.local`을 다음처럼 둡니다.
+
+```txt
+MONGODB_URI=mongodb://localhost:27017/blog
+MONGODB_DB=blog
+```
+
+개발 서버를 실행합니다.

 ```bash
 npm run dev
-# or
-yarn dev
-# or
-pnpm dev
-# or
-bun dev
 ```

-Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
+브라우저에서 [http://localhost:3000](http://localhost:3000)을 엽니다.
+
+## Routes

-You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.
+| 주소 | 역할 |
+| --- | --- |
+| `/` | 게시글 목록 |
+| `/detail/[id]` | 게시글 상세 |
+| `/post` | 게시글 작성 |
+| `/post/[id]` | 게시글 수정 |
+| `/about` | 소개 페이지 |
+| `/contact` | Contact mockup form |
+| `/api/post` | 게시글 목록/작성 API |
+| `/api/post/[id]` | 게시글 단건 조회/수정 API |

-This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.
+## API Response Format

-## Learn More
+모든 API 응답은 같은 최상위 필드를 사용합니다.

-To learn more about Next.js, take a look at the following resources:
+```json
+{
+  "success": true,
+  "message": "Posts fetched successfully",
+  "data": []
+}
+```

-- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
-- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
+오류도 같은 형식으로 반환합니다.

+```json
+{
+  "success": false,
+  "message": "Post not found",
+  "data": null
+}
+```
+
+| Method | 주소 | 요청 데이터 | 성공 시 `data` |
+| --- | --- | --- | --- |
+| `GET` | `/api/post` | 없음 | 게시글 배열 |
+| `POST` | `/api/post` | `{ title, content, image? }` | `{ postId }` |
+| `GET` | `/api/post/[id]` | URL의 `id` | 게시글 하나 |
+| `PUT` | `/api/post/[id]` | URL의 `id`, `{ title, content }` | `{ postId }` |
+
+## Useful Commands
+
+```bash
+npm run lint
+npm run build
+```

-## Deploy on Vercel
+`lint`는 코드 규칙을 확인하고, `build`는 실제 배포용 빌드가 가능한지 확인합니다.

-The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.
+## Notes For Beginners

-Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
+- 페이지 라우트는 `app` 폴더의 `page.js` 파일로 만듭니다.
+- API 라우트는 `app/api` 폴더의 `route.js` 파일로 만듭니다.
+- API 응답은 `lib/apiResponse.js`의 `apiSuccess`, `apiError`로 통일합니다.
+- MongoDB 연결은 `lib/mongodb.js`에 있습니다.
+- 게시글 데이터 함수는 `lib/posts.js`에 있습니다.
+- 클라이언트 컴포넌트에서 MongoDB를 직접 import하지 않습니다.
+- 첫 `/api/post` 요청은 `posts` 컬렉션이 비어 있으면 샘플 게시글 10개를 넣습니다.
+- Contact form은 실제 메일을 보내지 않는 mockup입니다.
~~~

### 설명/확인 포인트

- step-9까지의 기본 블로그 기능을 기준으로 작성합니다.
- 이후 단계에서 기능이 늘어나면 README도 필요한 만큼 갱신합니다.

## 작업 2. 사용하지 않는 기본 자산 삭제

create-next-app이 넣어준 기본 favicon과 public SVG는 현재 화면에서 사용하지 않습니다. 프로젝트에 남겨두면 학습자가 어떤 파일이 필요한지 헷갈릴 수 있으므로 제거합니다.

### 수정할 파일

- 삭제: `app/favicon.ico`
- 삭제: `public/file.svg`
- 삭제: `public/globe.svg`
- 삭제: `public/next.svg`
- 삭제: `public/vercel.svg`
- 삭제: `public/window.svg`

### 먼저 실행하거나 삭제할 명령

```bash
rm app/favicon.ico public/file.svg public/globe.svg public/next.svg public/vercel.svg public/window.svg
```

### 설명/확인 포인트

- 삭제 파일은 현재 단계 브랜치에 존재하지 않으므로 링크 대신 경로만 확인합니다.
- 삭제 후 import나 참조가 남아 있지 않아야 합니다.

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

- README의 Branch Flow와 Routes가 현재 기능과 맞는다.
- 삭제한 기본 자산을 참조하는 코드가 없다.

## 다음 단계로 넘어가기 전

- 이 문서의 각 작업 단위에서 설명을 먼저 읽고, 바로 아래 diff를 기준으로 파일을 수정합니다.
- 새 파일은 diff에 나온 전체 내용을 입력하고, 기존 파일은 diff의 `+`/`-` 줄만 비교하면서 수정합니다.
- 링크된 프로젝트 내부 파일을 열어 현재 단계의 완성본과 직접 비교할 수 있습니다.
