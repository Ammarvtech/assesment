const express = require("express");
const cors = require("cors");

require("./db/mydb");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

const usersRouter = require("./routes/users");
const mealsRouter = require("./routes/meals");

app.use("/users", usersRouter);
app.use("/meals", mealsRouter);

app.listen(port, () => {
  console.log("Node Server running on port: " + port);
});
