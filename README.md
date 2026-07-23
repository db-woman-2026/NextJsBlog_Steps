# Next.js 블로그 실습

App Router, Route Handler, MongoDB, form, 검색·정렬·페이지네이션, Tailwind CSS를 하나의 블로그에 순서대로 구현합니다. 개인 저장소의 `main`에서 코드를 직접 입력하고 매 단계 검사·commit·push까지 마칩니다.

## 시작 순서

1. [Windows 11 환경 준비](docs/windows-11.md)를 끝냅니다.
2. [기초 읽기 자료](docs/basic/00-learning-map.md)에서 필요한 JavaScript·React·Next.js 개념을 확인합니다.
3. [단계별 실습](docs/lecture/index.md)을 Step 1부터 진행합니다.
4. 오류가 나면 [문제 해결](docs/troubleshooting.md)의 진단 순서를 따릅니다.

## 과정 구성

- Step 1~2: App Router 화면, 공통 컴포넌트, 기본 스타일
- Step 3~4: MongoDB 연결, 데이터 함수, JSON API
- Step 5~8: 목록·상세·작성·수정·Contact form
- Step 9~13: 통합 점검, 검증, 제출 상태, 날짜, 삭제
- Step 14~19: 검색, 페이지네이션, 정렬, 오류 UI, 카테고리
- Step 20~23: Tailwind CSS 설치와 전체 UI 정리

## 매 단계 공통 확인

```powershell
git branch --show-current
git status --short
npm.cmd run lint
npm.cmd run build
git diff
git add .
git diff --staged
git commit -m "Complete Next.js step N"
git push origin main
```

`.env.local`은 commit하지 않습니다. MongoDB는 `next_blog_`로 시작하는 실습 전용 데이터베이스만 사용합니다. 개발 서버는 확인 뒤 `Ctrl+C`로 종료합니다.
