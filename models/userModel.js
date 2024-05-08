const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true, // Ensure email is unique
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    isDoctor:{
      type: Boolean,
      default: false
    },
    isAdmin:{
      type: Boolean,
      default: false
    },
    seenNotifications:{
      type: Array,
      default: [],
    },
    unseenNotifications:{
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("users", userSchema);

module.exports = User;
