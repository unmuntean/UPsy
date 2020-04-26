const functions = require('firebase-functions');

const app = require('express')();

const FBAuth = require('./util/fbAuth');

// const cors = require('cors');

// app.use(cors())

const { getAllTests, postOneTest } = require('./handlers/tests');
const { signup, login } = require('./handlers/users');


// Tests routes
app.get('/tests', getAllTests);
//app.post('/test', FBAuth, postOneTest)
//Users routes
app.post('/signup', signup);
app.post('/login', login);


exports.api = functions.region('europe-west3').https.onRequest(app);