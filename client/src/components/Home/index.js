import { memo } from "react";
import { useGetAllBikesQuery } from "redux/services"; 
import Card from './Card';
import { Grid } from "@mui/material";

const Home = props => {
    const useGetAllBikesQueryResults = useGetAllBikesQuery()

    return <Grid container spacing={3}>
        {useGetAllBikesQueryResults.isError && 
            <div>{useGetAllBikesQueryResults.error}</div>
        }
        {
            useGetAllBikesQueryResults.data?.map(bike => {
                return (
                    <Grid item xs={3}>
                       <div className="d-flex justify-content-center w-100">
                       <Card {...bike} />
                       </div>
                    </Grid>
                )
            })
        }
    </Grid>
}

export default memo(Home)