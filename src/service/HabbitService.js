import { connPool } from "../database/MysqlConn.js"

const getAllHabbits = async (userId) => {
    if (userId) {
        const query = 'select id,user_id, name, description, category, frequency, start_date, reminder_time, is_archived, created_at, updated_at FROM habits WHERE user_id = ? '
        const [result, fields] = await connPool.query(query, [userId])
        let habbits = [];
        result.forEach((h, i) => {
            let obj = {
                id: h.id,
                userId: h.user_id,
                name: h.name,
                description: h.description,
                category: h.category,
                frequency: h.frequency,
                customDays: [],
                startDate: h.start_date,
                reminder: h.reminder_time,
                createdAt: h.created_at
            }
            habbits.push(obj)
        })
        return habbits
    } else {
        const query = 'select id,user_id, name, description, category, frequency, start_date, reminder_time, is_archived, created_at, updated_at FROM habits'
        const [result] = await connPool.query(query)
        return result
    }

}

const getHabbitById = async (id) => {
    const query = 'select id, user_id, name, description, category, frequency, start_date, reminder_time, is_archived, created_at, updated_at from habits';
}

const saveHabbit = async (userId, data) => {

    const { name, description, category, frequency, startDate, reminder } = data;

    const selectQuery = 'select count(name) as cnt from habits where user_id = ? and name = ?'
    const insertQuery = 'insert into habits(user_id, name, description, category, frequency, start_date, reminder_time) values(?,?,?,?,?,?,?)'

    let obj = null;
    try {
        const [result1] = await connPool.execute(selectQuery, [userId, name])
        if (result1[0].cnt > 0) {
            obj = {
                status: 204,
                response: {
                    message: "Habit item already exists."
                }
            }
        } else {
            const [result2] = await connPool.execute(insertQuery, [userId, name, description, category, frequency, startDate, reminder])
            if (result2.affectedRows > 0) {
                obj = {
                    status: 200,
                    response: {
                        message: "Habit added."
                    }
                }
            } else {
                obj = {
                    status: 204,
                    response: {
                        message: "Habit could not be added."
                    }
                }
            }
        }
    } catch (error) {
        console.log(error);
        obj = {
            status: 500,
            response: {
                error: "Failed to insert record in Habit table."
            }
        }
    }

    return obj;

}

const toggleHabbitStatus = async (hId, uId, logDate, note, status) => {
    var obj = null;
    const selectQuery = 'select id, habit_id, user_id, log_date, completed, note, created_at, updated_at from habit_logs where habit_id = ? and user_id = ?';
    try {
        const [result] = await connPool.query(selectQuery, [hId, uId])
        console.log(result);
        if (Array.isArray(result) && result.length > 0) {
            const updateQuery = 'update habit_logs set log_date = ? , completed = ? where habit_id = ? and user_id = ? ';
            const result = await connPool.execute(updateQuery, [logDate, status, hId, uId]);
            console.log(result);
            obj = {
                status: 201,
                response: {
                    message: "Habbit log updated."
                }
            }
        } else {
            const insertQuery = 'insert into habit_logs (habit_id, user_id, log_date, note, completed) VALUES (?,?,?,?,?)';
            const result3 = await connPool.execute(insertQuery, [hId, uId, logDate, note, status])
            console.log(result3);
            obj = {
                status: 201,
                response: {
                    message: "Habbit log added."
                }
            }
        }

    } catch (error) {
        console.log(error);
        obj = {
            status: 500,
            response: {
                error: "Failed to update status in habbit logs table."
            }
        }
    }

    return obj;

}

const getLogDetailsByUserId = async (uId) => {
    var obj = null;
    const selectQuery = 'select id, habit_id, user_id, log_date, completed, note, created_at, updated_at from habit_logs where user_id = ?';
    try {
        const [result] = await connPool.query(selectQuery, [uId])
        let logs = [];
        result.forEach((h, i) => {
            let obj = {
                id: h.id,
                habitId: h.habit_id,
                date: h.log_date,
                completed: h.completed,
                userId: h.user_id,
                note: h.note,
            }
            logs.push(obj)
        });
        obj = {
            status: 200,
            response: logs
        }
    } catch (error) {
        console.log(error);
        obj = {
            status: 500,
            response: {
                error: "Failed to get habbit logs details."
            }
        }
    }
    return obj;
}

export {
    getAllHabbits,
    getHabbitById,
    saveHabbit,
    toggleHabbitStatus,
    getLogDetailsByUserId
}