import React, { useState, useEffect } from "react";
import { ChatState } from "../Context/Chatprovider";
import axios from "axios";
import { Box, Button, Card, Stack, Typography } from "@mui/material";
import GroupChaModal from "./GroupChaModal";
import { Text } from "@chakra-ui/layout";

const isMobile = window.innerWidth < 900;

const MyChats = ({ fetchAgain }) => {
  const [loggedUser, setloggedUser] = useState();
  const { selectedChat, user, setSelectedChat, chats, setChats } = ChatState();
  const [modal, setModal] = useState(false);

  const fetchChats = async () => {
    // console.log(user._id);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(
        "http://localhost:5000/api/v1/chat",
        config
      );
      console.log(data);
      setChats(data);
    } catch (error) {
      console.log(error.message);
    }
  };
  useEffect(() => {
    setloggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
    // eslint-disable-next-line
  }, [fetchAgain]);

  const getSender = (loggedUser, users) => {
    return users[0]._id === loggedUser._id ? users[1].name : users[0].name;
  };

  return (
    <>
      <Box
        sx={{
          display: selectedChat ? (isMobile ? "none" : "flex") : "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "8px",
          background: "grey",
          width: isMobile?"100%": "31%",
          borderRadius: "5px",
          borderWidth: "1px",
        }}
      >
        <Box
          sx={{
            paddingBottom: "10px",
            paddingX: "10px",
            fontFamily: "Work sans",
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            width: "100%",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h5" sx={{ color: "white" }}>
            Chat
          </Typography>
          {/* <Button
            variant="contained"
            sx={{ display: "flex", fontSize: isMobile ? "7px" : "10px" }}
            onClick={(e) => setModal(true)}
          >
            New Group
          </Button> */}
          <GroupChaModal/> 
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            padding: "10px",
            width: "100%",
            hieght: "100%",
            borderRadius: "10px",
            overflowY:"scroll"
          }}
        >
          {chats ? (
            <Stack >
              {chats.map((chat) => (
                <Card
                  key={chat._id}
                  onClick={() => setSelectedChat(chat)}
                  sx={{
                    justifyContent: "center",
                    alignItems: "center",
                    marginBottom: "5px",
                    paddingX: "12px",
                    paddingY: "12px",
                    borderRadius: "5px",
                    color: selectedChat === chat ? "white" : "black",
                    cursor: "pointer",
                    background:
                      selectedChat === chat ? "rgb(56, 178, 172)" : "white",
                  }}
                >
                  <Typography>
                    {!chat.isGroupChat
                      ? getSender(loggedUser, chat.users)
                      : chat.chatName}
                  </Typography>
                  {chat.latestMessage && (
                    <Text fontSize="sm">
                      <b>{chat.latestMessage.sender.name} : </b>
                      {chat.latestMessage.content.length > 50
                        ? chat.latestMessage.content.substring(0, 51) + "..."
                        : chat.latestMessage.content}
                    </Text>
                  )}
                </Card>
              ))}
            </Stack>
          ) : null}
        </Box>
      </Box>
      
    </>
  );
};

export default MyChats;
