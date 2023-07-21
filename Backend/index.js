const express  =require("express"); 
const cookieParser = require("cookie-parser")
var cors = require('cors')
const {connection} = require("./config/db");
const{userRoute} =require("./routes/user.route");
const { taskRoute } = require("./routes/task.route");
const { auth } = require("./middlewares/auth");
const { projectRoute } = require("./routes/project.route");
const {UserModel}=require("./models/user.model");

const passport = require("./config/google.oauth")
const fs=require("fs")
const http = require('http');
const  socketio= require("socket.io");



const path = require("path")
let session = require("express-session");
const jwt = require("jsonwebtoken");
// const { http } = require("winston");
require ("dotenv").config();


const app = express();
app.use(express.json());
app.use(cookieParser())
app.use(cors())


const Path=path.join(__dirname,"../Frontend")
console.log(Path,"kdfjdkkk")

app.use(express.static(Path+"/public"))

console.log(Path,"dflsjkd")
const server = http.createServer(app)
app.get("/chat/frontend", async(req,res)=>{
 
   try {
     const frontendPath = path.join(__dirname, '../Frontend/chat.html');
   //  console.log(frontendPath)

     res.sendFile(frontendPath)
   } catch (error) {
     console.log(error)
   }
})

/// Socket.io  setup : used for biderctional communicataion and event-based communication

const io =   socketio(server);

var users={}

io.on("connection",(socket)=>{

  console.log(socket.id)
  socket.on("new-user-joined",(username)=>{

        users[socket.id]=username;
        console.log(users)
       socket.broadcast.emit("user-connected",username)
       io.emit("user-list",users)
  });


socket.on("message",(data)=>{
  socket.broadcast.emit("message",{user:data.user,msg:data.msg})
})

  

  socket.on("disconnect",()=>{
    socket.broadcast.emit("user-disconnected",user=users[socket.id]);
     delete users[socket.id];
     io.emit("user-list",users)

  })
     
});




app.get(
   "/auth/google",
   passport.authenticate("google", { scope: ["profile", "email"] })
 );
 
 app.get(
   "/auth/google/callback",
   passport.authenticate("google", {
     failureRedirect: "/login",
     session: false,
   }),async (req, res) => {

      console.log(req.user._id,req.user.role)
      const accessToken = jwt.sign({UserId:`${req.user._id}`,role:`${req.user.role}`},"name",{expiresIn:"3h"})
 
      const user = req.user
      
    
      const frontendURL = "http://127.0.0.1:5501/Frontend/dashboard.html"
    
      res.send(`
                  <a href="${frontendURL}?userID=${user._id}&accesstoken=${accessToken}" id="myid" style="display: flex; justify-content: center; align-items: center; height: 100vh; background-color: #222222; margin: 0; padding: 0; overflow: scroll;">
                      <img style="width:100%;" src="https://cdn.dribbble.com/users/1787505/screenshots/7300251/media/a351d9e0236c03a539181b95faced9e0.gif" alt="https://i.pinimg.com/originals/c7/e1/b7/c7e1b7b5753737039e1bdbda578132b8.gif">
                  </a>
                  <script>
                      let a = document.getElementById('myid')
                      setTimeout(()=>{
                          a.click()
                      },2000)
                      console.log(a)
                  </script>
          `)
    
    }

 );
app.get("/", (req,res) => {
    res.send("welcome to the homepage")
})


app.use("/user",userRoute)
app.use("/project",auth,projectRoute)
app.use("/task",auth,taskRoute)

app.get("/checktoken",auth,(req,res)=>{
   const token = req.body.token;
})




app.listen(process.env.port,async () =>{
   try {
    await connection;
    console.log("connected to the db")
   } catch (error) {
      console.log("could not connected to the db")
      console.log(error.message)
   }
   console.log(`server is running in the port:${process.env.port}`);
})

