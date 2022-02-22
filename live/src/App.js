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
}


function openSSO(){
  return window.open("http://35.222.21.151:3001/sso", "Popup", "toolbar=no, location=no, statusbar=no, menubar=no, scrollbars=1, resizable=0, width=580, height=600, top=30");
}
//keep a reference to the window thats opened from the sign in button to close later upon authentication
export const opened = () => openSSO();



function Home() {
  return (
    <div>You must log in to access the development environment
      <br>
      </br>
    <button onClick={()=> opened()}>Sign In</button>
    </div>
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
      console.log("Error! No token could be found.");
      return;
    }
    //since token exists, we shall check to see if it is valid on the SSO
    console.log("Checking token through SSO...");
    axios.get(`http://35.222.21.151:3001/checkToken?token=${token}`).then(response => {
      //set the token inside session storage
      console.log("Token authenticated from SSO.");
      validateLoginSession(JSON.stringify(response.data));
      //complete load
      setAuthLoading(false);
    }).catch(error => {
      console.log("Token could not be authenticated from SSO.");
      setAuthLoading(false);
      //since there was an error, assuming the token was invalid, we will invalidate the LoginSession
      invalidateLoginSession();
    });
  }, []);

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
