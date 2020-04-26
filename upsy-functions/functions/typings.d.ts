type Mapping<T = any> = {
    [key in string | number]: T;
};