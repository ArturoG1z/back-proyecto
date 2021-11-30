'use strict';
const { response, request } = require("express");
const Pedido = require("../models/pedido");
const fs = require('fs');
const isWin = process.platform === 'win32';
const path = require('path');

const pedido = {
  save(req, res) {
		let params = req.body;
		let pedido = new Pedido();
		pedido.usuario = params.usuario;
		pedido.fecha = params.fecha;
		pedido.total = Number(params.total);
		pedido.articulos = params.articulos;
		pedido.descuento = Number(params.descuento) || 0;

		pedido.save((err, pedidoStored) => {
			if (err) {
				console.log(err);
				return res.status(500).send({ message: 'Error al guardar el pedido', err});
			}
			if (!pedidoStored) return res.status(404).send({ message: 'No se ha guardado el pedido' });
			return res.status(200).send({ pedido: pedidoStored });
		});
	},
	get(req, res) {
		let pedidoId = req.params.id;

		if (pedidoId == null) return res.status(404).send({ message: 'El pedido no existe.' });

		Pedido.findById(pedidoId, (err, pedido) => {
			if (err) return res.status(500).send({ message: 'Error al devolver los datos.' });

			if (!pedido) return res.status(404).send({ message: 'El pedido no existe.' });

			return res.status(200).send({
				pedido,
			});
		});
	},

	getAll(req, res) {
		Pedido.find({})
			.sort('-year')
			.exec((err, pedidos) => {
				if (err) return res.status(500).send({ message: 'Error al devolver los datos.' });

				if (!pedidos) return res.status(404).send({ message: 'No hay pedidoos que mostrar.' });

				return res.status(200).send({ pedidos });
			});
	},

	update(req, res) {
		let pedidoId = req.params.id;
		let update = req.body;

		Pedido.findByIdAndUpdate(pedidoId, update, { new: true }, (err, pedidoUpdated) => {
			if (err) return res.status(500).send({ message: 'Error al actualizar' });

			if (!pedidoUpdated) return res.status(404).send({ message: 'No existe el pedido para actualizar' });

			return res.status(200).send({
				pedido: pedidoUpdated,
			});
		});
	},

	delete(req, res) {
		let pedidoId = req.params.id;

		Pedido.findByIdAndRemove(pedidoId, (err, pedidoRemoved) => {
			if (err) return res.status(500).send({ message: 'No se ha podido borrar el pedido' });
			if (!pedidoRemoved) return res.status(404).send({ message: 'No se puede eliminar ese pedido.' });
			const eliminoImagen = this.deleteImage(pedidoRemoved.imagen);
			if (!eliminoImagen) return res.status(404).send({ message : 'No se pudo eliminar la imagen' });
			return res.status(200).send({
				pedido: pedidoRemoved,
			});
		});
	}
}

module.exports = {
  pedido
};
