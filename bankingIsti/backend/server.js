import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/items", () => {});

mongoose
  .connect("mongodb://localhost:27017/MyDatabase", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

const Schema = mongoose.Schema;
const ItemSchema = new Schema({
  bankId: String,
  requisitionId: String,
  status: String,
  created: String,
});

const Item = mongoose.model("Item", ItemSchema);

app.get("/getBankConnections", async (req, res) => {
  const items = await Item.find();
  res.json(items);
});

app.post("/reqid", async (req, res) => {
  new Item({
    bankId: req.body.bankId,
    requisitionId: req.body.requisitionId,
    status: req.body.status,
    created: req.body.created,
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

app.listen(8000, () => {
  console.log(`Server is running on port 8000.`);
});
