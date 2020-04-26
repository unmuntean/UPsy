import {Card, CardContent, Paper} from "@material-ui/core";
import React, {useEffect} from "react";
import {firebaseApi} from "../shared/api";
import Test from "../components/Test";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles({
    card: {
        maxWidth: "1000px",
        width: "100%"
    },
});

export default () => {
    const classes = useStyles();

    return <Card className={classes.card}>
        <CardContent>
            <Test/>
        </CardContent>
    </Card>
}
