import { memo, useState } from 'react';
import { Button, Menu, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const ManagerMenu = props => {
    const [anchorEl, setAnchorEl] = useState(null);
    const navigate = useNavigate();
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };
    const hancleMenuItemClick = (item) => {
        navigate(item);
        handleClose();
    }
  
    return (
      <div>
        <Button
          id="basic-button"
          aria-controls={open ? 'basic-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClick}
        >
          Manage
        </Button>
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            'aria-labelledby': 'basic-button',
          }}
        >
          <MenuItem onClick={() => hancleMenuItemClick('/manage/users')}>Users</MenuItem>
          <MenuItem onClick={() => hancleMenuItemClick('/manage/listings')}>Listings</MenuItem>
          <MenuItem onClick={() => hancleMenuItemClick('/manage/bookings')}>Bookings</MenuItem>
        </Menu>
      </div>
    );
}

export default memo(ManagerMenu)