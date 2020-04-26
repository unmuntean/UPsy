import {registerAction, useStore} from "./store";
import {firebaseApi} from "./api";

import jwt_decode from 'jwt-decode';
import {prePromise} from "./PrePromise";

export interface User {
    email: string,
    user_id: string
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
    console.log(user);
    return {
        ...state,
        user
    }
});

export const login = prePromise((data: {email: string, password: string}) => {
    return firebaseApi.login.POST<User>(data).then(jwt_decode);
});

export const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export default {};