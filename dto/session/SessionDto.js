class SessionDto {
    id = Number();
    fullName = String();
    loginDate = Number();

    constructor() {
        this.id = null;
        this.fullName = null;
        this.loginDate = null
    }
}

module.exports = SessionDto;