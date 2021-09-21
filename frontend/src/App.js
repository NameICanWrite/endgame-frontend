import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { Redirect, useHistory } from 'react-router';
import LoginForm from './components/loginForm/LoginForm';
import { fetchUserData } from './components/userProfile/API';
import UserProfile from './components/userProfile/UserProfile';



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
      <Redirect to='/login' />
    </Router>
  );
}

export default App;
