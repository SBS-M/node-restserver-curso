

const express = require('express');
const app = express();

const bcrypt = require('bcrypt');
const _ = require('underscore');
const Usuario = require('../models/usuario');
const { response } = require('express');

app.get('/usuario', function (req, res) {

    let desde = parseInt(req.query.desde,10) || 0;

    let limit = parseInt(req.query.limit,10) || 0;

    let estado = req.query.estado || true;

    Usuario.find({ estado: estado }, 'nombre email google role')
        .skip(desde)
        .limit(limit)
        .exec((err, listUsuario) => {

            if( err ){
                res.status(400).json({
                    ok: false,
                    err
                });
            } else {

                Usuario.countDocuments({ estado: estado }, (err, total) =>{
                    res.json({
                        ok: true,
                        listUsuario,
                        count: total
                    });
                });
                
            }

        });
  });
  
app.post('/usuario', function (req, res) {

    let body = req.body;

    let usuario = new Usuario({
    nombre: body.nombre,
    email: body.email,
    edad: body.edad,
    password: bcrypt.hashSync(body.password, 10),
    role: body.role
    });

    usuario.save( (err, usuarioDB) => {
        if( err ){
            res.status(400).json({
                ok: false,
                err
            });
        } else {
            res.json({
                ok: true,
                usuarioDB
            });
        }
        
    });
    
});
  
app.put('/usuario/:id', function (req, res) {
    
    let idUsuario = req.params.id;
    let body = _.pick(req.body, ['nombre','email', 'email', 'role', 'estado']);

    Usuario.findByIdAndUpdate( idUsuario, body, { new: true, runValidators: true }, (err, usuarioDB) => {

        if (err) {
            res.status(400).json({
                ok: false,
                err
            })
        } else { 
            res.json({ 
                ok: true,
                usuario: usuarioDB
             })
        }

    });

    console.log(`idUsuario `, idUsuario);
   
});

app.delete('/usuario/:id', function (req, res) {

    let idUsuario = req.params.id;
    
    let cambiaEstado = {
        estado: false
    }

    Usuario.findByIdAndUpdate(idUsuario, cambiaEstado, { new: true }, (err, usuario) => {

        if( err ){
            res.status(400).json({
                ok: false,
                err
            });
        } else if ( !usuario  ) {
            res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            });
        } else {
            res.json({
                ok: true,
                usuario
            });
        }

    });

    /* Usuario.findByIdAndRemove(idUsuario, (err, usuarioBorrado) => {
        if( err ){
            res.status(400).json({
                ok: false,
                err
            });
        } else if ( !usuarioBorrado  ) {
            res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            });
        } else {
            res.json({
                ok: true,
                usuarioBorrado
            });
        }
    }); */
});


  module.exports = app;