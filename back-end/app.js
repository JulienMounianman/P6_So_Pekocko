const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRouter');
const sauceRoutes = require('./routes/sauceRouter');
const bodyParser = require('body-parser');
const path = require('path');
const rateLimit = require("express-rate-limit");
require('dotenv').config()
const router = express.Router();

const uri = "mongodb+srv://" + process.env.DB_USERNAME + ":" + process.env.DB_PASSWORD + "@database.dhkdz.mongodb.net/" + process.env.DB_NAME + "?retryWrites=true&w=majority";
const helmet = require("helmet");

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
app.use(helmet());
app.use('/images', express.static(path.join(__dirname, '/images')));


app.use('/api/auth', userRoutes);
app.use('/api/sauces', sauceRoutes);

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 
  });
app.use(limiter);

module.exports = app;
