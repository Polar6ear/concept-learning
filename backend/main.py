from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware #cross origin resouce sharing
from pydantic import BaseModel
from database import get_connection

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class Item(BaseModel): #basemodel user jo values deta hai usko validate krne ko hai 
    name: str
    description: str

@app.post('/items')
def create_item(item: Item):
    conn = get_connection() #db se connection establish krne ke liye 
    cur = conn.cursor() #pen to write on db db ke sath kaam krne ka tool
    cur.execute('INSERT INTO items (name, description) VALUES (%s, %s) RETURNING *', (item.name, item.description)) #isse likhinge db me commands
    new_item = cur.fetchone()#db ne jo values di unko receave krta hai
    conn.commit()#changes permanently save krta hai
    conn.close()#db connection close krta hai 
    return {'id': new_item[0], 'name': new_item[1], 'description': new_item[2]}


@app.get('/items')
def get_items():
    conn = get_connection()
    cur = conn.cursor()
    cur.execute('SELECT * FROM items ORDER BY CREATED_AT DESC')
    rows = cur.fetchall()#saari rows utha lo
    conn.close()
    return [{'id': r[0], 'name': r[1], 'description': r[2]} for r in rows]


@app.put('/items/{item_id}')
def update_item(item_id: int, item: Item):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute('UPDATE items SET name = %s, description = %s WHERE id = %s RETURNING *', (item.name, item.description, item_id))
    updated = cur.fetchone()
    conn.commit()
    conn.close()
    if not updated:
        raise HTTPException(status_code=404, detail="Item not found")
    return {'id': updated[0], 'name': updated[1], 'description': updated[2]}

@app.delete('/items/{item_id}')
def delete_item(item_id: int):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute('DELETE FROM items WHERE id = %s RETURNING *', (item_id,))
    deleted = cur.fetchone()
    conn.commit()
    conn.close()
    if not deleted:
        raise HTTPException(status_code=404, detail="Item not found")
    return {'message': 'Item deleted successfully'}