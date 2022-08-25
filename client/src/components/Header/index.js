import { memo, useCallback } from "react";
import { Button } from "@mui/material";
import userSlice from 'redux/slices/user';
import { useDispatch, useSelector } from "react-redux";
import ManagerMenu from './ManagerMenu';
import { useNavigate } from "react-router-dom";

const Header = props => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { userInfo } = useSelector(state => state.user);
    
    const handleLogout = useCallback(() => {
        navigate("/login")
        localStorage.removeItem('accessToken')
        dispatch(userSlice.actions.setLoggedIn(false))
    }, [ dispatch]);

    return <div className="d-flex justify-content-between">
        <h1>Bike Rental App</h1>
        <div className="d-flex justify-content-between align-items-center">
            { userInfo?.role === 0 && <><ManagerMenu /> |</> }
            <Button >Profile</Button> |
            <Button onClick={handleLogout}>Logout</Button>
        </div>
    </div>
}

export default memo(Header)