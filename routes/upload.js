const express = require('express');
const router = express.Router();

const upload = require('../middlewares/uploader');

router.post('/image', upload.single('image'), async (req, res) =>{
  const imageUrl = req.file.location;
  console.log(imageUrl)
  res.status(200).json({imageUrl});
});

module.exports = router;

