const express = require("express");
const cors = require("cors");

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;
    this.usersPath = "/api/users";

    // Middlewares
    this.middlewares();

    // Rutas
    this.routes();
  }

  middlewares() {
    // CORS
    this.app.use(cors());

    // Lectura y parseo del body
    this.app.use(express.json());

    // Directorio público
    this.app.use(express.static("public"));
  }

  routes() {
    this.app.use(this.usersPath, require("../routes/user.routes"));
    // this.app.get("/api", (req, res) => {
    //   res.status(200).json({
    //     type: "get",
    //   });
    // });
    // this.app.delete("/api", (req, res) => {
    //   res.json({
    //     type: "delete",
    //   });
    // });
    // this.app.post("/api", (req, res) => {
    //   res.json({
    //     type: "post",
    //   });
    // });
  }

  start() {
    this.app.listen(this.port, () => {
      console.log("Running on port ", this.port);
    });
  }
}

module.exports = Server;
