import express from "express"
import authRouter from "./routes/auth.route.js";
import messageRouter from "./routes/message.route.js";
import dotenv from "dotenv"
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser"
import cors from "cors"
import { app, server } from "./lib/socket.js";

import path from "path"


dotenv.config();
// ----- ##### -----

// const app = express(); // delete this app that we have 
// already created in socket.js file

// import app from socket.js file

const PORT = process.env.PORT
const __dirname = path.resolve();

// Middleware
app.use(express.json({limit: '50mb'})); // allow to extract the json data out of the file
// you need to extent the limit of file upload if not using multer 
app.use(cookieParser()) // allow to parser the cookies
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}))



// Routes
app.use("/api/auth",authRouter);
app.use("/api/messages",messageRouter);


if(process.env.NODE_ENV === "production"){
  app.use(express.static(path.join(__dirname,"../frontend/dist")));

  app.get("*",(req,res) => {
    console.log("Fallback route triggered for:", req.url);
    res.sendFile(path.join(__dirname,"../frontend","dist","index.html"));
  })
}

// ----- ##### -----
// replace the app with server that we have created in socket.js file

server.listen(PORT,() => {
  console.log(`Server is running on PORT ${PORT}`);
  
  connectDB();
})
