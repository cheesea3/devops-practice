import logo from './logo.svg';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Routes,
  Link
} from "react-router-dom";
import axios from 'axios';
import React, { useEffect, useState } from "react";
import PublicRoute from './publicroute';


// return the token from the session storage
export const getToken = () => {
  const token = sessionStorage.getItem('token');
  //if token exists inside sessionStorage then return it otherwise don't.
  if (token) return JSON.parse(token);
  else return null;
}

//takes data as a parameter, should be a stringified version of fetched object entailing the token from SSo
export const validateLoginSession = (data) => {
  //parse to object after it was stringified earlier
  const userDetails = JSON.parse(data);
  //set token within session storage for the user
  sessionStorage.setItem('token', JSON.stringify(userDetails['token']));
  console.log("Token set!")  
}

export const invalidateLoginSession = () => {
  const token = getToken();
  //if token doesn't exist then don't do anything
  if (!token) {
    return;
  }
  //since token exists, remove it
  sessionStorage.removeItem('token');
  console.log('Removed sso token from session storage');
}


function Home() {
  return (
    <div>You must log in to access the development environment</div>
  );
}

function AuthHome() {
  return (
    <div>Hello, you have been authenticated</div>
  );
}

function App() {

  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    //get token from session storage
  const token = getToken();

    //if token doesn't exist then don't do anything
    if (!token) {
      return;
    }
    //since token exists, we shall check to see if it is valid on the SSo
    axios.get(`http://35.222.21.151:3001/checkToken=${token}`).then(response => {
      //set the token inside session storage
      validateLoginSession(JSON.stringify(response.data));
      //complete load
      setAuthLoading(false);
    }).catch(error => {
      setAuthLoading(false);
      //since there was an error, assuming the token was invalid, we will invalidate the LoginSession
      invalidateLoginSession();
    });
  }, []);

  //if authentication is still loading and a token exists
  if (authLoading && getToken()) {
    return (
      <div>Currently Verifying Authentication</div>
    );
  }

  return (
    <Router>
        <Routes>
          {/* Basically return guest view vs authenticated view...*/}
          {!getToken() ? <Route index element={<Home />} /> : <Route index element={<AuthHome />} />}
        </Routes>
    </Router>
  );
}

export default App;
