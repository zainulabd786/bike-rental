import { memo } from "react";
import { Rating } from "@mui/material";
import { useGetBikeRatingQuery } from "redux/services";

const BikeRating = ({bikeId}) => {
    const { data, isError, error } = useGetBikeRatingQuery(bikeId);
    
    return <div>
        <div className="text-danger">{isError && error.data}</div>
        <Rating value={parseFloat(data)} readOnly />
    </div>
}


export default memo(BikeRating);