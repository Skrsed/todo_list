import React, {useEffect} from 'react'
import {BrowserRouter as Router} from 'react-router-dom'
import AuthContext from './context/AuthContext'
import useAuth from './hooks/auth.hook'
import useRoutes from './routes'
import './App.css'

const App = () => {
  const {login, user, token, ready} = useAuth()
  const isAuth = !!user
  const routes = useRoutes(isAuth)

  useEffect(() => {
    document.title = "Список задач"
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        token,
        ready
      }}
    >
      <Router>{routes}</Router>
    </AuthContext.Provider>
  )
}

export default App
