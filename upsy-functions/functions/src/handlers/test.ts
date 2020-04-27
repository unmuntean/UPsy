import {FBAuth} from "../utils/auth";
import {app, db} from "../utils/app";


export const register = () => {
    const anxietyTests = [2, 4, 7, 10, 15, 17, 20];
    const depressionTests = [3, 5, 9, 13, 16, 19, 21];
    const stressTests = [1, 6, 8, 11, 12, 14, 18];
// post one test
    app.post<any, any, Record<string, string>>('/test', FBAuth, async (req, res) => {
        const stressScore = stressTests.reduce((s, c) => s + Number.parseInt(req.body[String(c)]), 0);
        const anxietyScore = anxietyTests.reduce((s, c) => s + Number.parseInt(req.body[String(c)]), 0);
        const depressionScore = depressionTests.reduce((s, c) => s + Number.parseInt(req.body[String(c)]), 0);

        const newTest = {
            userId: req.user.uid,
            questions: req.body,
            scores: {
                anxiety: anxietyScore,
                stress: stressScore,
                depression: depressionScore
            }
        };

        if ((await db
            .collection('tests')
            .where("userId", '==', req.user.uid)
            .get()).size > 0) {
            res.status(500).json({error: `User ${req.user.uid} already did a test.`})
        }

        db
            .collection('tests')
            .add(newTest)
            .then(doc => {
                return doc.get().then(test => {
                    res.status(201).json(test.data());
                })
            })
            .catch(err => {
                res.status(500).json({error: "something went wrong"});
                console.error(err);
            })
    })

    app.get<{userId: string}>('/test/:userId', FBAuth, async (req, res) => {
        const userId = req.params.userId;

        const qs = await db
            .collection('tests')
            .where("userId", '==', userId)
            .get();

        if (qs.size == 1) {
            res.status(200).json(qs.docs[0].data());
        } else {
            res.status(500).json({error: `Could not find test result for user ${userId}`})
        }
    })
}