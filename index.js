const morgan = require('morgan');
const express = require('express');
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


app.get("/", index); 

app.use('/pokedex', pokedex); 
app.use(express.static('public'));

app.use(notFound)

app.listen(process.env.PORT || 3000, () => {
    console.log('Server is running...');
});
