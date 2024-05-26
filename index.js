const morgan = require('morgan');
const express = require('express');
const path = require('path');
const app = express();
require('dotenv').config(); 

// routers
const pokedex = require('./routes/pokedex');

// middleware
const cors = require('./middleware/cors');
const index = require('./middleware/index');
const notFound = require('./middleware/notFound');

app.use(cors);
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos desde el directorio 'interfaz'
app.use(express.static(path.join(__dirname, 'interfaz')));

// Ruta para la página de inicio
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, 'interfaz', 'index.html'));
});

// Rutas API
app.use('/pokedex', pokedex); 

app.use(notFound)

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}...`);
});
