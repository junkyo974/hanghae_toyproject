const jwt = require("jsonwebtoken");
const User = require("../schemas/user.js");

// 사용자 인증 미들웨어
module.exports = async (req, res, next) => {
   const authHeader = req.headers.authorization;
   const [authType, authToken] = (authHeader ?? "").split(" ");  // ( 변수 ?? "" ) null 병합 연산자

   // jwt 검증
   try {
      // 1. authToken이 만료되었는지 확인
      // 2. authToken이 서버가 발급한 Token이 맞는지 확인
      const { userId } = jwt.verify(authToken, "customized-secret-key");
      // 1. authType이 Bearer 타입인지 확인하는 것! (Bearer랑 다르다면?)
      // 2. authToken을 검증하는 것! (비었다면?)
      if (!authToken || authType !== "Bearer") {
         res.status(403).send({
            errorMessage: "로그인이 필요한 기능입니다.",
         });
         return;
      }
      // 3. authToken 있는 userId에 해당하는 사용자가 실제 DB에 존재하는지 확인
      const user = await User.findById(userId);
      res.locals.user = user;
      next();  // 이 미들웨어 다음으로 보낸다.
   } catch (error) {
      console.error(error);
      res.status(403).json({ errorMessage: "전달된 쿠키에서 오류가 발생하였습니다." });
      return;
   }

};