from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from database import get_connection

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class Todo(BaseModel):
    title: str
    completed: bool = False


@app.post('/todos')
def create_todo(todo: Todo):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute(
       'Insert Into todos(title, completed) VALUES (%s, %s) RETURNING *',
        (todo.title, todo.completed)
    )
    row = cur.fetchone()
    conn.commit()
    conn.close()
    return {'id': row[0], 'title': row[1], 'completed':row[2]}

@app.get('/todos')
def get_todos():
    conn = get_connection()
    cur = conn.cursor()
    cur.execute('SELECT * FROM todos ORDER BY created_at DESC')
    rows = cur.fetchall()
    conn.close()
    return [{'id': r[0], 'title': r[1], 'completed': r[2]} for r in rows]

@app.put('/todos/{todo_id}')
def update_todo(todo_id: int, todo: Todo):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute(
        'UPDATE todos SET title = %s, completed = %s WHERE id=%s RETURNING *',
        (todo.title, todo.completed, todo_id)
    )
    row = cur.fetchone()
    conn.commit()
    conn.close()
    if not row: 
        raise HTTPException(status_code=404, detail="Todo not found")
    return {'id': row[0], 'title': row[1], 'completed': row[2]}

app.delete('/todos/{todo_id}')
def delete_todo(todo_id: int):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute('DELETE FROM todos WHERE id=%s RETURNING id', (todo_id,))
    row = cur.fetchone()
    conn.commit()
    conn.close()
    if not row:
        raise HTTPException(status_code=404, detail='Todo not found')
    return {"message": "Deleted successfully"}
