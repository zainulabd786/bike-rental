import { memo, useCallback } from "react";
import { Button } from "@mui/material";
import userSlice from 'redux/slices/user';
import { useDispatch } from "react-redux";

const Header = props => {
    const dispatch = useDispatch();
    
    const handleLogout = useCallback(() => {
        localStorage.removeItem('accessToken')
        dispatch(userSlice.actions.setLoggedIn(false))
    }, [ dispatch]);

    return <div className="d-flex justify-content-between">
        <h1>Bike Rental App</h1>
        <div>
            <Button onClick={handleLogout}>Logout</Button>
        </div>
    </div>
}

export default memo(Header)