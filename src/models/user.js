const mongoose = require("mongoose");
const validator = require("validator");
const bycrpt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 4,
      maxLength: 50,
    },
    lastName: {
      type: String,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid Email address");
        }
      },
    },
    password: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("enter a strong password");
        }
      },
    },
    age: {
      type: Number,
      min: 18,
      default:20
    },
    gender: {
      type: String,
      
      validate(value) {
        if (!["male", "female", "other"].includes(value)) {
          throw new Error("gender data is not valid");
        }
      },
    },
    photoUrl: {
      type: String,
      // default:"https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp",
      default:"https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_1280.png",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Invalid photo url address");
        }
      },
    },
    about: {
      type: String,
      default: "this is default about of user",
    },
    skills: {
      type: [String],
    },
  },
  { timestamps: true }
);

userSchema.methods.getJWT = async function () {
  const user = this;
  const token = await jwt.sign({ _id: user._id }, "Dev@Tinder$123", {
    expiresIn: "7d",
  });
  return token;
};

userSchema.methods.validatePassword = async function (userInputPassword) {
  const user = this;
  const passwordHash = user.password;
  const isPasswordValid = await bycrpt.compare(userInputPassword, passwordHash);
  return isPasswordValid
};

module.exports = mongoose.model("User", userSchema);
