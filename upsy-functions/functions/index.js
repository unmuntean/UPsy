const functions = require('firebase-functions');
const admin = require('firebase-admin');

const app = require('express')();

admin.initializeApp();

const config = {
    apiKey: "AIzaSyAvQdRq_SlrES22U0KoXfleLNxP16yC06g",
    authDomain: "upsy-928f6.firebaseapp.com",
    databaseURL: "https://upsy-928f6.firebaseio.com",
    projectId: "upsy-928f6",
    storageBucket: "upsy-928f6.appspot.com",
    messagingSenderId: "1042948035824",
    appId: "1:1042948035824:web:0432e7682faf7a1bd21e35",
    measurementId: "G-QD1KVCEDC9"
  };

const firebase = require('firebase');
firebase.initializeApp(config);

app.get('/tests', (req, res) =>{
    admin.firestore()
    .collection('tests')
    .get()
    .then(data => {
        let tests = [];
        data.forEach(doc=>{
            tests.push(doc.data());
        });
        return res.json(tests);
    })
    .catch(err => console.error(err));
})

app.post('/test', (req, res) => {
    const newTest = {
        body: req.body.body,
        submittedAt: admin.firestore.Timestamp.fromDate(new Date())
    };

    admin.firestore()
    .collection('tests')
    .add(newTest)
    .then(doc => {
        res.json({message: `Test ${doc.id} created succesfully`});
    })
    .catch(err => {
        res.status(500).json({ error: "something went wrong"});
        console.error(err);
    })
})

//SignUp route
app.post('/signup', (req, res) => {
    const newUser = {
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        handle: req.body.handle,
    };
    //TODO Data validation...


    firebase.auth().createUserWithEmailAndPassword(newUser.email, newUser.password)
    .then(data => {
        return res.status(201).json({ message: `User ${data.user.uid} signed up succesfully.`})
    })
    .catch(err => {
        console.error(err);
        return res.status(500).json({ error: err.code });
    })
})




// https://baseurl.com/api/blahblah
exports.api = functions.region('europe-west3').https.onRequest(app);