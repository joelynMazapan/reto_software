const db = require('../config/database');

const getEstadisticas = async (req, res) => {
    try {

        const [rows] = await db.query('CALL ObtenerEstadisticas()');

        const estadisticas = rows[0][0];

        res.json({
            total_jugadores: estadisticas.TotalJugadores,
            total_videojuegos: estadisticas.TotalVideojuegos,
            total_puntuaciones: estadisticas.TotalPuntuaciones,
            puntuacion_promedio: estadisticas.PuntuacionPromedio ? parseFloat(estadisticas.PuntuacionPromedio).toFixed(2) : 0
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener las estadísticas' });
    }
};

module.exports = { getEstadisticas };