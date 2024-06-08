const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const PORT = process.env.PORT || 8080;
const app = express();
app.use(express.json({ limit: "50mb" }));
app.use(cors());
app.use(express.json());

const memorySchema = mongoose.Schema({
  title: String,
  image: String,
});

const loginSchema = mongoose.Schema({
  username: String,
  password: String,
});

const subMemorySchema = mongoose.Schema({
  memorytitle: String,
  image: String,
  parentId: String,
});

// Creating the Schema
const memoryModel = mongoose.model("MemoryImages", memorySchema);
const loginModel = mongoose.model("LoginPage", loginSchema);
const subMemoryModel = mongoose.model("yourMemories", subMemorySchema);

// Post API for passing data into this Schema

app.post("/uploadMemory", async (req, res) => {
  console.log(req.body);
  const memoryData = new memoryModel({
    title: req.body.title,
    image: req.body.image,
  });
  await memoryData.save();
  console.log("Memory added successfully!");
});

app.get("/loginMemory", async (req, res) => {
  const data = await loginModel.find({});
  res.json({ message: "User fetched successfully", data: data });
  if (!res) {
    console.log("Failed");
  }
});

app.post("/uploadImagesToMemory", async (req, res) => {
  console.log(req.body);
  const memoryData = new subMemoryModel({
    image: req.body.image,
    parentId: req.body.parentId,
  });
  await memoryData.save();
  console.log("Memory Images added successfully!");

  try {
    const id = req.params.id;
    const memory = await memoryModel.findById(id);

    if (!memory) {
      return res.status(404).json({ message: "Memory not found" });
    }

    res.status(200).json(memory);
  } catch (error) {
    console.error("Error fetching memory:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.delete("/deleteMemory/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const deletedMemory = await memoryModel.findByIdAndDelete(id);

    if (!deletedMemory) {
      return res.status(404).json({ message: "Memory not found" });
    }

    console.log("Memory deleted successfully!");
    res.status(200).json({ message: "Memory deleted successfully!" });
  } catch (error) {
    console.error("Error deleting memory:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.delete("/deleteMemoryImage/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const deletedMemory = await subMemoryModel.findByIdAndDelete(id);

    if (!deletedMemory) {
      return res.status(404).json({ message: "Memory not found" });
    }

    console.log("Memory deleted successfully!");
    res.status(200).json({ message: "Memory deleted successfully!" });
  } catch (error) {
    console.error("Error deleting memory:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.get("/getMemory/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const memory = await memoryModel.findById(id);

    if (!memory) {
      return res.status(404).json({ message: "Memory not found" });
    }

    res.status(200).json(memory);
  } catch (error) {
    console.error("Error fetching memory:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.put("/editMemory/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const updatedData = {
      title: req.body.title,
      image: req.body.image,
    };

    const updatedMemory = await memoryModel.findByIdAndUpdate(id, updatedData, {
      new: true,
    });

    if (!updatedMemory) {
      return res.status(404).json({ message: "Memory not found" });
    }

    console.log("Memory updated successfully!");
    res
      .status(200)
      .json({ message: "Memory updated successfully!", updatedMemory });
  } catch (error) {
    console.error("Error updating memory:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.get("/getMemory", async (req, res) => {
  const data = await memoryModel.find({});
  res.json({ message: "Memory fetched successfully", data: data });
  if (!res) {
    console.log("Failed");
  }
});

app.get("/getMemoryImage/:parentId", async (req, res) => {
  try {
    const parentId = req.params.parentId;
    const memories = await subMemoryModel.find({ parentId: parentId });

    if (!memories.length) {
      return res.status(404).json({ message: "No memories found" });
    }

    res
      .status(200)
      .json({ message: "Memories fetched successfully", data: memories });
  } catch (error) {
    console.error("Error fetching memories:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.get("/", async (req, res) => {
  console.log("Running");
});

mongoose
  .connect(
    "mongodb+srv://bhavyasharmaa10:UDc4tdKYfKpJAFu8@cluster0.wei2vlz.mongodb.net/gallary_db"
  )
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

app.listen(PORT, () => console.log("Server is running at " + PORT));
