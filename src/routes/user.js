const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionrequest");
const { set } = require("mongoose");
const User = require("../models/User");

const userRouter = express.Router();
const USER_SAFE_DATA = [
  "firstName",
  "lastName",
  "skills",
  "about",
  "gender",
  "age",
];

userRouter.get("/user/request/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequests = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", USER_SAFE_DATA);

    res.json({ message: "data fetched successfuly", connectionRequests });
  } catch (err) {
    res.status(401).send("ERROR:" + err.message);
  }
});

userRouter.get("/user/connection", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequests = await ConnectionRequest.find({
      $or: [
        { toUserId: loggedInUser._id, status: "accepted" },
        { fromUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);

    const data = connectionRequests.map((row) => {
      if (loggedInUser._id.toString() === row.fromUserId._id.toString()) {
        return row.toUserId;
      }
      return row.fromUserId;
    });
    res.json({ data });
  } catch (err) {
    res.status(401).send("ERROR:" + err.message);
  }
});

userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 20 ? 10 : limit;
    const skip = (page - 1) * limit;

    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequest.find({
      $or: [{ toUserId: loggedInUser._id }, { fromUserId: loggedInUser._id }],
    }).select("toUserId fromUserId");

    const hideUserFromFeed = new Set();
    connectionRequests.forEach((req) => {
      hideUserFromFeed.add(req.fromUserId.toString());
      hideUserFromFeed.add(req.toUserId.toString());
    });
    // console.log(hideUserFromFeed)
    const user = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUserFromFeed) } },
        // { _id: { $ne: loggedInUser._id } },
      ],
    })
      .select(USER_SAFE_DATA)
      .skip(skip)
      .limit(limit);

    res.json({ data:user });
  } catch (err) {
    res.status(401).send("ERROR:" + err.message);
  }
});

module.exports = userRouter;
