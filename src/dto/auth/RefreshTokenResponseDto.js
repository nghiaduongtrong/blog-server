class RefreshTokenResponseDto {
    accessToken = String();
    isSucceed = Boolean();
    messageType = String();
    message = String();

    constructor() {
        this.accessToken = null;
        this.isSucceed = false;
        this.messageType = null;
        this.message = null;
    }
}

module.exports = RefreshTokenResponseDto;