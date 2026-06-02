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

    private username: string;
    private email: string;
    private firstName: string;
    private lastName: string;
    private password: string;

}

export default RegisterRequest;