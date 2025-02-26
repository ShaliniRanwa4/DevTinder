const express = require("express");
const { userAuth } = require("../middlewares/auth");
const { Chat } = require("../models/chat");
const { User } = require("../models/user");
const chatRouter = express.Router();

// chatRouter.get("/chat/:targetUserId", userAuth, async (req, res) => {
//   const { targetUserId } = req.params;
//   const userId = req.user._id;
//   try {
//     let chat = await Chat.findOne({
//       participants: { $all: [userId, targetUserId] },
//     }).populate({ path: "messages.senderId", select: "firstName lastName" });
//     if (!chat) {
//       chat = await new Chat({
//         participants: [userId, targetUserId],
//         messages: [],
//       });
//       await chat.save();
//     }

   

//     res.json( chat);
//   } catch (err) {
//     console.log(err);
//   }
// });


chatRouter.get("/chat/:targetUserId", userAuth, async (req, res) => {
  const { targetUserId } = req.params;
  const userId = req.user._id;
  try {
    let chat = await Chat.findOne({
      participants: { $all: [userId, targetUserId] },
    }).populate({ path: "messages.senderId", select: "firstName lastName" });

    if (!chat) {
      chat = await new Chat({
        participants: [userId, targetUserId],
        messages: [],
      });
      await chat.save();
    }

    // Fetch the target user's details
    const targetUser = await User.findById(targetUserId).select("firstName lastName");

    res.json({ chat, targetUser }); // Include `targetUser` in response
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server error" });
  }
});


module.exports = { chatRouter };
