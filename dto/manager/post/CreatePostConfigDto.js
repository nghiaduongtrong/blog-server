const ManagerRequestDto = require('../ManagerRequestDto');

class CreatePostConfigDto extends ManagerRequestDto {
    categoryIds = [];
    authorId = Number();
    parentId = Number();
    title = String();
    metaTitle = String();
    summary = String();
    content = String();
    tagIds = [];
}

module.exports = CreatePostConfigDto;