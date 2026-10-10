import { pool } from "./db.js";

export async function getAllTodos() {
    const res = await pool.query("select * from todo");
    return res.rows;
}

export async function getTodoById(id) {
    const res = await pool.query("select * from todo where id = $1 limit 1", [id]);
    return res.rows[0];
}

export async function createTodo(title, body) {
    const res = await pool.query(
      "insert into todo (title, body) values ($1, $2) returning *",
      [title, body],
    );
    return res.rows[0];
}

export async function updateTodo(id, body) {
    const columns = ['title', 'body', 'created_at', 'done'];
    const fields = [];
    const values = [];
    let index = 1;

    // check which column to update
    for(const column of columns) {
        if(body[column] !== undefined) {
            fields.push(`${column} = $${index++}`);
            values.push(body[column]);
        }
    };
    
    // check if no updates
    if (fields.length === 0) {
        return undefined;
    }

    values.push(id);
    
    const res = await pool.query(`update todo set ${fields.join(", ")} where id = $${index} returning *`, values);
    return res.rows[0];
}

export async function deleteTodoById(id) {
    const res = await pool.query("delete from todo where id = $1", [id]);
    return res.rowCount > 0;
}