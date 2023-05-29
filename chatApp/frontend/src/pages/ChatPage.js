import React,{Component, useState} from "react";
import { Box } from "@mui/material";
import { ChatState } from "../Context/Chatprovider";
import SideDrawer from "../component/authentication/SideDrawer";
import ChatBox from "../component/ChatBox";
import MyChats from "../component/MyChats";


const ChatPage = () => {
 const {user}=ChatState();
 const [fetchAgain,setFetchAgain]=useState(false);

  
  
  return (
    <div style={{width:"100%"}}>
      {user && <SideDrawer/>}
      <Box sx={{display:"flex",justifyContent:"space-between",width:"97%",height:"91.5vh",padding:"10px"}}>
        
        {user && <MyChats fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>}
        {user && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>}
      </Box>
    </div>
  )
}

export default ChatPage