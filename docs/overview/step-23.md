# Step 23. 남은 UI 조각 정리와 Tailwind 전환 마무리

새 기능은 추가하지 않고 Tailwind CSS v4가 적용되지 않은 삭제·오류 UI를 정리합니다.

## 변경 내용

- 상세 페이지의 삭제 버튼을 danger button 형태로 정리한다.
- 삭제 실패 오류 메시지를 alert 형태로 표시한다.
- 전역 Not Found 화면을 카드 UI로 정리한다.
- 상세 페이지 전용 Not Found 화면을 카드 UI로 정리한다.
- 전역 Error 화면을 카드 UI로 정리한다.

## 남은 오류·삭제 UI

공통 layout, 읽기 화면, form 화면에는 Tailwind가 적용되어 있습니다.

하지만 실제 앱에는 자주 보이지 않는 화면도 있습니다.

- 삭제 버튼
- 삭제 실패 메시지
- 없는 페이지
- 없는 게시글
- 예외 발생 화면

이런 화면은 평소에는 덜 보이지만 사용자가 문제 상황을 만났을 때 필요한 정보를 전달합니다. 삭제·오류 상태에도 같은 UI 규칙을 적용합니다.

## 삭제 버튼

상세 페이지의 Edit 버튼은 일반적인 주요 동작입니다. 반면 Delete 버튼은 데이터가 사라지는 위험한 동작입니다.

그래서 삭제 버튼에는 빨간색 계열을 사용합니다.

```jsx
<button className="rounded-md border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50">
  Delete
</button>
```

삭제 버튼은 얇은 빨간 border와 글자색으로 위험한 동작임을 표시합니다. 넓은 빨간 배경은 주변 내용을 읽기 어렵게 만들 수 있어 사용하지 않습니다.

## 삭제 오류 메시지

삭제 요청이 실패하면 기존처럼 `role="alert"`를 유지합니다.

```jsx
{error && (
  <p
    className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
    role="alert"
  >
    {error}
  </p>
)}
```

시각적인 스타일을 추가하더라도 기존의 의미 있는 HTML 속성은 유지합니다.

## Not Found 화면

전역 Not Found와 상세 페이지 전용 Not Found는 같은 패턴을 사용합니다.

```jsx
<main className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
  <div className="space-y-4">
    <p className="text-sm font-semibold uppercase text-zinc-500">404</p>
    <h1 className="text-3xl font-bold tracking-tight text-zinc-950">
      Page Not Found
    </h1>
    ...
  </div>
</main>
```

404 화면은 복잡할 필요가 없습니다. 사용자가 무엇이 잘못됐는지 알고, 홈 목록으로 돌아갈 수 있으면 충분합니다.

## Error 화면

Error 화면은 빨간색 계열을 조금 더 사용합니다.

```jsx
<main className="rounded-lg border border-red-200 bg-white p-6 shadow-sm">
  ...
</main>
```

다만 버튼은 다른 화면과 같은 검정색 primary button을 사용합니다. 이렇게 하면 "문제 상황"은 빨간색으로 알리고, "다시 시도" 동작은 기존 버튼 패턴과 일관되게 유지할 수 있습니다.

## 결과 확인

> Windows 11에서는 [환경 준비](../windows-11.md) <span class="print-reference" data-print-reference="true">(인쇄본 위치: Next.js · 장 「Windows 11 x64 실습 환경 준비」 · 절 「1. Windows Terminal 설치」)</span>를 먼저 확인합니다. 명령은 이 교재의 PowerShell 코드 블록에 적힌 `git`, `node`, `npm` 형태를 그대로 사용합니다.

```powershell
npm run lint
npm run build
```

브라우저에서는 다음 화면을 확인합니다.

```txt
/detail/[id]
/없는주소
/detail/없는ID
```

Error 화면은 일반적인 사용 흐름에서 쉽게 발생하지 않을 수 있습니다. 그래도 `npm run build`가 통과하면 최소한 컴포넌트 문법과 빌드 가능성은 확인할 수 있습니다.

## 체크리스트

1. 상세 페이지의 Delete 버튼이 danger button으로 보인다.
2. 삭제 실패 메시지가 alert 스타일로 보인다.
3. 없는 주소의 404 화면이 카드 형태로 보인다.
4. 없는 게시글의 404 화면이 카드 형태로 보인다.
5. Error 화면이 카드 형태로 보인다.
6. README와 `docs/overview/index.md`에 `step-23`이 추가되어 있다.

완료된 화면은 `simpledotcss` 대신 Tailwind CSS v4 기반의 기본 UI를 사용합니다.
