export class UserModel {
    token: string;
    user: {
        name: string,
        email: string
    };
    isAdmin: boolean;
    constructor(token, user, isAdmin) {
        this.token = token;
        this.user = user;
        this.isAdmin = isAdmin;
    }
}
