const express = require("express");
const router = express.Router();
const UserSchema = require("../schemas/user.js");
const authMiddleware = require("../middlewares/auth-middleware.js");
const jwt = require('jsonwebtoken');


// 회원 가입 API
router.post('/signup', async (req, res) => {
   const { nickname, password, confirm } = req.body;

   // 패스워드, 확인패스워드 일치 검증
   if (password !== confirm) {
      res.status(412).json({
         errorMessage: "패스워드가 일치하지 않습니다."
      });
      return;  // 패스워드 검증이 실패하면 뒤에는 실행시키지 않도록 return으로 브레이크
   };

   // 패스워드 닉네임을 포함시키면 에러메세지
   if (password.includes(nickname)) {
      res.status(412).json({
         errorMessage: "패스워드에 닉네임이 포함되어 있습니다."
      });
      return;
   };

   // 패스워드 4글자 이하이면 에러메세지 
   if (password.length <= 4) {
      res.status(412).json({
         errorMessage: "패스워드 형식이 일치하지 않습니다."
      });
      return;
   };


   // 닉네임 DB 중복 검증
   const isExistuser = await UserSchema.findOne({ nickname });
   if (isExistuser) {
      res.status(412).json({
         errorMessage: "중복된 닉네임입니다."
      });
      return;
   };

   // 닉네임 최소 3글자 이상, 알파벳 대소문자, 숫자 외 에러메세지
   if ((!/^[a-zA-Z0-9]+$/.test(nickname)) || (nickname.length < 4)) {
      res.status(412).json({
         errorMessage: "닉네임의 형식이 일치하지 않습니다."
      });
      return;
   };

   // 
   const user = new UserSchema({ nickname, password });
   await user.save();   // DB에 저장한다.

   return res.status(201).json({ message: "회원 가입에 성공하였습니다." });
});


// 로그인 API
router.post('/login', async (req, res) => {
   try {
      // 바디에서 이메일, 패스워드 불러옴
      const { nickname, password } = req.body;

      // User Tbl 에서 nickname값으로 유저 있는지 찾기 (먼저, 상단에 ../schemas/user.js 불러오는 코드 작성)
      const user = await UserSchema.findOne({ nickname });

      // 1. 이메일에 일치하는 유저가 존재하지 않거나
      // 2. 유저를 찾았지만, 유저의 비밀번호와 입력한 비밀번호가 다를 때
      if (!user || user.password !== password) {
         res.status(412).json({ errorMessage: "닉네임 또는 패스워드를 확인해주세요." });
         return;  // 다음코드로 진행되지 않도록 막을거다.
      };

      // JWT 생성 (먼저, 상단에 jsonwebtoken 라이브러리 불러오는 코드 작성)
      // jwt.sign 통해 생성하며
      // 좌측에는 실제로 담을 데이터
      // 우측에는 어떤 비밀키를 이용해서 jwt를 만들건지 데이터
      const token = jwt.sign({
         userId: user.userId,
         nickname: user.nickname
      }, "customized-secret-key");

      // cookie를 통해 Authorizatin을 전달을 할 건데
      // Bearer 형태로 token 값을 전달할 거다.
      // Bearer는 어떤 타입으로 전달을 하는건지 지정하는 것, 왜 사용하는건지 찾아볼 것
      res.cookie("Authorization", `Bearer ${token}`);

      // status(200) 전달
      res.status(200).json({ token });
   } catch (err) {
      console.log(err);
      res.status(400).json({ errorMessage: "로그인에 실패하였습니다." });
   }
});



module.exports = router;