import { connPool } from "../database/MysqlConn.js"

export const getAllHabbits = async (userId) => {
    if (userId) {
        const query = 'SELECT id,user_id, name, description, category, frequency, start_date, reminder_time, is_archived, created_at, updated_at FROM habbitdb.habits WHERE user_id = ? '
        const [result] = await connPool.query(query, [userId])
        return result
    } else {
        const query = 'SELECT id,user_id, name, description, category, frequency, start_date, reminder_time, is_archived, created_at, updated_at FROM habbitdb.habits'
        const [result] = await connPool.query(query)
        return result
    }

}