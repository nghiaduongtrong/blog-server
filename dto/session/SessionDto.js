class SessionDto {
    fullName = String();
    loginDate = Number();

    constructor() {
        this.fullName = null,
        this.loginDate = null
    }
}

module.exports = SessionDto;