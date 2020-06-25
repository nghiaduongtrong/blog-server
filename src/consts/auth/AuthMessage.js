class AuthMessage {
    // use in login
    static USER_NOT_EXIST = 'This account does not exist';
    static WRONG_PASSWORD = 'Enter the wrong password';
    static NOT_AUTHORIZED = 'Not authorized';
    static ERROR = 'Something wrong';

    // use in refresh token
    static REFRESH_TOKEN_NOT_FOUND = 'Not found refresh token';

    //use in authenticate middleware
    static AUTH_FAILD = 'Not yet authenticated';
}

module.exports = AuthMessage;