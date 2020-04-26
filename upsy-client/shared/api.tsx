import {ExtensibleFunction} from "./utils";
import merge from 'lodash.merge';

export type Filters = Mapping;

type ApiFactoryRequestInfo = {
    query?: Filters,
} & RequestInit

class ApiFactoryBase extends ExtensibleFunction {
    constructor(public path: string, public baseRequestInfo: RequestInit) {
        super((reqInfo: ApiFactoryRequestInfo = {}) => {
            reqInfo = merge({}, baseRequestInfo, reqInfo)
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

    GET<T>(reqInfo?: ApiFactoryRequestInfo): Promise<T> {
        reqInfo = merge({method: "GET"}, reqInfo);
        return this(reqInfo);
    }

    POST<T>(body: JsonValue | FormData, reqInfo?: ApiFactoryRequestInfo): Promise<T> {
        const contentType = body instanceof FormData ? "multipart/form-data" : "application/json";
        body = body instanceof FormData ? body : JSON.stringify(body);
        reqInfo = merge({
            headers: {
                "Content-Type": contentType
            }, method: "POST", body
        }, reqInfo);
        return this(reqInfo);
    }

    PUT<T>(body: JsonValue | FormData, reqInfo?: ApiFactoryRequestInfo): Promise<T> {
        const contentType = body instanceof FormData ? "multipart/form-data" : "application/json";
        body = body instanceof FormData ? body : JSON.stringify(body);
        reqInfo = merge({
            headers: {
                "Content-Type": contentType
            }, method: "PUT", body
        }, reqInfo);
        return this(reqInfo);
    }

    PATCH<T>(body: JsonValue | FormData, reqInfo?: ApiFactoryRequestInfo): Promise<T> {
        const contentType = body instanceof FormData ? "multipart/form-data" : "application/json";
        body = body instanceof FormData ? body : JSON.stringify(body);
        reqInfo = merge({
            headers: {
                "Content-Type": contentType
            }, method: "PATCH", body
        }, reqInfo);
        return this(reqInfo);
    }

    DELETE<T = null>(reqInfo?: ApiFactoryRequestInfo): Promise<T> {
        reqInfo = merge({method: "DELETE"}, reqInfo);
        return this(reqInfo);
    }
}

export type ApiFactory = ApiFactoryBase & MissingKeyApiFactory & {
    <T>(reqInfo?: ApiFactoryRequestInfo): Promise<T>;
    GET<T>(reqInfo?: ApiFactoryRequestInfo): Promise<T>;
    POST<T>(body: JsonValue | FormData, reqInfo?: ApiFactoryRequestInfo): Promise<T>;
    PUT<T>(body: JsonValue | FormData, reqInfo?: ApiFactoryRequestInfo): Promise<T>;
    PATCH<T>(body: JsonValue | FormData, reqInfo?: ApiFactoryRequestInfo): Promise<T>;
    DELETE<T = null>(reqInfo?: ApiFactoryRequestInfo): Promise<T>;
};

interface MissingKeyApiFactory extends Mapping<ApiFactory> {
}

export function apiFactory(path: string, baseRequestInfo: RequestInit = {}): ApiFactory {
    return new Proxy(new ApiFactoryBase(path, baseRequestInfo), {
        get(target: ApiFactoryBase, p: string | number, receiver: any): any {
            if (p in target && ["GET", "POST", "PUT", "PATCH", "DELETE"].includes(p as any)) return target[p];
            return apiFactory(path + p + '/', baseRequestInfo);
        }
    }) as ApiFactory;
}

export const firebaseApi = apiFactory("http://localhost:5001/upsy-928f6/europe-west3/api/", {
    mode: "cors"
});
