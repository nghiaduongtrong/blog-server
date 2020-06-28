const ManagerRequestDto = require('../ManagerRequestDto');

class CreateCategoryConfigDto extends ManagerRequestDto {
    parentId = Number();
    title = String();
    description = String();
}

module.exports = CreateCategoryConfigDto;