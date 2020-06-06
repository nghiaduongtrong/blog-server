/* Post view model
 */
class PostView {
    id = Number();
    postId = Number();
    ipAddress = Number();
    count = Number();
    createdAt = Date();
    updatedAt = Date();
}

module.exports = PostView;