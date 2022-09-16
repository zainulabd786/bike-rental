import { memo } from "react";
import { Typography } from "@mui/material";
import { useGetUsersQuery } from "redux/services";

const UserDetails = ({id}) => {
    const { data, isError, error } = useGetUsersQuery({ queryBy: 'id', value: id });
    return <div>
        <div className="text-danger">{isError && error.data}</div>
        <Typography>{data?.name}</Typography>
        <Typography>{data?.email}</Typography>
    </div>
}


export default memo(UserDetails);