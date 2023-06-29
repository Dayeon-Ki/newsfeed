const express = require('express');
const router = express.Router();
const commentsRouter = require('./comments');
const auth = require('../middlewares/auth');

const { User, Post, Comment, Like } = require('../models');
const { Op } = require('sequelize');

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
  console.log(posts);

  if (posts.length !== 0) {
    const results = posts.map(post => {
      console.log(post);

      return {
        postId: post.postId,
        writer: post.user.nickname,
        title: post.title,
        content: post.content,
        createdAt: post.createdAt,
        comments: post.comments,
      };
    });
    console.log(results);

    res.status(200).json({ results });
  } else {
    res.json({ message: '피드가 존재하지 않습니다.' });
  }
});

// 게시글 작성
router.post('/', auth, (req, res) => {
  const { title, content } = req.body;
  UserId = res.locals.user.userId;
  console.log('Post', Post);
  console.log('Comment', Comment);
  Post.create({ title, content, UserId });
  res.json({ message: '게시글을 생성하였습니다.' });
});

// 특정 게시글 조회
router.get('/:postId', auth, async (req, res) => {
  const postId = req.params.postId;
  const post = await Post.findOne({
    where: { postId: postId },
    include: [
      { model: Comment, as: 'comments', attributes: ['UserId', 'content'] },
      { model: Like, as: 'likes', attributes: ['userId'] },
    ],
    attributes: ['UserId', 'title', 'content', 'createdAt'],
  });
  if (!post) return res.status(400).json({ errMessage: '존재하지 않는 게시글입니다.' });
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
  if (!post) return res.status(400).json({ errMessage: '잘못된 접근입니다. 존재하지 않는 게시글입니다.' });
  if (post) {
    if (userId !== post.UserId) {
      return res.status(400).json({ errMessage: '작성자만이 게시글을 수정할 수 있습니다.' });
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
  if (!post) return res.status(400).json({ errMessage: '잘못된 접근입니다. 존재하지 않는 게시글입니다.' });
  if (post) {
    if (userId !== post.UserId) {
      return res.status(400).json({ errMessage: '작성자만이 게시글을 삭제할 수 있습니다.' });
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
