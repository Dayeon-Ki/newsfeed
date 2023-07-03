const jwt = require("jsonwebtoken");
const { User } = require("../models");

module.exports = async (req, res, next) => {
  const { Authorization } = req.cookies;
  const [tokenType, token] = (Authorization ?? "").split(" ");
  if (tokenType !== "Bearer" || !token) {
    return res.status(401).json({
      message: "토큰 타입이 일치하지 않거나, 토큰이 존재하지 않습니다.",
    });
  }
  try {

    const decodedToken = jwt.verify(token, "customized-secret-key");
    const userId = decodedToken.userId;

    const user = await User.findOne({ where: { userId } });

    if (!user) {
      return res
        .status(401)
        .json({ message: "토큰에 해당하는 사용자가 존재하지 않습니다." });
    }

    res.locals.user = user;
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({
      message: "비정상적인 접근입니다.",
    });
  }
};
