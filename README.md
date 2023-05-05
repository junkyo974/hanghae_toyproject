# REPORT. NODEJS LV1

### 게시글 RESTful API
1. 게시글 생성
   - HTTP METHOD : POST
   - URL : localhost:3000/posts
   - REQ : request.body {user, password, title, content}
   - RES : status(200).{ message : 게시글 생성하였습니다. }
          status(400).{ message : 데이터 형식이 잘못되었습니다. }
   - to.DB : create ({user, password, title, content})
   - from. DB : {_id, user, password, title, content, createdAt}

2. 게시글 조회 (createdAt 기준 내림차순)
   - HTTP METHOD : GET
   - URL : localhost:3000/posts
   - RES : status(200).{ date : [{postId(=_id), user, title, createdAt}}].sort(a,b)=>{b.createdAt-a.createdAt}}
          status(400).{ message : 데이터 형식이 잘못되었습니다. }

3. 게시글 상세 조회
   - HTTP METHOD : GET
   - URL : localhost:3000/posts/:postId
   - REQ : request.params (:postId)
   - RES : status(200).{ date : {postId(=_id), user, title, content, createdAt}}

4. 게시글 수정
   - HTTP METHOD : PUT
   - URL : localhost:3000/posts/:postId
   - REQ : request.params {:postId}, request.body {password, title, content}
   - RES : status(200).{ message : 게시글 수정되었습니다. }
          status(400).{ message : 데이터 형식이 잘못되었습니다. }
   - to.DB : updateOne ({_id:postId}, {title, content})

5. 게시글 삭제
   - HTTP METHOD : DELETE
   - URL : localhost:3000/posts/:postId
   - REQ : request.params {:postId}, request.body {password}
   - RES : status(200).{ message : 게시글 수정되었습니다. }
          status(400).{ message : 데이터 형식이 잘못되었습니다. }
   - to.DB : deleteOne ({_id:postId})


### 댓글 RESTful API
.   
.
***
# REPORT. NODEJS LV2

### 회원가입 API 개요
   - { nickname, password, confirm } = request
   - nickname ?
      - 최소 3자 이상
      - 알파벳 대소문자 (a-z, A-Z)
      - 숫자 (0~9)
      - DB.nickname 중복 ? "중복된 닉네임 입니다. errMessage
   - password ?
      - 최소 4자 이상
      - 닉네임 같은 값 포함 X -> 회원가입 실패로 만들기
   - password === confirm
### 회원가입 API 명세서  
   - URL : /signup
   - Method : POST
   - Req : nickname, password, confirm
   - Res (가입성공) :
      - status(201).json({ message: "회원 가입에 성공하였습니다.});
   - Res (닉네임 형식 비정상) :
      - status(412).json({ errorMessage: "닉네임의 형식이 일치하지 않습니다.});
   - Res (패스워드,확인패스워드 일치하지 않는 경우) :
      - status(412).json({ errorMessage: "패스워드가 일치하지 않습니다."});
   - Res (패스워드 형식이 비정상) :
      - status(412).json({ errorMessage: "패스워드 형식이 일치하지 않습니다."});
   - Res (패스워드에 닉네임이 포함되어있는 경우) :
      - status(412).json({ errorMessage: "패스워드에 닉네임이 포함되어 있습니다."});
   - Res (닉네임이 중복된 경우) :
      - status(412).json({ errorMessage: "중복된 닉네임입니다."});
   - Res (예외 케이스에서 처리하지 못한 에러) :
      - status(400).json({ errorMessage: "요청한 데이터 형식이 올바르지 않습니다."});

### 로그인 API 개요
   - { nickname, password } = request
   - 로그인 버튼 -> nickname, password === DB.nickname, password ?   
      falsy: errMessage : 닉네임 또는 패스워드를 확인해주세요.
   - 로그인 성공 -> 유저정보 JWT활용하여 클라이언트 쿠키로 전달

### 로그인 API 명세서
   - URL : /login
   - Method : POST
   - Req : nickname, password
   - Res (로그인 성공) :
      - status(200).json({ "token": asfasfsafasfasfasf });
   - Res.Header (로그인 성공) :
      - {"Authorization": "Bearer asfsafdsadfasdfasfdaf"};
   - Res (해당유저가 존재하지 않는 경우) :
      - status(412).json({ errorMessage: "닉네임 또는 패스워드를 확인해주세요."});
   - Res (예외 케이스에서 처리하지 못한 에러) :
      - status(400).json({ errorMessage: "로그인에 실패하였습니다."});


### 전체 게시글 목록 조회 API 개요
   - title, nickname, createdAt 조회
   - createdAt 기준 내림차순 정렬

### 전체 게시글 목록 조회 API 정의서
   - URL : /posts
   - Method : GET
   - Res : { "posts": [{postId, userId, nickname, title, createdAt, updatedAt}, {...}]}
   - Res (예외 케이스에서 처리하지 못한 에러) :
      - status(400).json({ errorMessage: "게시글 조회에 실패하였습니다."});

### 게시글 작성 API 개요
   - 토큰을 검사하여, 유효한 토큰일 경우에만 게시글 작성 가능
   - title, content 입력 -> { title, content } = req.body

### 게시글 작성 API 정의서
   - URL : /posts
   - Method : POST
   - Req Header : { "Authorization": "Bearer asdfasdfasfaf" }
   - Req Body : { title, content }
   - Res (성공)
      - status(201).json({ message: "게시글 작성에 성공하였습니다." })
   - Res (데이터가 정상적으로 전달되지 않는 경우)
      - status(412).json({ errorMessage: 데이터 형식이 올바르지 않습니다." })
   - Res

### 게시글 수정 API 정의서
   - URL : /posts/:postId
   - Method : PUT
   - Res - 데이터 전달되지 않는 경우
      - status(412) -> "데이터 형식이 올바르지 않습니다."
   - Res - Title 비정상
      - status(412) -> "게시글 제목의 형식이 일치하지 않습니다."
   - Res - Content 비정상
      - status(412) -> "게시글 내용의 형식이 일치하지 않습니다."
   - Res - 게시글 수정권한 X
      - status(403) -> "게시글 수정의 권한이 존재하지 않습니다."
   - Res - 쿠키 없을 경우
      - status(403) -> "로그인이 필요한 기능입니다."
   - Res - 쿠키 비정상적이거나 만료된 경우
      - status(403) -> "전달된 쿠키에서 오류가 발생하였습니다."
   - Res - 게시글 수정 실패
      - status(401) -> "게시글이 정상적으로 수정되지 않았습니다.”
   - Res - 예외 케이스 외
      - status(400) -> "게시글 수정에 실패하였습니다."

