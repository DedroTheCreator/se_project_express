const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const routes = require("./routes");

const { PORT = 3001 } = process.env;
const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use(routes);

// Universal error handler (MUST have 4 arguments)
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).json({
    message:
      statusCode === 500 ? "An error has occurred on the server" : message,
  });
  next();
});

// DB connection & server start
mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
// eslint-disable-next-line no-console
console.log(`App listening at port ${PORT}`);
