const express = require('express');
const router = express.Router();
const {
  getFees, getFeesByStudent, createFee, updateFee, deleteFee
} = require('../controllers/feeController');
const verifyToken = require('../middleware/auth');

router.use(verifyToken);

router.get('/', getFees);
router.get('/student/:studentId', getFeesByStudent);
router.post('/', createFee);
router.put('/:id', updateFee);
router.delete('/:id', deleteFee);

module.exports = router;
