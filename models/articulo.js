

const { Schema, model } = require("mongoose");

const ArticuloSchema = Schema({
	nombre: String,
	descripcion: String,
	resumen: String,
	codigo: String,
	precio: Number,
	stock: Number,
	categoria: String,
	imagen: String,
});

module.exports = model("articulo", ArticuloSchema);
