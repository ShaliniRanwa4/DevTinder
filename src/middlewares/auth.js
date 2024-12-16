const jwt = require("jsonwebtoken");
const User = require("../models/User");

const userAuth = async (req, res, next) => {
  try {
    const {token} = req.cookies;
    if (!token) {
   return res.status(401).send("please login first")
    }
    const decodedData = await jwt.verify(token, "Dev@Tinder$123");
    const { _id } = decodedData;
    const user = await User.findById(_id);
    if (!user) {
      throw new Error("user not found");
    }
    req.user=user
    next();
  } catch (err) {
    res.status(400).send("ERROR:"+err.message);
  }
};
module.exports = { userAuth };
