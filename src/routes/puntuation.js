const express = require('express');
const router = express.Router();
const { createPuntuation} = require('../controllers/puntuationController');


router.post('/', createPuntuation);

module.exports = router;