import { register as registerAuth } from "./auth";
import { register as registerTest } from "./test";

export const register = () => {
    registerAuth();
    registerTest();
}