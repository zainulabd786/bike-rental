import { memo } from 'react';
import UsersList from './UsersList';
import AddUser from './AddUser';

const ManageUsers = props => {


    return <div>
        <div className='text-end' >
            <AddUser/>
        </div>
        <div>
            <UsersList />
        </div>
    </div>
}

export default memo(ManageUsers);