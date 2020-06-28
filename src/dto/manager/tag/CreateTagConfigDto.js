const ManagerRequestDto = require('../ManagerRequestDto');

class CreateTagConfigDto extends ManagerRequestDto {
    title = String();
    description = String();
}

module.exports = CreateTagConfigDto;