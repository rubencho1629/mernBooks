
// impotart libraries
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require ('cors');

// use methods libs.
const app = express();
require('dotenv').config();

// Middlewares
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cors());
// Database setup
const URI = process.env.MONGODB_URL;
mongoose.connect(URI,{
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(()=> { console.log("connexion base de datos exitosa!");})
// Routes Setup

// app.get('',(req, res)=>{
//     res.send("Hola desde el servidor proyecto MERN");
// })

app.use('/api/category', require('./routes/category'));
app.use('/api/book', require('./routes/book'));

// Listen to Port
const port = process.env.PORT;

app.listen(port,()=>{
    console.log(`Servidor de bibiloteca MERN esta siendo ejecutado en el puerto ${port}`);
})