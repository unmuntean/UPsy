import React, {useEffect} from "react";
import {AppBar, IconButton, Tab, Tabs, Toolbar, Typography} from "@material-ui/core";
import {PhotoCamera,ExitToAppTwoTone} from "@material-ui/icons";
import {makeStyles} from "@material-ui/core/styles";
import {useHistory} from 'react-router-dom';
import {retrieveUserFromToken} from "../shared/user";
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

    const history = useHistory();
    retrieveUserFromToken();

    return <AppBar position="relative">
        <Toolbar>
            <PhotoCamera />
            <Typography variant="h6" color="inherit" noWrap className={classes.logo}>
                UPsy
            </Typography>
            <div className={classes.grow}/>
            <div className={classes.sectionDesktop}>
                <IconButton edge="end" color="inherit" onClick={() => history.push({pathname: "/login"})}>
                    <ExitToAppTwoTone/>
                </IconButton>
            </div>
        </Toolbar>
    </AppBar>;
}