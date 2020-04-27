import {Card, CardContent, Paper} from "@material-ui/core";
import React, {useEffect, useState} from "react";
import {firebaseApi} from "../shared/api";
import Test from "../components/Test";
import {makeStyles} from "@material-ui/core/styles";
import {useStore} from "../shared/store";
import {getTestResult, Result} from "../shared/test";

const useStyles = makeStyles({
    card: {
        maxWidth: "1000px",
        width: "100%"
    },
});

export default ({ userId }: {userId: string}) => {
    const classes = useStyles();
    const [result, setResult] = useState<Result | null>(null);
    useEffect(() => {
        (async () => {
            setResult(await getTestResult(userId))
        })()
    }, [])

    return <Card className={classes.card}>
        <CardContent>
            <Test result={result}/>
        </CardContent>
    </Card>
}
