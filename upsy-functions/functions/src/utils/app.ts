import express from "express";
import admin from "firebase-admin";

import cors from "cors";

export const app = express();
admin.initializeApp();
app.use(cors({
    origin: "*"
}));

import serviceAccount from "../../config.json";

export const firebaseApp = require('firebase').initializeApp( {
    "apiKey": "AIzaSyAvQdRq_SlrES22U0KoXfleLNxP16yC06g",
    "authDomain": "upsy-928f6.firebaseapp.com",
    "databaseURL": "https://upsy-928f6.firebaseio.com",
    "projectId": "upsy-928f6",
    "storageBucket": "upsy-928f6.appspot.com",
    "messagingSenderId": "1042948035824",
    "appId": "1:1042948035824:web:0432e7682faf7a1bd21e35",
    "measurementId": "G-QD1KVCEDC9",
    "credential": admin.credential.cert(serviceAccount as any)
});

export const db = admin.firestore();