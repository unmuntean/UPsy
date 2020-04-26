import React, {useEffect} from "react";
import {AppBar, IconButton, Toolbar, Typography} from "@material-ui/core";
import {PhotoCamera,ExitToAppTwoTone} from "@material-ui/icons";
import {makeStyles} from "@material-ui/core/styles";
import {login} from "../shared/user";
import {useStore} from "../shared/store";

const useStyles = makeStyles({
    sectionDesktop: {
        display: 'flex',
    },
    logo: {
        marginLeft: "5px"
    },
    grow: {
        flexGrow: 1,
    },
});

export default () => {
    const classes = useStyles();
    const { state, dispatchAsync, dispatch } = useStore();

    useEffect(() => {
        dispatch({
            type: "setUser",
            payload: { email: "" }
        })
    }, [])


    return <AppBar position="relative">
        <Toolbar>
            <PhotoCamera />
            <Typography variant="h6" color="inherit" noWrap className={classes.logo}>
                UPsy
            </Typography>
            <div className={classes.grow}/>
            <div className={classes.sectionDesktop}>
                <IconButton edge="end" color="inherit" onClick={() => login("garovat.adrian@gmail.com", "12345678").then(dispatchAsync("setUser"))}>
                    <ExitToAppTwoTone/>
                </IconButton>
            </div>
        </Toolbar>
    </AppBar>;
}