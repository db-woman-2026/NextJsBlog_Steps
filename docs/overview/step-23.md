# Step 23. 남은 UI 조각 정리와 Tailwind 전환 마무리

이번 단계는 Tailwind CSS v4 전환의 마무리입니다.

새 기능을 추가하지 않고, 이전 단계에서 남겨둔 작은 UI 조각들을 정리합니다.

## 이번 단계에서 하는 일

- 상세 페이지의 삭제 버튼을 danger button 형태로 정리한다.
- 삭제 실패 오류 메시지를 alert 형태로 표시한다.
- 전역 Not Found 화면을 카드 UI로 정리한다.
- 상세 페이지 전용 Not Found 화면을 카드 UI로 정리한다.
- 전역 Error 화면을 카드 UI로 정리한다.
- README와 `docs/overview/index.md`에 Tailwind 전환 마지막 단계를 추가한다.

## 왜 마지막 단계가 필요한가

`step-20`에서 Tailwind를 설치했고, `step-21`에서 읽기 화면을 정리했으며, `step-22`에서 form 화면을 정리했습니다.

하지만 실제 앱에는 자주 보이지 않는 화면도 있습니다.

- 삭제 버튼
- 삭제 실패 메시지
- 없는 페이지
- 없는 게시글
- 예외 발생 화면

이런 화면은 평소에는 덜 보이지만, 사용자가 문제 상황을 만났을 때 앱의 완성도를 크게 좌우합니다. 따라서 Tailwind 전환의 마지막 단계로 작은 UI 조각을 한 번 더 정리합니다.

## 삭제 버튼

상세 페이지의 Edit 버튼은 일반적인 주요 동작입니다. 반면 Delete 버튼은 데이터가 사라지는 위험한 동작입니다.

그래서 삭제 버튼에는 빨간색 계열을 사용합니다.

```jsx
<button className="rounded-md border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50">
  Delete
</button>
```

여기서 중요한 점은 빨간 배경을 강하게 쓰지 않았다는 것입니다. 삭제는 위험한 동작이지만, 화면 전체에서 너무 강하게 튀면 사용자가 다른 내용을 읽기 어렵습니다. 얇은 빨간 border와 글자색만으로도 충분히 danger 동작임을 알릴 수 있습니다.

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

## Tailwind 전환 단계 정리

Tailwind 전환은 총 네 단계로 나눴습니다.

| 단계 | 내용 |
| --- | --- |
| `step-20` | Tailwind CSS v4 설치와 공통 layout/nav/footer 정리 |
| `step-21` | 홈 목록, 상세 읽기 화면, About 페이지 UI 정리 |
| `step-22` | 게시글 작성/수정 form과 Contact form UI 정리 |
| `step-23` | 삭제 버튼, Not Found, Error 화면 정리 |

각 단계는 이전 단계 위에서 동작 가능한 상태여야 합니다. 중간 단계에서 문제가 발생하면 해당 브랜치에서 수정하고, 이후 단계 브랜치로 순서대로 merge하면 됩니다.

## 확인 방법

```bash
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

이 단계까지 완료하면 `simpledotcss` 기반 화면에서 Tailwind CSS v4 기반의 기본 UI로 전환하는 흐름이 마무리됩니다.
