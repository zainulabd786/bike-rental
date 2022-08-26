import { memo, useCallback } from "react";
import { useGetAllBikesQuery } from "redux/services"; 
import Card from './Card';
import { Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Home = props => {
    const useGetAllBikesQueryResults = useGetAllBikesQuery()
    const navigate = useNavigate();

    const handleBookClick = useCallback((clickedId) => {
        navigate(`/book/${clickedId}`, {
            replace: true
        })
    }, [useGetAllBikesQueryResults]);

    return <Grid container spacing={3}>
        {useGetAllBikesQueryResults.isError && 
            <div>{useGetAllBikesQueryResults.error}</div>
        }
        {
            useGetAllBikesQueryResults.data?.map(bike => {
                return (
                    <Grid item xs={3}>
                       <div className="d-flex justify-content-center w-100">
                       <Card {...bike} handleBookClick={handleBookClick} />
                       </div>
                    </Grid>
                )
            })
        }
    </Grid>
}

export default memo(Home)