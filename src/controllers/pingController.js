const db = require('../config/database');

const ping = async (req, res) => {
    try {
        const [resultado] = await db.query('SELECT "Conectado a la base de datos" AS mensaje');
        res.json(resultado[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Fallo en la conexión en la base de datos' });
    }
};

module.exports = { ping };