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
  const allowedOrigins = [
    "http://localhost:5173", // Local frontend (for development)
    // "https://dev-tinder-web-kappa.vercel.app" // Deployed frontend (for production)
  //  "https://dev-tinder-web-qzcn.vercel.app"
  // "https://dev-tinder-web-34t8.vercel.app/"
  "https://dev-tinder-web-5qx5.vercel.app"
  ];
  

  const io = socket(server, {
    // cors: {
    //   origin: allowedOrigins,
    //   credentials: true,
    // },
    //  path: "/socket.io",
    cors: {
      origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error("Not allowed by CORS"));
        }
      },
      credentials: true,
    },
    path: "/socket.io",
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
