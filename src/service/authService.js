import bcrypt from 'bcrypt'
import { connPool } from '../database/MysqlConn.js';
// import { connPool } from "../database/mysqlConnection.js";

const saltRound = 10;
/**
 * 
 * @param {email} email 
 * @param {name} name 
 * @param {password} password 
 * @returns 
 */
export const register = async (email, name, password) => {
    try {
        const [result] = await connPool.query('SELECT * FROM HABBITDB.USERS WHERE EMAIL = ?', [email]);
        if (Array.isArray(result) && result.length > 0) {
            console.log('User alreay exists');
            return {
                status: 200,
                response: {
                    message: `User alreay exists with email : ${email}.`
                }
            }
        } else {
            bcrypt.hash(password, saltRound, async (err, hash) => {
                const [result, fields] = await connPool.execute('INSERT INTO  HABBITDB.USERS(EMAIL, NAME, PASSWORD_HASH) VALUES(?,?,?)', [email, name, hash]);
            })
            return {
                status: 200,
                response: {
                    message: 'User registered.'
                }
            }
        }
    } catch (error) {
        console.error(error.sqlMessage);
        return {
            status: 500,
            response: {
                error: error.sqlMessage
            }
        }
    }
}


export const login = (email, password) => {

    // const query = 'SELECT N'

}

