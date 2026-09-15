USE TorneoVideoJuego;

-- Consulta de jugadores
SELECT
    Gamertag,
    Correo,
    FechaRegistro
FROM Usuario;

-- Búsqueda de jugador por 'Nombre' o 'Gamertag' y buscar coincidencias
SELECT
    idUsuario,
    Nombre,
    Gamertag,
    Correo,
    FechaRegistro
FROM Usuario
WHERE
    Nombre LIKE '%ejemplo%'
    OR Gamertag LIKE '%ejemplo%';


-- Clasificación por puntuación de mayor a menor
SELECT
    u.Gamertag AS JUGADOR,
    v.Nombre AS VIDEOJUEGO,
    p.Puntuacion AS PUNTUACIÓN
FROM Puntuacion p
    JOIN Usuario u ON p.fkUsuario = u.idUsuario
    JOIN VideoJuego v ON p.fkVideoJuego = v.idVideoJuego
ORDER BY p.Puntuacion DESC;

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