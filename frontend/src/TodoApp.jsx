import { useState, useEffect } from "react"
import axios from "axios"

const API = "http://localhost:8000"

export default function App() {
  const [todos, setTodos] = useState([])
  const [title, setTitle] = useState("")
  const [editId, setEditId] = useState(null)
  const [editTitle, setEditTitle] = useState("")

  // READ — page load pe sab todos fetch karo
  useEffect(() => {
    fetchTodos()
  }, [])

  const fetchTodos = async () => {
    const res = await axios.get(`${API}/todos`)
    setTodos(res.data)
  }

  // CREATE
  const handleAdd = async (e) => {
    e.preventDefault()
    if (!title.trim()) return
    await axios.post(`${API}/todos`, { title, completed: false })
    setTitle("")
    fetchTodos()
  }

  // TOGGLE complete/incomplete
  const handleToggle = async (todo) => {
    await axios.put(`${API}/todos/${todo.id}`, {
      title: todo.title,
      completed: !todo.completed   // ulta kar do
    })
    fetchTodos()
  }

  // UPDATE title
  const handleEdit = async (todo) => {
    await axios.put(`${API}/todos/${todo.id}`, {
      title: editTitle,
      completed: todo.completed
    })
    setEditId(null)
    fetchTodos()
  }

  // DELETE
  const handleDelete = async (id) => {
    await axios.delete(`${API}/todos/${id}`)
    fetchTodos()
  }

  return (
    <div style={{ maxWidth: 500, margin: "40px auto", fontFamily: "sans-serif" }}>
      <h1>Todo List ✅</h1>

      {/* ADD FORM */}
      <form onSubmit={handleAdd} style={{ display: "flex", gap: 8, marginBottom: 24 }}>
        <input
          placeholder="Kya karna hai?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ flex: 1, padding: "8px 12px", fontSize: 14 }}
        />
        <button type="submit" style={{ padding: "8px 16px" }}>Add</button>
      </form>

      {/* TODO LIST */}
      {todos.map(todo => (
        <div key={todo.id} style={{
          display: "flex", alignItems: "center", gap: 10,
          padding: "10px 12px", marginBottom: 8,
          border: "1px solid #ddd", borderRadius: 8,
          opacity: todo.completed ? 0.5 : 1
        }}>

          {/* Checkbox — toggle */}
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={() => handleToggle(todo)}
          />

          {/* Title ya edit input */}
          {editId === todo.id ? (
            <>
              <input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                style={{ flex: 1, padding: "4px 8px" }}
              />
              <button onClick={() => handleEdit(todo)}>Save</button>
              <button onClick={() => setEditId(null)}>Cancel</button>
            </>
          ) : (
            <>
              <span style={{
                flex: 1,
                textDecoration: todo.completed ? "line-through" : "none"
              }}>
                {todo.title}
              </span>
              <button onClick={() => { setEditId(todo.id); setEditTitle(todo.title) }}>Edit</button>
              <button onClick={() => handleDelete(todo.id)}>Delete</button>
            </>
          )}
        </div>
      ))}

      {todos.length === 0 && (
        <p style={{ color: "#999", textAlign: "center" }}>Koi todo nahi hai abhi!</p>
      )}
    </div>
  )
}