import express from "express";
import router from "./routes/approutes.js";
import notfound from "./middleware/notfound.js";
import errorHandler from "./middleware/errorhandler.js";
import session from "express-session";
import dotenv from "dotenv";
import cors from 'cors';
dotenv.config();
const web= express();
web.use(session({
    secret:process.env.SECRETKEY,
    resave:false,
    saveUninitialized:false,
    cookie:{
        maxAge:1000*60*60
    }
}));
web.use(express.json());
web.use(cors({
    origin: 'http://localhost:8080', 
    credentials: true 
}));
web.use('/',router);
web.use(notfound);
web.use(errorHandler);
const portnumber=process.env.PORT||3000;
web.listen(portnumber,"0.0.0.0",()=>console.log(`Server is running on port ${portnumber}`));
