import React from 'react'
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom'

//CSS Global
import './styles/global.css'

//Token
import { isAuthenticated } from './services/auth'

//Login routes public
import Login from './pages/Login'

//Components
import Header from './components/Header'
import Navbar from './components/Navbar'
import Footer from './components/Footer'

//Routes privates
import Routes from './routes'

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={Login}/>
        {isAuthenticated() ? 
          <>
            <div className="header">
              <Header />
              <Navbar />
            </div>
            <Routes />
            <Footer />
          </>
          : <Redirect to="/"/>
        }
      </Switch>
    </BrowserRouter>
  );
}

export default App