const { Router } = require('express');
const { articulo } = require('../controllers/articulo');
const multipart = require('connect-multiparty');
const multipartMiddleware = multipart({ uploadDir: './uploads' });

const router = Router();

router.get('/:id', articulo.get)
router.get('/', articulo.getAll)
router.post('/', articulo.save)
router.patch('/:id', articulo.update)
router.delete('/:id', articulo.delete)
router.patch('/image/:id', multipartMiddleware, articulo.uploadImage)
router.get('/image/get/:image', articulo.getImageFile);

module.exports = router;
