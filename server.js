const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const userRoutes = require("./routes/userRoutes")
const projectRoutes = require("./routes/projectRoutes")

dotenv.config();


connectDB()

const app = express();


app.use(cors());
app.use(express.json());

app.use("/user",userRoutes)
app.use("/project",projectRoutes)


app.get("/", (req, res) => {
    res.send("Working");
  });

// Start the Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
