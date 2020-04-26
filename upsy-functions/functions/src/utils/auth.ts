import admin from "firebase-admin";
import {db} from "./app";

interface User {
    handle: string,
    email: string,
    createdAT: string,
    userId: string
}
declare global {
    namespace Express {
        interface Request {
            user?: User
        }
    }
}

export const FBAuth = (req, res, next) => {
    let idToken;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        idToken = req.headers.authorization.split('Bearer ')[1];
    } else {
        console.error('Token not found')
        return res.status.json({error: "unauthorized!"})
    }

    admin.auth().verifyIdToken(idToken)
        .then(decodedToken => {
            req.user = decodedToken;
            return db.collection('users')
                .where('userId', '==', req.user.uid)
                .limit(1)
                .get()
        })
        .then(data => {
            req.user.handle = data.docs[0].data().handle;
            return next();
        })
        .catch(err => {
            console.error('Error while verification', err);
            return res.status(403).json(err);
        })
}

export const isEmail = (email) => {
    const emailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return !!email.match(emailRegEx);
}

export const isEmpty = (string) => {
    return string == null || string.trim() === '';
}