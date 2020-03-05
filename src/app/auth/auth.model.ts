export interface AuthData {
    email: string;
    password: string;
}

export interface AuthMessage {
    token?: string;
    expiresIn?: number;
    expirationDate?: Date;
}
