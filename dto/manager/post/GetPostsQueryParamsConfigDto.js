class GetPostsQueryParamsConfigDto {
    search = String();
    category = String();
    status = [];
    order = String();
    number = Number();
    page = Number();
}

module.exports = GetPostsQueryParamsConfigDto;