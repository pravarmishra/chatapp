const express=require('express');
const cors=require('cors');

const {chats}=require("./data/data");
const dotenv=require("dotenv");
const connectDB = require('./config/db');
const colors=require("colors");
const userRoutes=require("./routes/userRoutes")
const chatRoutes=require("./routes/chatRoutes");
const messageRoutes=require("./routes/messageRoutes");
const {errorHandler,notFound}=require("./middleware/errorMiddleware")

dotenv.config();
connectDB()
const app = express();
app.use(cors());
app.use(express.json());

app.use(cors({
    origin: '*',
    methods: 'GET, POST, PUT, DELETE', 
    allowedHeaders: 'Content-Type, Authorization', 
  }));




app.get('/', (req, res)=>{
 res.send("Api is running");
})

app.use('/api/v1/user',userRoutes);
app.use('/api/v1/chat',chatRoutes);
app.use('/api/v1/message',messageRoutes);
app.use(notFound);
app.use(errorHandler);

// app.get("/api/v1/chat",(req,res)=>{
//     res.send(chats)
// })

// app.get('/api/v1/chat/:id',(req,res)=>{
//     const singlechat=chats.find(c=>c._id==req.params.id);
//     res.send(singlechat);
// })


const PORT=process.env.PORT||5000;

const server=app.listen(PORT,console.log(`server started on ${PORT}`.yellow.bold));

const io=require('socket.io')(server,{
  pingTimout:60000,

 cors:{ origin: 'http://localhost:3000'},
})

io.on('connection', (socket) => {
  console.log('Socket.io connected'.grey.bold);
  socket.on("setup",(userData)=>{
    socket.join(userData._id);
    // console.log(userData._id);
    socket.emit("connected");
  })
  socket.on("join chat",(room)=>{
    socket.join(room);
    console.log("user joined room "+room);
  })
  socket.on("typing",(room)=>{
    socket.in(room).emit("typing")
  })

  socket.on("stop typing",(room)=>{
    socket.in(room).emit("stop typing")
  })



  socket.on("new message", (newMessageRecieved) => {
    var chat = newMessageRecieved.chat;

    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) return;

      socket.in(user._id).emit("message recieved", newMessageRecieved);
    });
  });
  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  });
})