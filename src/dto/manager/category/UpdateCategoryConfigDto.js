const ManagerRequestDto = require('../ManagerRequestDto');

class UpdateCategoryConfigDto extends ManagerRequestDto {
    id = Number();
    parentId = Number();
    title = String();
    description = String();
}

module.exports = UpdateCategoryConfigDto;