export interface IUser {
    _id: string;
    name: string;
    email: string;
    role: {
        _id: string;
        name: string;
    };
    avatarUrl?: string;
    permissions?: {
        _id: string;
        name: string;
        apiPath: string;
        module: string;
    }[]
}
