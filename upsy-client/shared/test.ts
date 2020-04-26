import {prePromise} from "./utils";
import {firebaseApi} from "./api";
import {Result} from "../components/Test";

export const postTest = prePromise((data: Record<number, number>) => {
    return firebaseApi.test.POST<Result>(data);
})