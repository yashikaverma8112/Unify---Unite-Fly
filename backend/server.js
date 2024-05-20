const express = require('express');
const cors = require('cors')
const app = express();
const path = require('path')
require('dotenv').config();
const FRONTEND_URL = process.env.FRONTEND_URL;
const bodyParser = require('body-parser');
const db = require('./db');
const cookieParser = require('cookie-parser');
const router = require("./routes");
db.connect();
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
// app.use(cors());
app.use(cors({
    origin: 'https://main--unify-where-knowledge-connects.netlify.app', // Update with your frontend URL
    credentials: true,
  }));
app.use(bodyParser.json({limit:"50mb"}))
app.use(bodyParser.urlencoded({extended:true,limit:"50mb"}))
app.use((req,res,next)=>{
    req.header("Accesss-Control-Allow-Origin","*")
    req.header("Accesss-Control-Allow-Headers","*")
    next()
})

app.use("/api", router);
const server = app.listen(process.env.PORT || 80,()=>{
    server.timeout = 30000;
    console.log("server connected to port")
})
