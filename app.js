const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const { PORT = 3001 } = process.env;
const app = express();

const routes = require("./routes");

// Connect to MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.error("DB error", err);
  });

app.use(cors());
app.use(express.json());

app.use(routes);

app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
});
