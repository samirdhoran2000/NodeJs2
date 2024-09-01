const express = require("express");
const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const app = express();
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB...");
  })
  .catch((e) => {
    console.log("something went wrong while connecting to database: ", e);
  });


//.....................


const userSchema = new mongoose.Schema({
  userId: { type: String, unique: true, required: true },
  username: { type: String, required: true },
  email: { type: String, required: true },
});

const User = mongoose.model('User', userSchema);
app.post("/register", async (req, res) => {
  try {
    const { username, email } = req.body;

    const userId = uuidv4();

    const newUser = new User({
      userId,
      username,
      email,
    });

    await newUser.save();

    res.status(201).json({ message: "User registered successfully", userId });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "An error occurred during registration" });
  }
});

app.get("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findOne({ userId });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Error retrieving user:", error);
    res
      .status(500)
      .json({ error: "An error occurred while retrieving user information" });
  }
});

//.....................

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
