const db = require('../db')
const QueryStream = require('pg-query-stream')
require('dotenv').config()
const tokenService = require('../service/token-service')


class PostService{
    async createPost(address, description, itemName, objectType, qualityRating, accessToken, photo ){

        const userId = (await tokenService.validateAccessToken(accessToken)).id
        const postId = (await db.query(`INSERT INTO "allPosts" ("itemName", user_id, qualityRating) values ($1, $2, $3) RETURNING *`,[itemName, userId, qualityRating])).rows[0].id
        const photoPath = photo.split('/')
        
        await db.query(`INSERT INTO post (address, description, "objectType", photo, post_id) values ($1, $2, $3, $4, $5)`, [address, description, objectType, photoPath[photoPath.length - 1], postId])

    }
    async getPosts(accessToken){
        try{
            const user_id = (await tokenService.validateAccessToken(accessToken)).id;
            
            const client = await db.connect()
            
            const postQuery = new QueryStream(`SELECT post.*, "allPosts"."itemName" FROM post INNER JOIN "allPosts" ON post.post_id = "allPosts".id WHERE "allPosts".user_id != $1;`, [user_id]);
            const postStream = client.query(postQuery);
            
            let postData = []

            postStream.on('data', (data) => {
                postData.push(data)
                console.log(data);
            })

            return new Promise((resolve) => {
                postStream.on('end', () => {

                    client.release();
                    resolve(postData);
                });
            
                postStream.on('error', (err) => {
                    console.error('Error during postStream:', err);
                    client.release();
                });
            });
            

        } catch(e){
            console.log(e);
        }
    }

    async myAdds(accessToken){
        const user_id =(await tokenService.validateAccessToken(accessToken)).id
        const postData = (await db.query(`SELECT post.*, "allPosts"."itemName" FROM post INNER JOIN "allPosts" ON post.post_id = "allPosts".id WHERE user_id = $1`, [user_id])).rows
        return postData
    }

    async deletePost(accessToken, post_id){
        const user_id = (await tokenService.validateAccessToken(accessToken)).id
        const dataBaseUser_id = (await db.query(`SELECT user_id from "allPosts" WHERE id = $1`, [post_id])).rows[0].user_id
        if (user_id == dataBaseUser_id){
            await db.query(`DELETE FROM post WHERE post_id = $1;`, [post_id]);
            await db.query(`DELETE FROM "allPosts" WHERE id = $1`, [post_id]);
        }

    }
}

module.exports = new PostService