class RegisterRequest {
    constructor(
        username: string,
        email: string,
        firstName: string,
        lastName: string,
        password: string
    ) {
        this.username = username;
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.password = password;
    }

    public username: string;
    public email: string;
    public firstName: string;
    public lastName: string;
    public password: string;

}

export default RegisterRequest;