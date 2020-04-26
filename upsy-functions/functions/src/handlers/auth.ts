
//SignUp route
import {app, db, firebaseApp} from "../utils/app";
import {isEmail, isEmpty} from "../utils/auth";

export const register = () => {
    app.post('/signup', (req, res) => {

        // if (Cors(req, res, 'POST')){
        //     return;
        // }
        console.log(req.body);
        const newUser = {
            email: req.body.email,
            password: req.body.password,
            confirmPassword: req.body.confirmPassword,
            handle: req.body.handle
        };

        let errors: any = {};

        if (isEmpty(newUser.email)) {
            errors.email = 'Must not be empty';
        } else if (!isEmail(newUser.email)) {
            errors.email = 'Must be valid email address.';
        }

        if (isEmpty(newUser.password)) errors.password = 'Must not be empty';
        if (newUser.password !== newUser.confirmPassword) errors.confirmPassword = 'Passwords must match';
        if (isEmpty(newUser.handle)) errors.habdle = 'Must not be empty';

        if (Object.keys(errors).length > 0) return res.status(400).json(errors);

        let token, userId;

        db.doc(`/users/${newUser.handle}`).get()
            .then(doc => {
                if (doc.exists) {
                    return res.status(400).json({handle: 'this handle is already taken'});
                } else {
                    return firebaseApp
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
                    userId: userId
                };
                return db.doc(`/users/${newUser.handle}`).set(userCredentials);
            })
            .then(() => {
                return res.status(201).json({token});
            })
            .catch(err => {
                console.error(err);
                if (err.code === 'auth/email-already-in-use') {
                    return res.status(400).json({email: 'email already in use'})
                } else {
                    res.status(500).json({error: err.code})
                }
            })
    });

// Login route
    app.post('/login', (req, res) => {

        // if (Cors(req, res, 'POST')){
        //     return;
        // }
        console.log(req.body.email);

        const user = {
            email: req.body.email,
            password: req.body.password
        };

        let errors: any = {};
        if (isEmpty(user.email)) errors.email = 'Must not be empty';
        if (isEmpty(user.password)) errors.password = 'Must not be empty';

        if (Object.keys(errors).length > 0) return res.status(400).json(errors);

        firebaseApp.auth().signInWithEmailAndPassword(user.email, user.password)
            .then(data => {
                return data.user.getIdToken();
            })
            .then(token => {
                return res.json(token);
            })
            .catch(err => {
                console.error(err);
                if (err.code === 'auth/wrong-password') {
                    return res.status(403).json({general: 'wrong credentials, try again'})
                } else {
                    return res.status(500).json({error: err.code})
                }
            })
    })
};