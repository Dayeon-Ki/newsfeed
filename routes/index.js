const express = require('express');
const usersRouter = require('./users');
const postsRouter = require('./posts');
const commentsRouter = require('./comments');

const router = express.Router();

router.use('/posts', postsRouter);
router.use('/users', usersRouter);
router.use('/posts/', commentsRouter);

module.exports = router;