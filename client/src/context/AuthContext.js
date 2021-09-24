import { createContext } from 'react'

function noop() {}

export default createContext({
  token: null,
  user: null,
  login: noop,
  isAuth: false
})