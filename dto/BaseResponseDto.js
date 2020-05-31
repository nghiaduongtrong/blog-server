class BaseResponseDto {
    isSucceed = Boolean();
    messageType = String();
    message = String();

    constructor() {
        this.isSucceed = false;
        this.messageType = null;
        this.message = null;
    }
}

module.exports = BaseResponseDto;