const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

const roles = {
    values: ['USER_ROLE','ADMIN_ROLE'],
    message: '{VALUE} no es un rol válido'
}

const usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio.']
    },
    email: {
        type: String,
        required: [true, 'El email es obligatorio.'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria.']
    },
    img: {
        type: String,
        require: false
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: roles
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }
})

usuarioSchema.plugin(uniqueValidator,{ message: '{PATH} ya existe' })

usuarioSchema.methods.toJSON = function(){
    let usuarioObj = this.toObject();
    delete usuarioObj.password;
    return usuarioObj;
}

module.exports = mongoose.model('Usuario', usuarioSchema);