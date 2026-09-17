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

const getPlayerById = async (req, res) => {
    try {

        const { id } = req.params;

        const query = `
            SELECT 
                idJugador, 
                Nombre, 
                Gamertag, 
                Correo, 
                FechaRegistro 
            FROM Jugador 
            WHERE idJugador = ?
        `;

        const [rows] = await db.query(query, [id]);

        if (rows.length === 0) {
            return res.status(404).json({ msg: 'Jugador no encontrado.' });
        }

        res.json(rows[0]);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al buscar el jugador por ID' });
    }
};

const updatePlayer = async (req, res) => {
    try {
        const { id } = req.params;
        
        const { nombre, gamerTag, correo } = req.body;

        if (!nombre || !gamerTag || !correo) {
            return res.status(400).json({ 
                msg: 'Los campos nombre, gamerTag y correo son obligatorios para actualizar.' 
            });
        }

        const query = `
            UPDATE Jugador 
            SET Nombre = ?, Gamertag = ?, Correo = ? 
            WHERE idJugador = ?
        `;
        
        const [result] = await db.query(query, [nombre, gamerTag, correo, id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ msg: 'Jugador no encontrado o no existe.' });
        }

        res.json({ 
            msg: 'Jugador actualizado exitosamente',
            idJugador: id
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Fallo al actualizar el jugador' });
    }
};

const deletePlayer = async (req, res) => {
    try {
        const { id } = req.params;

        const [result] = await db.query('DELETE FROM Jugador WHERE idJugador = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ msg: 'Jugador no encontrado.' });
        }

        res.json({ msg: 'Jugador eliminado exitosamente' });

    } catch (error) {
        console.error(error);
        
        if (error.code === 'ER_ROW_IS_REFERENCED_2') {
            return res.status(400).json({ 
                error: 'No se puede eliminar este jugador porque tiene puntuaciones registradas en el sistema.' 
            });
        }

        res.status(500).json({ error: 'Fallo al eliminar el jugador' });
    }
};
module.exports = { createPlayer, getPlayers, searchPlayers, getPlayerById , updatePlayer , deletePlayer};