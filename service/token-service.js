const jwt = require('jsonwebtoken')
require('dotenv').config()
const db = require('../db')

class TokenService{
    generateTokens(id, email){

        const payload = {
            id,
            email,
        }
        
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {expiresIn:'1d'})
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {expiresIn:'30d'})
        return {
            accessToken,
            refreshToken
        }
    }

    async saveToken(userId, refreshToken){
        const tokenData = await db.query(`SELECT * FROM token WHERE user_id=$1`, [userId])
        if (tokenData.rows.length > 0){
            return await db.query(`UPDATE token SET "refreshToken"=$1 WHERE user_id=$2`, [refreshToken, userId])
        }
        return await db.query(`INSERT INTO token ("refreshToken", user_id) values ($1, $2) RETURNING *`, [refreshToken, userId])
    }

    async removeToken(refreshToken){
        await db.query('DELETE FROM token WHERE "refreshToken"=$1 RETURNING *',[refreshToken])
        return {message:'Logged out successfuly'}
    }

    async validateAccessToken(token){
        try{
            const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET)
            return userData
        } catch{
            return null
        }
    }
    async validateRefreshToken(token){
        try{
            const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET)
            return userData
        } catch(e){
            return null
        }
    }
    async findRefreshToken(user_id){
        const token =( await db.query(`SELECT * FROM token WHERE "user_id"=$1`,[user_id])).rows[0]
        return token
    }
}

module.exports = new TokenService()