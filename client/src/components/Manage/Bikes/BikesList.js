import { memo, useState, useCallback, useEffect } from 'react';
import { useGetAllBikesQuery } from 'redux/services';
import { useDispatch } from 'react-redux';
import { Button } from '@mui/material';
import { useUpdateBikeMutation, useDeleteBikeMutation } from 'redux/services';
import commonSlice from 'redux/slices/common';
import { AVAILABLE } from 'constants';

const BikesList = props => {
    const [bikesList, setBikesList] = useState([])
    const getAllBikesQueryResults = useGetAllBikesQuery();
    const [updateBike, updateBikeMutationResults] = useUpdateBikeMutation();
    const [deleteBike, deleteBikeMutationResults] = useDeleteBikeMutation();
    const dispatch = useDispatch();

    useEffect(() => {
        if (getAllBikesQueryResults.isSuccess) {
            setBikesList(getAllBikesQueryResults.data?.map(bike => {
                const bikeClone = { ...bike };
                return { ...bikeClone, isEditing: false };
            }))
        }
    }, [getAllBikesQueryResults]);

    useEffect(() => {
        dispatch(commonSlice.actions.setLoading(updateBikeMutationResults.isLoading))
        if (updateBikeMutationResults.isSuccess && updateBikeMutationResults.data) {
            dispatch(commonSlice.actions.setMessage({ text: "Bike updated Successfully!", variant: "success" }));
        } else if (updateBikeMutationResults.isError && updateBikeMutationResults.error) {
            dispatch(commonSlice.actions.setMessage({ text: updateBikeMutationResults.error.message, variant: "error" }));
        }
    }, [updateBikeMutationResults, dispatch]);

    useEffect(() => {
        dispatch(commonSlice.actions.setLoading(deleteBikeMutationResults.isLoading))
        if (deleteBikeMutationResults.isSuccess && deleteBikeMutationResults.data) {
            dispatch(commonSlice.actions.setMessage({ text: "Bike Deleted Successfully!", variant: "success" }));
        } else if (deleteBikeMutationResults.isError && deleteBikeMutationResults.error) {
            dispatch(commonSlice.actions.setMessage({ text: deleteBikeMutationResults.error.message, variant: "error" }));
        }
    }, [deleteBikeMutationResults, dispatch]);

    const handleEditRow = (e, idx) => {
        const bikesClone = [...bikesList];
        bikesClone[idx].isEditing = e;
        setBikesList(bikesClone);
        if (!e) { //save data
            delete bikesClone[idx].isEditing; //avoid sending isEditing to db
            updateBike(bikesClone[idx]);
        }
    }

    const handleRowChange = (e, idx) => {
        const { name, value } = e.target;
        const bikesClone = [...bikesList];
        bikesClone[idx][name] = name === 'available' ? parseInt(value) : value;
        setBikesList(bikesClone);
    }

    const handleDeleteBike = useCallback(idx => {
        deleteBike(bikesList[idx].id);
    }, [deleteBike, bikesList])

    return <div>
        {getAllBikesQueryResults.isError && <div className='text-danger'>{getAllBikesQueryResults.error.data}</div>}
        <table className='w-100 my-3'>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Model</th>
                    <th>Color</th>
                    <th>Location</th>
                    <th>Available</th>
                    <th>Rating</th>
                    <th>Actions</th>
                </tr>
                {bikesList?.map(({ id, model, color, location, available = false, rating, isEditing }, idx) => {
                    return (
                        <tr key={id}>
                            <td>{id}</td>
                            <td>
                                <input
                                    name="model"
                                    value={model}
                                    onChange={(e) => handleRowChange(e, idx)}
                                    disabled={!isEditing}
                                />
                            </td>
                            <td>
                                <input
                                    name="color"
                                    value={color}
                                    onChange={(e) => handleRowChange(e, idx)}
                                    disabled={!isEditing}
                                />
                            </td>
                            <td>
                                <input
                                    name="location"
                                    value={location}
                                    onChange={(e) => handleRowChange(e, idx)}
                                    disabled={!isEditing}
                                />
                            </td>

                            <td>
                                <select
                                    name="available"
                                    className='p-2'
                                    value={available}
                                    disabled={!isEditing}
                                    onChange={(e) => handleRowChange(e, idx)}
                                >
                                    <option value={AVAILABLE.yes} >Yes</option>
                                    <option value={AVAILABLE.no} >No</option>
                                </select>
                            </td>

                            <td>{rating}</td>

                            <td>
                                <Button size='small' variant={isEditing ? 'outlined' : 'text'} onClick={() => handleEditRow(!isEditing, idx)}>
                                    {isEditing ? "Save" : "Edit"}
                                </Button>
                                <Button size='small' onClick={() => handleDeleteBike(idx)}>Delete</Button>
                            </td>
                        </tr>
                    )
                })}
            </thead>
        </table>
    </div>
}

export default memo(BikesList);