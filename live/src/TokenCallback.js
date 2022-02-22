import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import React from 'react';
import {invalidateLoginSession, validateLoginSession} from './App.js';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { getToken } from './App';

function TokenCallback () {
  let navigate = useNavigate();
  const { token } = useParams();
  const [loading, setTokenLoading] = useState(true);
  const [validUser, setValidUser] = useState(false);
    useEffect(() => {
    console.log("Checking token after SSO...");
    //if token doesn't exist then don't do anything
    if (!token) {
      console.log("Token was not provided...");
      alert("Token is required");
      navigate("/");
      return;
    }
    //since token exists, we shall check to see if it is valid on the SSo
    axios.get(`https://35.222.21.151:9000/checkToken?token=${token}`).then(response => {
      console.log("Valid token after SSO. Setting token...");      
      //set the token inside session storage
      validateLoginSession(JSON.stringify(response.data));
      //complete loads
      setTokenLoading(false);
      setValidUser(true);
      //navigate user back to home after authentication
      if(getToken()){
      console.log("Token is set, redirecting back with stored session token.");
      return window.open("https://dev.nightoff.org","_self")
      }
    }).catch(error => {
      setTokenLoading(false);
      setValidUser(false);
      console.log("Invalid token after SSO");
      //since there was an error, assuming the token was invalid, we will invalidate the LoginSession
      invalidateLoginSession();
      //navigate user back to home after invalid authentication
      navigate("/");
    });
  }, [token]);

      if (!validUser && loading) {
        return <div>Validating credentials after SSO completion. <br></br>Please wait...</div>
      }

    return (
      <div>
  </div>
    )
  }

export default TokenCallback;