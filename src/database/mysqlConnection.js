import mysql from 'mysql2/promise'




export const connPool = mysql.createPool({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'root',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0
})


export const connectMysql = async () => {
    try {
        const conn = await connPool.getConnection();
        console.log('✅ MySQL Pool Connected');
        conn.release();
    } catch (error) {
        console.error('❌ MySQL Connection Failed:', error.message);
        throw error;
    }
}
