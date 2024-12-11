const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
  {
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref:"User",
      required: true,
    },
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref:"User",
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ["interested", "ignored", "accepted", "rejected"],
        message: `{VALUE}status is not Supported`,
      },
    },
  },
  {
    timestamps: true,
  }
);

connectionRequestSchema.index({toUserId:1,fromUserId:1})

connectionRequestSchema.pre("save", function (next) {
  const connectionRequest = this;
  if (connectionRequest.toUserId.equals(connectionRequest.fromUserId)) {
    throw new Error("not allowed to send request yourself");
  }
  next();
});

const ConnectionRequestModel = mongoose.model(
  "ConnectionRequest",
  connectionRequestSchema
);

module.exports = ConnectionRequestModel;
