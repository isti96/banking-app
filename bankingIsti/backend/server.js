import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import "dotenv/config";
import axios from "axios";

const app = express();
const databaseUrl = process.env.REACT_APP_DATABASE_URL;
const PORT = process.env.PORT || 8000;

app.use(
  cors({
    origin: ["https://banking-app-2.netlify.app", "http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD"],
  })
);

app.options("*", cors());

app.use(express.json());
app.use("/api/items", () => {});


mongoose
  .connect(databaseUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

const Schema = mongoose.Schema;
const ItemSchema = new Schema({
  bankId: String,
  bankName: String,
  requisitionId: String,
  status: String,
  created: String,
  userId: mongoose.Schema.Types.ObjectId,
});

const UserSchema = new Schema({
  id: String,
  userName: String,
  email: String,
  password: String,
  displayName: String,
  created: String,
});

const Item = mongoose.model("Item", ItemSchema);
const User = mongoose.model("User", UserSchema);

app.post("/token", async (req, res) => {
  console.log(req.body, "   ", req.query);
  try {
    const response = await axios({
      method: req.method,
      url: "https://bankaccountdata.gocardless.com/api/v2/token/new",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
      },
      data: {
        secret_id: "66433513-7aed-4d19-bc80-7c9ac2ca0ba2",
        secret_key:
          "e270957e080f165c9f792106c134ad0706d7c696ded78087acc199ee06fdc364680778124d14efa9cf6521fcf215687d22126755fc160101bc3fe01862826ee9",
      },
    });
    const data = await response.json();
    console.log(data);
    token = data.access;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get(`/getBankConnections`, async (req, res) => {
  const items = await Item.find({ userId: req.query.userId });
  res.json(items);
});

app.post("/deleteConnection", async (req, res) => {
  await Item.deleteOne({ requisitionId: req.body.requisitionId });
  res.json();
});

app.post("/register", async (req, res) => {
  let user = await User.findOne({ email: req.body.email });
  if (user) {
    return res.status(400).send("User already exists. Please sign in");
  } else {
    new User({
      email: req.body.email,
      password: req.body.password,
      displayName: req.body.displayName,
      created: req.body.created,
    })
      .save()
      .then(() => res.json());
  }
});

app.post("/login", async (req, res) => {
  let user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(401).send("User not found! Please sign up!");
  }
  const isValid = user.password === req.body.password;
  if (!isValid) {
    return res.status(400).json("Wrong credentials!");
  }
  return res.json(user);
});

app.post("/reqid", async (req, res) => {
  new Item({
    bankId: req.body.bankId,
    bankName: req.body.bankName,
    requisitionId: req.body.requisitionId,
    status: req.body.status,
    created: req.body.created,
    userId: req.body.userId,
  })
    .save()
    .then(() => res.json());
});

app.post("/updateReq", async (req, res) => {
  await Item.updateOne(
    { requisitionId: req.body.requisitionId },
    {
      status: req.body.status,
      created: req.body.created,
      bankId: req.body.bankId,
    },
    {
      upsert: true,
    }
  ).then(() => res.json());
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
