import {Container, CssBaseline} from "@material-ui/core";
import React from "react";
import Header from "./components/Header";
import {StoreProvider} from "./shared/store";
import {makeStyles} from "@material-ui/core/styles";
import Routes from "./Routes";
import {Router} from "react-router-dom";
import { createBrowserHistory } from 'history';

const useStyles = makeStyles((theme) => ({
    cardGrid: {
        paddingTop: theme.spacing(2),
        paddingBottom: theme.spacing(2),
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    }
}));

export default () => {
    const classes = useStyles();
    return <Router history={createBrowserHistory()}>
        <StoreProvider>
            <CssBaseline/>
            <Header/>
            <main>
                <Container className={classes.cardGrid}>
                    <Routes/>
                </Container>
            </main>
        </StoreProvider>
    </Router>;
}