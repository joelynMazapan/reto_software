USE TorneoVideoJuego;

-- Registrar jugador (Error de Gamertag duplicado)
INSERT INTO Usuario (Nombre, Gamertag, Correo)
VALUES (?, ?, ?);
 

-- Registrar videojuego (Error de nombre duplicado)
INSERT INTO VideoJuego (Nombre, Genero)
VALUES (?, ?);

-- Consulta de jugadores
SELECT
    Gamertag,
    Correo,
    FechaRegistro
FROM Usuario;


-- Registrar puntuación (Valida que el jugador y el videojuego existan)
SELECT idUsuario FROM Usuario WHERE idUsuario = ?;
SELECT idVideoJuego FROM VideoJuego WHERE idVideoJuego = ?;
INSERT INTO Puntuacion (fkUsuario, fkVideoJuego, Puntuacion)
VALUES (?, ?, ?);


-- Clasificación por puntuación de mayor a menor
SELECT
    u.Gamertag AS JUGADOR,
    v.Nombre AS VIDEOJUEGO,
    p.Puntuacion AS PUNTUACIÓN
FROM Puntuacion p
    JOIN Usuario u ON p.fkUsuario = u.idUsuario
    JOIN VideoJuego v ON p.fkVideoJuego = v.idVideoJuego
ORDER BY p.Puntuacion DESC;


-- Búsqueda de jugador por 'Nombre' o 'Gamertag' y buscar coincidencias
SELECT
    idUsuario,
    Nombre,
    Gamertag,
    Correo,
    FechaRegistro
FROM Usuario
WHERE
    Nombre LIKE ?
    OR Gamertag LIKE ?;


-- Obtención de estadísticas
DELIMITER //
CREATE PROCEDURE ObtenerEstadisticas()
BEGIN
    SELECT
        (SELECT COUNT(*) FROM Usuario) AS TotalJugadores,
        (SELECT COUNT(*) FROM VideoJuego) AS TotalVideojuegos,
        (SELECT COUNT(*) FROM Puntuacion) AS TotalPuntuaciones,
        (SELECT AVG(Puntuacion) FROM Puntuacion) AS PuntuacionPromedio;
END //
DELIMITER ;

CALL ObtenerEstadisticas();