import React, { useEffect, useState } from "react";
import { ChatState } from "../Context/Chatprovider";
import { Box, Button, TextField, Typography } from "@mui/material";
import UpdateGroupChatModal from "./UpdateGroupChatModal";
import axios from "axios";
import ".././App.css";
import ScrollableChat from "./authentication/ScrollableChat";
import io from "socket.io-client";


const isMobile = window.innerWidth < 900;
const ENDPOINT="http://localhost:5000";
var socket,selectedChatCompare;
const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const { user, selectedChat, setSelectedChat,notification, setNotification } = ChatState();
  const [messages,setMessages]=useState([]);
  const [loading,setLoading]=useState(false);
  const [newMessage,setNewMessage]=useState();
  const [socketConnected,setSocketConnected]=useState(false);
  const [typing, setTyping] = useState(false);
  const [istyping, setIsTyping] = useState(false);
 

useEffect(()=>{
  socket=io(ENDPOINT);
  socket.emit("setup",user);
  socket.on("connected",()=>setSocketConnected(true));
  socket.on("typing", () => setIsTyping(true));
  socket.on("stop typing", () => setIsTyping(false));
},[])

const typingHandler=(e)=>{
  setNewMessage(e.target.value);
  if (!socketConnected) return;

  if (!typing) {
    setTyping(true);
    socket.emit("typing", selectedChat._id);
  }
  let lastTypingTime = new Date().getTime();
  var timerLength = 3000;
  setTimeout(() => {
    var timeNow = new Date().getTime();
    var timeDiff = timeNow - lastTypingTime;
    if (timeDiff >= timerLength && typing) {
      socket.emit("stop typing", selectedChat._id);
      setTyping(false);
    }
  }, timerLength);
}




  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      setLoading(true);

      const { data } = await axios.get(
        `http://localhost:5000/api/v1/message/${selectedChat._id}`,
        config
      );
      console.log(messages);
      setMessages(data);
      setLoading(false);
      socket.emit("join chat",selectedChat._id);
    }
    catch(err){
      console.log(err);
    }
    }

  useEffect(()=>{
    fetchMessages();
    selectedChatCompare=selectedChat;
  },[selectedChat]);
  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => {
      if (
        !selectedChatCompare || // if chat is not selected or doesn't match current chat
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) { if (!notification.includes(newMessageRecieved)) {
        setNotification([newMessageRecieved, ...notification]);
        setFetchAgain(!fetchAgain);
      }
        
      } else {
        setMessages([...messages, newMessageRecieved]);
      }
    });
  });
console.log(notification,"--------------------");
  const sendMessage=async(event)=>{
   if(event.key==="Enter" && newMessage){
    socket.emit("stop typing", selectedChat._id);
    try{
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      setNewMessage("");
      const { data } = await axios.post(
        "http://localhost:5000/api/v1/message",
        {
          content: newMessage,
          chatId: selectedChat._id,
        },
        config
      );
      console.log(data);
      socket.emit("new message", data);
    
     setMessages([...messages,data]);
    }
catch(err){
  console.log(err);
}
   }

  }

  const getSender = (loggedUser, users) => {
    return users[0]._id === loggedUser._id ? users[1].name : users[0].name;
  };

  return (
    <>
      {selectedChat ? (
        <>
          <Typography
            sx={{
              alignItems: "center",
              justifyContent: isMobile ? "space-between" : "none",
              display: "flex",
              width: "100%",
              paddingX: "8px",
              paddingBottom: "15px",
            }}
            variant={isMobile ? "h4" : "h3"}
          >
            <Button
              sx={{ display: isMobile ? "flex" : "none" }}
              onClick={() => setSelectedChat("")}
            >
              Back
            </Button>
            {!selectedChat.isGroupChat ? (
              <><Typography variant="h3" sx={{color:"white"}}>{getSender(user, selectedChat.users)}</Typography></>
            ) : (
              <>
                <Typography variant="h4" sx={{color:"white"}}>{selectedChat.chatName.toUpperCase()}</Typography>
                <UpdateGroupChatModal
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                  fetchMessages={fetchMessages}
                />
              </>
            )}
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              padding: "9px",
              background: "grey",
              width: "99.6%",
              height: "88%",
              borderRadius: "20px",
            }}
          >
          {loading?(<>Loading</>):(<div className="messages"><ScrollableChat messages={messages}/> </div>)}
          {istyping ? (
                <div>
                  typing...
                </div>
              ) : (
                <></>
              )}
          <TextField onKeyDown={sendMessage} sx={{background:"white",marginTop:"30px"}}  placeholder="Enter message" onChange={typingHandler} value={newMessage}/>

          </Box>
        </>
      ) : (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
          }}
        >
          <Typography
            variant="h2"
            fontFamily={"Work sans"}
            sx={{ paddingBottom: "20px" }}
          >
            Click on a Chat to start
          </Typography>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
