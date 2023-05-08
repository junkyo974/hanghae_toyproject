const express = require('express');
const router = express.Router();
const authMiddleware = require("../middlewares/auth-middleware.js");
const Posts = require('../schemas/post.js');
const Comments = require('../schemas/comment.js');


// 댓글 생성 : POST -> localhost:3000/posts/:postId/comments
router.post('/:postId/comments', authMiddleware, async (req, res) => {
    try {
        const { userId, nickname } = res.locals.user; // 로그인한 사용자의 userId와 nickname을 가져온다.
        const { postId } = req.params; // 요청 파라미터에서 postId를 가져온다.

        let comment; // 댓글 내용을 저장할 변수를 선언한다.
        if ((req.body.comment).length > 0) { // 요청 바디의 comment 속성의 길이가 0보다 큰 경우
            comment = req.body.comment; // comment 변수에 요청 바디의 comment 속성 값을 할당한다.
        } else if ((req.body.comment).length === 0){ 
            return res.status(410).json({ errorMessage: "댓글 내용을 입력해주세요."}); // 댓글 내용이 존재하지 않을 때
        } else if(!res.locals.user) {
            return res.status(403).json({ errorMessage: "로그인이 필요한 기능입니다."}) // 로그인을 하지 않았을 때
        } else {
            return res.status(410).json({ errorMessage: "데이터 형식이 올바르지 않습니다."}); 
        };

        const existPost = await Posts.findOne({ _id: postId }); // postId를 기준으로 Posts 컬렉션에서 게시글을 조회한다.
        if (!existPost) {
            return res.status(412).json({ errorMessage: '게시글이 존재하지 않습니다.' }); // 게시글이 존재하지 않을 때
        };

        await Comments.create({ postId, userId, nickname, comment }); // Comments 컬렉션에 댓글을 생성한다.
        return res.status(201).json({ message: '댓글을 작성하였습니다.' }); // 댓글 작성 완료
    } catch (error) {
        console.error(`${req.method} ${req.originalUrl} : ${error.message}`);
        return res.status(400).send({ message: '댓글 작성에 실패하였습니다.' });
    }
});


// 댓글 조회 : GET -> localhost:3000/posts/:postId/comments
router.get('/:postId/comments', async(req, res) => {
    try {
        const { postId } = req.params;
        const comments = await Comments.find({ postId }).sort("-createdAt"); // 내림차순 방법 1
        const results = comments.map((item)=>{ // 조회된 댓글들을 배열로 변환하여 가공하는 작업을 함
            return {
                commentId : item.commentId, // 댓글 ID
                userId : item.userId, // 댓글 작성자의 ID
                nickname : item.nickname, // 댓글 작성자의 닉네임
                comment : item.comment, // 댓글 내용
                createdAt : item.createdAt, // 댓글 작성 일시
                updatedAt : item.updatedAt // 댓글 수정 일시
            }
        }).sort((a, b) => {
            return b.createdAt.getTime() - a.createdAt.getTime(); // 가공된 댓글들을 최신순으로 정렬함
        });     // 내림차순 방법 2 (둘 중 하나만 해도 먹힘)
        res.json({ "data" : results }) // 최종적으로 가공된 댓글들을 JSON 형태로 응답함
    } catch (error) {
        console.error(`${req.method} ${req.originalUrl} : ${error.message}`);
        res.status(416).send({ message: '데이터 형식이 올바르지 않습니다.' });
    }
});


// 댓글 수정 : PUT -> localhost:3000/posts/:postId/comments/:commentId
router.put('/:postId/comments/:commentId', authMiddleware, async(req, res) => {
    try {
        const { userId } = res.locals.user;
        const { postId, commentId } = req.params; // 매개변수에서 게시글 ID와 댓글 ID를 추출하여 postId, commentId 상수에 할당

        const existPost = await Posts.findOne({_id: postId}); // 게시글 데이터베이스에서 postId와 일치하는 게시글을 찾음
        if (!existPost) {
            return res.status(412).json({ errorMessage: '게시글이 존재하지 않습니다.' }); // 게시글이 존재하지 않을 때
        }
        
        const existComment = await Comments.findOne({ _id:commentId }); // 댓글 데이터베이스에서 commentId와 일치하는 댓글을 찾음
        if (!existComment) {
            return res.status(412).json({ errorMessage: '댓글이 존재하지 않습니다.' }); // 댓글이 존재하지 않을 때
        }

        let comment; // 수정할 댓글을 저장할 comment 변수를 선언
        if ((req.body.comment).length > 0) {
            comment = req.body.comment; // 요청 바디에서 댓글 내용을 추출하여 comment 변수에 할당
        } else {
            return res.status(410).json({ errorMessage: "데이터 형식이 올바르지 않습니다."});
        };

        if (userId === existComment.userId) { // 로그인된 사용자가 댓글 작성자인 경우
            const updatedAt = new Date(); // 댓글 수정 시각을 저장하기 위해 현재 시각을 가져옴
            await Comments.updateOne({_id:commentId}, { $set: { comment, updatedAt }}); // 댓글 데이터베이스에서 commentId와 일치하는 댓글을 수정
            return res.status(201).json({ message: '댓글을 수정하였습니다.' });
        } else {
            return res.status(414).json({ errorMessage: '댓글의 수정 권한이 존재하지 않습니다.' });
        }
    } catch (error) {
        console.error(`${req.method} ${req.originalUrl} : ${error.message}`);
        res.status(415).send({ message: '댓글 수정에 실패하였습니다.' });
    }
});


// 댓글 삭제 : DELETE -> localhost:3000/posts/:postId/comments/:commentId
router.delete('/:postId/comments/:commentId', authMiddleware, async(req, res) => {
    try {
        const { userId } = res.locals.user;
        const { postId, commentId } = req.params; // 매개변수에서 게시글 ID와 댓글 ID를 추출하여 postId, commentId 상수에 할당

        const existPost = await Posts.findOne({_id: postId}); // 게시글 데이터베이스에서 postId와 일치하는 게시글을 찾음
        if (!existPost) { 
            return res.status(412).json({ errorMessage: '게시글이 존재하지 않습니다.' }); // 게시글이 존재하지 않을 때
        }
        
        const existComment = await Comments.findOne({ _id:commentId }); // 댓글 데이터베이스에서 commentId와 일치하는 댓글을 찾음
        if (!existComment) {
            return res.status(412).json({ errorMessage: '댓글이 존재하지 않습니다.' });
        }

        let comment; // 수정할 댓글을 저장할 comment 변수를 선언
        if ((req.body.comment).length > 0) {
            comment = req.body.comment; // 요청 바디에서 댓글 내용을 추출하여 comment 변수에 할당
        } else {
            return res.status(410).json({ errorMessage: "데이터 형식이 올바르지 않습니다."}); 
        };

        if (userId === existComment.userId) { // 로그인된 사용자가 댓글 작성자인 경우
            await Comments.deleteOne({_id:commentId}); // 댓글 데이터베이스에서 commentId와 일치하는 댓글을 지움
            return res.status(201).json({ message: '댓글을 삭제하였습니다.' });
        } else {
            return res.status(414).json({ errorMessage: '댓글의 삭제 권한이 존재하지 않습니다.' });
        }
    } catch (error) {
        console.error(`${req.method} ${req.originalUrl} : ${error.message}`);
        res.status(415).send({ message: '댓글 삭제에 실패하였습니다.' });
    }
});

module.exports = router;