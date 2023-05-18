// PRUEBA

const express = require("express");
require("dotenv").config();
const app = express();
const bodyParser = require("body-parser");
const PORT = process.env.PORT || 3001;

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.send({
    message: "Hola",
  });
});

app.post("/", (req, res) => {
  console.log(req.body);
});

app.listen(PORT, () => {
  console.log("Running on port ", process.env.PORT);
});
