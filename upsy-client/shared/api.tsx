import {ExtensibleFunction} from "./utils";

export type Filters = Mapping<any>;

type ApiFactoryRequestInfo = {
    query?: Filters,
} & RequestInit

class ApiFactoryBase extends ExtensibleFunction {
    constructor(public path: string) {
        super((reqInfo: ApiFactoryRequestInfo = {}) => {
            const searchParams = new URLSearchParams();
            Object.keys(reqInfo.query || {}).forEach(key => searchParams.append(key, reqInfo.query[key]));
            const url = path + (searchParams.toString() != "" ? '?' + searchParams.toString() : "");

            return fetch(url, reqInfo).then(resp => {
                if (resp.ok) {
                    return resp.json();
                } else {
                    throw resp;
                }
            });
        });
    }
}

export type ApiFactory = ApiFactoryBase & MissingKeyApiFactory & {
    <T>(reqInfo?: ApiFactoryRequestInfo): Promise<T>;
};

interface MissingKeyApiFactory extends Mapping<ApiFactory> {}

export function apiFactory(path: string): ApiFactory {
    return new Proxy(new ApiFactoryBase(path), {
        get(target: ApiFactoryBase, p: string | number, receiver: any): any {
            if (p in target) return target[p];
            return apiFactory(path + p + '/');
        }
    }) as ApiFactory;
}

export const firebaseApi = apiFactory("https://europe-west3-upsy-928f6.cloudfunctions.net/api/");
