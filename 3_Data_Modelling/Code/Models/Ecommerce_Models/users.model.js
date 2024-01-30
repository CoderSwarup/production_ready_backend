const mongoose = require("mongoose");
const validator = require("validator");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      maxLength: [30],
      minLength: [4, "minmum name Cahrater Length 4"],
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: [validator.isEmail, "Please Eneter a Valid Email"],
    },
    password: {
      type: String,
      // required: true,
      select: false,
    },
    mobile: {
      type: Number,
      // required: true,
    },
    avatar: {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
    role: {
      type: String,
      required: true,
      default: "user",
    },
    resetPasswordToken: {
      type: String,
    },
    resetPasswordExpired: {
      type: Date,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("User", UserSchema);
