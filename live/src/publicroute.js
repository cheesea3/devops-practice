import { Navigate, Route, RouteProps } from 'react-router';
import {getToken} from './App.js';


  export default function PublicRoute({...routeProps}) {
    if(!getToken()) {
        return <Route {...routeProps} />;
    } else {
      return <Navigate to={{ pathname: '/secured`' }} />;
    }
  };