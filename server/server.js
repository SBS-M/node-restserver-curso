
require('./config/config');


const express = require('express');
const app = express();

// Using Node.js `require()`
const mongoose = require('mongoose');

const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())

// Configuracion global de rutas
app.use(require('./routes/index'));

app.get('/', function (req, res) {
    res.json('Main usuarios')
});


// Conexion a base de datos
mongoose.connect(process.env.URLDB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
}).then((result) => {
    console.log(`Se inicio de forma correcta la conexion a la base de datos`);
}).catch((err) => {
    console.log(`Hubo un error al iniciar la conexion a la base de datos `, err);
});;
 
app.listen(process.env.PORT, () => {
    console.log(`Escuchando puerto 3000`);
})
