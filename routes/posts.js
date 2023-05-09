const express = require('express');
const router = express.Router();
const authMiddleware = require("../middlewares/auth-middleware.js");
const Posts = require('../schemas/post.js');
const Likes = require('../schemas/like.js');
const uploadImage = require('../modules/s3.js');



// 게시글 생성 : POST -> localhost:3000/posts
router.post('/', authMiddleware, uploadImage.single('photo'), async (req, res) => {
    try {
        const { userId, nickname } = res.locals.user;
        const { title, content } = req.body;
        const { photo_ip } = req;
        if (!title) {
            return res.status(410).json({ message: '게시글 제목의 형식이 일치하지 않습니다.' })
        }
        if (!content) {
            return res.status(410).json({ message: '게시글 내용의 형식이 일치하지 않습니다.' })
        }
        await Posts.create({ userId, nickname, title, content, photo_ip });
        return res.status(200).json({ message: '게시글 작성에 성공하였습니다.' })
    } catch (err) {
        console.error(err);
        return res.status(400).json({ message: '게시글 작성에 실패하였습니다.' });
    }
});

// const post = await (Posts.find()).sort("-createdAt"); 사용 시 MongoDB 내부 기능으로 mongoose 외 일반 배열에서는 동작 안 된다고 함

// 게시글 조회 : GET -> localhost:3000/posts


router.get('/posts', async (req, res) => {
    try {
        const postCount = await Posts.countDocuments();
        if (postCount === 0) {
            return res.status(412).json({ message: '게시물이 존재하지 않습니다.' });
        }
        const randomIndex = Math.floor(Math.random() * postCount);
        const randomPost = await Posts.aggregate([
            { $sample: { size: 1 } },
            { $skip: randomIndex }
        ]);
        const post = {
            postId: randomPost[0].postId,
            userId: randomPost[0].userId,
            nickname: randomPost[0].nickname,
            title: randomPost[0].title,
            createdAt: randomPost[0].createdAt,
            updatedAt: randomPost[0].updatedAt,
            photo_ip: randomPost[0].photo_ip,
        };
        const likeCount = await Likes.countDocuments({ postId: randomPost[0].postId });
        post.likeCount = likeCount;
        res.json({ data: post });
    } catch (err) {
        console.error(err);
        res.status(400).send({ message: '게시글 조회에 실패하였습니다.' });
    }
});

<<<<<<< HEAD
// best photo 조회
router.get('/best', async (req, res) => {

    try {
        const posts = await Posts.find()
        const results = await Promise.all(posts.map(async (item) => {
        const post = {
        postId: item.postId,
        userId: item.userId,
        nickname: item.nickname,
        title: item.title,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        photo_ip : item.photo_ip,
        };
        const likeCount = await Likes.countDocuments({ postId: item.postId });
        post.likeCount = likeCount;

        return post;
        }))
        const bestPost = results.reduce((prev, curr) => (prev.likeCount > curr.likeCount ? prev : curr));

        res.json({ data: bestPost });
    } catch (err) {
        console.error(err);
        res.status(400).send({ message: '게시글 조회에 실패하였습니다.' });
    }
});
=======
router.get('/newposts', async (req, res) => {
    try {
        const posts = await Posts.find().sort("-createdAt").limit(4); // 최근 4개의 게시물 조회
        const results = await Promise.all(posts.map(async (item) => {
            const post = {
                postId: item.postId,
                userId: item.userId,
                nickname: item.nickname,
                title: item.title,
                createdAt: item.createdAt,
                updatedAt: item.updatedAt,
                photo_ip: item.photo_ip,
            };
            const likeCount = await Likes.countDocuments({ postId: item.postId }).catch((err) => {
                throw new Error('좋아요 수 조회에 실패하였습니다.');
            });
            post.likeCount = likeCount;
            return post;
        }));
        res.json({ data: results });
    } catch (err) {
        console.error(err);
        res.status(400).send({ message: "게시글 조회에 실패하였습니다." });
    }
});

>>>>>>> 88182f82ab24fcf05354751ea4153b020212f78d

// 게시글 상세조회 : GET -> localhost:3000/posts/:postId
router.get('/:postId', async (req, res) => {
    try {
        const { postId } = req.params;
        const post = await Posts.findOne({_id:postId});
        const result = {
            postId: post.postId,
            userId: post.userId,
            nickname: post.nickname,
            title: post.title,
            content: post.content,
            createdAt: post.createdAt,
            updatedAt: post.updatedAt,
            photo_ip: post.photo_ip,
        };
        const likeCount = await Likes.countDocuments({ postId: postId });
        result.likeCount = likeCount;
        
        res.json({ data: result });
    } catch (err) {
        console.error(err);
        res.status(400).send({ message: '게시글 조회에 실패하였습니다.' });
    }
});





// 게시글 검색 조회 -> :keyword 부분에 검색 원하는 text 입력
router.get('/search/:keyword', async (req, res) => {
    try {
    let result = await Posts.find({ title: { $regex: req.params.keyword } });
    if (result.length === 0) {
        res.status(400).send({ message : "게시글이 존재하지 않습니다."})
    } else {
    return res.status(200).json({ data: result });
    }
    } catch (err) {
        console.error(err);
        res.status(400).send({ message : "게시글 조회에 실패하였습니다."})
    }
});


// 게시글 수정 : PUT -> localhost:3000/posts/:postId
router.put('/:postId', authMiddleware,uploadImage.single('photo'), async (req, res) => {
    try {
        const { userId } = res.locals.user;
        const { postId } = req.params;
        const { title, content } = req.body;
        const { photo_ip } = req;

        const [post] = await Posts.find({ _id: postId });
        
        if (title.length===0) {
            return res.status(410).json({ errorMessage: "게시글 제목의 형식이 일치하지 않습니다."})
        }
        if (content.length===0) {
            return res.status(410).json({ errorMessage: "게시글 내용의 형식이 일치하지 않습니다."})
        }
        if (userId === post.userId) {
            const date = new Date();
            await Posts.updateOne({ _id: postId }, { $set: { title: title, content: content, updatedAt: date, photo_ip: photo_ip } })
            return res.status(200).json({ message: '게시글을 수정하였습니다.' });
        } else {
            return res.status(414).json({ errorMessage: '게시글 수정의 권한이 존재하지 않습니다.' });
        }
    } catch (err) {
        console.error(err);
        res.status(400).send({ errorMessage: '게시글 수정에 실패하였습니다.' });
    }
});


// 게시글 삭제 : DELETE -> localhost:3000/posts/:postId
router.delete('/:postId', authMiddleware, async (req, res) => {
    try {
        const { userId } = res.locals.user;
        const { postId } = req.params;
        
        const post = await Posts.findOne({ _id: postId });

        if (!post) {
            return res.status(412).json({ message: '게시글이 존재하지 않습니다.' });
        }
        
        if (userId === post.userId) {
            await Posts.deleteOne({ _id: postId })
            return res.status(200).json({ message: '게시글을 삭제하였습니다.' });
        } else {
            return res.status(414).json({ errorMessage: '게시글의 삭제 권한이 존재하지 않습니다.' });
        }
    } catch (err) {
        console.error(err);
        return res.status(415).send({ errorMessage: '게시글 삭제에 실패하였습니다.' });
    }
});



module.exports = router;