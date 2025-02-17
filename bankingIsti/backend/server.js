import express from "express";
import cors from "cors";
import mongoose from "mongoose";
require("dotenv").config();

const app = express();
const databaseUrl = process.env.MONGOD_CONNECT_URI;
const PORT = process.env.PORT || 8000;

app.use(cors({ origin: "*" }));
app.use(express.json());
app.use("/api/items", () => {});
app.use('/proxy', (req, res) => {
  res.json({ message: 'Proxy is working!' });
});

mongoose
  .connect(
    `mongodb+srv://isti96:${databaseUrl}@cluster0.y5si3nq.mongodb.net/MyDatabase`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
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
