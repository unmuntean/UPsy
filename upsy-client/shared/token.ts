export class TokenStorage {
    private static readonly LOCAL_STORAGE_TOKEN = 'token';

    public static storeToken(token: string): void {
        localStorage.setItem(TokenStorage.LOCAL_STORAGE_TOKEN, token);
    }

    public static clear(): void {
        localStorage.removeItem(TokenStorage.LOCAL_STORAGE_TOKEN);
    }

    public static getToken(): string | null {
        return localStorage.getItem(TokenStorage.LOCAL_STORAGE_TOKEN);
    }
}

export class TokenError extends Error {
    constructor(message: string) {
        super(message);
        this.name = this.constructor.name;
    }
}

export class RefreshTokenNotAvailableError extends TokenError {}
