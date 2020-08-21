
const express = require('express');
const app = express();

const { verificaToken, verificaAdminRol } = require('../middlewares/autenticacion')


let Categoria = require('../models/categoria');
const categoria = require('../models/categoria');


// =================================
// Mostrar todas las categorias
// =================================
app.get('/categoria', verificaToken, (req, resp) => {

    let desde = parseInt(req.query.desde,10) || 0;
    let limit = parseInt(req.query.limit,10) || 0;

    Categoria.find()
    .populate('usuario','nombre email')
    .sort('descripcion')
    .skip(desde)
    .limit(limit)
    .exec((err, listCategoria) => {

        if ( err ){
            resp.status(500).json({
                ok: false,
                err
            });
        }
        
        if ( !listCategoria ){
            resp.status(400).json({
                ok: false,
                err
            });
        } else {
            
            Categoria.countDocuments({}, (err, total) => {

                resp.status(200).json({
                    ok: true,
                    listCategoria,
                    count: total
                });

            })
            
        }

    });
    

});

// =================================
// Mostrar categoria por ID
// =================================
app.get('/categoria/:id', verificaToken, (req, resp) => {
    
    let idCategoria = req.params.id;

    Categoria.findById(idCategoria, (err, categoriaDB) => {

        if ( err ){
            resp.status(500).json({
                ok: false,
                err
            });
        }

        if ( !categoriaDB ){
            resp.status(400).json({
                ok: false,
                err: {
                    message: 'El ID no es correcto'
                }
            });
        } else {

            resp.status(200).json({
                ok: true,
                categoriaDB
            });
            
        }

    });

});

// =================================
// Crear nueva categoria
// =================================
app.post('/categoria', verificaToken, (req, resp) => {
    // regresa la nueva categoria
    // req.usuario._id

    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    categoria.save( (err, newCategoria) => {

        if ( err ){
            resp.status(500).json({
                ok: false,
                err
            });
        }

        if ( !newCategoria ){
            resp.status(400).json({
                ok: false,
                err
            });
        } else {
            resp.status(200).json({
                ok: true,
                newCategoria
            });
        }
    });

});

// =================================
// Actualizar nombre categoria
// =================================
app.put('/categoria/:id', verificaToken, (req, resp) => {
    // regresa la nueva categoria
    // req.usuario._id

    let idCategoria = req.params.id;
    let body = req.body;

    let descCategoria = {
        descripcion: body.descripcion
    };

    Categoria.findByIdAndUpdate(idCategoria, descCategoria, { new: true, runValidators: true }, (err, categoriaDB) => {

        if ( err ){
            resp.status(500).json({
                ok: false,
                err
            });
        }

        if ( !categoriaDB ){
            resp.status(400).json({
                ok: false,
                err
            });
        } else {
            resp.status(200).json({
                ok: true,
                categoriaDB
            });
        }

    });

});

// =================================
// Eliminar nombre categoria
// =================================
app.delete('/categoria/:id', [verificaToken, verificaAdminRol], (req, resp) => {
    // Solo admin puede borrar
    // Categoria.findByIdAndRemove

    let idCategoria = req.params.id;

    Categoria.findByIdAndRemove(idCategoria, (err, categoriaDB) => {

        if ( err ){
            resp.status(500).json({
                ok: false,
                err
            });
        }

        if ( !categoriaDB ){
            resp.status(400).json({
                ok: false,
                err: {
                    message: 'El id no existe'
                }
            });
        } else {
            resp.status(200).json({
                ok: true,
                message: 'Categoria borrada'
            });
        }

    });

});

module.exports = app;

