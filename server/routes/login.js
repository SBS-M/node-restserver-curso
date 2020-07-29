const express = require('express');

const app = express();

const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');

const Usuario = require('../models/usuario');


app.post('/login', (req, resp) => {

    let body = req.body;

    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {
        if( err ){
            resp.status(400).json({
                ok: false,
                err
            });
        }

        if( !usuarioDB ){
            resp.status(400).json({
                ok: false,
                err : {
                    message: 'Usuario o contraseña incorrectos'
                }
            });
        }

        if ( !bcrypt.compareSync(body.password, usuarioDB.password ) ) {
            resp.status(400).json({
                ok: false,
                err : {
                    message: 'Usuario o contraseña incorrectos'
                }
            });
        } else {

            let token = jwt.sign({
                usuario: usuarioDB
            }, process.env.SEED, { expiresIn: process.env.TOKEN_CADUCIDAD });

            resp.json({
                ok: true,
                usuario: usuarioDB,
                token
            })
        }

    });

});




module.exports = app;