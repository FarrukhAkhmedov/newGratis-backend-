const postService = require("../service/post-service")


class PostController {
    async createPost(req, res, next){
        try{
            const {address, description, itemName, objectType, qualityRating} = req.body
            const photo = req.file.path

            const authorizationHeader = req.headers.authorization
            const accessToken = authorizationHeader.split(' ')[1]

            await postService.createPost(address, description, itemName, objectType, qualityRating, accessToken, photo)
            
        } catch(e){
            next(e)
        }
    }
    async getInterestingPosts(req, res, next){
        try{
            const authorizationHeader = req.headers.authorization
            const accessToken = authorizationHeader.split(' ')[1]
            const postData = await postService.getPosts(accessToken)
            res.json(postData)
        } catch(e){
            next(e)
        }
    }


    async getMyActiveAds(req, res, next){
        try{
            const authorizationHeader = req.headers.authorization
            const accessToken = authorizationHeader.split(' ')[1]
            const postData = await postService.myAdds(accessToken)
            res.json(postData)
        } catch(e){
            next(e)
        }
    }

    async removePost(req, res, next){
        try{
            const {post_id} = req.query
            const authorizationHeader = req.headers.authorization
            const accessToken = authorizationHeader.split(' ')[1]
            await postService.deletePost(accessToken, post_id)
        } catch(e){
            next(e)
        }
    }
}

module.exports = new PostController