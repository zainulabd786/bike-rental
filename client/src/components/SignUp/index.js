import { memo, useCallback, useState, useEffect } from 'react';
import { TextField, Button } from '@mui/material';
import { useSignUpMutation } from 'redux/services';
import { useSelector, useDispatch } from 'react-redux';
import commonSlice from 'redux/slices/common';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';

const SignUp = props => {
    const [signUp, { data, isLoading, error, status, isError, isSuccess }] = useSignUpMutation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const [inputVals, setInputVals] = useState({
        name: "",
        email: "",
        password: "",
        role: 1
    });
    const { loggedIn } = useSelector(state => state.user);

    useEffect(() => {
        dispatch(commonSlice.actions.setLoading(isLoading));
        if (isSuccess && data) {
            dispatch(commonSlice.actions.setMessage({ text: "Account Successfully Created!", variant: 'success' }));
            navigate('/login');
        } else if (!isLoading && isError && status === "rejected") {
            dispatch(commonSlice.actions.setMessage({ text: error.data, variant: 'error' }))
        } else {
            dispatch(commonSlice.actions.setMessage({ text: "", variant: '' }))
        }
    }, [error, isLoading, data, isError, status, isSuccess, dispatch, navigate])

    const handleSubmit = useCallback((e) => {
        e.preventDefault();
        signUp(inputVals);
    }, [signUp, inputVals]);

    const handleInputChange = e => {
        const { name, value } = e.target;
        setInputVals({ ...inputVals, [name]: value })
    }

    if (loggedIn) {
        return <Navigate to={location?.state?.from || "/"} />;
    }

    return (
        <div className='d-flex justify-content-center'>
            <form onSubmit={handleSubmit} className="d-flex flex-column">
                <TextField
                    label="Name"
                    name="name"
                    value={inputVals.name}
                    onChange={e => handleInputChange(e)}
                    size="small"
                    margin='normal'

                />
                <TextField
                    label="Email"
                    name="email"
                    value={inputVals.email}
                    onChange={e => handleInputChange(e)}
                    size="small"
                    margin='normal'

                />
                <TextField
                    type="password"
                    name="password"
                    label="Password"
                    value={inputVals.password}
                    onChange={e => handleInputChange(e)}
                    size="small"
                    margin='normal'
                />
                <Button
                    type='submit'
                    size="small"
                    disabled={Object.values(inputVals).includes("")}
                >
                    Sign Up
                </Button>
            </form>
        </div>
    )
}

export default memo(SignUp)