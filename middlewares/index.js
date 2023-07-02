exports.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.status(403).json({ message: "로그인이 필요합니다." })
  }
}

exports.isNotLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    console.log('notAuthenticated')
    next();
  } else {
    res.json({ message: "로그인한 상태입니다." })
  }
};