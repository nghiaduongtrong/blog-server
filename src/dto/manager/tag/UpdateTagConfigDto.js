const ManagerRequestDto = require('../ManagerRequestDto');

class UpdateTagConfigDto extends ManagerRequestDto {
    id = Number();
    title = String();
    description = String();
}

module.exports = UpdateTagConfigDto;