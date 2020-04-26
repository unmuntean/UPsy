const { db } = require('../util/admin');

const config = require('../util/config');

// const config =  {
//     apiKey: "AIzaSyAvQdRq_SlrES22U0KoXfleLNxP16yC06g",
//     authDomain: "upsy-928f6.firebaseapp.com",
//     databaseURL: "https://upsy-928f6.firebaseio.com",
//     projectId: "upsy-928f6",
//     storageBucket: "upsy-928f6.appspot.com",
//     messagingSenderId: "1042948035824",
//     appId: "1:1042948035824:web:0432e7682faf7a1bd21e35",
//     measurementId: "G-QD1KVCEDC9"
//   };


const firebase = require('firebase');
firebase.initializeApp(config)

const {validateSignupData, validateLoginData, Cors} = require('../util/validators');


exports.signup =  (req, res) => {

    if (Cors(req, res, 'POST')){
        return;
    }


    const newUser = {
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        handle: req.body.handle
    };

    const { valid, errors } = validateSignupData(newUser);

    if(!valid) return res.status(400).json(error);

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
}



exports.login = (req, res) => {

    if (Cors(req, res, 'POST')){
        return;
    }

    const user = {
      email: req.body.email,
      password: req.body.password
    };
  
    const { valid, errors } = validateLoginData(user);
  
    if (!valid) return res.status(400).json(errors);
  
    firebase
      .auth()
      .signInWithEmailAndPassword(user.email, user.password)
      .then((data) => {
        return data.user.getIdToken();
      })
      .then((token) => {
        return res.json({ token });
      })
      .catch((err) => {
        console.error(err);
        // auth/wrong-password
        // auth/user-not-user
        return res
          .status(403)
          .json({ general: "Wrong credentials, please try again" });
      });
  };




