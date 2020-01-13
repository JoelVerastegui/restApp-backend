const jwt = require('jsonwebtoken');


const authUser = (req, res, next) => {
    const token = req.get('token');

    jwt.verify(token,process.env.token_seed,(err,decoded)=>{
        if(err){
            return res.status(401).json({
                ok: false,
                err
            })
        }

        req.usuario = decoded.usuarioDB;

        next();
    })
}

const adminVerify = (req,res,next) => {
    if(req.usuario.role !== 'ADMIN_ROLE'){
        return res.status(401).json({
            ok: false,
            err: {
                message: 'El usuario no tiene privilegios de administrador'
            }
        })
    }
    
    next();
}

module.exports = {
    authUser,
    adminVerify
}