import { useState, useEffect } from "react"
import axios from "axios"

const API = "http://localhost:8000"

const TYPES = [
  { l: "FIRE",     bg: "#FF6B35", c: "#fff" },
  { l: "WATER",    bg: "#3A86FF", c: "#fff" },
  { l: "GRASS",    bg: "#38B000", c: "#fff" },
  { l: "ELECTRIC", bg: "#F9A825", c: "#1a1a1a" },
  { l: "PSYCHIC",  bg: "#C77DFF", c: "#fff" },
  { l: "GHOST",    bg: "#6B4F8A", c: "#fff" },
  { l: "DRAGON",   bg: "#0D47A1", c: "#fff" },
  { l: "NORMAL",   bg: "#9E9E9E", c: "#fff" },
]

export default function App() {
  const [todos, setTodos] = useState([])
  const [title, setTitle] = useState("")
  const [editId, setEditId] = useState(null)
  const [editTitle, setEditTitle] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => { fetchTodos() }, [])

  const fetchTodos = async () => {
    try {
      setError(null)
      const res = await axios.get(`${API}/todos`)
      setTodos(res.data)
    } catch (e) {
      setError("Backend connect nahi ho raha! uvicorn chal raha hai?")
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = async (e) => {
    e.preventDefault()
    if (!title.trim()) return
    await axios.post(`${API}/todos`, { title, completed: false })
    setTitle("")
    fetchTodos()
  }

  const handleToggle = async (todo) => {
    await axios.put(`${API}/todos/${todo.id}`, {
      title: todo.title,
      completed: !todo.completed
    })
    fetchTodos()
  }

  const handleEdit = async (todo) => {
    if (!editTitle.trim()) return
    await axios.put(`${API}/todos/${todo.id}`, {
      title: editTitle,
      completed: todo.completed
    })
    setEditId(null)
    fetchTodos()
  }

  const handleDelete = async (id) => {
    await axios.delete(`${API}/todos/${id}`)
    fetchTodos()
  }

  const done = todos.filter(t => t.completed).length

  return (
    <div style={{
      minHeight: "100vh", background: "#111",
      display: "flex", alignItems: "flex-start",
      justifyContent: "center", padding: "40px 16px",
      fontFamily: "'Nunito', sans-serif"
    }}>
      <div style={{ width: "100%", maxWidth: 500 }}>

        {/* Pokedex top */}
        <div style={{
          background: "#CC0000", borderRadius: "20px 20px 0 0",
          padding: "16px 24px", display: "flex", alignItems: "center", gap: 16
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: "50%",
            background: "#60CFFF", border: "4px solid #fff",
            boxShadow: "0 0 0 3px #1a1a1a", flexShrink: 0
          }} />
          <div style={{ display: "flex", gap: 8 }}>
            {["#FF6B6B", "#FFD93D", "#6BCB77"].map(c => (
              <div key={c} style={{ width: 14, height: 14, borderRadius: "50%", background: c }} />
            ))}
          </div>
        </div>

        <div style={{ background: "#1a1a1a", height: 6 }} />

        {/* Title bar */}
        <div style={{
          background: "#1a1a1a", padding: "12px 24px",
          display: "flex", justifyContent: "space-between",
          alignItems: "center", borderBottom: "2px solid #222"
        }}>
          <span style={{ color: "#FFD93D", fontSize: 15, fontWeight: 900, letterSpacing: 2 }}>
            POKEDEX TASKS
          </span>
          <span style={{
            color: "#fff", fontSize: 12, fontWeight: 700,
            background: "#2a2a2a", padding: "4px 12px", borderRadius: 20
          }}>
            {done} / {todos.length} caught
          </span>
        </div>

        {/* Screen */}
        <div style={{
          background: "#1a1a1a", padding: 20,
          borderRadius: "0 0 20px 20px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.6)"
        }}>

          {/* Add form */}
          <form onSubmit={handleAdd} style={{ display: "flex", gap: 10, marginBottom: 16 }}>
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Add a new quest..."
              style={{
                flex: 1, background: "#2a2a2a", border: "2px solid #333",
                borderRadius: 12, padding: "12px 16px", color: "#fff",
                fontSize: 14, fontFamily: "'Nunito', sans-serif",
                fontWeight: 700, outline: "none"
              }}
              onFocus={e => e.target.style.borderColor = "#FFD93D"}
              onBlur={e => e.target.style.borderColor = "#333"}
            />
            <button type="submit" style={{
              background: "#FFD93D", color: "#1a1a1a", border: "none",
              borderRadius: 12, padding: "12px 18px", fontWeight: 900,
              fontSize: 14, cursor: "pointer", fontFamily: "'Nunito', sans-serif"
            }}>+ Catch</button>
          </form>

          {/* Error */}
          {error && (
            <div style={{
              background: "#2a1a1a", border: "2px solid #FF6B6B",
              borderRadius: 12, padding: "12px 16px", marginBottom: 16,
              color: "#FF6B6B", fontSize: 13, fontWeight: 700, textAlign: "center"
            }}>{error}</div>
          )}

          {/* Loading */}
          {loading && (
            <div style={{ color: "#444", textAlign: "center", padding: 32, fontSize: 13, fontWeight: 700 }}>
              Loading quests...
            </div>
          )}

          {/* Empty */}
          {!loading && !error && todos.length === 0 && (
            <div style={{ color: "#444", textAlign: "center", padding: 32, fontSize: 13, fontWeight: 700, lineHeight: 2 }}>
              No quests yet!<br />Add one above to begin.
            </div>
          )}

          {/* List */}
          {todos.map(todo => {
            const tp = TYPES[todo.id % TYPES.length]

            return (
              <div key={todo.id} style={{
                display: "flex", alignItems: "center", gap: 12,
                background: todo.completed ? "#1e3a20" : "#2a2a2a",
                borderRadius: 14, padding: "14px 16px", marginBottom: 10,
                border: `2px solid ${todo.completed ? "#2d5a30" : "#333"}`
              }}>

                {editId === todo.id ? (
                  <div style={{ flex: 1 }}>
                    <input
                      value={editTitle}
                      onChange={e => setEditTitle(e.target.value)}
                      onKeyDown={e => e.key === "Enter" && handleEdit(todo)}
                      autoFocus
                      style={{
                        width: "100%", background: "#111", border: "2px solid #FFD93D",
                        borderRadius: 8, padding: "7px 10px", color: "#fff",
                        fontSize: 13, fontFamily: "'Nunito', sans-serif",
                        fontWeight: 700, outline: "none", marginBottom: 8
                      }}
                    />
                    <div style={{ display: "flex", gap: 6 }}>
                      <button onClick={() => handleEdit(todo)} style={btnStyle("#FFD93D", "#1a1a1a")}>Save</button>
                      <button onClick={() => setEditId(null)} style={btnStyle("#333", "#888")}>Cancel</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        color: todo.completed ? "#555" : "#fff",
                        fontSize: 14, fontWeight: 800,
                        textDecoration: todo.completed ? "line-through" : "none",
                        wordBreak: "break-word", lineHeight: 1.4
                      }}>
                        {todo.title}
                      </div>
                      <span style={{
                        display: "inline-block", background: tp.bg, color: tp.c,
                        fontSize: 10, fontWeight: 800, padding: "2px 8px",
                        borderRadius: 20, marginTop: 5
                      }}>
                        {tp.l}
                      </span>
                    </div>

                    <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                      {todo.completed
                        ? <button onClick={() => handleToggle(todo)} style={btnStyle("#333", "#888")}>Undo</button>
                        : <button onClick={() => handleToggle(todo)} style={btnStyle("#6BCB77", "#fff")}>Catch!</button>
                      }
                      <button onClick={() => { setEditId(todo.id); setEditTitle(todo.title) }} style={btnStyle("#333", "#FFD93D")}>Edit</button>
                      <button onClick={() => handleDelete(todo.id)} style={btnStyle("#333", "#FF6B6B")}>Flee</button>
                    </div>
                  </>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

const btnStyle = (bg, color) => ({
  background: bg, color, border: "none", borderRadius: 8,
  padding: "6px 10px", fontSize: 11, fontWeight: 800,
  cursor: "pointer", fontFamily: "'Nunito', sans-serif"
})
// import { useState, useEffect } from "react"
// import axios from "axios"

// const API = "http://localhost:8000"

// export default function App() {
//   const [todos, setTodos] = useState([])
//   //todos -> saare todos 
//   //setTodos -> todos update krne ka function
//   const [title, setTitle] = useState("")
//   //title --> add todos ka data store krega 
//   //setTitle --> ye todos store krne ka function
//   const [editId, setEditId] = useState(null)
//   //editId -> abhi konsa todo edit hora hai 
//   // setEditId -> edit krne ki value
//   const [editTitle, setEditTitle] = useState("")
//   //editTitle -> edit box ki value
//   //setEditTitle -> set krne ka function
//   // READ — page load pe sab todos fetch karo
//   useEffect(() => {
//     fetchTodos() //page khulte hi todos load kro 
//   }, [])

//   //backend se saare tools lao
//   const fetchTodos = async () => {
//     const res = await axios.get(`${API}/todos`)
//     setTodos(res.data)
//   }

//   // CREATE
//   const handleAdd = async (e) => { //ye add button dabane pr chalta hai 
//     e.preventDefault() //page reload mtt kro
//     if (!title.trim()) return //agar user sirf space daale toh
//     await axios.post(`${API}/todos`, 
//       { 
//         title, completed: false 
//       })
//     setTitle("")
//     fetchTodos()
//   }

//   // TOGGLE complete/incomplete
//   const handleToggle = async (todo) => {
//     await axios.put(`${API}/todos/${todo.id}`, {
//       title: todo.title,
//       completed: !todo.completed   // ulta kar do
//     })
//     fetchTodos()
//   }

//   // UPDATE title
//   const handleEdit = async (todo) => {
//     await axios.put(`${API}/todos/${todo.id}`, {
//       title: editTitle,
//       completed: todo.completed
//     })
//     setEditId(null)
//     fetchTodos()
//   }

//   // DELETE
//   const handleDelete = async (id) => {
//     await axios.delete(`${API}/todos/${id}`)
//     fetchTodos()
//   }

//   return (
//     <div style={{ maxWidth: 500, margin: "40px auto", fontFamily: "sans-serif" }}>
//       <h1>Todo List ✅</h1>

//       {/* ADD FORM */}
//       <form onSubmit={handleAdd} style={{ display: "flex", gap: 8, marginBottom: 24 }}>
//         <input
//           placeholder="Kya karna hai?"
//           value={title}
//           onChange={(e) => setTitle(e.target.value)}
//           style={{ flex: 1, padding: "8px 12px", fontSize: 14 }}
//         />
//         <button type="submit" style={{ padding: "8px 16px" }}>Add</button>
//       </form>

//       {/* TODO LIST */}
//       {todos.map(todo => (
//         <div key={todo.id} style={{
//           display: "flex", alignItems: "center", gap: 10,
//           padding: "10px 12px", marginBottom: 8,
//           border: "1px solid #ddd", borderRadius: 8,
//           opacity: todo.completed ? 0.5 : 1
//         }}>

//           {/* Checkbox — toggle */}
//           <input
//             type="checkbox"
//             checked={todo.completed}
//             onChange={() => handleToggle(todo)}
//           />

//           {/* Title ya edit input */}
//           {editId === todo.id ? (
//             <>
//               <input
//                 value={editTitle}
//                 onChange={(e) => setEditTitle(e.target.value)}
//                 style={{ flex: 1, padding: "4px 8px" }}
//               />
//               <button onClick={() => handleEdit(todo)}>Save</button>
//               <button onClick={() => setEditId(null)}>Cancel</button>
//             </>
//           ) : (
//             <>
//               <span style={{
//                 flex: 1,
//                 textDecoration: todo.completed ? "line-through" : "none"
//               }}>
//                 {todo.title}
//               </span>
//               <button onClick={() => { setEditId(todo.id); setEditTitle(todo.title) }}>Edit</button>
//               <button onClick={() => handleDelete(todo.id)}>Delete</button>
//             </>
//           )}
//         </div>
//       ))}

//       {todos.length === 0 && (
//         <p style={{ color: "#999", textAlign: "center" }}>Koi todo nahi hai abhi!</p>
//       )}
//     </div>
//   )
// }