
import { useState, useCallback, useEffect } from 'react'
import jwt_decode from 'jwt-decode'

const storageName = 'userData'

const useAuth = () => {
  const [token, setToken] = useState('')
  const [ready, setReady] = useState(false)
  const [user, setUser] = useState(null)

  const login = useCallback((jwtToken) => {
    if (!jwtToken) return

    setToken(jwtToken)
    
    const user_decoded = jwt_decode(jwtToken)
    setUser(user_decoded)

    localStorage.setItem(storageName, JSON.stringify({
      userId: user_decoded.id, token: jwtToken
    }))
  }, [])

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem(storageName))

    if (data && data.token) {
      login(data.token, data.userId)
      setReady(true)
    }
    
  }, [login])


  return { login, user, token, ready }
}

export default useAuth