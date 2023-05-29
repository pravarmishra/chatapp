import logo from './logo.svg';
import './App.css';
import { Button } from '@mui/material';
import { Route } from 'react-router-dom';
import Homepage from './pages/Homepage';
import ChatPage from './pages/ChatPage';
// import { red } from '@mui/material/colors';
// import { ThemeProvider, createTheme } from '@mui/material/styles';



function App() {
  return (
   
    <div className="App">
      <Route path="/" component={Homepage} exact/>
      <Route path="/chats" component={ChatPage}/>
    </div>
    
  );
}

export default App;
