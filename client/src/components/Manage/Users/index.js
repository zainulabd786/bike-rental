import { memo, useState, useEffect } from 'react';
import { useGetAllUsersQuery, useUpdateUserMutation } from 'redux/services';
import { Button } from '@mui/material';
import commonSlice from 'redux/slices/common';
import { useDispatch } from 'react-redux';
import AddUser from './AddUser';
import { roles } from 'constants';

const ManageUsers = props => {
    const [usersList, setUsersList] = useState([]);
    const dispatch = useDispatch();
    const { data, error, isError, isSuccess } = useGetAllUsersQuery();
    const [updateUser, updateUserMutationResults] = useUpdateUserMutation();

    useEffect(() => {
        if(isSuccess){
            setUsersList(data?.map(user => {
                const userClone = { ...user };
                delete userClone.password;
                return {...userClone, isEditing: false};
            }))
        }
    }, [data, isSuccess])

    useEffect(() => {
        dispatch(commonSlice.actions.setLoading(updateUserMutationResults.isLoading))
        if(updateUserMutationResults.isSuccess && updateUserMutationResults.data){
            dispatch(commonSlice.actions.setMessage({ text: "User updated Successfully!", variant: "success" }));
        } else if(updateUserMutationResults.isError && updateUserMutationResults.error){
            dispatch(commonSlice.actions.setMessage({ text: updateUserMutationResults.error.message, variant: "error" }));
        }
    }, [updateUserMutationResults, dispatch]);
    
    const handleEditRow = (e, idx) => {
        const usersClone = [...usersList];
        usersClone[idx].isEditing = e;
        setUsersList(usersClone);

        if(!e){ //save data
            delete usersClone[idx].isEditing; //avoid sending isEditing to db
            updateUser(usersClone[idx]);
        }
    }

    const handleRowChange = (e, idx) => {
        const { name, value } = e.target;
        const usersClone = [...usersList];
        usersClone[idx][name] = name === 'role' ? parseInt(value) : value;
        setUsersList(usersClone);
    }

    return <div>
        {isError && <div className='text-danger'>{error.data}</div>}
        <div className='text-end' >
            <AddUser/>
        </div>
        <table className='w-100 my-3'>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Password</th>
                    <th>Actions</th>
                </tr>
                {usersList?.map(({id, name, email, isEditing, password, role}, idx) => {
                    return (
                        <tr key={id}>
                            <td>{id}</td>
                            <td><input name="name" value={name} onChange={(e) => handleRowChange(e, idx)} disabled={!isEditing} /></td>
                            <td><input name="email" value={email} onChange={(e) => handleRowChange(e, idx)} disabled={!isEditing} /></td>
                            <td>
                                <select name="role" 
                                    value={role} 
                                    onChange={(e) => handleRowChange(e, idx)} 
                                    disabled={!isEditing} 
                                >
                                    <option value={roles.user} >User</option>
                                    <option value={roles.manager} >Manager</option>
                                </select>
                            </td>
                            <td>
                                <input 
                                    type="password" 
                                    name="password" 
                                    placeholder='******'
                                    value={password} 
                                    onChange={(e) => handleRowChange(e, idx)} 
                                    disabled={!isEditing} 
                                />
                            </td>
                            <td>
                                <Button size='small' onClick={() => handleEditRow(!isEditing, idx)}>
                                    {isEditing ? "Save": "Edit"}
                                </Button>
                                <Button size='small'>Delete</Button>
                            </td>
                        </tr>
                    )
                })}
            </thead>
        </table>
    </div>
}

export default memo(ManageUsers);