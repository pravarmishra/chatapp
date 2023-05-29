import { Box, Button, Drawer, TextField, Tooltip,Typography } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import NotificationBadge from "react-notification-badge";
import { Effect } from "react-notification-badge";
import React, { useState } from 'react'
import { ChatState } from '../../Context/Chatprovider';
import Divider from '@mui/material/Divider';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import axios from "axios";
import {Snackbar} from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import UserListItem from './UserListItem';
import NotificationsIcon from '@mui/icons-material/Notifications';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const SideDrawer = () => {
  const [search,setSearch]=useState("");
  const [searchResult,setSearchResult]=useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [openDrawer,setOpenDrawer]=useState(false)
  const open = Boolean(anchorEl);
  const {user,setSelectedChat,chats,setChats,notification, setNotification}=ChatState();
  const history=useHistory();
  const [bar,setBar]=useState(false);
  const [loading,setLoading]=useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const[openN,setOpenN]=useState(false);

  const handleNotification=()=>{
    setOpenN(true);
  }
  

  const searchbtn=()=>{
    setOpenDrawer(true);
  }
  
  const logout=()=>{
    localStorage.removeItem("userInfo");
    history.push("/");
  }

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
    setOpenN(false);
  };
  const handleClose1= (event) => {
    setOpenDrawer(false);
  };
  const handleClose2 = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setBar(false);
  };
  const handleSearch=async()=>{
    if(!search){
      setBar(1);
      return;
    }
    try{
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(`http://localhost:5000/api/v1/user?search=${search}`, config);
      
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      setBar(2);
      console.log(error.message);
    }

  }
  const accessChat=async(userId)=>{
    try{
setLoadingChat(true);
const config = {
  headers: {
    "Content-type": "application/json",
    Authorization: `Bearer ${user.token}`,
  },
    }
    const {data}=await axios.post("http://localhost:5000/api/v1/chat",{userId},config)

    if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
  setSelectedChat(data);
  setLoadingChat(false);
  setBar(false)
  }catch(error){
   setBar(2);
  }
}
const getSender=(loggedUser,users)=>{
  return users[0]._id===loggedUser._id? users[1].name : users[0].name;
}


  return (
    <>
    <Box sx={{display:"flex",justifyContent:"space-between",alignItems:"center",background:"rgb(215, 165, 165)",width:"98.7%",padding:"5px 10px 5px 10px",borderWidth:"5px"}}>
      <Tooltip title="search" arrow>
        <Button onClick={searchbtn}><Typography variant="caption" color={"black"} display={{md:"flex" ,base:"none"}} gutterBottom>
        Search
      </Typography></Button>
      </Tooltip>
      <Typography variant="h6" color={"black"} display={{md:"flex" ,base:"none"}} fontFamily={"Work sans"} gutterBottom>
        SUTRAA
      </Typography>
      <Box>
      <IconButton  onClick={handleNotification}>
      <NotificationBadge
                count={notification.length}
                effect={Effect.SCALE}
              />
        <NotificationsIcon/>
      </IconButton>
      <Menu
        
        id="account-menu"
        open={openN}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
      >{!notification.length && "No New Messages"}
      {notification.map((notif) => (
<MenuItem key={notif._id}
                  onClick={() => {
                    setSelectedChat(notif.chat);
                    setNotification(notification.filter((n) => n !== notif));
                  }}> {notif.chat.isGroupChat
                    ? `New Message in ${notif.chat.chatName}`
                    : `New Message from ${getSender(user, notif.chat.users)}`}</MenuItem>))}
     

      </Menu>
      <IconButton
            onClick={handleClick}
            size="small"
            sx={{ ml: 2 }}
            aria-controls={open ? 'account-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
          >
            <Avatar sx={{ width: 32, height: 32 }}/>
          </IconButton>
          <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={logout}>
           Log Out
        </MenuItem>
        </Menu>

</Box>
    </Box>
    
    <Drawer anchor='left' open={openDrawer} onBackdropClick={handleClose1} sx={{width:"100%",padding:"10px 10px 10px 10px"}}
     >
      <Typography variant="h4">Search user</Typography>
         <Box sx={{display:"flex",paddingBottom:"10px"}}>
          <TextField placeholder="Search by name or email" value={search} onChange={(e)=>{setSearch(e.target.value)}} sx={{marginRight:"5px"}}/>
          <Button onClick={handleSearch}>Go</Button>
         </Box>
         {!searchResult ?null:searchResult.map((user)=>(
          <UserListItem key={user.id}
          user={user}
          handleFunction={()=>accessChat(user._id)}/>)
         )}

    </Drawer>


    <Snackbar open={bar===1} autoHideDuration={6000} onClose={handleClose2}>
<Alert onClose={handleClose2} severity="error" sx={{ width: '100%' }}>
          please enter value
        </Alert></Snackbar>

        <Snackbar open={bar===2} autoHideDuration={6000} onClose={handleClose2}>
<Alert onClose={handleClose2} severity="error" sx={{ width: '100%' }}>
         Error please check...
        </Alert></Snackbar>


        
    </>
  )
}

export default SideDrawer