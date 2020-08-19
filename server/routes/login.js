const express = require('express');

const app = express();

const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');


const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);


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


// Configuracion de google
async function verify( token ) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    /* console.log('payload ', payload); */

    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
}
/* verify().catch(console.error); */
  

app.post('/google', async (req, resp) => {

    let token = req.body.idtoken;
    
    let googleUser = await verify(token)
        .catch( e => {
            return resp.status(403).json({
                ok: false,
                err: e
            })
        });
    
    Usuario.findOne( { email: googleUser.email }, (err, usuarioDB) => {

        if ( err ) {
            return resp.status(500).json({
                ok: false,
                err
            });
        }

        if( usuarioDB ) {

            if(usuarioDB.google === false ) {
                return resp.status(400).json({
                    ok: false,
                    err: {
                        message: 'Debe de usar su autenticacion normal'
                    }
                });
            } else {

                let token = jwt.sign({
                    usuario: usuarioDB
                }, process.env.SEED, { expiresIn: process.env.TOKEN_CADUCIDAD })

                return resp.status(200).json({
                    ok: true,
                    usuario: usuarioDB,
                    token,
                })
            }
            
        } else {

            // Si el usuario no existe en nuestra BD

            let usuario = new Usuario();

            usuario.nombre = googleUser.nombre;
            usuario.email = googleUser.email;
            usuario.img = googleUser.img;
            usuario.google = googleUser.google;
            usuario.password = ':)';

            usuario.save( (err, usuarioDB) => {

                if ( err ) {
                    return resp.status(500).json({
                        ok: false,
                        err
                    });
                }

                let token = jwt.sign({
                    usuario: usuarioDB
                }, process.env.SEED, { expiresIn: process.env.TOKEN_CADUCIDAD })

                return resp.status(200).json({
                    ok: true,
                    usuario: usuarioDB,
                    token,
                })

            })

        }

    });

});


module.exports = app;