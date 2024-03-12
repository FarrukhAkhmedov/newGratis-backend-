const Router = require('express')
const router = new Router()
const userController = require('../controllers/user.controller')
const {body} = require('express-validator')
const authMiddleware = require('../middleware/auth-middleware')
const multerMiddlewere = require('../middleware/multer-profile-middlewere')

router.post(
    '/register',
    body('email').isEmail(),
    userController.createUser)
router.post('/login', userController.login)
router.post('/addInfo', multerMiddlewere, userController.addUserInfo)
router.post('/logout', userController.logout)
router.get('/refresh', userController.refresh)
router.post('/edit', authMiddleware, multerMiddlewere,  userController.EditProfileInfo)

module.exports = router


