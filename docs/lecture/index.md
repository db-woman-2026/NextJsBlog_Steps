# Next.js 블로그 단계별 실습

[Windows 11 환경 준비](../windows-11.md) <span class="print-reference" data-print-reference="true">(Next.js · Windows 11 x64 실습 환경 준비 · 1. Windows Terminal 설치)</span>에서 새 Next.js 프로젝트와 개인 저장소를 만든 뒤 `main`에서 시작합니다. 각 코드 블록은 해당 단계에서 사용할 파일 전체 내용이며 모든 코드는 직접 입력합니다.

## 실습 원칙

1. 현재 branch가 `main`이고 작업 폴더가 깨끗한지 확인합니다.
2. 수정할 파일과 실행 명령을 먼저 읽습니다.
3. 파일 경로를 확인하고 코드 블록의 전체 내용을 입력합니다.
4. 패키지 파일과 lockfile은 npm 명령으로 갱신합니다.
5. `lint`와 `build`를 모두 통과시킵니다.
6. 브라우저와 API 결과를 확인합니다.
7. 실험용 변경을 복구한 뒤 commit하고 push합니다.

## 실습 목록

| 단계 | 문서 | 결과 |
| --- | --- | --- |
| 1 | [App Router와 기본 페이지](./step-1.md) <span class="print-reference" data-print-reference="true">(Next.js · Step 1. App Router와 기본 페이지 껍데기 만들기 · 변경 내용)</span> | Home, About, Post, Contact |
| 2 | [기본 스타일과 이미지](./step-2.md) <span class="print-reference" data-print-reference="true">(Next.js · Step 2. simpledotcss와 이미지 설정으로 화면 정돈하기 · 변경 내용)</span> | 전역 CSS와 next/image |
| 3 | [MongoDB 연결](./step-3.md) <span class="print-reference" data-print-reference="true">(Next.js · Step 3. MongoDB 연결과 게시글 데이터 함수 만들기 · 변경 내용)</span> | 데이터 함수 |
| 4 | [API Route](./step-4.md) <span class="print-reference" data-print-reference="true">(Next.js · Step 4. API Route와 통일된 JSON 응답 만들기 · 변경 내용)</span> | 목록·작성·조회·수정 API |
| 5 | [목록과 상세](./step-5.md) <span class="print-reference" data-print-reference="true">(Next.js · Step 5. 홈 게시글 목록과 상세 읽기 화면 연결하기 · 변경 내용)</span> | 읽기 화면 |
| 6 | [게시글 작성](./step-6.md) <span class="print-reference" data-print-reference="true">(Next.js · Step 6. 새 게시글 작성 form 만들기 · 변경 내용)</span> | POST form |
| 7 | [게시글 수정](./step-7.md) <span class="print-reference" data-print-reference="true">(Next.js · Step 7. 게시글 수정 화면과 PUT 요청 연결하기 · 변경 내용)</span> | PUT form |
| 8 | [Contact form](./step-8.md) <span class="print-reference" data-print-reference="true">(Next.js · Step 8. Contact mockup form 만들기 · 변경 내용)</span> | controlled input |
| 9 | [기본 흐름 점검](./step-9.md) <span class="print-reference" data-print-reference="true">(Next.js · Step 9. 기본 블로그 흐름 점검하기 · 변경 내용)</span> | 통합 확인 |
| 10 | [입력 검증](./step-10.md) <span class="print-reference" data-print-reference="true">(Next.js · Step 10. 입력값 검증 강화와 서버 오류 메시지 표시 · 변경 내용)</span> | 서버 오류 표시 |
| 11 | [제출 상태](./step-11.md) <span class="print-reference" data-print-reference="true">(Next.js · Step 11. 제출 중 상태와 상세 페이지 이동 개선하기 · 변경 내용)</span> | 중복 제출 방지 |
| 12 | [날짜 표시](./step-12.md) <span class="print-reference" data-print-reference="true">(Next.js · Step 12. 작성일과 수정일 표시하기 · 변경 내용)</span> | 작성일·수정일 |
| 13 | [게시글 삭제](./step-13.md) <span class="print-reference" data-print-reference="true">(Next.js · Step 13. 게시글 삭제 기능 만들기 · 변경 내용)</span> | DELETE 흐름 |
| 14 | [클라이언트 검색](./step-14.md) <span class="print-reference" data-print-reference="true">(Next.js · Step 14. 클라이언트 필터 검색 추가하기 · 변경 내용)</span> | 배열 필터 |
| 15 | [서버 검색](./step-15.md) <span class="print-reference" data-print-reference="true">(Next.js · Step 15. 서버 검색으로 전환하기 · 변경 내용)</span> | MongoDB keyword 검색 |
| 16 | [페이지네이션](./step-16.md) <span class="print-reference" data-print-reference="true">(Next.js · Step 16. 페이지네이션 추가하기 · 변경 내용)</span> | page와 limit |
| 17 | [정렬](./step-17.md) <span class="print-reference" data-print-reference="true">(Next.js · Step 17. 정렬 기능 추가하기 · 변경 내용)</span> | sort query |
| 18 | [오류 UI](./step-18.md) <span class="print-reference" data-print-reference="true">(Next.js · Step 18. Not Found와 Error UI 추가하기 · 변경 내용)</span> | Not Found와 Error |
| 19 | [카테고리](./step-19.md) <span class="print-reference" data-print-reference="true">(Next.js · Step 19. 게시글 카테고리 추가하기 · 변경 내용)</span> | 데이터·form·필터 연결 |
| 20 | [Tailwind CSS 설치](./step-20.md) <span class="print-reference" data-print-reference="true">(Next.js · Step 20. Tailwind CSS v4 설치와 공통 layout 정리 · 변경 내용)</span> | 공통 layout |
| 21 | [읽기 화면 UI](./step-21.md) <span class="print-reference" data-print-reference="true">(Next.js · Step 21. 홈 목록과 상세 읽기 화면 UI 정리 · 변경 내용)</span> | 목록·상세 카드 |
| 22 | [form UI](./step-22.md) <span class="print-reference" data-print-reference="true">(Next.js · Step 22. 작성, 수정, Contact form UI 정리 · 변경 내용)</span> | 작성·수정·Contact |
| 23 | [오류·삭제 UI](./step-23.md) <span class="print-reference" data-print-reference="true">(Next.js · Step 23. 남은 UI 조각 정리와 Tailwind 전환 마무리 · 변경 내용)</span> | Tailwind 전환 완료 |
