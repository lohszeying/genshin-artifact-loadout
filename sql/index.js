const sql = {}

sql.query = {
    add_user: 'INSERT INTO Users (username, password) VALUES ($1,$2)',
    user: 'SELECT * FROM Users WHERE username=$1'
}

module.exports = sql