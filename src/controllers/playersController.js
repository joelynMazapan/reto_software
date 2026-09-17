const db = require('../config/database');

const createPlayer = async (req, res) => {
    try {
        const { name, gamerTag, email } = req.body;

        if (!name || !gamerTag || !email) {
            return res.status(400).json({ 
                msg: 'Todos los campos (name, gamerTag, email) son obligatorios.' 
            });
        }

        const [rows] = await db.query(
            'SELECT * FROM Jugador WHERE GamerTag = ? OR Correo = ?', 
            [gamerTag, email]
        );

        if (rows.length > 0) {
            return res.status(400).json({ 
                msg: 'El gamerTag o el email ya están registrados. Por favor elige otro.' 
            });
        }

        const [result] = await db.query(
            'INSERT INTO Jugador (Nombre, GamerTag, Correo) VALUES (?, ?, ?)',
            [name, gamerTag, email]
        );

        res.status(201).json({
            mensaje: 'Jugador creado exitosamente',
            id: result.insertId
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Fallo al guardar' });
    }
};

const getPlayers = async (req, res ) => {
    try {
        const [players] = await db.query('SELECT * FROM Jugador');
        res.json(players);
    } catch (error){
        console.error(error);
        res.status(500).json({ error: 'Error al obtener los datos' });
    }
};

const searchPlayers = async (req, res) => {
    try {
        const { q } = req.query;

        if (!q) {
            return res.status(400).json({ 
                msg: 'Debes proporcionar un término de búsqueda (ej: ?q=texto).' 
            });
        }

        const searchTerm = `%${q}%`;

        const query = `
            SELECT 
                idJugador,
                Nombre,
                GamerTag,
                Correo,
                FechaRegistro
            FROM Jugador
            WHERE 
                Nombre LIKE ?
                OR GamerTag LIKE ?;
        `;

        const [players] = await db.query(query, [searchTerm, searchTerm]);

        res.json(players);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al buscar jugadores' });
    }
};

module.exports = { createPlayer, getPlayers, searchPlayers };