
const jwt = require('jsonwebtoken');


const ROLES_VALIDOS = ['ADMIN_ROLE'];

// ============================================
// Verificar Token
// ============================================

let verificaToken = (req, resp, next) => {

    let token = req.get('token');

    jwt.verify( token, process.env.SEED, (err, decoded) => {

        if ( err ) {
            resp.status(401).json({
                ok: false,
                err: {
                    message: 'Token no valido'
                }
            })
        } else {
            req.usuario = decoded.usuario;
            next();
        }

    }) ;

};

let verificaAdminRol = (req, resp, next) => {

    let token = req.get('token');

    jwt.verify(token, process.env.SEED, (err, payload) => {

        if( err ){
            resp.status(500).json({
                ok: false,
                err
            })
        }

        if( req.usuario.role !== 'ADMIN_ROLE' ){

            resp.status(401).json({
                err:{
                    message: 'Usuario no posee ADMIN_ROLE, para ejecutar esta accion'
                }
            });

        } else {
            next();
            return;
        }

    });

}

module.exports = {
    verificaToken,
    verificaAdminRol
}