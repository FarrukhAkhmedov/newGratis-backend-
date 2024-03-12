const ApiError = require('../exeptions/api-error')
const userService = require('../service/user-service')
const {validationResult} = require('express-validator')


class UserController {
    async createUser(req, res, next) {
        const error = validationResult(req)
        if (!error.isEmpty()){
            return next(ApiError.Badrequest('Invalid email'))
        }
        try {
            const {email} = req.body
            const userData = await userService.createUser(email)
            res.json(userData)
        } catch(e) {
            next(e)
        }

    }

    async addUserInfo(req, res, next){
        try{
            const { userName, address, email, password } = req.body;
            const image = req.file.path 
            const userDataAdd = await userService.addInfo(userName, address, email, password, image)
            return res.json(userDataAdd)
        }catch(e){
            next(e)
        }
    }

    async login (req, res, next){
        try {
            const {email, password} = req.body
            const userData = await userService.login(email, password)
            res.json(userData)
        } catch(e) {
            next(e)
        }
    }

    async logout(req, res, next){
        try {
            const {refreshToken} = req.body
            const userData = await userService.logout(refreshToken)
            return res.json(userData)
        } catch(e){
            next(e)
        }
    }

    async refresh(req, res, next){
        try {
            const {refreshToken} = req.query
            const userData = await userService.refresh(refreshToken)
            return res.json(userData)
        } catch(e){
            next(e)
        }
    }

    async EditProfileInfo(req, res, next){
        try{
            const {userName, address, oldUserName} = req.body
            const image = req.file.path
            const userData = await userService.EditInfo(userName, address, oldUserName, image)
            return res.json(userData)
        } catch (e){
            next(e)
        }
    }
    
}

module.exports = new UserController