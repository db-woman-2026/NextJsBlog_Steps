# Step 10. 입력값 검증 강화와 서버 오류 메시지 표시

## 변경 내용

작성·수정 API의 입력값 검증을 강화합니다.

`step-6`과 `step-7`에서 form에는 `required` 속성이 들어갔습니다. 하지만 `required`는 브라우저에서만 동작합니다. API는 브라우저 form이 아닌 다른 방법으로도 호출할 수 있으므로 서버에서도 반드시 검증해야 합니다.

다음을 구현합니다.

- 제목과 본문이 문자열인지 확인한다.
- `trim()`으로 앞뒤 공백을 제거한다.
- 공백만 입력한 값은 빈 값으로 처리한다.
- 작성 API와 수정 API에 같은 검증 규칙을 적용한다.
- API가 반환한 `message`를 작성/수정 화면의 오류 메시지로 보여준다.

## 왜 required만으로 부족한가

다음 input은 빈 값 제출을 브라우저에서 막아줍니다.

```jsx
<input required />
```

하지만 사용자가 공백만 입력하면 브라우저 입장에서는 값이 있는 것으로 볼 수 있습니다.

```txt
"     "
```

또한 API는 브라우저 form 없이도 직접 호출될 수 있습니다.

> Windows 11에서는 [환경 준비](../windows-11.md)를 먼저 확인합니다. Windows Terminal의 PowerShell에서 `git`, `node`, `npm.cmd` 명령을 실행합니다.

새 PowerShell 탭에서 다음 요청을 보냅니다.

```powershell
$body = @{
  title = "   "
  content = "   "
} | ConvertTo-Json

Invoke-RestMethod -Method Post -Uri "http://localhost:3000/api/post" -ContentType "application/json" -Body $body
```

따라서 서버 API가 최종 방어선이 되어야 합니다.

## 작성 API 검증

`app/api/post/route.js`의 `POST` 함수에서 요청 body를 읽은 뒤 값을 정리합니다.

```js
const postData = await request.json();
const title =
  typeof postData.title === "string" ? postData.title.trim() : "";
const content =
  typeof postData.content === "string" ? postData.content.trim() : "";
```

`typeof postData.title === "string"`은 값이 문자열인지 확인합니다.

문자열이면 `trim()`으로 앞뒤 공백을 제거합니다. 문자열이 아니면 빈 문자열로 처리합니다.

## 공백 입력 막기

정리한 값이 비어 있으면 API는 400 응답을 반환합니다.

```js
if (!title || !content) {
  return apiError("Title and content are required", 400);
}
```

이 프로젝트의 API는 `step-4`에서 응답 형식을 통일했습니다. 따라서 오류 응답도 다음 모양을 유지합니다.

```json
{
  "success": false,
  "message": "Title and content are required",
  "data": null
}
```

## 정리된 값 저장하기

MongoDB에는 공백이 제거된 값을 저장합니다.

```js
const result = await createPost({
  title,
  content,
  image: postData.image,
});
```

이렇게 하면 사용자가 `"  Hello  "`를 입력해도 DB에는 `"Hello"`가 저장됩니다.

## 수정 API에도 같은 규칙 적용

`app/api/post/[id]/route.js`의 `PUT` 함수도 같은 방식으로 바꿉니다.

```js
const title =
  typeof postData.title === "string" ? postData.title.trim() : "";
const content =
  typeof postData.content === "string" ? postData.content.trim() : "";
```

그리고 `updatePost`에는 정리된 값을 전달합니다.

```js
const result = await updatePost(id, { title, content });
```

작성과 수정의 검증 규칙이 다르면 사용자 입장에서 예측하기 어렵습니다. 같은 데이터 모델을 다루는 API는 가능한 한 같은 규칙을 사용하는 것이 좋습니다.

## 화면에서 오류 메시지 보기

작성 화면과 수정 화면은 이미 API 응답의 `message`를 읽고 있습니다.

```js
const result = await response.json();

if (!response.ok) {
  throw new Error(result.message || "Failed to create post");
}
```

클라이언트 코드를 크게 바꾸지 않아도 서버가 보낸 메시지가 화면에 표시됩니다.

## 실습 순서

1. `app/api/post/route.js`의 `POST` 함수에서 `postData`를 읽는다.
2. `title`, `content`를 문자열인지 확인하고 `trim()`한다.
3. 둘 중 하나라도 비어 있으면 `apiError(..., 400)`을 반환한다.
4. `createPost`에는 정리된 `title`, `content`를 전달한다.
5. `app/api/post/[id]/route.js`의 `PUT` 함수도 같은 방식으로 수정한다.
6. 작성/수정 화면에서 공백만 입력했을 때 오류 메시지가 보이는지 확인한다.

## 결과 확인

개발 서버를 실행합니다.

```powershell
npm.cmd run dev
```

작성 화면에서 제목이나 본문에 공백만 입력하고 제출합니다.

```txt
http://localhost:3000/post
```

화면에 다음 메시지가 표시되면 성공입니다.

```txt
Title and content are required
```

수정 화면에서도 같은 방식으로 확인합니다.

## 검증 명령

```powershell
npm.cmd run lint
npm.cmd run build
```

## 정리

브라우저 검증은 사용자 편의 기능이고, 서버 검증은 데이터 보호 장치입니다. 둘 다 필요하지만 최종 책임은 서버 API에 있습니다.
