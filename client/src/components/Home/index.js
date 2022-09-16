import { memo, useCallback, useEffect, useState } from "react";
import { useGetBikesQuery } from "redux/services";
import Card from './Card';
import { Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Filters from './Filters';

const Home = props => {
    const [bikes, setBikes] = useState([]);
    const useGetAllBikesQueryResults = useGetBikesQuery()
    const navigate = useNavigate();

    useEffect(() => {
        if(useGetAllBikesQueryResults.isSuccess && useGetAllBikesQueryResults.data){
            setBikes(useGetAllBikesQueryResults.data);
        }
    }, [useGetAllBikesQueryResults]);

    const handleBookClick = useCallback((clickedId) => {
        navigate(`/book/${clickedId}`, {
            replace: true
        })
    }, [useGetAllBikesQueryResults]);

    return <div>
        {useGetAllBikesQueryResults.isError && <div>{useGetAllBikesQueryResults.error}</div>}
        <div className="w-100 d-flex justify-content-center">
            <Filters setBikes={setBikes} />
        </div>
        <Grid container spacing={3}>
            {
                bikes.map(bike => {
                    return (
                        <Grid key={bike.id} item xs={3}>
                            <div className="d-flex justify-content-center w-100">
                                <Card {...bike} handleBookClick={handleBookClick} />
                            </div>
                        </Grid>
                    )
                })
            }
        </Grid>
    </div>

}

export default memo(Home)