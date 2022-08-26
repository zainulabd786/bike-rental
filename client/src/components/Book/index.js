import { memo, useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useGetBikeQuery, useGetBookingQuery } from 'redux/services';
import { Scheduler } from "@aldabil/react-scheduler";
import { useSelector } from "react-redux";
const Book = props => {
    const { id } = useParams();
    const { user = {} } = useSelector(state => state);
    const [bookings, setBookings] = useState([]);
    const getBikeQueryResults = useGetBikeQuery(id);
    const getBookingQueryResults = useGetBookingQuery(id);

    useEffect(() => {
        if (getBookingQueryResults.isSuccess && getBookingQueryResults.data) {
            setBookings(getBookingQueryResults.data)
        }
    }, [getBookingQueryResults]);

    const weekProps = useMemo(() => ({
        weekDays: [0, 1, 2, 3, 4, 5],
        weekStartOn: 0,
        startHour: 9,
        endHour: 17,
        step: 60,
    }),[]);


    return <div>
        <div className="text-danger">
            {getBikeQueryResults.isError && getBikeQueryResults.error?.data}
            {getBookingQueryResults.isError && getBookingQueryResults.error?.data}
        </div>
        <div>
            <h1>
                Book {getBikeQueryResults.data?.model}
            </h1>
            {/* TODO: Disable previous Button */}
            <div className="scheculer-container">
                <Scheduler
                    view="week"
                    week={weekProps}
                    fields={[]}
                    events={bookings.map(({ id, title, start, end, userId }) => ({
                        event_id: id,
                        start: new Date(start),
                        end: new Date(end),
                        title,
                        disabled: true
                    }))}
                />
            </div>

        </div>

    </div>
}

export default memo(Book);