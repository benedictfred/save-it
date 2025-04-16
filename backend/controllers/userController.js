const User = require("../models/User");
const bcrypt = require("bcrypt");

exports.getRecipientPhoneNumber = async (req, res) => {
  const { phoneNumber } = req.params;

  const user = await User.findOne({ phoneNumber: phoneNumber });

  if (!user) {
    return res.status(404).send({ message: "User not found" });
  }

  res.status(200).send(user.name);
};

exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.setOrPutPin = async (req, res) => {
  try {
    const { phoneNumber, pin } = req.body;

    const user = await User.findOne({ phoneNumber });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.pin) {
      const hashedPin = bcrypt.hashSync(pin, 10);
      user.pin = hashedPin;
      await user.save();
      return res.status(200).json({ message: "Pin set successfully" });
    }

    const isValidPin = bcrypt.compareSync(pin, user.pin);
    if (!isValidPin) {
      return res.status(401).json({ message: "Invalid Pin" });
    }

    res.status(200).json({ message: "Pin is valid" });
  } catch (error) {
    console.error("Error handling PIN:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.transferMoney = async (req, res) => {
  try {
    const { senderNumber, recipientNumber, amount, recipientName, senderName } =
      req.body;

    if (senderNumber === recipientNumber) {
      return res
        .status(400)
        .json({ message: "Cannot transfer to the same account" });
    }

    const parsedAmount = parseFloat(amount);

    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    const sender = await User.findOne({ phoneNumber: senderNumber });
    const receiver = await User.findOne({ phoneNumber: recipientNumber });

    if (!sender || !receiver) {
      return res.status(404).json({ message: "User not found" });
    }

    if (sender.balance < parsedAmount) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    sender.balance -= parsedAmount;
    receiver.balance += parsedAmount;

    const senderTransaction = {
      id: Date.now(),
      recipientNumber,
      recipientName,
      senderName,
      amount: parsedAmount,
      date: new Date().toISOString(),
      type: "debit",
    };

    const receiverTransaction = {
      id: Date.now(),
      recipientNumber,
      recipientName,
      senderName,
      amount: parsedAmount,
      date: new Date().toISOString(),
      type: "credit",
    };

    sender.transactions.unshift(senderTransaction);
    receiver.transactions.unshift(receiverTransaction);

    await sender.save();
    await receiver.save();

    res.status(200).json({ message: "Transfer successful" });
  } catch (err) {
    console.error("Error processing transaction:", err);
    res.status(500).json({ message: "Error processing transaction" });
  }
};
