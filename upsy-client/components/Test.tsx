import {Controller, FormContext, useForm} from "react-hook-form";
import React from "react";
import {login} from "../shared/user";
import {FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Typography} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import {postTest} from "../shared/test";
import {useHistory} from 'react-router-dom';

export interface Result {
    questions: Record<number, number>;
    userId: string;
    scores: {
        anxiety: number;
        stress: number;
        depression: number
    }
}


const questions = {
    1: "I found it hard to wind down.",
    2: "I was aware of dryness of my mouth.",
    3: "I couldn’t seem to experience any positive feeling at all.",
    4: "I experienced breathing difficulty (eg, excessively rapid breathing, breathlessness in the absence of physical exertion).",
    5: "I found it difficult to work up the initiative to do things.",
    6: "I tended to over-react to situations.",
    7: "I experienced trembling (eg, in the hands).",
    8: "I felt that I was using a lot of nervous energy.",
    9: "I was worried about situations in which I might panic and make a fool of myself.",
    10: "I felt that I had nothing to look forward to.",
    11: "I found myself getting agitated.",
    12: "I found it difficult to relax.",
    13: "I felt down-hearted and blue.",
    14: "I was intolerant of anything that kept me from getting on with what I was doing.",
    15: "I felt I was close to panic.",
    16: "I was unable to become enthusiastic about anything.",
    17: "I felt I wasn’t worth much as a person.",
    18: "I felt that I was rather touchy.",
    19: "I was aware of the action of my heart in the absence of physical exertion (eg, sense of heart rate increase, heart missing a beat).",
    20: "I felt scared without any good reason.",
    21: "I felt that life was meaningless."
};

const useStyles = makeStyles({
    field: {
        marginTop: "10px",
    },
    form: {
        display: "flex",
        flexDirection: "column"
    },
    button: {
        alignSelf: "flex-end",
        marginTop: "10px",
    },
    radioGroup: {
        display: "flex",
        flexDirection: "row",
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        marginTop: "20px",
        marginBottom: "40px"
    },
    radioLabel: {
        width: "100%",
        textAlign: "center"
    }
});

export default ({result}: {result?: Result}) => {
    const methods = useForm<{
        email: string, password: string
    }>()
    const history = useHistory();
    const classes = useStyles();

    return <FormContext {...methods}>
        <form onSubmit={methods.handleSubmit(postTest.then(() => history.push({pathname: '/result'})))} className={classes.form}>
            {Object.entries(questions).map(([index, text]) => {
                return <FormControl component="fieldset" error={methods.errors[index]} className={classes.field}>
                    <FormLabel component="legend"  className={classes.radioLabel}>
                        <Typography variant="h6" color="primary"><b>{index}.</b> {text}</Typography>
                    </FormLabel>
                    <Controller name={index} as={
                        <RadioGroup aria-label="quiz" name="quiz" className={classes.radioGroup} defaultValue={result?.questions[index]}>
                            <FormControlLabel value="0" disabled={!!result} control={<Radio />} label="Never" />
                            <FormControlLabel value="1" disabled={!!result} control={<Radio />} label="Sometimes" />
                            <FormControlLabel value="2" disabled={!!result} control={<Radio />} label="Often" />
                            <FormControlLabel value="3" disabled={!!result} control={<Radio />} label="Almost Always" />
                        </RadioGroup>
                    }/>
                </FormControl>;
            })}
        </form>
    </FormContext>
}