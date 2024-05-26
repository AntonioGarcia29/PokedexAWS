const morgan = require('morgan');
const express = require('express');
const app = express();
require('dotenv').config(); 
const path = require('path')

// routers
const pokedex = require('./routes/pokedex');

// middleware
const cors = require('./middleware/cors');
const index = require('./middleware/index');
const notFound = require('./middleware/notFound');
app.use(express.static(path.join(__dirname, 'interfaz')));

app.use(cors);
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/",(request, response)=>{
    response.sendFile(path.resolve(__dirname,'index.html'))
} ); 

app.use('/pokedex', pokedex); 

app.use(notFound)

app.listen(process.env.PORT || 80, () => {
    console.log('Server is running...');
});
