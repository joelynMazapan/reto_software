const db = require('../config/database');

const getClasification = async (req, res) => {
    try {
        const query = `
            SELECT 
                u.Gamertag AS JUGADOR,
                v.Nombre AS VIDEOJUEGO,
                p.Puntuacion AS PUNTUACIÓN
            FROM Puntuacion p
               JOIN Jugador u ON p.fkJugador = u.idJugador
               JOIN VideoJuego v ON p.fkVideoJuego = v.idVideoJuego
            ORDER BY p.Puntos DESC
        `;
        
        const [clasificacion] = await db.query(query);
        
        res.json(clasificacion);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener la clasificación' });
    }
};

module.exports = { getClasification };