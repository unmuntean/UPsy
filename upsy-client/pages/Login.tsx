import React, {useState} from "react";
import {Button, Card, CardContent, TextField, Typography} from "@material-ui/core";
import {FormContext, useForm} from 'react-hook-form'
import {makeStyles} from "@material-ui/core/styles";
import {RHFInput} from 'react-hook-form-input';
import {emailRegex, User} from "../shared/user";
import {firebaseApi} from "../shared/api";
import {useStore} from "../shared/store";

const useStyles = makeStyles({
    field: {
        marginTop: "10px",
    },
    card: {
        maxWidth: "400px",
        width: "100%"
    },
    form: {
        display: "flex",
        flexDirection: "column"
    },
    button: {
        alignSelf: "flex-end",
        marginTop: "10px",
    }
});


export default ({}) => {
    const {dispatchAsync} = useStore();
    const methods = useForm<{
        email: string, password: string
    }>()

    const classes = useStyles();

    const onSubmit = (data) => {
        firebaseApi.login<User>({method: 'POST'}).then(dispatchAsync("setUser"));
        console.log(data);
    }


    return <Card className={classes.card}>
        <CardContent>
            <Typography variant="h2" color="inherit" noWrap>Login</Typography>
            <FormContext {...methods}>
                <form onSubmit={methods.handleSubmit(onSubmit)} className={classes.form}>
                    <RHFInput
                        name="email"
                        defaultValue=""
                        rules={{
                            required: true,
                            pattern: {
                                value: emailRegex,
                                message: "The field's value is not a valid email."
                            }
                        }}
                        as={<TextField label="Email" variant="filled" fullWidth className={classes.field}
                                       helperText={methods.errors?.email?.type == 'required' ? "This field is required" : methods.errors?.email?.message}
                                       error={methods.errors.email != null}/>}/>
                    <RHFInput
                        name="password"
                        defaultValue=""
                        as={<TextField label="Password" variant="filled" fullWidth className={classes.field}
                                       type="password"/>}/>
                    <Button type="submit" variant="contained" className={classes.button}>Login</Button>
                </form>
            </FormContext>
        </CardContent>
    </Card>
}