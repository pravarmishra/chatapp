import React, { useState } from 'react'
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import { Button, Chip, Stack, TextField, Typography } from '@mui/material';
import { ChatState } from '../Context/Chatprovider';
import axios from 'axios';
import UserListItem from './authentication/UserListItem';
import UserChip from './UserChip';


const isMobile = window.innerWidth < 900;
const GroupChaModal = ({}) => {
    const [open, setOpen] = useState(false);
    const [groupChatName, setGroupChatName] = useState();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tags, setTags] = useState([]);

  const { user, chats, setChats } = ChatState();
  const handleClose = () => setOpen(false);
  const handleGroup = (userToAdd) => {
    if (selectedUsers.includes(userToAdd)) {
    return;
    }

    setSelectedUsers([...selectedUsers, userToAdd]);
  };

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`http://localhost:5000/api/v1/user?search=${search}`,config);
      console.log(data);
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      console.log(error);
    }
  };


  const handleDelete = (delUser) => {
    setSelectedUsers(selectedUsers.filter((sel) => sel._id !== delUser._id));
  };

  const handleSubmit = async () => {
    if (!groupChatName || !selectedUsers) {
    
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(
        `http://localhost:5000/api/v1/chat/group`,
        {
          name: groupChatName,
          users: JSON.stringify(selectedUsers.map((u) => u._id)),
        },
        config
      );
      setChats([data, ...chats]);
      setOpen(false);
    
    } catch (error) {
      console.log(error)
    
    }
  };
  return (
    // <>{children}
    <>
    <Button
            variant="contained"
            sx={{ display: "flex", fontSize: isMobile ? "7px" : "10px" }}
            onClick={(e) => setOpen(true)}
          >
            New Group
          </Button>
    <Modal
  open={open}
  onClose={handleClose}
  aria-labelledby="modal-modal-title"
  aria-describedby="modal-modal-description"
 
>
<Box sx={{
    display:"flex",
    flexDirection: "column",
    alignItems:"center",
 marginTop:isMobile?"25%":"15%",
  marginLeft:"30%",
  width: isMobile?"50%":"30%",
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: "24",
  }}> <Stack sx={{display:"flex",flexWrap:"wrap",alignItems:"center"}} id="modal-modal-description">
    
    <Typography id="modal-modal-title" variant="h6"  >
      Create Group Chat
    </Typography>
    
      <TextField label="Chat Name" sx={{marginBottom:"8px",marginTop:"20px"}} onChange={(e)=>{setGroupChatName(e.target.value)}}  />
      <TextField label="Add Users" sx={{marginBottom:"4px"}} onChange={(e)=>handleSearch(e.target.value)}/>
      <Box>
      {selectedUsers.map((u) => (
                <UserChip
                  key={u._id}
                  user={u}
                  handleFunction={() => handleDelete(u)}
                />
              ))}
     </Box> 
        
      {loading ? null: searchResult.slice(0,4).map((user)=>(
        <UserListItem 
        key={user._id}
        user={user}
        handleFunction={() => handleGroup(user)}/>
      )
        )}


     
    
      <Button variant='contained'sx={{marginRight:"9px",marginTop:"20px",marginBottom:"10px"}} onClick={handleSubmit} >Submit</Button>
      </Stack>
  </Box>
</Modal></>
  )
}

export default GroupChaModal