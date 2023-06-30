const express = require('express');
const router = express.Router({ mergeParams: true });
const { Comment } = require('../models');
const auth = require('../middlewares/auth');

// 댓글작성
router.post('/', auth, (req, res) => {
  const { postId } = req.params;
  const { content } = req.body;
  const userId = res.locals.user.userId;
  if (!content) return res.status(400).json({ message: "댓글 내용을 입력해주세요." });

  console.log("postId:", postId)

  Comment.create({ PostId: postId, UserId: userId, content: content });
  res.status(201).json({ message: "댓글이 작성되었습니다." })

})


// 댓글 수정
router.put('/:commentId', auth, async (req, res) => {
  const commentId = req.params.commentId;
  const content = req.body.content;
  const { userId } = res.locals.user;
  const comment = await Comment.findOne({ where: { commentId } });

  if (!comment) return res.status(400).json({ message: "댓글 내용을 입력해 주세요." })
  if (comment) {
    if (userId !== comment.UserId) {
      return res.status(400).json({ message: "댓글 작성자가 아닙니다." })
    }
    else {
      await Comment.update({ content: content }, {
        where: {
          commentId: commentId
        }
      });
      res.status(201).json({ message: "수정이 정상적으로 완료되었습니다." });
    }
  }
})

// 댓글 삭제
router.delete('/:commentId', auth, async (req, res) => {
  const commentId = req.params.commentId;
  const { userId } = res.locals.user;
  const comment = await Comment.findOne({ where: { commentId } });

  if (!comment) return res.status(400).json({ message: "존재하지 않는 댓글은 삭제할 수 없습니다." })
  if (comment) {
    if (userId !== comment.UserId) {
      return res.status(400).json({ message: "댓글 작성자가 아닙니다." })
    }
    else {
      await Comment.destroy({
        where: {
          commentId: commentId
        }
      });
      res.status(201).json({ message: "댓글이 정상적으로 삭제되었습니다." });
    }
  }
})


module.exports = router;