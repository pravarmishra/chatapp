import React from 'react'
import { ChatState } from '../../Context/Chatprovider'
import { Box, Typography ,Avatar, Card} from '@mui/material'

const UserListItem = ({user, handleFunction }) => {
    // const {user}=ChatState()
  return (
    <> <Card onClick={handleFunction} sx={{cursor:"pointer",background:"grey",width:"70%",display:"flex",alignItems:"center",color:"white",paddingX:"8px",paddingY:"5px",marginBottom:"5px"}} >
    <Avatar src="https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg" />
    <Box sx={{marginLeft:"8px"}}><Typography variant='h6' gutterBottom>{user.name}</Typography>
    <Typography gutterBottom>
      <b>Email : </b>
      {user.email}
    </Typography></Box>
  </Card></>
  )
}

export default UserListItem