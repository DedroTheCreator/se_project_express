const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const { PORT = 3001 } = process.env;
const app = express();

const routes = require("./routes");

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db");

app.use(cors());
app.use(express.json());

app.use(routes);

// ✅ JSON error handler (prevents HTML responses)
app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).json({
    message: err.message || "An error has occurred on the server",
  });
});

app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
});
