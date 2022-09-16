import { memo, useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { TextField, Button } from "@mui/material";
import { useUpdateUserMutation } from 'redux/services';
import commonSlice from 'redux/slices/common';

const Profile = props => {
    const dispatch = useDispatch();
    const { userInfo } = useSelector(state => state.user);
    const [updateUser, updateUserMutationResults] = useUpdateUserMutation();
    const [inputVals, setInputVals] = useState({
        name: '',
        email: '',
        password: ''
    });
    useEffect(() => {
        setInputVals({ ...inputVals, ...userInfo })
    }, [userInfo, setInputVals]);

    useEffect(() => {
        dispatch(commonSlice.actions.setLoading(updateUserMutationResults.isLoading))
        if (updateUserMutationResults.isSuccess && updateUserMutationResults.data) {
            dispatch(commonSlice.actions.setMessage({ text: "User updated Successfully!", variant: "success" }));
        } else if (updateUserMutationResults.isError && updateUserMutationResults.error) {
            dispatch(commonSlice.actions.setMessage({ text: updateUserMutationResults.error.message, variant: "error" }));
        }
    }, [updateUserMutationResults, dispatch]);

    const handleInputChange = e => {
        const { name, value } = e.target;
        setInputVals({ ...inputVals, [name]: value });
    }

    const handleSubmit = useCallback((e) => {
        e.preventDefault();
        updateUser(inputVals);
    }, [updateUser, inputVals]);

    return <form onSubmit={handleSubmit} className="d-flex flex-column">
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
            size="large"
            variant='outlined'
            className='mt-1'
            disabled={Object.values(inputVals).includes("")}
        >
            Update
        </Button>
    </form>
}

export default memo(Profile);