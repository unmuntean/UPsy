import {FBAuth} from "../utils/auth";
import {app, db} from "../utils/app";
export const register = () => {
    app.get('/tests', (req, res) => {
        db
            .collection('tests')
            .get()
            .then(data => {
                let tests = [];
                data.forEach(doc => {
                    tests.push({
                        ...doc.data()
                    });
                });
                return res.json(tests);
            })
            .catch(err => console.error(err));
    })


// post one test
    app.post('/test', FBAuth, (req, res) => {

        const newTest = {
            body: req.body.body,
            userHandle: req.user.handle,
            createdAT: new Date().toISOString()
        };

        db
            .collection('tests')
            .add(newTest)
            .then(doc => {
                res.json({message: `Test ${doc.id} created succesfully`});
            })
            .catch(err => {
                res.status(500).json({error: "something went wrong"});
                console.error(err);
            })
    })
}