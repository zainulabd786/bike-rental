import { memo } from 'react';
import SignUp from 'components/SignUp';

const AddUser = props => {
    return (
        <SignUp view="horizontal" redirectPath="" />
    )
}

export default memo(AddUser)