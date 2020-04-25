const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

const express = require('express');
const app = express();

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
        res.json({message: `document ${doc.id} created succesfully`});
    })
    .catch(err => {
        res.status(500).json({ error: "something went wrong"});
        console.error(err);
    })
})


// https://baseurl.com/api/blahblah
exports.api = functions.region('europe-west3').https.onRequest(app);