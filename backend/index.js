const fs = require("fs");
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = 8000;
const DATA_FILE = "./data/data.json";

const readData = () => JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
const writeData = (data) =>
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));

//GET USERS
// app.get("/users", (req, res) => {
//   const data = readData();
//   res.status(200).send(data.users);
// });

//GET USER BY NUMBER
app.get("/recipient/:phoneNumber", (req, res) => {
  const { phoneNumber } = req.params;
  const data = readData();

  const user = data.users.find((user) => user.phoneNumber === phoneNumber);
  if (!user) {
    return res.status(404).send({ message: "User not found" });
  }

  res.status(200).send(user.name);
});

//REGISTER
app.post("/register", (req, res) => {
  const { name, email, phoneNumber, password } = req.body;
  const data = readData();

  if (
    data.users.find(
      (user) => user.email === email || user.phoneNumber === phoneNumber
    )
  ) {
    return res.status(400).send({ message: "User already exists" });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);

  const newUser = {
    id: Date.now(),
    name,
    email,
    phoneNumber,
    pin: "",
    password: hashedPassword,
    balance: 0,
    transactions: [],
  };
  data.users.push(newUser);
  writeData(data);

  res.status(201).send({ message: "User registered successfully" });
});

//LOGIN
app.post("/login", (req, res) => {
  const { phoneNumber, password } = req.body;
  const data = readData();

  const user = data.users.find((user) => user.phoneNumber === phoneNumber);
  if (!user) {
    return res.status(404).send({ message: "User not found" });
  }

  if (!bcrypt.compareSync(password, user.password)) {
    return res.status(401).send({ message: "Invalid number or password" });
  }

  res.status(200).send({
    message: "Login successful",
    user: { id: user.id, email: user.email },
  });
});

//GET USER BY ID
app.get("/users/:id", (req, res) => {
  const { id } = req.params;
  const data = readData();

  const user = data.users.find((user) => user.id == id);
  if (!user) {
    return res.status(404).send({ message: "User not found" });
  }

  res.status(200).send(user);
});

app.post("/pin", (req, res) => {
  const { phoneNumber, pin } = req.body;
  const data = readData();
  const user = data.users.find((user) => user.phoneNumber === phoneNumber);

  if (!user) {
    return res.status(404).send({ message: "User not found" });
  }

  if (!user.pin) {
    const hashedPin = bcrypt.hashSync(pin, 10);
    user.pin = hashedPin;
    writeData(data);
    return res.status(200).json({ message: "Pin set successfully" });
  }

  const isValidPin = bcrypt.compareSync(pin, user.pin);

  if (!isValidPin) {
    return res.status(401).send({ message: "Invalid Pin" });
  }

  res.status(200).json({ message: "Pin is valid" });
});

//Transfer Money
app.post("/transfer", (req, res) => {
  const { senderNumber, recipientNumber, amount, recipientName, senderName } =
    req.body;

  if (senderNumber === recipientNumber) {
    return res
      .status(400)
      .send({ message: "Cannot transfer to the same account" });
  }

  const parsedAmount = parseFloat(amount);

  if (isNaN(parsedAmount) || amount <= 0) {
    return res.status(400).send({ message: "Invalid amount" });
  }

  const data = readData();

  const sender = data.users.find((user) => user.phoneNumber === senderNumber);
  const receiver = data.users.find(
    (user) => user.phoneNumber === recipientNumber
  );

  if (!sender || !receiver) {
    return res.status(404).send({ message: "User not found" });
  }

  if (sender.balance < amount) {
    return res.status(400).send({ message: "Insufficient balance" });
  }

  sender.balance -= parsedAmount;
  receiver.balance += parsedAmount;

  const sendersTransaction = {
    id: Date.now(),
    recipientNumber,
    recipientName,
    senderName,
    amount: parsedAmount,
    date: new Date().toISOString(),
    type: "debit",
  };

  const receiversTransaction = {
    id: Date.now(),
    recipientNumber,
    recipientName,
    senderName,
    amount: parsedAmount,
    date: new Date().toISOString(),
    type: "credit",
  };

  sender.transactions.push(sendersTransaction);
  receiver.transactions.push(receiversTransaction);

  try {
    writeData(data);
    res.status(200).send({ message: "Transfer successful" });
  } catch (err) {
    console.error("Error saving data:", err);
    res.status(500).send({ message: "Error processing transaction" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
