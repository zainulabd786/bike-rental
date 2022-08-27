import { memo, useCallback, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useGetBookingsQuery, useGetAllBikesQuery, useUpdateBookingMutation } from "redux/services";
import { Button } from "@mui/material";
import commonSlice from 'redux/slices/common';

const Bookings = props => {
    const dispatch = useDispatch();
    const { userInfo } = useSelector(state => state.user) || {};
    const [bookings, setBookings] = useState([]);
    const getBookingsQueryResults = useGetBookingsQuery({
        queryBy: 'userId',
        value: userInfo?.id
    }, {
        skip: !userInfo?.id
    });
    const [updateBooking, updateBookingMutationResults] = useUpdateBookingMutation();
    const getAllBikesQueryResults = useGetAllBikesQuery();

    useEffect(() => {
        if (getBookingsQueryResults.isSuccess && getBookingsQueryResults.data) {
            setBookings(getBookingsQueryResults.data)
        }
    }, [getBookingsQueryResults]);

    useEffect(() => {
        dispatch(commonSlice.actions.setLoading(updateBookingMutationResults.isLoading))
        if (updateBookingMutationResults.isSuccess && updateBookingMutationResults.data) {
            dispatch(commonSlice.actions.setMessage({ text: "Booking Cancelled Successfully!", variant: "success" }));
        } else if (updateBookingMutationResults.isError && updateBookingMutationResults.error) {
            dispatch(commonSlice.actions.setMessage({ text: updateBookingMutationResults.error.message, variant: "error" }));
        }
    }, [updateBookingMutationResults, dispatch]);

    const handleCancelBooking = useCallback((idx) => {
        const bookingsClone = JSON.parse(JSON.stringify(bookings));
        bookingsClone[idx].status = 'cancelled';
        updateBooking(bookingsClone[idx]);
    }, [bookings, updateBooking])

    return <div>
        <div className="text-danger">
            {getBookingsQueryResults.isError && getBookingsQueryResults.error?.data}
        </div>
        <table className="w-100">
            <thead>
                <tr>
                    <th>Booking ID</th>
                    <th>From Date</th>
                    <th>To Date</th>
                    <th>Bike</th>
                    <th>Booking Status</th>
                    <th>Rate</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {
                    bookings.map(({ id, start, end, bikeId, status }, idx) => {
                        let from = new Date(start);
                        from = `${from.getDay()}/${from.getMonth() + 1}/${from.getFullYear()} 
                                - ${from.getHours()}:${from.getMinutes()}`
                        let to = new Date(end);
                        to = `${to.getDay()}/${to.getMonth() + 1}/${to.getFullYear()} 
                                - ${to.getHours()}:${to.getMinutes()}`
                        const bike = getAllBikesQueryResults.data?.find(({ id }) => id === bikeId);
                        return <tr key={id}>
                            <td>{id}</td>
                            <td>{from}</td>
                            <td>{to}</td>
                            <td>{bike?.model}</td>
                            <td>{status}</td>
                            <td></td>
                            <td>
                                <Button
                                    disabled={status === 'cancelled'}
                                    onClick={() => handleCancelBooking(idx)}
                                >
                                    Cancel Booking
                                </Button>
                            </td>
                        </tr>
                    })
                }
            </tbody>
        </table>
    </div>
}

export default memo(Bookings);