require('./config/config');

const express = require('express');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');


// ===== Middlewares ===== //

// cors
app.use(cors());

app.use(require('./routes/routes'))

// ======================= //



// ===== Connect and deploy ===== //

mongoose.connect(process.env.urlDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, (err, res) => {
    if (err) throw err;

    console.log('Base de datos online.');
})

app.listen(process.env.port, () => {
    console.log(`Listen port ${process.env.port}...`);
});

// ======================= //