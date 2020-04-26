import {registerAction} from "./store";

export interface User {
    email: string
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
    return {
        ...state,
        user
    }
});

export const login = (email: string, password: string) => {
    return Promise.resolve({email});
}

export const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export default {};