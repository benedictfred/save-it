const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phoneNumber: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  pin: { type: String, default: "" },
  balance: { type: Number, default: 2000 },
  transactions: [
    {
      id: Number,
      amount: Number,
      date: Date,
      type: { type: String, enum: ["credit", "debit"] },
      recipientName: String,
      recipientNumber: String,
      senderName: String,
    },
  ],
});

module.exports = mongoose.model("User", userSchema);
