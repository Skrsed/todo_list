import { Route, Switch, Redirect } from 'react-router-dom'

import LoginPage from './pages/login/Login'
import IssuesPage from './pages/issues/Issues'

const useRoutes = isAuth => {
  if (isAuth) {
    return (
      <Switch>
        <Route path="/issues" exact>
          <IssuesPage />
        </Route>
        <Redirect to="/issues" />
      </Switch>
    )
  }

  return (
    <Switch>
      <Route path="/" exact>
        <LoginPage />
      </Route>
      <Redirect to="/" />
    </Switch>
  )
}

export default useRoutes