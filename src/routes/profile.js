const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth");

const { validateEditData, validateEditPassword } = require("../utils/validate");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.json(user);
  } catch (err) {
    res.status(400).send("ERROR:" + err.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditData(req)) {
      throw new Error("invalid edit data");
    }
    const loggedInuser = req.user;
    // console.log(loggedInuser);
    // loggedInuser.password=req.body.password
    Object.keys(req.body).forEach((key) => (loggedInuser[key] = req.body[key]));
    // console.log(loggedInuser);
    await loggedInuser.save()
    res.json({message:`${loggedInuser.firstName} your profile updated successfuly`,
    data:loggedInuser});
  } catch (err) {
    res.status(400).send("ERROR:" + err.message);
  }
});




module.exports = profileRouter;
