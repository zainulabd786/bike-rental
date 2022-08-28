import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { TextField, Grid, Button } from '@mui/material';
import { useGetBikesQuery, useGetBookingsQuery } from 'redux/services';

function groupArrayOfObjects(list, key) {
    return list.reduce(function (rv, x) {
        (rv[x[key]] = rv[x[key]] || []).push(x);
        return rv;
    }, {});
};

const Filters = props => {
    const { setBikes } = props;
    const [inputVals, setInputVals] = useState({});
    const [bikeQueryData, setBikeQueryData] = useState({ queryBy: [], value: [] });

    const keysToIgnoreInBikeQuery = useMemo(() => ['from', 'to', 'rating'], []);
    const getBikesQuery = useGetBikesQuery(bikeQueryData.queryBy.length < 1 ? undefined : {
        queryBy: bikeQueryData.queryBy,
        value: bikeQueryData.value
    });

    const getBookingsQuery = useGetBookingsQuery();


    useEffect(() => {
        if (getBikesQuery.isSuccess && getBikesQuery.data) {
            setBikes(getBikesQuery.data)
        }
    }, [getBikesQuery]);

    useEffect(() => {
        const inputValsClone = { ...inputVals };
        keysToIgnoreInBikeQuery.forEach(k => {
            if (inputValsClone[k]) {
                delete inputValsClone[k];
                let bikesDataGrouped = groupArrayOfObjects(getBookingsQuery.data, 'bikeId');
                Object.keys(bikesDataGrouped).forEach(key => {
                    const bikesWithRatings = bikesDataGrouped[key].filter(({ rating }) => !!rating);
                    const upcomingBookings = bikesDataGrouped[key].filter(
                        ({ start, status }) => start >= new Date().valueOf() && status === "booked"
                    );
                    bikesDataGrouped[key] = {
                        bikeId: parseInt(key),
                        rating: Math.floor(bikesWithRatings.reduce((prev, curr) => prev + curr.rating, 0) / bikesWithRatings.length),
                        bookings: upcomingBookings.map(({ start, end }) => ({ start, end }))
                    }
                });
                if (
                    getBookingsQuery.isSuccess &&
                    getBookingsQuery.data &&
                    getBikesQuery.isSuccess &&
                    getBikesQuery.data
                ) {
                    if (k === "rating") {
                        const bikeRatings = groupArrayOfObjects(Object.values(bikesDataGrouped), k);
                        const bikeIds = bikeRatings[inputVals.rating]?.map(({ bikeId }) => bikeId) || [];
                        setBikes(getBikesQuery.data?.filter(({ id }) => bikeIds.includes(id)) || [])

                    } else if (k=== "from" || k === "to") {
                        
                        if (inputVals.to && inputVals.from) { //date range should be there
                            const from = new Date(inputVals.from).setHours(0,0,0,0).valueOf();
                            const to = new Date(inputVals.to).setHours(0,0,0,0).valueOf();
                            
                            const unavailableBikesIds = Object.keys(bikesDataGrouped).filter(key => {
                                const bookings = bikesDataGrouped[key].bookings;
                                const isRangeBooked = bookings.some(({ start, end }, idx) => {
                                    start = new Date(start).setHours(0,0,0,0).valueOf();
                                    end = new Date(end).setHours(0,0,0,0).valueOf();
                                    return start >= from && end <= to;
                                });
                                return isRangeBooked;
                            }).map(bikeId => parseInt(bikeId));
                            setBikes(
                                getBikesQuery.data?.filter(
                                    ({ id }) => !unavailableBikesIds.includes(id)
                                ) || []
                            )
                        }
                    }
                }
            }

        });
        Object.keys(inputValsClone).forEach(k =>
            (!inputValsClone[k] || inputValsClone[k].length < 3) && delete inputValsClone[k]
        ); //delete empty values
        setBikeQueryData({
            queryBy: Object.keys(inputValsClone),
            value: Object.values(inputValsClone)
        });

    }, [inputVals, getBookingsQuery, getBikesQuery])

    const handleSubmit = useCallback(e => {
        e.preventDefault();
    }, [inputVals]);

    const handleChange = e => {
        const { name, value } = e.target;
        setInputVals({ ...inputVals, [name]: value });
    }

    const handleReset = useCallback(() => {
        setInputVals({});
        setBikeQueryData({ queryBy: [], value: [] });
        if(getBikesQuery.isSuccess && getBikesQuery.data) setBikes(getBikesQuery.data);
    },[getBikesQuery]);

    return <form onSubmit={handleSubmit} className="w-100 m-4">
        {getBikesQuery.isLoading && <div>Loading...</div>}
        {getBikesQuery.isError && <div className='text-danger'>{getBikesQuery.error.data}</div>}
        <Grid container >
            <Grid item xs={2}>
                <TextField
                    className='w-100'
                    name="model"
                    label="Model"
                    size='small'
                    value={inputVals.model || ""}
                    onChange={handleChange}
                />
            </Grid>
            <Grid item xs={2}>
                <TextField
                    className='w-100'
                    name="color"
                    label="Color"
                    size='small'
                    value={inputVals.color || ""}
                    onChange={handleChange}
                />
            </Grid>
            <Grid item xs={2}>
                <TextField
                    className='w-100'
                    name="location"
                    label="Location"
                    size='small'
                    value={inputVals.location || ""}
                    onChange={handleChange}
                />
            </Grid>

            <Grid item xs={2}>
                <select
                    className='p-2 w-100'
                    onChange={handleChange}
                    name="rating"
                    value={inputVals.rating || ""}
                >
                    <option value="">Select Rating</option>
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                    <option>4</option>
                    <option>5</option>
                </select>
            </Grid>
            <Grid item xs={2}>
                <div className='position-relative'>
                    <p style={{ top: '-25px' }} className='position-absolute'> Date Availibility Filters</p>
                    <div className='d-flex'>
                        <input
                            className='p-1'
                            type="date"
                            name="from"
                            onChange={handleChange}
                            value={inputVals.from || ""}
                            min={new Date().toISOString().split('T')[0]}
                        />
                        <input
                            className='p-1'
                            type="date"
                            name="to"
                            onChange={handleChange}
                            value={inputVals.to || ""}
                            min={(inputVals.from ? new Date(inputVals.from) : new Date()).toISOString().split('T')[0]}
                        />
                    </div>
                </div>
            </Grid>
            <Grid item xs={2}>
                <Button variant="outlined" onClick={handleReset}>Reset Filters</Button>
            </Grid>

        </Grid>
    </form>
}

export default memo(Filters);