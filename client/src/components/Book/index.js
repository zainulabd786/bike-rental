import { memo, useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import {
    useGetBikeQuery,
    useGetBookingsQuery,
    useAddBookingMutation
} from 'redux/services';
import { Scheduler } from "@aldabil/react-scheduler";
import { useSelector, useDispatch } from "react-redux";
import commonSlice from 'redux/slices/common';

const Book = props => {
    const dispatch = useDispatch();
    const { id } = useParams();
    const { userInfo } = useSelector(state => state.user) || {};
    const [bookings, setBookings] = useState([]);

    const getBikeQueryResults = useGetBikeQuery(id);
    const getBookingsQueryResults = useGetBookingsQuery({ queryBy: 'bikeId', value: id });
    const [addBooking, addBookingMutationResponse] = useAddBookingMutation();

    useEffect(() => {
        dispatch(commonSlice.actions.setLoading(addBookingMutationResponse.isLoading))
        if (addBookingMutationResponse.isSuccess && addBookingMutationResponse.data) {
            dispatch(commonSlice.actions.setMessage({ text: "Booking Successful!!", variant: "success" }));
        } else if (addBookingMutationResponse.isError && addBookingMutationResponse.error) {
            dispatch(commonSlice.actions.setMessage({ text: addBookingMutationResponse.error.message, variant: "error" }));
        }
    }, [addBookingMutationResponse, dispatch]);

    useEffect(() => {
        if (getBookingsQueryResults.isSuccess && getBookingsQueryResults.data) {
            setBookings(getBookingsQueryResults.data)
        }
    }, [getBookingsQueryResults]);

    const handleCreateBooking = useCallback(async (event) => {
        const { start, end } = event
        const payload = {
            title: 'Booked',
            userId: userInfo?.id,
            bikeId: parseInt(id),
            start: new Date(start).valueOf(),
            end: new Date(end).valueOf()
        }
        await addBooking(payload);
        return event;
    }, [addBooking, userInfo, id])




    return <div>
        <div className="text-danger">
            {getBikeQueryResults.isError && getBikeQueryResults.error?.data}
            {getBookingsQueryResults.isError && getBookingsQueryResults.error?.data}
        </div>
        <div>
            <h1>
                Book {getBikeQueryResults.data?.model}
            </h1>
            {/* TODO: Disable previous Button */}
            <div className="scheculer-container">
                {/** condition to pass the latest instance of handleCreateBooking with user data*/}
                {userInfo && bookings && 
                    <Scheduler
                        view="day"
                        onConfirm={handleCreateBooking}
                        selectedDate={new Date()}
                        events={bookings.map(({ id, title, start, end }) => ({
                            event_id: id,
                            start: new Date(start),
                            end: new Date(end),
                            title,
                            disabled: true
                        }))}
                    />
                }
            </div>

        </div>

    </div>
}

export default memo(Book);