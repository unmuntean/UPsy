type Mapping<T = any> = {
    [key in string | number]: T;
};
type FunctionType<Args extends Array<any> = [], T = void> = (...args: Args | []) => T;

type JsonValue = string|number|boolean|Date|JsonObject|JsonArray;

interface JsonObject {
    [x: string]: JsonValue;
}
interface JsonArray extends Array<JsonValue> { }