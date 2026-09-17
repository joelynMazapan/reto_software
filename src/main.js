require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

// Importación de rutas
const pingRoutes = require('./routes/pingRoutes');
const playerRoutes = require('./routes/players')
const gameRoutes = require('./routes/games')
const puntuationRoutes = require('./routes/puntuation')
const clasificationRoutes = require('./routes/clasification')
const statisticsRoutes = require('./routes/statistics')

// Inicializando Express
const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Conexi´m de rutas
app.use('/', pingRoutes);
app.use('/players',playerRoutes);
app.use('/games',gameRoutes);
app.use('/puntuation',puntuationRoutes);
app.use('/clasification',clasificationRoutes);
app.use('/statistics',statisticsRoutes);

// Arramnque del servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});