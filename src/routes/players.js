const express = require('express');
const router = express.Router();

const { getPlayers , createPlayer , searchPlayers , getPlayerById} = require('../controllers/playersController');

router.get('/', getPlayers);
router.post('/', createPlayer);
router.get('/search', searchPlayers);
router.get('/:id', getPlayerById);

module.exports = router;