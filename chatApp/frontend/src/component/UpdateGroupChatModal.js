import { Box, Button, Modal, Stack, TextField, Tooltip, Typography } from '@mui/material'
import React, { useState } from 'react'
import { ChatState } from '../Context/Chatprovider';
import UserChip from './UserChip';
import axios from 'axios';
import UserListItem from './authentication/UserListItem';
import InfoIcon from '@mui/icons-material/Info';
const isMobile = window.innerWidth < 900;
const UpdateGroupChatModal = ({fetchAgain,setFetchAgain,fetchMessages}) => {
    const [open,setOpen]=useState(false);
    const {selectedChat,setSelectedChat,user}=ChatState()
    const [groupChatName, setGroupChatName] = useState();
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameLoading, setRenameLoading] = useState(false);
    const handleClose = () => setOpen(false);
    const handleRemove = async (user1) => {
      if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
        
        return;
      }
  
      try {
        setLoading(true);
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        const { data } = await axios.put(
          `http://localhost:5000/api/v1/chat/groupremove`,
          {
            chatId: selectedChat._id,
            userId: user1._id,
          },
          config
        );
  
        user1._id === user._id ? setSelectedChat() : setSelectedChat(data);
        setFetchAgain(!fetchAgain);
        fetchMessages();
        setLoading(false);
      } catch (error) {
       
        setLoading(false);
      }
      setGroupChatName("");
    };
  
    const handleRename=async () => {
      if (!groupChatName) return;
  
      try {
        setRenameLoading(true);
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        const { data } = await axios.put(
          `http://localhost:5000/api/v1/chat/rename`,
          {
            chatId: selectedChat._id,
            chatName: groupChatName,
          },
          config
        );
  
        console.log(data._id);
        // setSelectedChat("");
        setSelectedChat(data);
        setFetchAgain(!fetchAgain);
        setRenameLoading(false);
      } catch (error) {
        
        setRenameLoading(false);
      }
      setGroupChatName("");
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
        setSearch("")
      } catch (error) {
        console.log(error);
      }
      
    };
    const handleAddUser = async (user1) => {
      if (selectedChat.users.find((u) => u._id === user1._id)) {
        
        return;
      }
  
      if (selectedChat.groupAdmin._id !== user._id) {
        
        return;
      }
  
      try {
        setLoading(true);
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        const { data } = await axios.put(
          `http://localhost:5000/api/v1/chat/groupadd`,
          {
            chatId: selectedChat._id,
            userId: user1._id,
          },
          config
        );
  
        setSelectedChat(data);
        setFetchAgain(!fetchAgain);
        setLoading(false);
        
      } catch (error) {
        console.log(error)
        setLoading(false);
      }
      setGroupChatName("");
    };
  
  
    return (
    <div><Tooltip title="Group Info"><Button sx={{marginleft:"10%",color:"white",float:"right"}} onClick={()=>setOpen(true)}><InfoIcon/> </Button></Tooltip>
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
 marginTop:"15%",
  marginLeft:"30%",
  width: isMobile?"50%":"30%",
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: "24",
  }}> <Stack sx={{display:"flex",flexWrap:"wrap",alignItems:"center"}} id="modal-modal-description">
    
    <Typography id="modal-modal-title" variant="h6">
     {selectedChat.chatName}
    </Typography>
    
    <TextField label="Group Name" sx={{marginBottom:"8px",marginTop:"20px"}}  value={groupChatName} onChange={(e)=>setGroupChatName(e.target.value)}/>
    <Button variant='contained' onClick={handleRename} sx={{marginBottom:"8px"}}>Update</Button>
    <Box >
    {selectedChat.users.map((u)=>(
       <UserChip
       key={u._id}
       user={u}
       handleFunction={() => handleRemove(u)}
     />
    ))}

    
    </Box>
    <TextField label="Add Users" sx={{marginBottom:"4px",marginTop:"10px"}} onChange={(e)=>handleSearch(e.target.value)}/>
   
    </Stack>
    {loading ? null: searchResult.slice(0,4).map((user)=>(
        <UserListItem 
        key={user._id}
        user={user}
        handleFunction={() => handleAddUser(user)}/>
      )
        )} 
        <Button variant="contained" onClick={() => handleRemove(user)} sx={{marginTop:"5px",marginBottom:"30px"}}>
              Leave Group
            </Button>
  </Box>
</Modal>
    </div>
  )
}

export default UpdateGroupChatModal