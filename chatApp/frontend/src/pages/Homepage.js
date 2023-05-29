import React, { useState,useEffect } from 'react';
import { Container,Box } from '@mui/material';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import styled from '@emotion/styled';
import Signup from '../component/authentication/Signup';
import Login from '../component/authentication/Login';
import { useHistory } from 'react-router-dom';



const Wrapper = styled.div`
  margin left: 10px;
  padding bottom: 10px;
`;

const Homepage = () => {

  const [value,setValue]=useState(0);
  const history=useHistory();
  useEffect(()=>{
    const userInfo=JSON.parse(localStorage.getItem('userInfo'));
  if(userInfo){
    // history.push("/chats");
  }

},[history])
  
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };



  return (
   <Container       
   disableGutters
   style={{
     height: '100vh',
     width:'100vh',
     alignItems: 'center',
     justifyContent: 'center',
   }}
>
    <Box sx={{display:"flex",padding:"3",bgcolor:"white",justifyContent:"center",width:"100vh",margin:"25px 0 15px 0",borderRadius:"15px",borderWidth:"1px",borderColor:"1px"}}>
        <h1>Sutraa</h1>
    </Box>
    <Box sx={{bgcolor:"white",width:"98vh",padding:"4",borderRadius:"15px",borderWidth:"1px",paddingLeft:"10px",margin:"40px 0 15px 0"}}>
    <Tabs value={value} onChange={handleChange} centered>
    <Tab  label="Login" sx={{alignContent:"center",padding:"2"}}/>

    <Tab label="SignUp" sx={{alignContent:"center",padding:"2"}} />
    </Tabs>   
{value===0?<Login/>:null}
{value===1?<Signup/>:null}

    </Box>
   </Container>
  )
}

export default Homepage