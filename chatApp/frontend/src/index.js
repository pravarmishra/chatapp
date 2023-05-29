import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { red } from '@mui/material/colors';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import {BrowserRouter} from 'react-router-dom'
import ChatProvider from './Context/Chatprovider';

const theme = createTheme({
  palette: {
    primary: {
      main: red[500],
    },
  },
});
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  
    <BrowserRouter>
    <ChatProvider>
      <ThemeProvider theme={theme}>
    <App /></ThemeProvider></ChatProvider></BrowserRouter>
 
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals

