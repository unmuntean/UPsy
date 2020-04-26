import React from "react";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";
import Login from "./pages/Login";
import Test from "./pages/Test";

export default () => <Switch>
    <Route path="/login">
        <Login/>
    </Route>
    <Route path="/test">
        <Test/>
    </Route>
    <Route path="/">
        <Login/>
    </Route>
</Switch>