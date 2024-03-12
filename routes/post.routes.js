const Router = require('express')
const postController = require('../controllers/post.controller')
const authMiddleware = require('../middleware/auth-middleware')
const multerMiddlewere = require('../middleware/multer-post-middlewere')

const router = new Router()

router.get('/interestingPosts', authMiddleware, postController.getInterestingPosts)
router.post('/createPost', authMiddleware, multerMiddlewere, postController.createPost)
router.get('/myAdds', authMiddleware, postController.getMyActiveAds )
router.delete('/removePost', authMiddleware, postController.removePost)

module.exports = router