import {registerAction, useStore} from "./store";
import {firebaseApi} from "./api";

import jwt_decode from 'jwt-decode';
import {prePromise} from "./utils";
import {TokenStorage} from "./token";
import {useEffect} from "react";

export interface User {
    email: string,
    user_id: string,
    token: string
}

declare global {
    interface StoreActions {
        setUser: User
    }

    interface StoreState {
        user?: User
    }
}

registerAction("setUser", (state, user) => {
    TokenStorage.storeToken(user.token);

    return {
        ...state,
        user
    }
});

export const retrieveUserFromToken = () => {
    const {state, dispatch} = useStore();

    useEffect(() => {
        const token = TokenStorage.getToken();
        if (token) {
            dispatch({
                type: "setUser",
                payload: tokenToUser(token)
            })
        }
    }, [])
}

export const tokenToUser = (token: string) => Object.assign(jwt_decode(token) as User, {token})

export const login = prePromise((data: {email: string, password: string}) => {
    return firebaseApi.login.POST<string>(data).then(tokenToUser);
});

export const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export default {};