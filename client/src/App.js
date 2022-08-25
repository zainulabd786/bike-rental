import React, { useEffect } from 'react';
import './App.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import { useSnackbar } from "notistack";
import { useSelector, useDispatch } from "react-redux";
import userSlice from 'redux/slices/user';
import jwt_decode from "jwt-decode";
import { useGetUserQuery } from 'redux/services'

import PrivateRoutes from './components/PrivateRoutes';
import Home from 'components/Home'
import Login from 'components/Login'
import Header from 'components/Header'


function App() {
  const {
    common: { loading, message },
    user: { loggedIn },
  } = useSelector((state) => state);
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const accessToken = localStorage.getItem('accessToken');
  const { email = "" } = accessToken ? jwt_decode(accessToken) : {};

  const userQueryResults = useGetUserQuery(email, { skip: email === "" });

  useEffect(() => {
    if (accessToken) {
      dispatch(userSlice.actions.setLoggedIn(true));
    }
    else {
      dispatch(userSlice.actions.setLoggedIn(false));
    }

    if (!loading && message.variant && message.text) {
      enqueueSnackbar(message.text, { variant: message.variant });
    }
  }, [loading, message, accessToken,  enqueueSnackbar, dispatch]);

  useEffect(() => {
    if (loggedIn && userQueryResults.data) {
      dispatch(userSlice.actions.setUserInfo(userQueryResults.data))
    }
  }, [loggedIn, userQueryResults, dispatch])

  return (
    <div className="App">
      {loading && <div>Loading...</div>}

      <Router >
        {loggedIn && <Header />}
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<PrivateRoutes loggedIn={loggedIn} />}>
            <Route element={<Home />} path="/" exact />
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
