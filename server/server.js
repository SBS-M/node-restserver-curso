
require('./config/config');

const express = require('express')
const app = express()

const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())


app.get('/usuario', function (req, res) {
  res.json('get usuarios')
});

app.post('/usuario', function (req, res) {

    let body = req.body;

    if ( body.nombre === undefined ){
        res.status(400).json({
            ok: false,
            mensaje: `El nombre es necesario`
        });
    } else {
        res.json({body})
    }
    
});

app.put('/usuario/:id', function (req, res) {
    let idUsuario = req.params.id;

    console.log(`idUsuario `, idUsuario);
    
    res.json({ idUsuario })
});

app.delete('/usuario', function (req, res) {
    res.json('get usuarios')
});
 
app.listen(process.env.PORT, () => {
    console.log(`Escuchando puerto 3000`);
})
