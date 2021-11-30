const express = require("express");
const cors = require("cors");
const routesArticulos = require("../routes/articulos");
const routesPedidos = require("../routes/pedidos");
const { dbConnecion } = require("../database/config");
const bodyParser = require("body-parser");

class Server {
	constructor() {
		this.app = express();
		this.PORT = process.env.PORT;
		// Conect to database
		this.conectDB();
		// Middlewares
		this.middlewares();
		// Routes
		this.routes();
	}

	async conectDB() {
		await dbConnecion();
	}

	middlewares() {
		// CORS
		this.app.use(bodyParser.urlencoded({ extended: false }));
		this.app.use(bodyParser.json());
		this.app.use(cors());
		// Read and parse body
		
		// Public directory
		// this.app.use(express.static("public"));
	}

	routes() {
		this.app.use((req, res, next) => {
			res.header('Access-Control-Allow-Origin', '*');
			res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
			res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
			res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
			next();
		});
		this.app.use("/api/articulos", routesArticulos);
		this.app.use("/api/pedidos", routesPedidos);
	}

	listen() {
		this.app.listen(this.PORT, () => {
			console.log(`Listening at http://localhost:${this.PORT}`);
		});
	}
}

module.exports = Server;
