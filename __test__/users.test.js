//describe는 테스트 그룹을 묶어주는 역할,
//describe 안의 콜백함수 내에 테스트에 쓰일 가짜 변수, 객체들을 선언하여 일회용으로 사용가능
//toXxx부분에서 사용되는 함수 = Test Mathcher라고함 to Equal() 함수는 갑을 비교할때 사용됨
//matcher란 '이거 맞아?' 라고 물어보는 메서드
//Jest는 기본적으로 test.js로 끝나거나, __test__ 디렉터리 안에 있는 파일들은 모두 테스트 파일로 인식한다.

//테스트할 파일 가져오기
const { router } = require('../routes/users')

describe('user.js 테스트 코드작성', () => {
    test("인증코드 판별", () => {
        const authcode = "1234"; // 예시로 인증코드를 1234로 설정
        const authNum = "5678"; // 예시로 인증번호를 5678로 설정
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        // authcode와 authNum이 다르면 오류 메시지를 반환하는 코드
        //expect 특정값이 만족되는지 (정상적인지) 확인하기 위한 표현
        expect(authcode !== authNum).toEqual(true)
    });


    test("패스워드 확인 패스워드 일치검증", () => {
        const password = "1234";
        const confirm = "1234";
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        // 패스워드 확인패스워드 일치검증
        expect(password === confirm).toEqual(true);
        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).not.toHaveBeenCalled();
    });


    test("패스워드에 닉네임이 포함되어 있는지 검증", () => {
        const password = "1234"
        const nickname = "1231"
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }


    })
});




