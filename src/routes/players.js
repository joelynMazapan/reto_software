const express = require('express');
const router = express.Router();

const { getPlayers , createPlayer , searchPlayers} = require('../controllers/playersController');

router.get('/', getPlayers);
router.post('/', createPlayer);
router.get('/:id', searchPlayers);

module.exports = router;