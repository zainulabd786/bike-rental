import { memo } from "react";
import { Grid } from "@mui/material";
import UpdateProfile from "./UpdateProfile";
import BookingsList from "./BookingsList";

const Profile = props => {

    return <Grid container>
        <Grid item xs={4}>
            <h2>Update Profile</h2>
            <UpdateProfile />
        </Grid>
        <Grid item xs={8}>
            <h2>Manage Bookings</h2>
            <BookingsList />
        </Grid>
    </Grid>
}

export default memo(Profile);