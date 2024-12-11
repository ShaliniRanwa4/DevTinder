const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionrequest");
const User = require("../models/User");

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;
      const allowedStatus = ["interested", "ignored"];
      if (!allowedStatus.includes(status)) {
        return res
          .status(400)
          .json({ message: "invalid status type :" + status });
      }

      const toUser = await User.findById(toUserId);
      if (!toUser) {
        return res
          .status(404)
          .json({ message: "is user does not exit in our database" });
      }

      const existingConnection = await ConnectionRequest.findOne({
        $or: [
          {
            toUserId,
            fromUserId,
          },
          {
            toUserId: fromUserId,
            fromUserId: toUserId,
          },
        ],
      });

      if (existingConnection) {
        return res
          .status(400)
          .json({ message: "Connection request already sent " });
      }

      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      const data = await connectionRequest.save();
      res.json({
        message: "Connection request sent",
        data,
      });
    } catch (err) {
      res.status(400).send("ERROR :" + err.message);
    }
  }
);



requestRouter.post("/request/review/:status/:requestId",userAuth,async(req,res)=>{
 try{ const loggedInUser=req.user;
  const {status,requestId}=req.params

  const allowedStatus=["accepted","rejected"]
  if(!allowedStatus.includes(status)){
    return res.send("invalid status type")
  }

  const connectionRequest= await ConnectionRequest.findOne({
    _id:requestId,
    status:"interested",
    toUserId:loggedInUser._id
  })
if(!connectionRequest){
  return res.send("connection request not found")
}

connectionRequest.status=status;
const data=await connectionRequest.save()

res.json({message:`request ${status}`,data})}
catch(err){
  res.status(400).send("ERROR :" + err.message);
}

})

module.exports = requestRouter;
