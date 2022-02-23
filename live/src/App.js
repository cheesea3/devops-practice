import './App.css';
import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";
import axios from 'axios';
import React, { useEffect, useState } from "react";
import TokenCallback from './TokenCallback'

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
  console.log('Redirecting user back to the website without authenticated session..');
  return window.open("https://dev.nightoff.org","_self")
}

function openSSO(){
  return window.open("https://35.222.21.151:9000/sso","_self")
}

function Home() {
  return (
    <div>You must log in to access the development environment.
      <br>
      </br>
    <button onClick={()=> openSSO()}>Sign In</button>
    </div>
  );
}


function AuthHome() {
  return (
    <div>
      Hello, you have been authenticated
      <br></br>
      <button onClick={()=> invalidateLoginSession()}>Remove Session</button>
    </div>
  );
}

function App() {
  


  const [authLoading, setAuthLoading] = useState(true);

  //get token from session storage
  const token = getToken();

  useEffect(() => {
    //if token doesn't exist then don't do anything
    if (!token) {
      console.log("Error! No token could be found.");
      return;
    }
    //since token exists, we shall check to see if it is valid on the SSO
    console.log("Checking token through SSO...");
    axios.get(`https://35.222.21.151:9000/checkToken?token=${token}`).then(response => {
      //let us know that the stored token was authenticated.
      console.log("Token authenticated from SSO.");
      //complete load
      console.log("Loading complete.");
      setAuthLoading(false);
    }).catch(error => {
      console.log("Token could not be authenticated from SSO.");
      console.log("Loading complete.");
      setAuthLoading(false);
      //since there was an error, under the assumption that the token exists, we shall invalidate the LoginSession to remove the token.
      invalidateLoginSession();
    });
  }, [token]);

  //if authentication is still loading and a token exists
  if (authLoading && getToken()) {
    console.log("Currently loading.");
    return (
      <div>Currently Verifying Authentication. <br></br>Please wait...</div>
    );
  }

  return (
    <Router>
        <Routes>
          {/* Basically return guest view vs authenticated view...*/}
          {!getToken() ? <Route index element={<Home />} /> : <Route index element={<AuthHome />} />}
          {!getToken() ? <Route path="/token/" element={<TokenCallback />} /> : <Route path="/token/" element={<AuthHome />} />}
          <Route path="/token/:token" element={<TokenCallback />} />
        </Routes>
    </Router>
  );
}

export default App;
