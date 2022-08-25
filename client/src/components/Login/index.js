import { memo, useCallback, useState, useEffect } from 'react';
import { Navigate, useLocation, Link } from "react-router-dom";
import { TextField, Button } from '@mui/material'
import { useLoginMutation } from 'redux/services'
import { useSelector, useDispatch } from 'react-redux';
import commonSlice from 'redux/slices/common';
import './style.scss'

const Login = props => {
  const [login, { error, data, isLoading, status, isError, isSuccess }] = useLoginMutation();
  const [inputVals, setInputVals] = useState({
    email: "",
    password: ""
  });
  const { loggedIn } = useSelector(state => state.user);
  const location = useLocation();
  const dispatch = useDispatch();
  const handleInputChange = e => {
    const { name, value } = e.target;
    setInputVals({ ...inputVals, [name]: value });
  }

  const handleSubmit = useCallback(e => {
    e.preventDefault();
    login(inputVals)
  }, [login, inputVals])

  useEffect(() => {
    dispatch(commonSlice.actions.setLoading(isLoading));
    if (data && isSuccess) {
      localStorage.setItem("accessToken", data.accessToken)
    } else if (!isLoading && isError && status === "rejected") {
      dispatch(commonSlice.actions.setMessage({ text: "Invalid Username or Password!", variant: 'error' }))
    } else {
      dispatch(commonSlice.actions.setMessage({ text: "", variant: '' }))
    }
  }, [error, isLoading, data, isError, status, isSuccess, dispatch])

  if (loggedIn) {
    return <Navigate to={location?.state?.from} replace />;
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
        variant='outlined'
        disabled={Object.values(inputVals).includes("")}
      >
        Login
      </Button>
      <Link to="/signup">Sign up</Link>
    </form>
  </div>
}

export default memo(Login)