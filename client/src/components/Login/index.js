import { memo, useCallback, useState, useEffect } from 'react';
import { Navigate, useLocation } from "react-router-dom";
import { TextField, Button } from '@mui/material'
import { useLoginMutation } from 'redux/services'
import { useSelector, useDispatch } from 'react-redux';
import commonSlice from 'redux/slices/common';
import './style.scss'

const Login = props => {
  const [login, { error, data, isLoading, status, isError }] = useLoginMutation();
  const [inputVals, setInputVals] = useState({
    email: "",
    password: ""
  });
  const {loggedIn} = useSelector(state => state.user);
  const location = useLocation();
  const dispatch = useDispatch();
  const handleInputChange = e => {
    const { name, value } = e.target;
    setInputVals({ ...inputVals, [name]: value });
  }

  const handleSubmit = useCallback(e => {
    e.preventDefault();
    login(inputVals)
  },[login, inputVals])

  useEffect(() => {
    dispatch(commonSlice.actions.setLoading(isLoading));
    if(data){
      localStorage.setItem("accessToken", data.accessToken)
    }
    if(!isLoading && isError && status === "rejected") {
      dispatch(commonSlice.actions.setMessage({text: "Invalid Username or Password!", variant: 'error'}))
    } else{
      dispatch(commonSlice.actions.setMessage({text: "", variant: ''}))
    }
  
  },[error, isLoading, data, isError, status, dispatch])

  if (loggedIn) {
    return <Navigate to={location?.state?.from || "/"} />;
  }

  return <div className='d-flex justify-content-center'>

    <form onSubmit={handleSubmit} className="d-flex flex-column">
      <TextField
        label="Email"
        name="email"
        value={inputVals.email}
        onChange={e => handleInputChange(e)}
        size="small"
        margin='normal'
        error={error}

      />
      <TextField
        type="password"
        name="password"
        label="Password"
        value={inputVals.password}
        onChange={e => handleInputChange(e)}
        size="small"
        margin='normal'
        error={error}
      />
      <Button
        type='submit'
        size="small"
        disabled={Object.values(inputVals).includes("")}
      >
        Login
      </Button>
    </form>
  </div>
}

export default memo(Login)