const express = require('express');
const router = express.Router();
const { getStats } = require('../controllers/dashboardController');
const verifyToken = require('../middleware/auth');

router.use(verifyToken);
router.get('/stats', getStats);

module.exports = router;
