'use strict';
const { response, request } = require("express");
const Articulo = require("../models/articulo");
const fs = require('fs');
const isWin = process.platform === 'win32';
const path = require('path');
const { deleteImage } = require("../helpers/images");
const articulo = {
  save(req, res) {
		let params = req.body;
		let articulo = new Articulo();
		articulo.nombre = params.nombre;
		articulo.descripcion = params.descripcion;
		articulo.resumen = params.resumen;
		articulo.codigo = params.codigo;
		articulo.stock = Number(params.stock);
		articulo.precio = Number(params.precio);
		articulo.categoria = params.categoria;
		articulo.imagen = null;

		articulo.save((err, articuloStored) => {
			if (err) return res.status(500).send({ message: 'Error al guardar el articulo', err});
			if (!articuloStored) return res.status(404).send({ message: 'No se ha guardado el articulo' });
			return res.status(200).send({ articulo: articuloStored });
		});
	},
	get(req, res) {
		let articuloId = req.params.id;

		if (articuloId == null) return res.status(404).send({ message: 'El articulo no existe.' });

		Articulo.findById(articuloId, (err, articulo) => {
			if (err) return res.status(500).send({ message: 'Error al devolver los datos.' });

			if (!articulo) return res.status(404).send({ message: 'El articulo no existe.' });

			return res.status(200).send({
				articulo,
			});
		});
	},

	getAll(req, res) {
		Articulo.find({})
			.sort('-year')
			.exec((err, articulos) => {
				if (err) return res.status(500).send({ message: 'Error al devolver los datos.' });

				if (!articulos) return res.status(404).send({ message: 'No hay articuloos que mostrar.' });

				return res.status(200).send({ articulos });
			});
	},

	update(req, res) {
		let articuloId = req.params.id;
		let params = req.body;
		let articulo = {};
		articulo.nombre = params.nombre;
		articulo.descripcion = params.descripcion;
		articulo.resumen = params.resumen;
		articulo.codigo = params.codigo;
		articulo.stock = Number(params.stock);
		articulo.precio = Number(params.precio);
		articulo.categoria = params.categoria;

		Articulo.findByIdAndUpdate(articuloId, articulo, { new: true }, (err, articuloUpdated) => {
			if (err){
				console.log(err);
				return res.status(500).send({
					message: 'Error al actualizar'
				});
			} 

			if (!articuloUpdated) return res.status(404).send({ message: 'No existe el articulo para actualizar' });

			return res.status(200).send({
				articulo: articuloUpdated,
			});
		});
	},

	delete(req, res) {
		let articuloId = req.params.id;

		Articulo.findByIdAndRemove(articuloId, (err, articuloRemoved) => {
			if (err) return res.status(500).send({ message: 'No se ha podido borrar el articulo' });
			if (!articuloRemoved) return res.status(404).send({ message: 'No se puede eliminar ese articulo.' });
			const eliminoImagen = deleteImage(articuloRemoved.imagen);
			if (!eliminoImagen) return res.status(404).send({ message : 'No se pudo eliminar la imagen' });
			return res.status(200).send({
				articulo: articuloRemoved,
			});
		});
	},
	uploadImage(req, res) {
		let articuloId = req.params.id;
		let fileName = 'Imagen no subida';
		if (req.files) {
			let filePath = req.files.imagen.path;
			let fileSplit = isWin ? filePath.split('\\') : filePath.split('/');
			fileName = fileSplit[1];
			let extSplit = fileName.split('.');
			let fileExt = extSplit[1];
			
			if (fileExt == 'png' || fileExt == 'jpg' || fileExt == 'jpeg' || fileExt == 'gif') {
				Articulo.findByIdAndUpdate(articuloId, { imagen: fileName }, { new: true }, (err, articuloUpdated) => {
					if (err) return res.status(500).send({ message: 'Error al actualizar' });

					if (!articuloUpdated) return res.status(404).send({ message: 'No existe el articulo para actualizar' });

					return res.status(200).send({
						articulo: articuloUpdated,
					});
				});
			} else {
				fs.unlink(filePath, (err) => {
					return res.status(200).send({ message: 'La extension no es valida' });
				});
			}
		} else {
			return res.status(200).send({ message: fileName });
		}
	},
	getImageFile(req, res) {
		let file = req.params.image;
		let path_file = './uploads/' + file;

		fs.exists(path_file, (exists) => {
			if (exists) {
				return res.sendFile(path.resolve(path_file));
			} else {
				return res.status(200).send({
					message: 'No existe la imagen...',
				});
			}
		});
	},
	
}

module.exports = {
  articulo
};
