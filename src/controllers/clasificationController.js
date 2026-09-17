const db = require('../config/database');

const getClasification = async (req, res) => {
    try {
        const { juego } = req.query;

        let query = `
            SELECT 
                ROW_NUMBER() OVER(ORDER BY p.Puntuacion DESC) AS 'POSICIÓN',
                j.Gamertag AS 'JUGADOR',
                v.Nombre AS 'VIDEOJUEGO',
                p.Puntuacion AS 'PUNTUACIÓN'
            FROM Puntuacion p
            INNER JOIN Jugador j ON p.fkJugador = j.idJugador
            INNER JOIN VideoJuego v ON p.fkVideoJuego = v.idVideoJuego
        `;

        let queryParams = [];

        if (juego) {
            query += ` WHERE v.Nombre LIKE ?`;
            queryParams.push(`%${juego}%`);
        }

        const [ranking] = await db.query(query, queryParams);

        res.json(ranking);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener la clasificación' });
    }
};

module.exports = { getClasification };