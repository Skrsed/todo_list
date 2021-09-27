import './Login.css'
import {Form, FloatingLabel, Button, Alert} from 'react-bootstrap'
import React, {useContext, useCallback, useState} from 'react'
import useHttp from '../../hooks/http.hook'
import AuthContext from '../../context/AuthContext'

const Login = () => {
  const auth = useContext(AuthContext)
  const {request, loading, error} = useHttp()
  
  const [form, setForm] = useState({
    login: '',
    password: ''
  })

  const changeHandler = useCallback((event) => {
    setForm({...form, [event.target.name]: event.target.value})
  }, [form])

  const loginHandler = useCallback(async () => {
    try {
      const data = await request('api/v1/auth/login', 'POST', {...form})
      auth.login(data.token)
    } catch (e) {}
  },[auth, form, request])

  return (
    <div className="page page-login">
      <div className="login-window">
        <FloatingLabel controlId="floatingInput" label="Логин" className="mb-3">
          <Form.Control
            name="login"
            value={form.login}
            onChange={changeHandler}
            type="text"
            placeholder="login"
          />
        </FloatingLabel>
        <FloatingLabel controlId="floatingPassword" label="Пароль">
          <Form.Control
            name="password"
            value={form.password}
            onChange={changeHandler}
            type="password"
            placeholder="password"
          />
        </FloatingLabel>
        <Alert
          key={'idx'}
          variant={'danger'}
          style={{display: !error ? 'none' : 'block'}}
        >
          {error}
        </Alert>
        <div className="button-wrapper">
          <Button variant="badge" onClick={loginHandler} disabled={loading}>
            Войти
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Login
