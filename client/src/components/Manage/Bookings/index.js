import { memo } from 'react';
import { BookingsList } from "components/Shared";



const ManageBookings = props => {
    return <BookingsList disableRate={true} getAll={true} />
}

export default memo(ManageBookings);