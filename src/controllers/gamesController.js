const db = require('../config/database');

const createGame = async (req, res) => {
    try {
        const { name,genre} = req.body;

        if (!name || !genre) {
            return res.status(400).json({ 
                msg: 'Todos los campos (name, genre) son obligatorios.' 
            });
        }

        const [rows] = await db.query(
            'SELECT * FROM VideoJuego WHERE Nombre = ?', 
            [name]
        );

        if (rows.length > 0) {
            return res.status(400).json({ 
                msg: 'El nombre ya está registrado. Por favor elige otro.' 
            });
        }

        const [result] = await db.query(
            'INSERT INTO VideoJuego (Nombre, Genero) VALUES (?, ?)',
            [name, genre]
        );

        res.status(201).json({
            mensaje: 'Videojuego creado exitosamente',
            id: result.insertId
        });

    }catch (error){
        console.error(error);
        res.status(500).json({ error: 'Fallo al guardar' });
    }
}

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
module.exports = { createGame , getGames, getGameById };
