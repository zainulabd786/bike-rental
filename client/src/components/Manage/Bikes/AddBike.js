import { memo, useState, useMemo, useCallback, useEffect } from 'react';
import { TextField, Button } from '@mui/material';
import { useAddBikeMutation } from 'redux/services';
import commonSlice from 'redux/slices/common';
import { useDispatch } from 'react-redux';
import { AVAILABLE } from 'constants';

const AddBikes = props => {
    const defaultInputVals = useMemo(() => ({
        model: '',
        color: '',
        location: '',
        available: AVAILABLE.yes
    }), []);
    const dispatch = useDispatch();
    const [inputVals, setInputVals] = useState(defaultInputVals);
    const [addBike, addBikeMutationResults] = useAddBikeMutation();

    useEffect(() => {
        dispatch(commonSlice.actions.setLoading(addBikeMutationResults.isLoading))
        if (addBikeMutationResults.isSuccess && addBikeMutationResults.data) {
            dispatch(commonSlice.actions.setMessage({ text: "Bike Added Successfully!", variant: "success" }));
            setInputVals(defaultInputVals);
        } else if (addBikeMutationResults.isError && addBikeMutationResults.error) {
            dispatch(commonSlice.actions.setMessage({ text: addBikeMutationResults.error.message, variant: "error" }));
        }
    }, [addBikeMutationResults, dispatch]);

    const handleInputChange = e => {
        const { name, value } = e.target;
        setInputVals({ ...inputVals, [name]: value });
    }

    const handleSubmit = useCallback((e) => {
        e.preventDefault();
        addBike(inputVals);
    }, [addBike, inputVals]);

    return <div className='d-flex justify-content-center'>
        <form onSubmit={handleSubmit} className='d-flex w-100 justify-content-center align-items-center'
        >
            <TextField
                label="Model"
                name="model"
                value={inputVals.model}
                onChange={e => handleInputChange(e)}
                size="small"
                margin='normal'

            />
            <TextField
                label="Color"
                name="color"
                value={inputVals.color}
                onChange={e => handleInputChange(e)}
                size="small"
                margin='normal'

            />
            <TextField
                name="location"
                label="Location"
                value={inputVals.location}
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
                Add
            </Button>
        </form>
    </div>
}

export default memo(AddBikes);