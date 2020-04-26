export class ExtensibleFunction extends Function {
    // @ts-ignore
    constructor(f) {
        return Object.setPrototypeOf(f, new.target.prototype);
    }
}