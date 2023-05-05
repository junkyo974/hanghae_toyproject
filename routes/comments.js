const express = require('express');
const router = express.Router();
const authMiddleware = require("../middlewares/auth-middleware.js");
const Posts = require('../schemas/post.js');
const Comments = require('../schemas/comment.js');


// 댓글 생성 : POST -> localhost:3000/posts/:postId/comments
router.post('/:postId/comments', authMiddleware, async (req, res) => {
    try {
        const { userId, nickname } = res.locals.user;
        const { postId } = req.params;

        let comment;
        if ((req.body.comment).length > 0) {
            comment = req.body.comment;
        } else if ((req.body.comment).length === 0){
            return res.status(412).json({ errorMessage: "댓글 내용을 입력해주세요."}); 
        } else {
            return res.status(412).json({ errorMessage: "데이터 형식이 올바르지 않습니다."}); 
        };

        const existPost = await Posts.findOne({ _id: postId });
        if (!existPost) {
            return res.status(404).json({ errorMessage: '게시글이 존재하지 않습니다.' });
        };

        await Comments.create({ postId, userId, nickname, comment });
        return res.status(201).json({ message: '댓글을 작성하였습니다.' })
    } catch (err) {
        console.error(err);
        return res.status(400).send({ message: '댓글 작성에 실패하였습니다.' });
    }
});


// 댓글 조회 : GET -> localhost:3000/posts/:postId/comments
router.get('/:postId/comments', async(req, res) => {
    try {
        const { postId } = req.params;
        const comments = await Comments.find({ postId }).sort("-createdAt"); // 내림차순 방법 1
        const results = comments.map((item)=>{
            return {
                commentId : item.commentId,
                userId : item.userId,
                nickname : item.nickname,
                comment : item.comment,
                createdAt : item.createdAt,
                updatedAt : item.updatedAt
            }
        }).sort((a, b) => {
            return b.createdAt.getTime() - a.createdAt.getTime();
        });     // 내림차순 방법 2 (둘 중 하나만 해도 먹힘)
        res.json({ "data" : results })
    } catch (err) {
        console.log(err);
        res.status(400).send({ message: '데이터 형식이 올바르지 않습니다.' });
    }
})


// 댓글 수정 : PUT -> localhost:3000/posts/:postId/comments/:commentId
router.put('/:postId/comments/:commentId', authMiddleware, async(req, res) => {
    try {
        const { userId } = res.locals.user;
        const { postId, commentId } = req.params;

        const existPost = await Posts.findOne({_id: postId});
        if (!existPost) {
            return res.status(404).json({ errorMessage: '게시글이 존재하지 않습니다.' });
        }
        
        const existComment = await Comments.findOne({ _id:commentId });
        if (!existComment) {
            return res.status(404).json({ errorMessage: '댓글이 존재하지 않습니다.' });
        }

        let comment;
        if ((req.body.comment).length > 0) {
            comment = req.body.comment;
        } else {
            return res.status(412).json({ errorMessage: "데이터 형식이 올바르지 않습니다."}); 
        };

        if (userId === existComment.userId) {
            const updatedAt = new Date();
            await Comments.updateOne({_id:commentId}, { $set: { comment, updatedAt }});
            return res.status(201).json({ message: '댓글을 수정하였습니다.' });
        } else {
            return res.status(403).json({ errorMessage: '댓글의 수정 권한이 존재하지 않습니다.' });
        }
    } catch (err) {
        console.log(err);
        res.status(400).send({ message: '댓글 수정에 실패하였습니다.' });
    }
});


// 댓글 삭제 : DELETE -> localhost:3000/posts/:postId/comments/:commentId
router.delete('/:postId/comments/:commentId', authMiddleware, async(req, res) => {
    try {
        const { userId } = res.locals.user;
        const { postId, commentId } = req.params;

        const existPost = await Posts.findOne({_id: postId});
        if (!existPost) {
            return res.status(404).json({ errorMessage: '게시글이 존재하지 않습니다.' });
        }
        
        const existComment = await Comments.findOne({ _id:commentId });
        if (!existComment) {
            return res.status(404).json({ errorMessage: '댓글이 존재하지 않습니다.' });
        }

        let comment;
        if ((req.body.comment).length > 0) {
            comment = req.body.comment;
        } else {
            return res.status(412).json({ errorMessage: "데이터 형식이 올바르지 않습니다."}); 
        };

        if (userId === existComment.userId) {
            const updatedAt = new Date();
            await Comments.deleteOne({_id:commentId});
            return res.status(201).json({ message: '댓글을 삭제하였습니다.' });
        } else {
            return res.status(403).json({ errorMessage: '댓글의 삭제 권한이 존재하지 않습니다.' });
        }
    } catch (err) {
        console.log(err);
        res.status(400).send({ message: '댓글 삭제에 실패하였습니다.' });
    }
});

module.exports = router;