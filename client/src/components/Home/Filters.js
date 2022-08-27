import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { TextField, Button } from '@mui/material';
import { useGetBikesQuery } from 'redux/services';

const Filters = props => {
    const { setBikes } = props;
    const [inputVals, setInputVals] = useState({});

    const { data, isError, error, isSuccess } = useGetBikesQuery({
        queryBy: Object.keys(inputVals).filter(i => !!inputVals[i]),
        value: Object.values(inputVals).filter(i => i !== "")
    });
    
    useEffect(() => {
        if(isSuccess && data){
            setBikes(data)
        }
    }, [data, isSuccess])

    const disabled = !!useMemo(
        () => Object.values(inputVals).some(i => i === undefined || i === "") || 
        Object.values(inputVals).length < 1, 
        [inputVals]
    );

    const handleSubmit = useCallback(e => {
        e.preventDefault();
    }, [inputVals]);

    const handleChange = e => {
        const { name, value } = e.target;
        setInputVals({ ...inputVals, [name]: value });
        
    }

    return <form onSubmit={handleSubmit} className="w-50 m-4">
        <TextField
            name="model"
            label="Model"
            size='small'
            value={inputVals.model}
            onChange={handleChange}
        />
        <TextField
            name="color"
            label="Color"
            size='small'
            value={inputVals.color}
            onChange={handleChange}
        />
        <TextField
            name="location"
            label="Location"
            size='small'
            value={inputVals.location}
            onChange={handleChange}
        />
        <select
            className='p-2'
            onChange={handleChange}
            name="rating"
            value={inputVals.rating}
        >
            <option value="">Select Rating</option>
            <option>1</option>
            <option>2</option>
            <option>3</option>
            <option>4</option>
            <option>5</option>
        </select>
        {/* <Button type='submit' disabled={disabled} >Filter</Button> */}
    </form>
}

export default memo(Filters);