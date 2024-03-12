const express = require('express')
const userRoutes = require('./routes/user.routes')
const postRoutes = require('./routes/post.routes')
require('dotenv').config()
const cors = require('cors')
const errorMiddlewere = require('./middleware/error-middlewere')


const PORT = process.env.PORT 

const app = express()

app.use(express.json())
app.use(cors({
    origin: "http://localhost:8081"
}))
app.use('/profileImages', express.static('profileImages'));
app.use('/postImages', express.static('postImages'));
app.use('/auth', userRoutes)
app.use('/post', postRoutes)
app.use(errorMiddlewere)

const start = async () => {
    try {
    app.listen(PORT, () => console.log(`Server works on ${PORT} PORT`))
} catch (e) {
    console.log(e)
}
}

start()