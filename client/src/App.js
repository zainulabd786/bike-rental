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
import { useGetUsersQuery } from 'redux/services'
import { ROLES } from 'constants';

import PrivateRoute from './components/PrivateRoute';
import Home from 'components/Home';
import Login from 'components/Login';
import Header from 'components/Header';
import SignUp from 'components/SignUp';
import Book from 'components/Book';
import Profile from 'components/Profile';
import { Users, Bikes, Bookings } from 'components/Manage';



function App() {
  const {
    common: { loading, message },
    user: { userInfo, loggedIn },
  } = useSelector((state) => state);
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const accessToken = localStorage.getItem('accessToken');
  const { email } = accessToken ? jwt_decode(accessToken) : {};
  const userQueryResults = useGetUsersQuery({ queryBy: 'email', value: email }, { skip: !!userInfo?.email });

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
  }, [loading, message, accessToken, enqueueSnackbar, dispatch]);

  useEffect(() => {
    if (loggedIn && userQueryResults.isSuccess && !userQueryResults.isFetching && userQueryResults?.data[0]) {
      dispatch(userSlice.actions.setUserInfo(userQueryResults.data[0]))
    }
  }, [loggedIn, userQueryResults, dispatch])

  return (
    <div className="App">
      {loading && <div>Loading...</div>}

      <Router >
        {loggedIn && <Header />}
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route element={<PrivateRoute isAllowed={loggedIn} />}>
            <Route path="/" element={<Home />} />
            <Route path="/book/:id" element={<Book />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
          <Route element={<PrivateRoute redirectPath="/" isAllowed={userInfo ? userInfo.role === ROLES.manager: userInfo} />} > {/** Manager Routes */}
              <Route path="/manage/users" element={<Users/>} />
              <Route path="/manage/bikes" element={<Bikes/>} />
              <Route path="/manage/bookings" element={<Bookings/>} />
            </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
