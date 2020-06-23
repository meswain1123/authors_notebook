import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { NavLink } from "react-router-dom";
import {
  Menu, MenuItem,
  ListItem, ListItemText,
  Icon, // ListItemIcon
} from '@material-ui/core';
// import {
//   // InboxIcon,
//   // DraftsIcon,
//   // SendIcon
// } from '@material-ui/icons';

const StyledMenu = withStyles({
  paper: {
    border: '1px solid #d3d4d5',
  },
})((props) => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'center',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'center',
    }}
    {...props}
  />
));

// const StyledMenuItem = withStyles((theme) => ({
//   root: {
//     '&:focus': {
//       backgroundColor: theme.palette.primary.main,
//       '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
//         color: theme.palette.common.white,
//       },
//     },
//   },
// }))(MenuItem);

export default function UserMenu(props) {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  return (
    <span className="float-right blue whiteFont">
      <ListItem 
        aria-controls="user-menu" aria-haspopup="true"
        style={{cursor: "pointer"}} 
        onClick={handleClick} 
        className="curvedButton float-right">
        <Icon>person</Icon>
        <ListItemText primary={` ${props.username}`}/>
      </ListItem>
      <StyledMenu
        id="customized-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={_ => {setAnchorEl(null)}}
      >
        <MenuItem onClick={_ => {
          // if (props.onProfile !== undefined)
          //   props.onProfile();
          setAnchorEl(null);
        }}>
          <NavLink
            to="/User/Profile"
            // onClick={_ => {
            //   this.props.toggleMenu();
            // }}
            style={{
              color:"black"
            }}
            // className="MyButton"
            // activeClassName="active"
          >
            <ListItemText primary="Profile" />
          </NavLink>
        </MenuItem>
        <MenuItem
          style={{
            color:"black"
          }} 
          onClick={_ => {
            if (props.onLogout !== undefined)
              props.onLogout();
            setAnchorEl(null);
          }}>
          <ListItemText primary="Logout" />
        </MenuItem>
      </StyledMenu>
    </span>
  );
}
