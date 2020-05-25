const SessionDto = require('../session/SessionDto');

class LoginDto {
    accessToken = String();
    isSucceed = Boolean();
    messageType = String();
    message = String();
    sessionDto = new SessionDto();

    constructor() {
        this.accessToken = null,
        this.isSucceed = false,
        this.messageType = null,
        this.message = null
    }
}

module.exports = LoginDto;