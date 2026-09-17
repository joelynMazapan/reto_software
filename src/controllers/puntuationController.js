const db = require('../config/database');

const createPuntuation = async (req, res) => {
    try {
        const { fkJugador, fkVideoJuego, puntos } = req.body;

        if (!fkJugador || !fkVideoJuego || puntos === undefined) {
            return res.status(400).json({ 
                msg: 'Los campos fkJugador, fkVideoJuego y puntos son obligatorios.' 
            });
        }

        if (puntos < 0) {
            return res.status(400).json({ 
                msg: 'La puntuación no puede ser negativa.' 
            });
        }

        const [userRows] = await db.query(
            'SELECT idJugador FROM Jugador WHERE idJugador = ?', 
            [fkJugador]
        );
        
        if (userRows.length === 0) {
            return res.status(404).json({ msg: 'El jugador especificado no existe.' });
        }

        const [gameRows] = await db.query(
            'SELECT idVideoJuego FROM VideoJuego WHERE idVideoJuego = ?', 
            [fkVideoJuego]
        );
        
        if (gameRows.length === 0) {
            return res.status(404).json({ msg: 'El videojuego especificado no existe.' });
        }

        const [result] = await db.query(
            'INSERT INTO Puntuacion (fkJugador, fkVideoJuego, Puntuacion) VALUES (?, ?, ?)',
            [fkJugador, fkVideoJuego, puntos]
        );

        res.status(201).json({
            mensaje: 'Puntuación registrada exitosamente',
            idPuntuacion: result.insertId
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Fallo al guardar la puntuación' });
    }
};

module.exports = { createPuntuation };