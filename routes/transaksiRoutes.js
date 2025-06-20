const router = require('express').Router();
const auth = require('../middleware/authMiddleware');
const ctrl = require('../controllers/transaksiController');

router.use(auth);
router.post('/', ctrl.create);
router.get('/', ctrl.getAll);

module.exports = router;
