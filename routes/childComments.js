const express = require('express');
const router = express.Router();
const authMiddleware = require("../middlewares/auth-middleware.js");
const Posts = require('../schemas/post.js');
const Comments = require("../schemas/comment.js")
const childComments = require('../schemas/childComment.js');

// 대댓글 생성 : POST -> /posts/:postId/comments/:commentId/child-comments
router.post('/:postId/comments/:commentId/childcomments', authMiddleware, async (req, res) => {
    try {
        const { userId, nickname } = res.locals.user;
        const { postId, commentId } = req.params;
        const { childComment } = req.body;

        if (!childComment) {
            return res.status(400).json({ errorMessage: '대댓글 내용을 입력해주세요.' });
        }

        const existPost = await Posts.findOne({ _id: postId });
        if (!existPost) {
            return res.status(404).json({ errorMessage: '게시글이 존재하지 않습니다.' });
        }

        const existComment = await Comments.findOne({ _id: commentId });
        if (!existComment) {
            return res.status(404).json({ errorMessage: '댓글이 존재하지 않습니다.' });
        }

        await childComments.create({ commentId, userId, nickname, childComment });
        return res.status(201).json({ message: '대댓글이 작성되었습니다.' });
    } catch (error) {
        console.error(`${req.method} ${req.originalUrl} : ${error.message}`);
        return res.status(500).json({ errorMessage: '서버 오류입니다.' });
    }
});

// 대댓글 조회
router.get('/:postId/comments/:commentId/childcomments', async(req, res) => {
    try {
        const { commentId } = req.params;
        const childComment = await childComments.find({ commentId }).sort("-createdAt"); // 내림차순 방법 1
        const results = childComment.map((item)=>{
            return {
                commentId : item.commentId,
                userId : item.userId,
                nickname : item.nickname,
                childComment : item.childComment,
                createdAt : item.createdAt,
                updatedAt : item.updatedAt
            }
        }).sort((a, b) => {
            return b.createdAt.getTime() - a.createdAt.getTime();
        });     // 내림차순 방법 2 (둘 중 하나만 해도 먹힘)
        res.json( results )
    } catch (err) {
        console.log(err);
        res.status(400).send({ message: '데이터 형식이 올바르지 않습니다.' });
    }
})





module.exports = router;