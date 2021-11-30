const { Router } = require('express');
const { pedido } = require('../controllers/pedido');

const router = Router();

router.get('/:id', pedido.get)
router.get('/', pedido.getAll)
router.post('/', pedido.save)
router.patch('/:id', pedido.update)
router.delete('/:id', pedido.delete)

module.exports = router;
