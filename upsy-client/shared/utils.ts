export class ExtensibleFunction extends Function {
    // @ts-ignore
    constructor(f) {
        return Object.setPrototypeOf(f, new.target.prototype);
    }
}


export interface PrePromise<I, O> {
    then<O1>(func: (input: O) => O1): PrePromise<I, O1>
    catch<I1, O1>(func: (input: I1) => O1): PrePromise<I, O1>
    (input: I): Promise<O>
}

export class _PrePromise<I, O> extends ExtensibleFunction {
    chains: ["then" | "catch", (arg) => any][];
    constructor(func: (input: I) => Promise<O>) {
        super((input: I) => {
            let promise = func(input);
            this.chains.forEach(([method, f]) => {
                promise = method == "then" ? promise.then(f) : promise.catch(f);
            })
            return promise;
        });
        this.chains = [];
    }

    then<O1>(func: (input: O) => O1): PrePromise<I, O1> {
        this.chains.push(["then", func]);
        return this as any as PrePromise<I, O1>;
    }

    catch<I1, O1>(func: (input: I1) => O1): PrePromise<I, O1> {
        this.chains.push(["catch", func]);
        return this as any as PrePromise<I, O1>;
    }
}

export const prePromise = <I, O>(f: (input: I) => Promise<O>): PrePromise<I, O> => new _PrePromise(f) as any;