import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { Redirect, useHistory } from 'react-router';
import LoginForm from './components/loginForm/LoginForm';
import { fetchUserData } from './components/userProfile/API';
import UserProfile from './components/userProfile/UserProfile';
import BattlePage from './components/battlePage/BattlePage';



function App() {

  return (
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
  );
}

export const path = 'http://localhost:5000'

export default App;
