const express = require('express');
const cors = require('cors');
const dbConnection = require('../database/config');

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;
    this.paths = {
      user: '/api/users',
      auth: '/api/auth',
      category: '/api/category',
      product: '/api/product',
    };

    // Conectar a base de datos
    this.connectDB();

    // Middlewares
    this.middlewares();

    // Rutas
    this.routes();
  }

  async connectDB() {
    await dbConnection();
  }

  middlewares() {
    // CORS
    this.app.use(cors());

    // Lectura y parseo del body
    this.app.use(express.json());

    // Directorio público
    this.app.use(express.static('public'));
  }

  routes() {
    this.app.use(this.paths.auth, require('../routes/auth.routes'));
    this.app.use(this.paths.user, require('../routes/user.routes'));
    this.app.use(this.paths.category, require('../routes/category.routes'));
    this.app.use(this.paths.product, require('../routes/products.routes'));
  }

  start() {
    this.app.listen(this.port, () => {
      console.log('Running on port ', this.port);
    });
  }
}

module.exports = Server;
