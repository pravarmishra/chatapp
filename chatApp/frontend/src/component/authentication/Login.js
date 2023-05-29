import React, { useState } from 'react'
import { Stack,TextField,Button } from '@mui/material'
import MuiAlert from '@mui/material/Alert';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import {Snackbar} from '@mui/material';


const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Login = () => {


    const [email,setEmail]=useState();
    const [password,setPassword]=useState();
    const [show,setShow]=useState();
    const [loading,setLoading]=useState(false);
    const history = useHistory();
   const submitHandler=async()=>{ if(!email||!password){
    setShow(1);
    return;
  }
  
  try {
    const config={
      headers: {'Content-Type': 'application/json',},
    }
    const {data}=await axios.post("http://localhost:5000/api/v1/user/login",{email,password},config);
    setShow(2)

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
    <TextField label="Email" variant='outlined' onChange={(e)=>setEmail(e.target.value)}/>
    <TextField type='password' label="Password" variant='outlined' onChange={(e)=>setPassword(e.target.value)}/>
    <Button onClick={submitHandler} >Login</Button>
    </Stack><Snackbar open={show===1} autoHideDuration={6000} onClose={handleClose}>
<Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
          please fill all the fields
        </Alert></Snackbar>

        <Snackbar open={show===2} autoHideDuration={6000} onClose={handleClose}>
<Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
         Logging IN....
        </Alert></Snackbar>
    </div>
  )
}

export default Login