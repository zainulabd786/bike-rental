import { memo, useCallback } from "react";
import { Button, Grid } from "@mui/material";
import userSlice from 'redux/slices/user';
import { useDispatch, useSelector } from "react-redux";
import ManagerMenu from './ManagerMenu';
import UserMenu from './UserMenu';
import { useNavigate, Link } from "react-router-dom";
import { ROLES } from "constants";

const Header = props => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { userInfo } = useSelector(state => state.user);

    const handleLogout = useCallback(() => {
        localStorage.removeItem('accessToken')
        dispatch(userSlice.actions.setLoggedIn(undefined))
        dispatch(userSlice.actions.setUserInfo(undefined))
        navigate("/login")
    }, [dispatch]);

    return <div className="border-bottom">
        <Grid container>
            <Grid item xs={4}>
                <h1 className="mx-2">Bike Rental</h1>
            </Grid>
            <Grid item xs={4}>
                <div className="text-center">
                    <UserMenu />
                </div>
            </Grid>
            <Grid item xs={2}></Grid>
            <Grid item xs={2}>
                <div className="d-flex justify-content-between align-items-center">
                    {userInfo?.role === ROLES.manager && <><ManagerMenu /> |</>}
                    <Link className="mx-1" to={`/profile/`} >Profile</Link> |
                    <Button className="mx-1" onClick={handleLogout}>Logout</Button>
                </div>
                <p className="text-end p-1">Welcome {userInfo?.name}</p>
            </Grid>
        </Grid>
    </div>
}

export default memo(Header)