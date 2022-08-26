import { memo, useState, useEffect, useMemo, useCallback } from "react";
import { useParams } from "react-router-dom";
import {
    useGetBikeQuery, 
    useGetBookingQuery,
    useAddBookingMutation
} from 'redux/services';
import { useSelector } from "react-redux";
const Book = props => {
    const { id } = useParams();
    const { user = {} } = useSelector(state => state);
    const [bookings, setBookings] = useState([]);

    const getBikeQueryResults = useGetBikeQuery(id);
    const getBookingQueryResults = useGetBookingQuery(id);
    const [addBooking, addBookingMutationResponse] = useAddBookingMutation();

    useEffect(() => {
        if (getBookingQueryResults.isSuccess && getBookingQueryResults.data) {
            setBookings(getBookingQueryResults.data)
        }
    }, [getBookingQueryResults]);

    const handleCreateBooking = useCallback(async (event) => {
        const { start, end } = event
        await addBooking({
            title: 'Booked',
            userId: user.userInfo?.id,
            bikeId: id,
            start,
            end
        });
        return event;
    }, [addBooking])

    


    return <div>
        <div className="text-danger">
            {getBikeQueryResults.isError && getBikeQueryResults.error?.data}
            {getBookingQueryResults.isError && getBookingQueryResults.error?.data}
        </div>
        <div>
            <h1>
                Book {getBikeQueryResults.data?.model}
            </h1>
            <div className="scheculer-container">
                
            </div>

        </div>

    </div>
}

export default memo(Book);