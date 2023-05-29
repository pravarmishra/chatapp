import React from 'react'
import { ChatState } from '../../Context/Chatprovider';
import ScrollableFeed from "react-scrollable-feed";
import { Avatar, Tooltip } from '@mui/material';

const ScrollableChat = ({messages}) => {
    const { user } = ChatState();

     const isSameSenderMargin = (messages, m, i, userId) => {
        // console.log(i === messages.length - 1);
      
        if (
          i < messages.length - 1 &&
          messages[i + 1].sender._id === m.sender._id &&
          messages[i].sender._id !== userId
        )
          return 33;
        else if (
          (i < messages.length - 1 &&
            messages[i + 1].sender._id !== m.sender._id &&
            messages[i].sender._id !== userId) ||
          (i === messages.length - 1 && messages[i].sender._id !== userId)
        )
          return 0;
        else return "auto";
      };
      
       const isSameSender = (messages, m, i, userId) => {
        return (
          i < messages.length - 1 &&
          (messages[i + 1].sender._id !== m.sender._id ||
            messages[i + 1].sender._id === undefined) &&
          messages[i].sender._id !== userId
        );
      };
      
       const isLastMessage = (messages, i, userId) => {
        return (
          i === messages.length - 1 &&
          messages[messages.length - 1].sender._id !== userId &&
          messages[messages.length - 1].sender._id
        );
      };
      
       const isSameUser = (messages, m, i) => {
        return i > 0 && messages[i - 1].sender._id === m.sender._id;
      };



  return (
    <ScrollableFeed>
       {messages &&
        messages.map((m, i) => (
          <div style={{ display: "flex" }} key={m._id}>
            {(isSameSender(messages, m, i, user._id) ||
              isLastMessage(messages, i, user._id)) && (
              <Tooltip label={m.sender.name} placement="bottom-start" hasArrow>
                <Avatar
                  mt="10px"
                  
                  sx={{width: 30, height: 32,marginRight:"4px"}}
                  cursor="pointer"
                  name={m.sender.name}
                  src={m.sender.pic}
                />
              </Tooltip>
            )}
            <span
              style={{
                backgroundColor: `${
                  m.sender._id === user._id ? "white" : "white"
                }`,
                marginLeft: isSameSenderMargin(messages, m, i, user._id),
                marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
                borderRadius: "20px",
                padding: "5px 15px",
                maxWidth: "75%",
              }}
            >
              {m.content}
            </span>
          </div>
        ))}


    </ScrollableFeed>
  )
}

export default ScrollableChat