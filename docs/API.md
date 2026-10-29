# Verified API contracts

Reviewed 2026-10-29. Base URL: `https://route-posts.routemisr.com` (no `/api` prefix for application routes).

Primary sources retrieved:

- https://route-posts.routemisr.com/
- https://documenter.getpostman.com/view/5709532/2sBXcBnNAq
- https://documenter.gw.postman.com/api/collections/5709532/2sBXcBnNAq?segregateAuth=true&versionTag=latest

Protected requests: `Authorization: Bearer <token>`. Envelope: `{success,message,data,meta}`; failures may contain `errors`.

| Feature | Method | Path | Body |
|---|---|---|---|
| Signup | POST | `/users/signup` | JSON: name, username, email, dateOfBirth, gender, password, rePassword |
| Login | POST | `/users/signin` | JSON: email, password |
| My profile | GET | `/users/profile-data` | none |
| Password | PATCH | `/users/change-password` | JSON: password, newPassword |
| Photo | PUT | `/users/upload-photo` | multipart: photo |
| Feed | GET | `/posts/feed?only=all&page=1&limit=10` | only also supports following, me |
| Create post | POST | `/posts` | multipart: body, optional image |
| Single post | GET | `/posts/:postId` | none |
| Update post | PUT | `/posts/:postId` | multipart: body, optional image |
| Delete post | DELETE | `/posts/:postId` | none |
| Like/unlike | PUT | `/posts/:postId/like` | none |
| Comments | GET | `/posts/:postId/comments?page=1&limit=10` | none |
| Create comment | POST | `/posts/:postId/comments` | multipart: content, optional image |
| Update comment | PUT | `/posts/:postId/comments/:commentId` | multipart: content, optional image |
| Delete comment | DELETE | `/posts/:postId/comments/:commentId` | none |

The collection leaves ID slots empty in several examples (such as `/posts/` and `/posts//comments/`). Operation names establish single/update/delete post operations; the homepage explicitly supplies `:postId` and `:commentId` for nested routes. The implementation fills these slots with real IDs. It does not invent a standalone `/comments` route or use the older `token` header.

The browser supplies multipart boundaries. Existing images stay unless replaced. Image removal was not implemented because the exact field contract was not explicit. My profile uses documented `only=me`, avoiding ambiguous blank-user-ID collection examples.

Response handling expects `data.token`, `data.user`, `data.posts`, `data.post`, `data.comments`, `_id` and `commentCreator` (also accepts `user`). The overall envelope and token location are documented; authenticated response field shapes remain an integration assumption pending a real-account run. Central helpers isolate the response contracts for adjustment if needed.

Verification levels:

1. Official homepage and full Postman collection retrieved and inspected.
2. Read-only live health and unauthenticated protected routes: `live-verification.json`.
3. Six local automated tests: headers, multipart, 401, offline errors, envelope helpers, demo CRUD.
4. Browser checks: login, demo feed, composer and local post creation/navigation.
5. Live authenticated mutations were not run: automatic approval review rejected account/post/comment/password changes under the user's no-submission instruction. No live end-to-end success is claimed.

Pagination requests 10 items per page; a full last page can require one final empty request. Search covers loaded items only.
