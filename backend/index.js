const fs = require("fs");
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const User = require("./models/User");
const connectDB = require("./db");
require("dotenv").config();

const app = express();
app.use(
  cors({
    origin: "https://save-it-rho.vercel.app",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(bodyParser.json());

connectDB();

const PORT = 8000;

//GET USERS
// app.get("/users", (req, res) => {
//   const data = readData();
//   res.status(200).send(data.users);
// });

//GET USER BY NUMBER
app.get("/recipient/:phoneNumber", async (req, res) => {
  const { phoneNumber } = req.params;

  const user = await User.findOne({ phoneNumber: phoneNumber });

  if (!user) {
    return res.status(404).send({ message: "User not found" });
  }

  res.status(200).send(user.name);
});

//REGISTER
app.post("/register", async (req, res) => {
  const { name, email, phoneNumber, password } = req.body;

  try {
    const existingUser = await User.findOne({
      $or: [{ email }, { phoneNumber }],
    });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    const newUser = new User({
      name,
      email,
      phoneNumber,
      password: hashedPassword,
      pin: "",
    });

    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Error during registration:", err);
    res.status(500).json({ message: "Server error" });
  }
});

//LOGIN
app.post("/login", async (req, res) => {
  try {
    const { phoneNumber, password } = req.body;

    const user = await User.findOne({ phoneNumber });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid number or password" });
    }

    res.status(200).json({
      message: "Login successful",
      user: { id: user._id, email: user.email },
    });
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ message: "Server error" });
  }
});

//GET USER BY ID
app.get("/users/:id", async (req, res) => {
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
});

app.post("/pin", async (req, res) => {
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
});

//Transfer Money
app.post("/transfer", async (req, res) => {
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
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
