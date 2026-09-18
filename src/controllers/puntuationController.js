const db = require('../config/database');

// (Ya lo tienes) Crear puntuación
const createPuntuation = async (req, res) => {
    try {
        const { fkJugador, fkVideoJuego, puntos } = req.body;

        if (!fkJugador || !fkVideoJuego || puntos === undefined) {
            return res.status(400).json({ msg: 'Los campos fkJugador, fkVideoJuego y puntos son obligatorios.' });
        }
        if (puntos < 0) {
            return res.status(400).json({ msg: 'La puntuación no puede ser negativa.' });
        }

        const [result] = await db.query(
            'INSERT INTO Puntuacion (fkJugador, fkVideoJuego, Puntuacion) VALUES (?, ?, ?)',
            [fkJugador, fkVideoJuego, puntos]
        );

        res.status(201).json({ mensaje: 'Puntuación registrada exitosamente', idPuntuacion: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Fallo al guardar la puntuación' });
    }
};

// NUEVO: Actualizar Puntuación
const updatePuntuation = async (req, res) => {
    try {
        const { id } = req.params;
        const { fkJugador, fkVideoJuego, puntos } = req.body;

        if (!fkJugador || !fkVideoJuego || puntos === undefined) {
            return res.status(400).json({ msg: 'Todos los campos son obligatorios para actualizar.' });
        }
        if (puntos < 0) {
            return res.status(400).json({ msg: 'La puntuación no puede ser negativa.' });
        }

        const [result] = await db.query(
            'UPDATE Puntuacion SET fkJugador = ?, fkVideoJuego = ?, Puntuacion = ? WHERE idPuntuacion = ?',
            [fkJugador, fkVideoJuego, puntos, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ msg: 'Puntuación no encontrada.' });
        }

        res.json({ mensaje: 'Puntuación actualizada exitosamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Fallo al actualizar la puntuación' });
    }
};

// NUEVO: Eliminar Puntuación
const deletePuntuation = async (req, res) => {
    try {
        const { id } = req.params;

        const [result] = await db.query(
            'DELETE FROM Puntuacion WHERE idPuntuacion = ?',
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ msg: 'Puntuación no encontrada.' });
        }

        res.json({ mensaje: 'Puntuación eliminada correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Fallo al eliminar la puntuación' });
    }
};

module.exports = { createPuntuation, updatePuntuation, deletePuntuation };