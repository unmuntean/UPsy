import React from "react";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";
import Login from "./pages/Login";

export default () => <Switch>
    <Route>
        <Route path="/login">
            <Login/>
        </Route>
    </Route>
</Switch>