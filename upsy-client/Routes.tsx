import React from "react";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import TestPage from "./pages/TestPage";
import ResultPage from "./pages/ResultPage";
import {useStore} from "./shared/store";

export default () => <Switch>
    <Route path="/login" component={LoginPage}/>
    <Route path="/test" component={TestPage}/>
    <Route path="/result" component={() => {
        const {state} = useStore();
        return <ResultPage userId={state.user.user_id}/>
    }}/>
    <Route path="/result/:userId" component={({ match }) => {
        return <ResultPage userId={match.params.userId}/>
    }}/>
    <Route path="/" component={LoginPage}/>
</Switch>