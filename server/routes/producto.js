
const express = require('express');

const { verificaToken, verificaAdminRol } = require('../middlewares/autenticacion')

let app = express();

let Producto = require('../models/producto');


// =================================
// Buscar productos
// =================================
app.get('/producto/buscar/:termino', verificaToken, (req, resp) => {

    let termino = req.params.termino;
    let regex = new RegExp(termino, 'i');

    Producto.find({ nombre: regex })
    .populate('categoria', 'nombre')
    .exec((err, productosDB) => {

        if ( err ) {
            resp.status(500).json({
                ok: false,
                err
            });
        }

        if ( !productosDB ) {
            resp.status(400).json({
                ok: false,
                err
            });
        } else {
            resp.status(200).json({
                ok: true,
                productosDB
            });
        }

    })

});

// =================================
// Mostrar todas los productos
// =================================
app.get('/producto', verificaToken,(req, resp) => {
    // Trae todos los productos
    // Populate: usuario categoria
    // Paginado

    let desde = parseInt(req.query.desde, 10) || 0;
    let hasta = parseInt(req.query.hasta, 10) || 0;

    Producto.find({})
    .populate('categoria', 'descripcion')
    .populate('usuario', 'nombre email')
    .skip(desde)
    .limit(hasta).exec((err, listaProductos) => {

        if ( err ) {
            resp.status(500).json({
                ok: false,
                err
            });
        }

        if ( !listaProductos ) {
            resp.status(400).json({
                ok: false,
                err
            });
        } else {
            resp.status(200).json({
                ok: true,
                listaProductos
            });
        }

    });

});

// =================================
// Mostrar producto por ID
// =================================
app.get('/producto/:id', verificaToken, (req, resp) => {
    // Populate: usuario categoria

    let idProducto = req.params.id;

    Producto.findById(idProducto)
    .populate('usuario', 'nombre email')
    .exec((err, productoDB) => {

        if ( err ) {
            resp.status(500).json({
                ok: false,
                err
            });
        }

        if ( !productoDB ) {
            resp.status(400).json({
                ok: false,
                err
            });
        } else {
            resp.status(200).json({
                ok: true,
                productoDB
            });
        }

    })

});

// =================================
// Crear un nuevo producto
// =================================
app.post('/producto', verificaToken, (req, resp) => {
    // Grabar el usuario
    // Grabar una categoria del listado

    let body = req.body;

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
        usuario: req.usuario._id
    });

    producto.save((err, productoDB) => {

        if ( err ) {
            resp.status(500).json({
                ok: false,
                err
            });
        }

        if ( !productoDB ) {
            resp.status(400).json({
                ok: false,
                err
            });
        } else {
            resp.status(201).json({
                ok: true,
                productoDB
            });
        }

    });

});

// =================================
// Actualizar producto
// =================================
app.put('/producto/:id', verificaToken, (req, resp) => {
    // Grabar el usuario
    // Grabar una categoria del listado

    let idProducto = req.params.id;



    Producto.findById(idProducto, (err, productoDB) => {

        if ( err ) {
            resp.status(500).json({
                ok: false,
                err
            });
        }

        if ( !productoDB ) {
            resp.status(400).json({
                ok: false,
                err
            });
        } else {

            productoDB.nombre = req.body.nombre;
            productoDB.precioUni = req.body.precioUni;
            productoDB.categoria = req.body.categoria;
            productoDB.disponible = req.body.disponible;
            productoDB.descripcion = req.body.descripcion;

            productoDB.save((err, productoGuardado) => {
                if ( err ) {
                    resp.status(500).json({
                        ok: false,
                        err
                    });
                } else {
                    resp.status(200).json({
                        ok: true,
                        producto: productoGuardado
                    });
                }
            })
            
        }

        

    });

});

// =================================
// Actualizar producto
// =================================
app.delete('/producto/:id', (req, resp) => {
    // Grabar el usuario
    // Grabar una categoria del listado
    // Disponible a false

    let idProducto = req.params.id;

    let producto = {
        disponible: false
    };

    Producto.findByIdAndUpdate(idProducto, producto, { new: true, runValidators: true }, (err, productoDB) => {

        if ( err ) {
            resp.status(500).json({
                ok: false,
                err
            });
        }

        if ( !productoDB ) {
            resp.status(400).json({
                ok: false,
                err: {
                    message: 'El producto con ese ID no existe'
                }
            });
        } else {
            resp.status(200).json({
                ok: true,
                message: 'Producto eliminado'
            });
        }

    });

});

module.exports = app;
