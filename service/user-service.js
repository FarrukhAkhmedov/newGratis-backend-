const db = require('../db')
const bctypt = require('bcryptjs')
const tokenService = require('./token-service')
const ApiError = require('../exeptions/api-error')

class UserService {
    async createUser(email){
        const simularEmail = await db.query(`SELECT * FROM "user" WHERE email=$1`, [email])
        if (simularEmail.rows.length > 0){
            throw ApiError.Badrequest('This e-mail has been already used') 
        } 
        try {
            return {
                message: 'No users found'
            }

        } catch(e) {
            console.log(e)
        }
    }

    async addInfo (userName, address, email, password, image){
        const simularName = await db.query(`SELECT * FROM "userInfo" WHERE "userName"=$1`, [userName])
        if (simularName.rows.length > 0){
            throw ApiError.Badrequest('This user name has been already used')
        }

        const hashPassword = bctypt.hashSync(password, 7)

        await db.query(`INSERT INTO "user" (email, password) values ($1, $2) RETURNING *`, [email, hashPassword])
        const id = (await db.query(`SELECT * FROM "user" WHERE email=$1`, [email])).rows[0].id
        const tokens = tokenService.generateTokens(id, email)

        console.log(tokens);
        
        await tokenService.saveToken(id, tokens.refreshToken)

        
        const imagePathArr = image.split('/');
        const imagePath = imagePathArr[imagePathArr.length - 1];

        const user = (await db.query(`INSERT INTO "userInfo" ("userName", address, user_id, avatar) values ($1, $2, $3, $4) RETURNING *`, [userName, address, id, imagePath])).rows[0];

        console.log(user);
        return {
            ...tokens,
            userInfo: user
        }
    }

    async login(email, password){
        const user = await db.query(`SELECT * FROM "user" WHERE email=$1`, [email])

        if (!user.rows[0]){
            throw ApiError.Badrequest( "User does not exist")
        }

        const isValidPassword = await bctypt.compare(password, user.rows[0].password)
        if (!isValidPassword){
            throw ApiError.Badrequest("Wrong password")
        }

        const userInfo = (await db.query(`SELECT * FROM "userInfo" WHERE user_id=$1`, [user.rows[0].id])).rows[0]
        const tokens = tokenService.generateTokens(user.rows[0].id, email)
        
        tokenService.saveToken(user.rows[0].id, tokens.refreshToken)

        return {
            ...tokens,
            userInfo:userInfo,

        }
        
    }

    async logout(refreshToken){
        const token = await tokenService.removeToken(refreshToken);
        return token
    }

    async refresh(refreshToken){
        if (!refreshToken){
            throw ApiError.UnauthorizedError()
        }

        const userData = await tokenService.validateRefreshToken(refreshToken)
        const tokenFromDataBase = await tokenService.findRefreshToken(userData.id)
        if (!userData || !tokenFromDataBase){
            throw ApiError.UnauthorizedError()
        }

        const user = await db.query(`SELECT * FROM "user" WHERE id=$1`, [userData.id])
        const userInfo = (await db.query(`SELECT * FROM "userInfo" WHERE user_id = $1`, [userData.id])).rows[0]
        const tokens = tokenService.generateTokens(user.rows[0].id, user.rows[0].email)
        await tokenService.saveToken(user.rows[0].id, tokens.refreshToken)

        return {
            ...tokens,
            userInfo: userInfo
        }
    }

    async EditInfo(userName, address, oldUserName, image){
        const simularName = await db.query(`SELECT * FROM "userInfo" WHERE "userName"=$1`, [userName])

        if (simularName.rows.length > 0){
            throw ApiError.Badrequest('This user name has been already used')
        }

        const imagePath = image.split('/')


        const updatedUserData = (await db.query(`UPDATE "userInfo" SET "userName" = $1, address = $2, avatar = $3 WHERE "userName" = $4 RETURNING *;`, [userName, address, imagePath[imagePath.length - 1], oldUserName])).rows[0]
        return {
            userInfo: {...updatedUserData}
        }
    }
    
}

module.exports = new UserService()