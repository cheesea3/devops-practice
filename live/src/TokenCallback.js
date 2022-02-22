import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import React from 'react';
import {invalidateLoginSession, validateLoginSession} from './App.js';
import axios from 'axios';
import { useNavigate } from "react-router-dom";


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
    axios.get(`http://35.222.21.151:3001/checkToken?token=${token}`).then(response => {
      //set the token inside session storage
      validateLoginSession(JSON.stringify(response.data));
      //complete loads
      setTokenLoading(false);
      setValidUser(true);
      console.log("Valid token after SSO");
      //navigate user back to home after authentication
      navigate("/");
    }).catch(error => {
      setTokenLoading(false);
      setValidUser(false);
      console.log("Invalid token after SSO");
      //since there was an error, assuming the token was invalid, we will invalidate the LoginSession
      invalidateLoginSession();
      //navigate user back to home after invalid authentication
      navigate("/");
    });
  }, []);

      if (!validUser && loading) {
        return <div>Validating credentials after SSO completion. <br></br>Please wait...</div>
      }

    return (
      <div>
  </div>
    )
  }

export default TokenCallback;