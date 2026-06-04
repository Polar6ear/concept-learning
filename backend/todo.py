from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from database import get_db, engine, Base
from models import Todo
from schemas import TodoCreate, TodoResponse
from typing import List

# Tables automatically ban jaayengi agar exist nahi karti
Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# CREATE
@app.post("/todos", response_model=TodoResponse)
def create_todo(todo: TodoCreate, db: Session = Depends(get_db)):
    new_todo = Todo(title=todo.title, completed=todo.completed)
    db.add(new_todo)
    db.commit()
    db.refresh(new_todo)
    return new_todo

# READ
@app.get("/todos", response_model=List[TodoResponse])
def get_todos(db: Session = Depends(get_db)):
    return db.query(Todo).order_by(Todo.created_at.desc()).all()

# UPDATE
@app.put("/todos/{todo_id}", response_model=TodoResponse)
def update_todo(todo_id: int, todo: TodoCreate, db: Session = Depends(get_db)):
    db_todo = db.query(Todo).filter(Todo.id == todo_id).first()
    if not db_todo:
        raise HTTPException(status_code=404, detail="Todo not found")
    db_todo.title = todo.title
    db_todo.completed = todo.completed
    db.commit()
    db.refresh(db_todo)
    return db_todo

# DELETE
@app.delete("/todos/{todo_id}")
def delete_todo(todo_id: int, db: Session = Depends(get_db)):
    db_todo = db.query(Todo).filter(Todo.id == todo_id).first()
    if not db_todo:
        raise HTTPException(status_code=404, detail="Todo not found")
    db.delete(db_todo)
    db.commit()
    return {"message": "Deleted successfully"}




# from fastapi import FastAPI, HTTPException #app bnane ke liye FastAPI aur error handle krne ko HTTPException
# from fastapi.middleware.cors import CORSMiddleware #react ko backend access dene ke liye use hota hai
# from pydantic import BaseModel
# from database import get_connection

# app = FastAPI() # aek aesa program bnao jo req receave kre and response de

# #user -> react app -> post/get/put/delete -> CORSmiddleware -> routes -> functions(backend)->
# #-> middleware -> databaes -> response -> middleware -> react app -> user
# #middleware-> req/res ke bich me modify krne ko--> auth(token hai->api | no->error)
# # login(hrr req record krne ko get/items, delete/item/5), timing(kitta time lga)
# #cors(diff domain ko allow reject krne ko), ratelimit(1 min me kitti req allowed hai)

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["http://localhost:5173"],
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# #BaseModel -> req/response ka datatype, fields
# # BaseModel -> Data validation
# # Base(sql Alchemy) -> database table mapping 

# class Todo(BaseModel): #basemodel se hum btate hai ki is class ki tra hona chaiye req/res ka type
#     title: str
#     completed: bool = False


# @app.post('/todos')
# def create_todo(todo: Todo):
#     conn = get_connection()
#     cur = conn.cursor()
#     cur.execute(
#        'Insert Into todos(title, completed) VALUES (%s, %s) RETURNING *', #data me new todo add kro
#         (todo.title, todo.completed)
#     )
#     row = cur.fetchone() #inserted row utao
#     conn.commit()
#     conn.close()
#     return {'id': row[0], 'title': row[1], 'completed':row[2]}

# @app.get('/todos')
# def get_todos():
#     conn = get_connection() #connection db se establish krne ke liye
#     cur = conn.cursor() #db me likhne ke liye tool
#     cur.execute('SELECT * FROM todos ORDER BY created_at DESC') #command run krne ke liye
#     rows = cur.fetchall()
#     conn.close()
#     return [{'id': r[0], 'title': r[1], 'completed': r[2]} for r in rows]

# @app.put('/todos/{todo_id}')
# def update_todo(todo_id: int, todo: Todo):
#     conn = get_connection()
#     cur = conn.cursor()
#     cur.execute(
#         'UPDATE todos SET title = %s, completed = %s WHERE id=%s RETURNING *',
#         (todo.title, todo.completed, todo_id)
#     )
#     row = cur.fetchone()
#     conn.commit()
#     conn.close()
#     if not row: 
#         raise HTTPException(status_code=404, detail="Todo not found")
#     return {'id': row[0], 'title': row[1], 'completed': row[2]}

# app.delete('/todos/{todo_id}')
# def delete_todo(todo_id: int):
#     conn = get_connection()
#     cur = conn.cursor()
#     cur.execute('DELETE FROM todos WHERE id=%s RETURNING id', (todo_id,)) #sincle multiple values hai toh automatically tuple bnn jayega
#     row = cur.fetchone()
#     conn.commit()
#     conn.close()
#     if not row:
#         raise HTTPException(status_code=404, detail='Todo not found')
#     return {"message": "Deleted successfully"}
