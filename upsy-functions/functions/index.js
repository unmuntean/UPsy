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

const db = admin.firestore();


app.get('/tests', (req, res) =>{
    db
    .collection('tests')
    .orderBy('createdAT', 'desc')
    .get()
    .then(data => {
        let tests = [];
        data.forEach(doc=>{
            tests.push({
                testId: doc.id,
                name: doc.data().name,
                createdAT: doc.data().createdAT
            });
        });
        return res.json(tests);
    })
    .catch(err => console.error(err));
})

app.post('/test', (req, res) => {
    const newTest = {
        body: req.body.body,
        userHandle: req.body.userHandle,
        createdAT: new Date().toISOString()
    };

    db
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

const isEmail = (email) => {
    const emailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; 
    if(email.match(emailRegEx)) return true;
    else return false;
}

const isEmpty = (string) => {
    if(string.trim() === '') return true;
    else return false;
}


//SignUp route
app.post('/signup', (req, res) => {
    const newUser = {
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        handle: req.body.handle
    };

    let errors = {};

    if(isEmpty(newUser.email)) {
        errors.email = 'Must not be empty';
    } else if(!isEmail(newUser.email)){
        errors.email = 'Must be valid email address.';
    }

    if(isEmpty(newUser.password)) errors.password = 'Must not be empty';
    if(newUser.password !== newUser.confirmPassword) errors.confirmPassword = 'Passwords must match';
    if(isEmpty(newUser.handle)) errors.habdle = 'Must not be empty';

    if(Object.keys(errors).length > 0) return res.status(400).json(errors);

    let token, userId;

    db.doc(`/users/${newUser.handle}`).get()
    .then(doc => {
        if(doc.exists){
            return res.status(400).json({ handle: 'this handle is already taken'});
        } else {
           return firebase
           .auth()
           .createUserWithEmailAndPassword(newUser.email, newUser.password)
        }
    })
    .then(data => {
        userId = data.user.uid;
        return data.user.getIdToken();
    })
    .then(idToken => {
        token = idToken;
        const userCredentials = {
            handle: newUser.handle,
            email: newUser.email,
            createdAT: new Date().toISOString(),
            userId : userId
        };
        return db.doc(`/users/${newUser.handle}`).set(userCredentials);
    })
    .then(() =>{
        return res.status(201).json({ token });
    })
    .catch(err => {
        console.error(err);
        if(err.code === 'auth/email-already-in-use'){
            return res.status(400).json({ email: 'email already in use'})
        } else { 
            res.status(500).json({ error: err.code})
        }
    })
});


app.post('/login', (req, res) => {
    const user = {
        email: req.body.email,
        password: req.body.password,

    };
    
    let errors = {};
    if(isEmpty(user.email))  errors.email = 'Must not be empty';
    if(isEmpty(user.password))  errors.password = 'Must not be empty';

    if(Object.keys(errors).length > 0) return res.status(400).json(errors);

    firebase.auth().signInWithEmailAndPassword(user.email, user.password)
    .then(data => {
        return data.user.getIdToken();
    })
    .then(token => {
        return res.json({ token });
    })
    .catch(err => {
        console.error(err);
        if(err.code === 'auth/wrong-password'){
            return res.status(403).json({ general: 'wrong credentials, try again'})
        } else {
        return res.status(500).json({error: err.code})
        }
    })
})


// https://baseurl.com/api/blahblah
exports.api = functions.region('europe-west3').https.onRequest(app);