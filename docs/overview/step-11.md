# Step 11. 제출 중 상태와 상세 페이지 이동

## 배울 내용

`step-11`은 게시글 작성/수정 form의 사용자 경험을 개선하는 단계입니다.

다음을 구현합니다.

- 작성 중 또는 수정 중인지 나타내는 `isSubmitting` 상태를 만든다.
- 제출 중에는 input, textarea, button을 비활성화한다.
- 제출 중 버튼 문구를 `Creating...`, `Updating...`으로 바꾼다.
- 작성 성공 후 새 게시글의 상세 페이지로 이동한다.
- 수정 성공 후 수정한 게시글의 상세 페이지로 이동한다.

## 왜 제출 중 상태가 필요한가

사용자가 버튼을 빠르게 여러 번 누르면 같은 요청이 중복으로 전송될 수 있습니다.

작성 화면에서는 같은 글이 여러 개 저장될 수 있고, 수정 화면에서는 같은 수정 요청이 반복될 수 있습니다.

그래서 요청을 보내는 동안 버튼과 입력창을 잠시 비활성화합니다.

## isSubmitting 상태

작성 화면에 상태를 추가합니다.

```js
const [isSubmitting, setIsSubmitting] = useState(false);
```

처음에는 제출 중이 아니므로 `false`입니다.

submit이 시작되면 `true`로 바꿉니다.

```js
setIsSubmitting(true);
```

요청이 성공하든 실패하든 마지막에는 다시 `false`로 돌립니다.

```js
finally {
  setIsSubmitting(false);
}
```

`finally`를 사용하면 성공과 실패 양쪽에서 같은 정리 코드를 반복하지 않아도 됩니다.

## 입력창 비활성화

제출 중일 때는 입력창을 수정하지 못하게 합니다.

```jsx
<input
  value={title}
  onChange={(event) => setTitle(event.target.value)}
  disabled={isSubmitting}
  required
/>
```

textarea도 같은 방식입니다.

```jsx
<textarea
  value={content}
  onChange={(event) => setContent(event.target.value)}
  disabled={isSubmitting}
  required
/>
```

## 버튼 비활성화와 문구 변경

버튼도 비활성화합니다.

```jsx
<button type="submit" disabled={isSubmitting}>
  {isSubmitting ? "Creating..." : "Create Post"}
</button>
```

수정 화면에서는 문구만 다릅니다.

```jsx
<button type="submit" disabled={isSubmitting}>
  {isSubmitting ? "Updating..." : "Update Post"}
</button>
```

이렇게 하면 사용자는 요청이 진행 중이라는 사실을 화면에서 바로 알 수 있습니다.

## 작성 후 상세 페이지로 이동

`step-10`까지 작성 성공 후에는 홈으로 이동했습니다.

이제는 새로 작성한 글의 상세 페이지로 이동합니다.

작성 API는 통일된 응답 형식으로 새 게시글 id를 반환합니다.

```json
{
  "success": true,
  "message": "Post created successfully",
  "data": {
    "postId": "..."
  }
}
```

따라서 작성 화면에서는 다음처럼 이동할 수 있습니다.

```js
router.push(`/detail/${result.data.postId}`);
router.refresh();
```

작성 직후 상세 화면으로 이동하면 사용자는 저장된 결과를 바로 확인할 수 있습니다.

## 수정 후 상세 페이지로 이동

수정 API도 `data.postId`를 반환합니다.

```js
router.replace(`/detail/${result.data.postId}`);
router.refresh();
```

수정은 기존 글을 바꾸는 작업이므로 `replace`를 사용합니다. 수정 저장 후 뒤로 가기를 눌렀을 때 다시 수정 form으로 돌아가는 흐름을 줄일 수 있습니다.

## 실습 순서

1. 작성 화면에 `isSubmitting` 상태를 추가한다.
2. submit 시작 시 `setIsSubmitting(true)`를 호출한다.
3. `finally`에서 `setIsSubmitting(false)`를 호출한다.
4. 작성 화면 input, textarea, button에 `disabled={isSubmitting}`을 추가한다.
5. 작성 버튼 문구를 상태에 따라 바꾼다.
6. 작성 성공 후 `/detail/${result.data.postId}`로 이동한다.
7. 수정 화면에도 같은 `isSubmitting` 구조를 추가한다.
8. 수정 성공 후 `/detail/${result.data.postId}`로 이동한다.

## 확인 방법

작성 화면에서 글을 작성합니다.

```txt
http://localhost:3000/post
```

버튼을 누른 직후 버튼 문구가 `Creating...`으로 바뀌고, 성공하면 새 글 상세 화면으로 이동해야 합니다.

수정 화면에서는 버튼 문구가 `Updating...`으로 바뀌고, 성공하면 수정한 글 상세 화면으로 이동해야 합니다.

## 검증 명령

> Windows 11에서는 [환경 준비](../windows-11.md)를 먼저 확인합니다. `git`, `node`, `npm.cmd` 명령은 PowerShell에서도 같습니다. `npm.ps1` 오류가 나면 `npm.cmd`를 사용합니다.

```powershell
npm.cmd run lint
npm.cmd run build
```

## 정리

서버 요청 중에는 제출 버튼을 `disabled`로 잠가 같은 요청이 연속 전송되지 않게 합니다.
