import { memo, useCallback, useState, useEffect, useMemo } from 'react';
import { TextField, Button } from '@mui/material';
import { useSignUpMutation } from 'redux/services';
import { useDispatch } from 'react-redux';
import commonSlice from 'redux/slices/common';
import { useNavigate } from 'react-router-dom';
import cx from 'classnames';
import { ROLES } from 'constants';


const SignUp = props => {
    const { 
        view = 'vertical',
        redirectPath = '/login'
    } = props
    const [signUp, { data, isLoading, error, status, isError, isSuccess }] = useSignUpMutation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const defaultInputVals = useMemo(() => ({
        name: "",
        email: "",
        password: "",
        role: 1
    }), [])
    const [inputVals, setInputVals] = useState(defaultInputVals);

    useEffect(() => {
        dispatch(commonSlice.actions.setLoading(isLoading));
        if (isSuccess && data) {
            dispatch(commonSlice.actions.setMessage({ 
                text: "Account Successfully Created!", 
                variant: 'success' 
            }));
            setInputVals(defaultInputVals)
            if(redirectPath) navigate(redirectPath);
        } else if (!isLoading && isError && status === "rejected") {
            dispatch(commonSlice.actions.setMessage({ text: error.data, variant: 'error' }));
        } else {
            dispatch(commonSlice.actions.setMessage({ text: "", variant: '' }))
        }
    }, [error, isLoading, data, isError, status, isSuccess, redirectPath, defaultInputVals, dispatch, navigate])

    const handleSubmit = useCallback((e) => {
        e.preventDefault();
        signUp(inputVals);
    }, [signUp, inputVals]);

    const handleInputChange = e => {
        const { name, value } = e.target;
        setInputVals({ ...inputVals, [name]: value });
    }

    const isVertical = useMemo(() => view === 'vertical', [view]);

    return (
        <div className='d-flex justify-content-center'>
            <form onSubmit={handleSubmit} 
                className={cx('d-flex', { 
                    'flex-column': isVertical, 
                    'w-100 justify-content-center align-items-center': !isVertical 
                })}
            >
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
                {
                    !isVertical && <select 
                        className='p-2 mt-1' 
                        name="role" 
                        onChange={handleInputChange}
                        value={inputVals.role}
                    >
                        <option value="">Select role</option>
                        <option value={ROLES.user}>User</option>
                        <option value={ROLES.manager}>Manager</option>
                    </select>
                }
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
                    size="large"
                    variant='outlined'
                    className='mt-1'
                    disabled={Object.values(inputVals).includes("")}
                >
                    Sign Up
                </Button>
            </form>
        </div>
    )
}

export default memo(SignUp)