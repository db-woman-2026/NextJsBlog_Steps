# Next.js 블로그 실습

App Router, Route Handler, MongoDB, form, 검색·정렬·페이지네이션, Tailwind CSS를 하나의 블로그에 구현합니다. 개인 저장소의 `main`에서 코드를 직접 입력하고 검사·commit·push 결과를 확인합니다.

이 저장소에는 단계별 설명과 기준 코드가 있습니다. `create-next-app`으로 `$HOME\dongbu\nextjs-blog` 프로젝트와 개인 GitHub 저장소를 만들고 모든 파일을 직접 입력합니다.

## 시작 안내

1. [Windows 11 환경 준비](docs/windows-11.md) <span class="print-reference" data-print-reference="true">(Next.js · Windows 11 x64 실습 환경 준비 · 1. Windows Terminal 설치)</span>를 끝냅니다.
2. [기초 읽기 자료](docs/basic/00-learning-map.md) <span class="print-reference" data-print-reference="true">(Next.js · 00. 기초 개념과 개발 환경 · 확인할 내용)</span>에서 필요한 JavaScript·React·Next.js 개념을 확인합니다.
3. [단계별 실습](docs/lecture/index.md) <span class="print-reference" data-print-reference="true">(Next.js · Next.js 블로그 단계별 실습 · 실습 원칙)</span>에서 수정할 내용을 확인합니다.
4. 오류가 나면 [문제 해결](docs/troubleshooting.md) <span class="print-reference" data-print-reference="true">(Next.js · Next.js 실습 문제 해결 · 문서 코드와 현재 파일이 다릅니다)</span>의 진단 순서를 따릅니다.

## 기능 구성

- Step 1~2: App Router 화면, 공통 컴포넌트, 기본 스타일
- Step 3~4: MongoDB 연결, 데이터 함수, JSON API
- Step 5~8: 목록·상세·작성·수정·Contact form
- Step 9~13: 통합 점검, 검증, 제출 상태, 날짜, 삭제
- Step 14~19: 검색, 페이지네이션, 정렬, 오류 UI, 카테고리
- Step 20~23: Tailwind CSS 설치와 전체 UI 정리

## 공통 확인

```powershell
git branch --show-current
git status
npm run lint
npm run build
git add .
git commit -m "Complete Next.js step N"
git push
git status
```

`.env.local`은 commit하지 않습니다. MongoDB는 `next_blog_`로 시작하는 실습 전용 데이터베이스만 사용합니다. 개발 서버는 확인 뒤 `Ctrl+C`로 종료합니다.
