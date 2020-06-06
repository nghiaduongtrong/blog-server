const BaseResponseDto = require('../../BaseResponseDto');

class GetPostsResponseDto extends BaseResponseDto {
    posts = [];
}

module.exports = GetPostsResponseDto;