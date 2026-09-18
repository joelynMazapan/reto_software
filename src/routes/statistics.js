const express = require('express');
const router = express.Router();

const { getEstadisticas } = require('../controllers/statisticsController');

router.get('/', getEstadisticas);

module.exports = router;
