const router = require('express').Router();
const auth = require('../middleware/authMiddleware');
const ctrl = require('../controllers/barangController');

router.use(auth);
router.get('/', ctrl.getAll);
router.get('/low-stock', ctrl.getLowStock);
router.post('/', ctrl.create);
router.put('/:id', ctrl.update);
router.delete('/:id', ctrl.delete);

module.exports = router;