import { useEffect, useState } from 'react' //useState -> jiska component ka data change ho skta hai, 
//state -> component ka data jo change ho skta hai 
//useEffect -> component render hone pr kux kaam krna ho toh 
import axios from 'axios'
//axios -> api se data fetch krne ke liye use hota hai, 
// fetch se bhi data fetch kr skte hai but axios zyada use hota hai 
// kyuki usme error handling aur response ko json me convert krne ki zarurat nahi hoti
//  + request response ko interrupt krne ka option b available hota hai
const API = 'http://localhost:8000' // ye hmara fastapi backend hai

export default function App(){
  const [items, setItems] = useState([]) //initial state create kr raha hu empty array hai
  //items -> current state isme data store hoga (whiteboard)
  //setItems -> state update krne wala function (ink)

  const [form, setForm] = useState({ //[current value, us value ko change krne wala function]
    name: "", description: ""
  })

  const [editId, setEditId] = useState(null)

  useEffect(() => { //jb page phli baar khule tb fetch item chala do
    //arrow function -> component renderhone pr chalta hai
    fetchItems()
  }, []) //dependency array -> isme jo b value hogi vo change hogi
  //agar empty hai toh sirf component ke render hone aek baar chalega

  const fetchItems = async () => { //fetchItems naam ka ek function bnao jo backend se data layega
    const res = await axios.get(`${API}/items`)
    setItems(res.data) //jo data aaya hai usko itmes me store krdo setItems us function ka naam hai jo ye krta hai 
  }

  const handleSubmit = async (e) => {
    e.preventDefault() //from submit hone pr page reload nahi hoga
    //jese default me normally form submit hone pr reload hota hai usko rokne ko
    if(editId){
      await axios.put(`${API}/items/${editId}`, form) //put request bhej do backend ko update krne ke liye
      setEditId(null) //edit mode se bhar aane ko editing khtm ho gyi
    }else{
      await axios.post(`${API}/items`, form) //post request bhej do backend ko naya item add krne ke liye
    }
    setForm({name: "", description: ""}) //form reset krdo 
      fetchItems() //list refresh kro 
    }

  const handleDelete = async (id) => {//us item ki id jisko delete krna hai
    await axios.delete(`${API}/items/${id}`) 
    fetchItems()//delete request bhej do backend ko item delete krne ke liye
    //latest data fetch krke aao
  }
  const handleEdit = async (item) => {
    setEditId(item.id) //item ki id ko edit mode me le aao
    setForm({name: item.name, description: item.description})//form me item ka data bhar do taki user usko edit kr ske
  }
  return ( //react screen pr kya dikhega vo return me likhte hai 
    <div style={{maxWidth: 600, margin: "40px auto", fontFamily: "Arial, sans-serif"}}>
      <h1>CRUD APP</h1>
      {/* form submit hone pr ye function call hota hai */}
      <form onSubmit={handleSubmit}>  
        <input 
          placeholder='Name'
          //textbox khali ho toh ye dikhega
          value={form.name}
          //textbox ki value kha se ayegi
          onChange={(e) => setForm({...form, name: e.target.value})} // jo valude di hai vhi update hogi
          //current text deta hai
        />
        
        <input 
          placeholder='Description'
          value={form.description}
          onChange={(e) => setForm({...form, description: e.target.value})} //
        />
        <button type='submit'>{editId ? 'Update' : 'Add Item'}</button> 
        {/* naya item bna rhe ho add item purana update krre ho update */}
        {editId && <button type='button' onClick={() => setEditId(null)}>Cancel</button>}
        {/* jb editId = null toh cancel button nakko dikhega */}
      </form>
      {/* LIST — Read */}
      {items.map(item => (
        <div key={item.id} style={{ border: "1px solid #ddd", padding: 12, margin: "8px 0" }}>
          <strong>{item.name}</strong> — {item.description}
          <button onClick={() => startEdit(item)}>Edit</button>
          <button onClick={() => handleDelete(item.id)}>Delete</button>
        </div>
      ))}
    </div>
  )
}