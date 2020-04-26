const { admin } = require('./admin');

module.exports = (req, res, next) => {
    let idToken;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer ')){
        idToken = req.headers.authorization.split('Bearer ')[1];
    } else {
        console.error('Token not found')
        return res.status.json({error: "unauthorized!"})
    }

    admin.auth().verifyIdToken(idToken)
    .then(decodedToken => {
        req.user =decodedToken;
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
