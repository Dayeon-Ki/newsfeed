const express = require('express');
const usersRouter = require('./users');
const postsRouter = require('./posts');
const commentsRouter = require('./comments');

const router = express.Router();

router.use('/users', usersRouter);
router.use('/posts', postsRouter);




module.exports = router;