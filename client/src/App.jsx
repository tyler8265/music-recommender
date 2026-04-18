import { useState, useEffect } from 'react'
import Dashboard from './Dashboard'
import LoginPage from './LoginPage'
import axios from 'axios'
import './App.css'

function App() {
  const [user, setUser] = useState(null)
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get('/me', { withCredentials: true })
        setUser(res.data.user)
        console.log('checked auth')
        console.log(user)
      } catch(error) {
        console.log(error);
      }
    }
    checkAuth();
  }, []) 
  if(user) {
      return (
        <Dashboard />
      )
    } else {
      return (
        <LoginPage />
      )
    }
}

export default App
