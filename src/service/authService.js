import bcrypt from 'bcrypt'
import { connPool } from '../database/MysqlConn.js';
import { generateToken } from '../utils/JwtUtil.js';

const saltRound = 10;
const jwtExpiry = process.env.JWT_EXPIRY;
const database = process.env.MYSQL_SCHEMA;

/**
 * 
 * @param {email} email 
 * @param {name} name 
 * @param {password} password 
 * @returns 
 */
export const register = async (email, name, password) => {
    try {
        const selectQuery = `SELECT * FROM ${database}.USERS WHERE EMAIL = ?`;
        console.log(selectQuery);
        const [result] = await connPool.query(selectQuery, [email]);
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
                let insertQuery = `INSERT INTO ${database}.USERS(EMAIL, NAME, PASSWORD_HASH) VALUES(?,?,?)`;
                console.log(insertQuery);
                const [result, fields] = await connPool.execute(insertQuery, [email, name, hash]);
            })
            return {
                status: 201,
                response: {
                    message: `User registered with email ${email}`
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


export const login = async (email, password) => {
    const query = `SELECT ID, EMAIL, NAME, PASSWORD_HASH FROM ${database}.USERS WHERE EMAIL = ?`;
    console.log(query);

    const [result] = await connPool.query(query, [email])
    if (Array.isArray(result) && result.length > 0) {
        let data = result[0];
        const isValidCred = await bcrypt.compare(password, data.PASSWORD_HASH);
        if (isValidCred) {
            let user = {
                "id": data.ID,
                "name": data.NAME,
                "email": data.EMAIL
            }
            const token = generateToken(user)
            return {
                status: 200,
                response:
                {
                    "status": "Success",
                    "message": "Login successful",
                    "data": {
                        "user": user,
                        "accessToken": token,
                        "expiresIn": jwtExpiry
                    }
                }
            }
        }
    }
    return {
        status: 401,
        response: {
            status: 'Failure',
            message: 'Invalid username or password.'
        }
    }
}