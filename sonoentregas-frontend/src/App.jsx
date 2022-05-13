import React from 'react'
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom'

//CSS Global
import './styles/global.css'

//Token
import { isAuthenticated } from './services/auth'

//Login routes public
import Login from './pages/Login'

//Routes privates
import Routes from './routes'

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={Login}/>
        {isAuthenticated()  
          ? <Routes />
          : <Redirect to="/"/>
        }
      </Switch>
    </BrowserRouter>
  );
}

export default App