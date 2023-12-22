const express = require("express");
const app = express();
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173"],
  })
);
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.w7djr5h.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const taskCollections = client.db("taskDB").collection("tasks");
    const userCollections = client.db("taskDB").collection("users");
    app.post("/add-task", async (req, res) => {
      const task = req.body;
      const result = await taskCollections.insertOne(task);
      res.send(result);
      console.log(result);
    });
    app.post("/add-user", async (req, res) => {
      const user = req.body;
      const result = await userCollections.insertOne(user);
      res.send(result);
      console.log(result);
    });

    app.get("/tasks", async (req, res) => {
      const result = await taskCollections.find().toArray();
      console.log(result);
      res.send(result);
    });
    app.patch("/update-task/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const updateDocument = {
        $set: { status: req.body.status },
      };
      const result = await taskCollections.updateOne(query, updateDocument);
      res.send(result);
    });

    app.post("/logout", async (req, res) => {
      const user = req.body;
      console.log("Logging Out", user);
    });

    app.delete("/delete-task/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await taskCollections.deleteOne(query);
      res.send(result);
    });
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Task Manager is available");
});

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
