import express from 'express';
import mongoose from 'mongoose';
import dotenv from "dotenv";
import userRouter from "./routes/user-routes.js"
import authRouter from "./routes/auth-routes.js"
import listingRouter from "./routes/listing-routes.js";
import cookieParser from 'cookie-parser';
import path from 'path';
dotenv.config();

mongoose.connect(process.env.MONGO).then(()=>{
    console.log("connected to database");
}).catch((err) => {
    console.log(err);
}); 

const __dirname = path.resolve();

const app = express();
app.use(express.json());
app.use(cookieParser());

app.listen(5000 , ()=>{
    console.log("connected to 5000");
});

app.use("/api/user" , userRouter);
app.use("/api/auth" , authRouter);
app.use("/api/listing" , listingRouter);
app.use(express.static(path.join(__dirname , '/client/dist')));

app.get('*' , (req , res) => {
    res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});

//middlewares
app.use((err , req , res , next)=>{
    const statuscode = err.statusCode || 500;
    const message = err.message ||"Internal Server Error";
    res.status(statuscode).json({
        message ,
        statuscode ,
        success:false,
    });
})