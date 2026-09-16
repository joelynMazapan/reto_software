CREATE DATABASE TorneoVideoJuego;

USE TorneoVideoJuego;

CREATE TABLE
    Jugador (
        idJugador INT PRIMARY KEY AUTO_INCREMENT,
        Nombre VARCHAR(50) NOT NULL,
        Gamertag VARCHAR(50) NOT NULL UNIQUE,
        Correo VARCHAR(50) NOT NULL,
        FechaRegistro DATETIME DEFAULT CURRENT_TIMESTAMP
    );

CREATE TABLE
    VideoJuego (
        idVideoJuego INT PRIMARY KEY AUTO_INCREMENT,
        Nombre VARCHAR(100) NOT NULL UNIQUE,
        Genero VARCHAR(50) NOT NULL
    );

CREATE TABLE
    Puntuacion (
        idPuntuacion INT PRIMARY KEY AUTO_INCREMENT,
        fkJugador INT NOT NULL,
        fkVideoJuego INT NOT NULL,
        Puntuacion INT NOT NULL,
        CONSTRAINT check_puntuacion CHECK (Puntuacion >= 0),
        FechaPuntuacion DATETIME DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_puntuacion_jugador FOREIGN KEY (fkJugador) REFERENCES Jugador (idJugador),
        CONSTRAINT fk_puntuacion_videojuego FOREIGN KEY (fkVideoJuego) REFERENCES VideoJuego (idVideoJuego)
    );