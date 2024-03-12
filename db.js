const Pool = require('pg').Pool

const pool = new Pool({
    user:'postgres',
    password:'300503',
    host:'localhost',
    port:5432,
    database:'newgratis'
})

module.exports = pool