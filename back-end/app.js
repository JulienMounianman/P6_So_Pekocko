const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRouter');
const sauceRoutes = require('./routes/sauceRouter');
const bodyParser = require('body-parser');
const path = require('path');

const router = express.Router();

const username = "Admin";
const password = "Bb48nCa4yFUFYfZ";
const dbname = "Database";
const uri = "mongodb+srv://" + username + ":" + password + "@database.dhkdz.mongodb.net/" + dbname + "?retryWrites=true&w=majority";


mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express();

router.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/images', express.static(path.join(__dirname, '/images')));


app.use('/api/auth', userRoutes);
app.use('/api/sauces', sauceRoutes);


module.exports = app;
