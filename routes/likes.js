const express = require('express');
const authMiddleware = require("../middlewares/auth-middleware");
const router = express.Router();
const Posts = require('../schemas/post.js');
const Likes = require('../schemas/like.js');

router.put("/:postId/like", authMiddleware, async (req, res) => {
    try {
        const { userId } = res.locals.user;
        const { postId } = req.params;

        const getExistPost = await Posts.findById(postId);
        if (!getExistPost) {
            return res.status(404).json({ errorMessage: "게시글이 존재하지 않습니다." });
        }

        const getExistLike = await Likes.findOne({
             postId : postId , userId : userId 
        });

        if (!getExistLike) {
            await Likes.create({ postId: postId, userId: userId });
            return res.status(200).json({ message: "게시글의 좋아요를 등록하였습니다." });
        } else {
            await Likes.deleteOne({ postId: postId, userId: userId });
            return res.status(200).json({ message: "게시글의 좋아요를 취소하였습니다." });
        };
    } catch (error) {
        console.error(error);
        return res.status(400).json({ errorMessage: "게시글 좋아요에 실패하였습니다." });
    }
});

router.get("/like", authMiddleware, async (req, res) => {
    const { userId } = res.locals.user;
    
    try {
        // 해당 userId가 좋아요 한 게시글의 postId 리스트를 가져옵니다.
        const likedPosts = await Likes.find({ userId });

        // 좋아요 한 게시글들의 postId 배열을 생성합니다.
    const postIdArray = likedPosts.map((likedPost) => likedPost.postId);

    // postIdArray에 있는 모든 postId와 일치하는 Posts의 title과 content를 출력합니다.
    const posts = await Posts.find({ _id: { $in: postIdArray } })
    .select('title content -_id')
    .lean();

        return res.status(200).json(posts);
    } catch (error) {
        console.error(error);
        return res.status(400).json({ errorMessage: "좋아요 게시글 조회에 실패하였습니다." });
    }
});

module.exports = router;