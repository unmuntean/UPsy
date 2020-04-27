import {prePromise} from "./utils";
import {firebaseApi} from "./api";
export interface Result {
    questions: Record<string, string>;
    userId: string;
    scores: {
        anxiety: number;
        stress: number;
        depression: number
    }
}


export const postTest = prePromise((data: Record<string, string>) => {
    return firebaseApi.test.POST<Result>(data);
})

export const getTestResult = prePromise((userId: string) => {
    return firebaseApi.test[userId].GET<Result>();
})