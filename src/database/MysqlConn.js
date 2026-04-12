import mysql from 'mysql2/promise'
import dotenv from "dotenv"
dotenv.config();

const { MYSQL_HOST, MYSQL_PORT, MYSQL_USER, MYSQL_PASS } = process.env

export const connPool = mysql.createPool({
    host: MYSQL_HOST,
    port: MYSQL_PORT,
    user: MYSQL_USER,
    password: MYSQL_PASS,
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
