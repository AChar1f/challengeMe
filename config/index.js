import { createPool } from "mysql2";
import 'dotenv/config'

let connection  = createPool({
    host: process.env.hostDb,
    user: process.env.userDb,
    password: process.env.pwdDb,
    database: process.env.dbName,
    multipleStatements: true,
    connectionLimit: 30
})
connection.on('connection', (pool) => {
    if(!pool) throw new Error ('(X_X) Couldn\'t connect to the database. Try again later')
})
export {
    connection
}