require('../config/config');

const express = require('express');
const app = express();
const Usuario = require('../models/usuario');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


app.post('/login', (req, res) => {
    const body = req.body;

    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario incorrecto.'
                }
            })
        }

        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Contraseña incorrecta.'
                }
            })
        }

        const token = jwt.sign({
            usuarioDB
        }, process.env.token_seed, { expiresIn: Number(process.env.token_expiresIn) });

        res.json({
            ok: true,
            usuarioDB,
            token
        })
    })
})

module.exports = app;