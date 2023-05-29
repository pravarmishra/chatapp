import React from "react";
import { ChatState } from "../Context/Chatprovider";
import { Box } from "@mui/material";
import SingleChat from "./SingleChat";

const isMobile = window.innerWidth < 900;
const ChatBox = ({ fetchAgain, setFetchAgain }) => {
  const { selectedChat } = ChatState();
  // (!isMobile?(selectedChat?"flex":"none"):("flex"))
  return (
    <Box
      sx={{
        display: selectedChat ? (!isMobile ? "flex" : "flex") : (!isMobile ?"flex":"none"),
        alignItems: "center",
        flexDirection: "column",
        background: "grey",
        width: isMobile ? "100%" : "100%",
        borderRadius: "10px",
        borderWidth: "1px",
        padding: "8px",
        marginLeft: "5px",
      }}
    >
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </Box>
  );
};

export default ChatBox;
