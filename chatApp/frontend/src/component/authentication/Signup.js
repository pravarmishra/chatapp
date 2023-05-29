import React, { useState } from 'react';
import { Input, InputLabel, Stack, TextField,Button, Snackbar } from '@mui/material';
import { FormControl } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import axios from 'axios';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';


const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Signup = () => {
    const [show,setShow]=useState(0);
    const [name,setName]=useState();
    const [email,setEmail]=useState();
    const [password,setPassword]=useState();
    const [confirmpassword,setConfirmPassword]=useState();
    const history=useHistory()
    
    
    const submitHandler=async()=>{

    if(!name||!email||!password||!confirmpassword){
      setShow(1);
      return;
    }
    if(password !== confirmpassword){
      setShow(2);
      return;
    }
    try {
      const config={
        headers: {'Content-Type': 'application/json',},
      }
      const {data}=await axios.post("http://localhost:5000/api/v1/user",{name,email,password},config);

     localStorage.setItem("userInfo",JSON.stringify(data));
     history.push('/chats')

    }catch(error){
      console.log(error)
    }

    }


    const handleClose = (event, reason) => {
      if (reason === 'clickaway') {
        return;
      }
  
      setShow(0);
    };


  return (<div>
    <Stack spacing={2} sx={{width:"50vh",marginLeft:"140px",marginTop:"30px",padding:"20px"}}>
    <TextField label="Name" variant='outlined' onChange={(e)=>setName(e.target.value)}/>
    <TextField label="Email" variant='outlined' onChange={(e)=>setEmail(e.target.value)}/>
    <TextField type='password' label="Password" variant='outlined' onChange={(e)=>setPassword(e.target.value)}/>
    <TextField type='password' label="Confirm Password" variant='outlined' onChange={(e)=>setConfirmPassword(e.target.value)}/>
    
    <Button onClick={submitHandler}>Submit</Button>
    
</Stack>

<Snackbar open={show===1} autoHideDuration={6000} onClose={handleClose}>
<Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
          please fill all the fields
        </Alert></Snackbar>
        <Snackbar open={show===2} autoHideDuration={6000} onClose={handleClose}>
<Alert onClose={handleClose} severity="warning" sx={{ width: '100%' }}>
         Passwords do not match
        </Alert></Snackbar>
</div>
  )
}

export default Signup