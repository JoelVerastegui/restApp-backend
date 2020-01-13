const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const Usuario = require('../models/usuario');
const bcrypt = require('bcrypt');
const _ = require('underscore');

const { authUser, adminVerify } = require('../middlewares/authentication');

// ===== Middlewares ===== //

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// ======================= //



// ===== Requests ===== //

app.get('/usuario', authUser, (req, res) => {
    const skip = Number(req.query.skip) || 0;
    const limit = Number(req.query.limit) || 5;

    const conditions = {
        estado: true
    }

    Usuario.find(conditions, 'nombre email')
        .skip(skip)
        .limit(limit)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }

            Usuario.count(conditions, (err, count) => {
                res.json({
                    ok: true,
                    usuarios,
                    count
                })
            })
        })
})

app.post('/usuario', [authUser, adminVerify], (req, res) => {
    const body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        })
    })

})

app.put('/usuario/:id', [authUser, adminVerify], (req, res) => {
    const id = req.params.id;
    const body = _.pick(req.body, ['nombre', 'img', 'role', 'estado']);

    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            usuarioDB
        })
    })
})

app.delete('/usuario/:id', [authUser, adminVerify], (req, res) => {
    const id = req.params.id;
    const softDelete = Boolean(req.query.soft) || false;

    if (softDelete) {
        Usuario.findByIdAndUpdate(id, { estado: false }, { new: true }, (err, usuarioDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }

            res.json({
                ok: true,
                usuarioDB
            })
        })
    } else {
        Usuario.findByIdAndRemove(id, (err, usuarioRem) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }

            if (!usuarioRem) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'El usuario no existe.'
                    }
                })
            }

            res.json({
                ok: true,
                usuario: usuarioRem
            })
        })
    }
})

// ==================== //

module.exports = app;