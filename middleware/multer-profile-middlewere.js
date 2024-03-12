const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname, '../profileImages'))
    },
    filename: function (req, file, cb) {
      cb(null,  Date.now() + '-' + Math.round(Math.random()) + '.jpeg')
    }
  })
  
const multerProfileMiddlewere = multer({ 
    storage: storage, 
    limits: {
        fileSize: 1024 * 1024 * 5 
    }
}).single('profileImage')

module.exports = multerProfileMiddlewere