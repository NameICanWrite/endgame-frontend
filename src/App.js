import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { Redirect, useHistory } from 'react-router';
import LoginForm from './components/loginForm/LoginForm';
import { fetchUserData } from './components/userProfile/API';
import UserProfile from './components/userProfile/UserProfile';
import BattlePage from './components/battlePage/BattlePage';
import githubLogo from './github-logo.png'
import './style.sass'
import HealthCheck from './components/HealthCheck/HealthCheck';
import baseUrl from './baseUrl';



function App() {

  return (
    <div>
      <HealthCheck>

<div className="githubLogoWrapper">
  <a href='https://github.com/NameICanWrite/endgame-backend'><img className="githubLogo" src={githubLogo} alt="github" /></a>
</div>
<Router>
<Route
  path='/login' exact
  render={
    () => <LoginForm />
  }
/>
<Route 
  path='/profile'
  render={
    () => <UserProfile/>
  }
/>
      <Route 
  path='/battle'
  render={
    () => <BattlePage/>
  }
/>
<Route exact 
  path='/'
  render={
    () => <Redirect to='/profile' />
  }
/>
{/* <Redirect to='/profile' /> */}
</Router>
</HealthCheck>
    </div>
    
    
  );
}

const path = baseUrl

export { path }

export default App;
