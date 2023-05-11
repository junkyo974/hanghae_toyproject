const jwt = require("jsonwebtoken");
const User = require("../schemas/user.js");

// 사용자 인증 미들웨어
module.exports = async (req, res, next) => {
   // const authHeader = req.headers.authorization;
   // const [authType, authToken] = (authHeader ?? "").split(" ");  // ( 변수 ?? "" ) null 병합 연산자

   const { Authorization } = req.cookies;
   //undefined.split = err
   // authorization 쿠키가 존재하지 않았을 때를 대비
   const [authType, authToken] = (Authorization ?? "").split(" ")

   // 6 ~ 7번째 줄과 9 ~ 12번째 줄 두 코드 모두 JWT 검증 및 DB에서 사용자를 가져오는 부분에서 동일합니다. 
   // 다만, 두 번째 코드에서는 쿠키가 존재하지 않을 수도 있으므로 Authorization 쿠키를 먼저 체크하고, 만약 존재하지 않으면 ""로 초기화하여 split 메소드가 오류를 발생시키지 않도록합니다. 
   // 이는 첫 번째 코드에서는 Authorization 헤더가 존재하는지 여부를 확인할 필요가 없기 때문에 생략되었습니다.

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
      console.error(`${req.method} ${req.originalUrl} : ${error.message}`);
      res.status(403).json({ errorMessage: "전달된 쿠키에서 오류가 발생하였습니다." });
      return;
   }

};