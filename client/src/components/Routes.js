import React from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';

import Login from './login/Login';
import Issues from './issues/Issues';

const Routes = () => (
  <BrowserRouter>
      <Switch>
          <Route exact path="/"><Redirect to="/issues" /></Route>
          <Route exact path='/issues' component={ Issues }/>
          <Route exact path='/login' component={ Login }/>
      </Switch>
  </BrowserRouter>
)
export default Routes