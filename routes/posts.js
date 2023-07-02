const express = require('express');
const router = express.Router();
const commentsRouter = require('./comments');
const auth = require('../middlewares/auth');

const { User, Post, Comment, Like } = require('../models');
const { Op } = require('sequelize');
const upload = require('../middlewares/uploader');
const AWS = require('aws-sdk');
require("dotenv").config();


router.use('/:postId/comments', commentsRouter);

// 전체 게시글 조회
router.get('/', async (req, res) => {
  const posts = await Post.findAll({
    include: [
      {
        model: Comment,
        as: 'comments',
        include: [{ model: User, as: 'user', attributes: ['nickname'] }],
        attributes: ['commentId', 'content'],
      },
      { model: User, as: 'user', attributes: ['nickname'] },
    ],
    attributes: ['postId', 'UserId', 'title', 'content', 'createdAt'],
    order: [['createdAt', 'DESC']],
  });

  if (posts.length !== 0) {
    const results = posts.map(post => {
      return {
        postId: post.postId,
        writer: post.user.nickname,
        title: post.title,
        content: post.content,
        createdAt: post.createdAt,
        comments: post.comments,
      };
    });
    res.status(200).json({ results });
  } else {
    res.json({ message: '피드가 존재하지 않습니다.' });
  }
});
// 사진 업로드
const s3 = new AWS.S3({
  region: process.env.REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

// 게시글 작성
router.post('/', auth, async (req, res) => {
  const { title, content } = req.body;
  const UserId = res.locals.user.userId;
  // 사진 업로드된 경로 불러와서 함께 저장
  // const uploadimageUrl = req.file.location;
  // if (uploadimageUrl) { const img = uploadimageUrl }
  // else { const img = null }


  Post.create({ title, content, UserId });
  res.json({ message: '게시글을 생성하였습니다.' });
});

// router.post('/', auth, upload.single('image'), async (req, res) => {
//   const { title, content } = req.body;
//   const { userId } = res.locals.user;
//   사진 업로드된 경로 불러와서 함께 저장
//   const uploadimageUrl = req.file.location;
//   if (uploadimageUrl) { const img = uploadimageUrl }
//   else { const img = null }


//   Post.create({ title, content, userId });
//   res.json({ message: '게시글을 생성하였습니다.' });
// });



// router.post('/photo/:userId', auth, upload.single('image'), async (req, res) => {
//   const userId = req.params.userId;
//   const user = await User.findOne({ where: { userId: userId } });
//   console.log(user.img)
//   const decordURL = decodeURIComponent(user.img)
//   const imgUrl = decordURL.substring(56,)rrr
//   console.log(imgUrl)
//   if (user.img === null) {
//     const uploadimageUrl = req.file.location;
//     console.log(uploadimageUrl)
//     await User.update({ img: uploadimageUrl }, {
//       where: {
//         userId: userId
//       }
//     })
//   } else {
//     s3.deleteObject({
//       Bucket: process.env.BUCKET_NAME,
//       Key: imgUrl
//     }, (err, data) => {
//       if (err) { throw err; }
//       console.log('s3 deleteObject ', data)
//     })
//     const imageUrl = req.file.location;
//     console.log(imageUrl)
//     await User.update({ img: imageUrl }, {
//       where: {
//         userId: userId
//       }
//     })
//   }
//   res.status(201).json({ Message: "사진이 변경되었습니다." });
// });

// 특정 게시글 조회
router.get('/:postId', auth, async (req, res) => {
  const postId = req.params.postId;
  const post = await Post.findOne({
    where: { postId: postId },
    include: [
      {
        model: Comment,

        as: 'comments',
        include: [{ model: User, as: 'user', attributes: ['nickname'] }],
        attributes: ['commentId', 'UserId', 'content'],
      },
      { model: Like, as: 'likes', attributes: ['userId'] },
      { model: User, as: 'user', attributes: ['nickname'] },
    ],
    attributes: ['UserId', 'title', 'content', 'createdAt'],
  });
  if (!post) return res.status(400).json({ message: '존재하지 않는 게시글입니다.' });
  res.status(200).json({ post });
});

// 게시글 수정
router.put('/:postId', auth, async (req, res) => {
  const { postId } = req.params;
  const { title, content } = req.body;
  const { userId } = res.locals.user;
  const post = await Post.findOne({
    where: { postId },
  });
  if (!post) return res.status(400).json({ message: '잘못된 접근입니다. 존재하지 않는 게시글입니다.' });
  if (post) {
    if (userId !== post.UserId) {
      return res.status(400).json({ message: '작성자만이 게시글을 수정할 수 있습니다.' });
    } else {
      await Post.update({ title, content }, { where: { postId: postId } });
      res.status(201).json({ message: '게시글이 정상적으로 수정되었습니다.' });
    }
  }
});

// 게시글 삭제
router.delete('/:postId', auth, async (req, res) => {
  const { postId } = req.params;
  const { userId } = res.locals.user;
  const post = await Post.findOne({
    where: { postId },
  });
  if (!post) return res.status(400).json({ message: '잘못된 접근입니다. 존재하지 않는 게시글입니다.' });
  if (post) {
    if (userId !== post.UserId) {
      return res.status(400).json({ message: '작성자만이 게시글을 삭제할 수 있습니다.' });
    } else {
      await Post.destroy({ where: { postId: postId } });
      res.status(201).json({ message: '게시글이 정상적으로 삭제되었습니다.' });
    }
  }
});


// 게시글 좋아요 / 취소
router.get('/:postId/like', auth, async (req, res) => {
  const { postId } = req.params;
  const { userId } = res.locals.user;
  const like = await Like.findOne({
    where: { [Op.and]: [{ postId }, { userId }] },
  });
  if (like) {
    Like.destroy({ where: { [Op.and]: [{ postId }, { userId }] } });
    res.status(201).json({ message: '해당 게시글의 좋아요를 취소하셨습니다.' });
  } else {
    Like.create({ userId: userId, postId: postId });
    res.status(201).json({ message: '해당 게시글을 좋아요 하셨습니다.' });
  }
});

module.exports = router;
