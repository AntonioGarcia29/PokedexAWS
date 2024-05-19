const morgan = require('morgan');
const express = require('express');
const app = express();

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

app.get("/", index); 

app.use('/pokedex', pokedex); 

app.use(notFound)

app.listen(process.env.PORT || 3000, () => {
    console.log('Server is running...');
});
