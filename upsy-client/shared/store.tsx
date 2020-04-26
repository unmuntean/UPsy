import React, {createContext, useContext, useReducer, useState} from "react";

declare global {
    interface StoreActions {
        _: string
    }

    interface StoreState {
    }
}

type StoreAction<T extends keyof StoreActions> = {
    type: T,
    payload: StoreActions[T]
}

export const StoreContext = createContext<{
    state: StoreState,
    dispatch<T extends keyof StoreActions>(action: StoreAction<T>): void,
    dispatchAsync<T extends keyof StoreActions>(type: T): (payload: StoreActions[T]) => void
}>({} as any);

export const useStore = () => useContext(StoreContext);

export type Reducer<T extends keyof StoreActions> = (state: StoreState, payload: StoreActions[T]) => StoreState;

const actions: {
    [key: string]: Reducer<any>
} = {}

export function registerAction<T extends keyof StoreActions>(type: T, reducer: Reducer<T>) {
    actions[type] = reducer;
    return reducer;
}

function reducer<T extends keyof StoreActions>(state: StoreState, action: StoreAction<T>): StoreState {
    if (action.type in actions) {
        return actions[action.type](state, action.payload);
    }
    throw new Error(`Invalid action ${action.type}`);
}

export const StoreProvider = ({children}) => {
    const [state, dispatch] = useReducer(reducer, {});
    function dispatchAsync<T extends keyof StoreActions>(type: T) {
        return (payload: StoreActions[T]) => dispatch({
            type, payload
        });
    };
    return <StoreContext.Provider value={{
        state, dispatch, dispatchAsync
    }}>{children}</StoreContext.Provider>
};