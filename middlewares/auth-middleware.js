const jwt = require("jsonwebtoken");
const User = require("../schemas/user.js");

// 사용자 인증 미들웨어
module.exports = async (req, res, next) => {
   const { Authorization } = req.cookies;
   // console.log(Authorization);
   // Authorization이 존재하지 않을 경우, undefined 형태일 건데, 이럴 때를 대비해야 하는 장치가 필요함
   // ?? 문법은 좌측의 값이 undefined거나 null일 경우, 오른쪽 값으로 대체를 해준다! 라는 의미
   // split을 써서 공백을 기준으로 나눔. (Bearer asdfsafdsafsadfa 이런식으로 값이 있기 때문에)
   const [authType, authToken] = (Authorization ?? "").split(" ");   // ( 변수 ?? "" ) null 병합 연산자

   // 1. authType이 Bearer 타입인지 확인하는 것! (Bearer랑 다르다면?)
   // 2. authToken을 검증하는 것! (비었다면?)
   if (!authToken || authType !== "Bearer") {
      res.status(403).send({
         errorMessage: "로그인이 필요한 기능입니다.",
      });
      return;
   }

   // jwt 검증
   try {
      // 1. authToken이 만료되었는지 확인
      // 2. authToken이 서버가 발급한 Token이 맞는지 확인
      const { userId } = jwt.verify(authToken, "customized-secret-key");
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