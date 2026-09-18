const db = require('../config/database');

const createGame = async (req, res) => {
    try {
        const { name, genre } = req.body;

        if (!name || !genre) {
            return res.status(400).json({ msg: 'Todos los campos (name, genre) son obligatorios.' });
        }

        const cleanName = name.trim().toLowerCase();
        const cleanGenre = genre.trim().toLowerCase();

        const [rows] = await db.query('SELECT * FROM VideoJuego WHERE LOWER(Nombre) = ?', [cleanName]);

        if (rows.length > 0) {
            return res.status(400).json({ 
                msg: `El videojuego '${cleanName}' ya está registrado. Por favor elige otro.` 
            });
        }

        const [result] = await db.query(
            'INSERT INTO VideoJuego (Nombre, Genero) VALUES (?, ?)',
            [cleanName, cleanGenre] 
        );

        res.status(201).json({
            mensaje: 'Videojuego creado exitosamente',
            id: result.insertId
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Fallo al guardar' });
    }
};

const getGames = async (req, res) => {
    try {
        const [games] = await db.query('SELECT * FROM VideoJuego'); 
        res.json(games);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener los datos' });
    }
};

const getGameById = async (req, res) => {
    try {
        const { id } = req.params;

        const [rows] = await db.query('SELECT * FROM VideoJuego WHERE idVideoJuego = ?', [id]);

        if (rows.length === 0) {
            return res.status(404).json({ msg: 'Videojuego no encontrado.' });
        }

        res.json(rows[0]);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener los datos' });
    }
};

const updateGame = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, genre } = req.body; 

        if (!name || !genre) {
            return res.status(400).json({ msg: 'El nombre y el género son obligatorios.' });
        }

        const cleanName = name.trim().toLowerCase();
        const cleanGenre = genre.trim().toLowerCase();

        const query = 'UPDATE VideoJuego SET Nombre = ?, Genero = ? WHERE idVideoJuego = ?';
        const [result] = await db.query(query, [cleanName, cleanGenre, id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ msg: 'Videojuego no encontrado.' });
        }

        res.json({ 
            msg: 'Videojuego actualizado exitosamente', 
            idVideoJuego: id 
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Fallo al actualizar el videojuego' });
    }
};

const deleteGame = async (req, res) => {
    try {
        const { id } = req.params;

        const [result] = await db.query('DELETE FROM VideoJuego WHERE idVideoJuego = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ msg: 'Videojuego no encontrado.' });
        }

        res.json({ msg: 'Videojuego eliminado exitosamente' });

    } catch (error) {
        console.error(error);
        
        // Protección si el juego ya tiene puntuaciones
        if (error.code === 'ER_ROW_IS_REFERENCED_2') {
            return res.status(400).json({ 
                error: 'No se puede eliminar este videojuego porque tiene puntuaciones registradas.' 
            });
        }

        res.status(500).json({ error: 'Fallo al eliminar el videojuego' });
    }
};
module.exports = { createGame , getGames, getGameById, updateGame, deleteGame };
