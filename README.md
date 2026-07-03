# NextJsBlog_Steps

초급 개발자 교육용 Next.js 블로그 프로젝트를 단계별 브랜치로 나눈 저장소입니다.

`main`은 `create-next-app` 직후의 기본 프로젝트 상태입니다. `step-1`부터는 이전 단계 위에 코드를 누적해서, 마지막 `step-9` 브랜치가 기본 블로그 기능의 최종 산출물이 됩니다.

## Branch Flow

| 브랜치 | 내용 |
| --- | --- |
| `main` | Next.js 기본 프로젝트 생성 상태 |
| `step-1` | App Router 기본 페이지, Header, Footer, nav 구성 |
| `step-2` | `simpledotcss`, 전역 스타일, About 이미지, 이미지 도메인 설정 |
| `step-3` | MongoDB 연결, 환경 변수 예시, 게시글 데이터 함수 |
| `step-4` | 게시글 목록/작성/단건조회/수정 API Route |
| `step-5` | 홈 화면 게시글 목록과 `/detail/[id]` 상세 읽기 화면 |
| `step-6` | 새 게시글 작성 form과 POST 요청 |
| `step-7` | 상세 화면에서 진입하는 게시글 수정 form과 PUT 요청 |
| `step-8` | Contact mockup form |
| `step-9` | README 정리, 불필요한 기본 파일 제거, 최종 기본 기능 |

각 단계 설명은 `/docs/step-N.md`에 있습니다.

## Stack

- Next.js 16
- React 19
- MongoDB Node.js Driver 7
- ESLint 9 flat config
- simple.css

## Getting Started

의존성을 설치합니다.

```bash
npm install
```

환경 변수 예시 파일을 복사합니다.

```bash
cp .env.example .env.local
```

로컬 MongoDB를 사용한다면 `.env.local`을 다음처럼 둡니다.

```txt
MONGODB_URI=mongodb://localhost:27017/blog
MONGODB_DB=blog
```

개발 서버를 실행합니다.

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 엽니다.

## Routes

| 주소 | 역할 |
| --- | --- |
| `/` | 게시글 목록 |
| `/detail/[id]` | 게시글 상세 |
| `/post` | 게시글 작성 |
| `/post/[id]` | 게시글 수정 |
| `/about` | 소개 페이지 |
| `/contact` | Contact mockup form |
| `/api/post` | 게시글 목록/작성 API |
| `/api/post/[id]` | 게시글 단건 조회/수정 API |

## Useful Commands

```bash
npm run lint
npm run build
```

`lint`는 코드 규칙을 확인하고, `build`는 실제 배포용 빌드가 가능한지 확인합니다.

## Notes For Beginners

- 페이지 라우트는 `app` 폴더의 `page.js` 파일로 만듭니다.
- API 라우트는 `app/api` 폴더의 `route.js` 파일로 만듭니다.
- MongoDB 연결은 `lib/mongodb.js`에 있습니다.
- 게시글 데이터 함수는 `lib/posts.js`에 있습니다.
- 클라이언트 컴포넌트에서 MongoDB를 직접 import하지 않습니다.
- 첫 `/api/post` 요청은 `posts` 컬렉션이 비어 있으면 샘플 게시글 10개를 넣습니다.
- Contact form은 실제 메일을 보내지 않는 mockup입니다.
