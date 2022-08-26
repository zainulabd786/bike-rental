import { memo } from 'react';
import AddBikes from './AddBike';
import BikesList from './BikesList';

const ManageBikes = props => {

    return <div >
        <div>
            <AddBikes />
        </div>
        <div>
            <BikesList />
        </div>
    </div>
}

export default memo(ManageBikes);