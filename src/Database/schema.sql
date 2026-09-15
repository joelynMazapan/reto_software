CREATE DATABASE TorneoVideoJuego;

USE TorneoVideoJuego;

CREATE TABLE Usuario (
    idUsuario INT PRIMARY KEY AUTO_INCREMENT,
    Nombre VARCHAR(50) NOT NULL,
    Gamertag VARCHAR(50) NOT NULL UNIQUE,
    Correo VARCHAR(50) NOT NULL,
    FechaRegistro DATETIME DEFAULT CURRENT_TIMESTAMP,
    /* 0 = false para jugador, 1 = true para administrador */
    IsAdmin BOOLEAN NOT NULL DEFAULT 0
);

CREATE TABLE VideoJuego (
    idVideoJuego INT PRIMARY KEY AUTO_INCREMENT,
    Nombre VARCHAR(100) NOT NULL UNIQUE,
    Genero VARCHAR(50) NOT NULL
);

CREATE TABLE Puntuacion (
    idPuntuacion INT PRIMARY KEY AUTO_INCREMENT,
    fkUsuario INT NOT NULL,
    fkVideoJuego INT NOT NULL,
    Puntuacion INT UNSIGNED NOT NULL,
    FechaPuntuacion DATETIME DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_puntuacion_usuario
        FOREIGN KEY (fkUsuario)
        REFERENCES Usuario(idUsuario),

    CONSTRAINT fk_puntuacion_videojuego
        FOREIGN KEY (fkVideoJuego)
        REFERENCES VideoJuego(idVideoJuego)
);