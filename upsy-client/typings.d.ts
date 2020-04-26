type Mapping<T = any> = {
    [key in string | number]: T;
};
type FunctionType<Args extends Array<any> = [], T = void> = (...args: Args | []) => T;