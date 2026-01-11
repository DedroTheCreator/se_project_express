const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const routes = require("./routes");

const { PORT = 3001 } = process.env;
const app = express();

app.use(cors());
app.use(express.json());

// Always set test user for all requests
app.use((req, res, next) => {
  req.user = { _id: "5d8b8592978f8bd833ca8133" };
  next();
});

// Debug root: ensure server responds right away (for wait-port)
app.get("/", (req, res) => {
  res.send("ok");
});

app.use(routes);

// Error handler (4 args)
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).json({
    message:
      statusCode === 500 ? "An error has occurred on the server" : message,
  });
  next();
});

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    // eslint-disable-next-line no-console
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      // eslint-disable-next-line no-console
      console.log(`App listening at port ${PORT}`);
    });
  })
  .catch((err) => {
    // eslint-disable-next-line no-console
    console.error("DB connection error:", err);
    process.exit(1);
  });
