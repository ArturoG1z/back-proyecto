

const { Schema, model } = require("mongoose");

const PedidoSchema = Schema({
	usuario: String,
	fecha: String,
	total: Number,
	descuento: Number,
	articulos: [{ 
		cantidad: Number,
		idArticulo: String,
	}]
});

module.exports = model("pedido", PedidoSchema);
