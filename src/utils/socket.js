const crypto = require("crypto");
const socket = require("socket.io");
const { Chat } = require("../models/chat");

const getSecretRoomId = (userId, targetUserId) => {
  return crypto
    .createHash("sha256")
    .update([userId, targetUserId].sort().join("_"))
    .digest("hex");
};

  

const initializeSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: "http://localhost:5173",
    },
  });




  io.on("connection", (socket) => {
    socket.on("joinChat", ({ firstName, userId, targetUserId }) => {
      const roomId = getSecretRoomId(userId, targetUserId);
      // console.log(firstName + ": " + roomId);
      socket.join(roomId);
    });
    socket.on("sendMessages", async({ firstName,lastName, userId, targetUserId, text }) => {
      const roomId = getSecretRoomId(userId, targetUserId);
      try {
        let chat = await Chat.findOne({
          participants: {
            $all: [userId, targetUserId],
          },
        });
        if(!chat){
      chat=new Chat({
        participants:[userId,targetUserId],
        messages:[]
      })
        }
        chat.messages.push({
          senderId:userId,
          text
        })
        await chat.save()
      } catch (err) {
        console.log(err);
      }
      io.to(roomId).emit("messageReceived", { firstName,lastName, text });
      // console.log(text);
    });
    socket.on("disconnect", () => {});
  });
};
module.exports = { initializeSocket };
