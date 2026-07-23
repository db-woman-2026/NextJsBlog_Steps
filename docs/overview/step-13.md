# Step 13. 삭제 기능 추가

## 변경 내용

게시글 삭제 기능을 추가합니다.

삭제 기능에는 다음 세 부분이 함께 필요합니다.

- MongoDB에서 문서를 삭제하는 데이터 함수
- `DELETE /api/post/[id]` API Route
- 상세 화면에서 삭제 요청을 보내는 클라이언트 버튼

세 부분을 함께 구현해 삭제 요청의 시작부터 저장 결과까지 확인합니다.

## 삭제 흐름

삭제 기능은 다음 순서로 동작합니다.

```txt
상세 화면
-> Delete 버튼 클릭
-> confirm 창으로 삭제 여부 확인
-> DELETE /api/post/[id] 요청
-> MongoDB에서 해당 게시글 삭제
-> 성공하면 홈 화면으로 이동
```

## deletePost 데이터 함수

`lib/posts.js`에 삭제 함수를 추가합니다.

```js
export async function deletePost(id) {
  if (!ObjectId.isValid(id)) {
    return null;
  }

  const collection = await getPostsCollection();
  return collection.deleteOne({ _id: new ObjectId(id) });
}
```

삭제도 상세 조회/수정과 마찬가지로 URL의 id를 MongoDB `ObjectId`로 변환해야 합니다.

잘못된 id가 들어오면 `null`을 반환합니다.

## DELETE API Route

`app/api/post/[id]/route.js`에 `DELETE` 함수를 추가합니다.

```js
export async function DELETE(_request, { params }) {
  try {
    const { id } = await params;
    const result = await deletePost(id);

    if (!result || result.deletedCount === 0) {
      return apiError("Post not found", 404);
    }

    return apiSuccess({ postId: id }, "Post deleted successfully");
  } catch (error) {
    console.error("Error deleting post:", error);
    return apiError("Internal Server Error", 500);
  }
}
```

삭제할 게시글이 없으면 404 응답을 반환합니다.

성공하면 통일된 API 응답 형식으로 삭제된 id를 반환합니다.

## 상세 화면과 삭제 버튼 분리

상세 페이지는 서버 컴포넌트입니다. 하지만 삭제 버튼은 클릭 이벤트와 상태가 필요하므로 클라이언트 컴포넌트여야 합니다.

그래서 삭제 버튼을 별도 파일로 분리합니다.

```txt
app/detail/[id]/DeletePostButton.js
```

상세 페이지에서는 이 컴포넌트를 import해서 렌더링합니다.

```jsx
<DeletePostButton id={id} />
```

## DeletePostButton

삭제 버튼은 클라이언트 컴포넌트입니다.

```js
"use client";
```

상태는 두 가지입니다.

```js
const [error, setError] = useState("");
const [isDeleting, setIsDeleting] = useState(false);
```

`isDeleting`은 삭제 요청 중 버튼을 비활성화하기 위해 사용합니다.

## 삭제 확인창

삭제는 되돌리기 어려운 작업입니다. 그래서 요청을 보내기 전에 확인창을 띄웁니다.

```js
const shouldDelete = window.confirm("Delete this post?");

if (!shouldDelete) {
  return;
}
```

사용자가 취소하면 아무 요청도 보내지 않습니다.

## DELETE 요청 보내기

삭제 요청은 다음처럼 보냅니다.

```js
const response = await fetch(`/api/post/${id}`, {
  method: "DELETE",
});
```

API 응답은 통일된 형식이므로 `message`를 읽어 오류 메시지로 사용할 수 있습니다.

```js
const result = await response.json();

if (!response.ok) {
  throw new Error(result.message || "Failed to delete post");
}
```

## 삭제 성공 후 이동

삭제된 글의 상세 페이지에 계속 머물 수는 없습니다. 성공하면 홈 화면으로 이동합니다.

```js
router.push("/");
router.refresh();
```

## 실습 순서

1. `lib/posts.js`에 `deletePost(id)`를 추가한다.
2. `app/api/post/[id]/route.js`에서 `deletePost`를 import한다.
3. 같은 파일에 `DELETE` 함수를 추가한다.
4. `app/detail/[id]/DeletePostButton.js` 파일을 만든다.
5. 삭제 버튼을 클라이언트 컴포넌트로 작성한다.
6. 버튼 클릭 시 confirm 창을 띄운다.
7. 확인하면 `DELETE /api/post/[id]` 요청을 보낸다.
8. 성공하면 홈으로 이동한다.
9. 상세 페이지에서 `<DeletePostButton id={id} />`를 렌더링한다.

## 결과 확인

상세 화면으로 이동합니다.

```txt
http://localhost:3000/detail/게시글id
```

`Delete` 버튼을 누르고 확인합니다.

성공하면 홈으로 이동하고, 삭제한 글이 목록에 보이지 않아야 합니다.

삭제된 상세 주소로 다시 접근하면 404 흐름으로 이동해야 합니다.

## 검증 명령

> Windows 11에서는 [환경 준비](../windows-11.md) <span class="print-reference" data-print-reference="true">(인쇄본 위치: Next.js · 장 「Windows 11 x64 실습 환경 준비」 · 절 「1. Windows Terminal 설치」)</span>를 먼저 확인합니다. 명령은 이 교재의 PowerShell 코드 블록에 적힌 `git`, `node`, `npm.cmd` 형태를 그대로 사용합니다.

```powershell
npm.cmd run lint
npm.cmd run build
```

## 정리

삭제 기능은 서버 데이터 변경과 사용자 확인이 모두 필요한 기능입니다. 그래서 데이터 함수, API Route, 클라이언트 버튼을 함께 설계해야 합니다.
