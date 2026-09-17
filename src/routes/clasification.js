const express = require('express');
const router = express.Router();

const { getClasification } = require('../controllers/clasificationController');

router.get('/', getClasification);

module.exports = router;
