import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import multer, { diskStorage } from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js"
const __filename=fileURLToPath(import.meta.url);
const __dirname=path.dirname(__filename);
import {register} from "./controllers/auth.js";
import {createPost} from "./controllers/posts.js"
import { verifyToken } from "./middleware/auth.js";
import User from "./models/User.js"
import Post from "./models/Post.js"
import {users,posts} from "./data/index.js"
dotenv.config();
const app=express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));
app.use(bodyParser.json({ limit : '30mb',extended:true}));
app.use(bodyParser.urlencoded( { extended: true,limit:'30mb'} ) ); 
app.use(cors());
app.use("/assets",express.static(path.join(__dirname,'public/assets')));
//MULTER CONFIGURATIONS
const storage=multer.diskStorage({
destination:function(req,file,cb){
    cb(null,"public/assets")
},

filename:function(req,file,cb){
    cb(null,file.originalname);
}
}); 
const upload=multer({storage});

app.post("/auth/register",upload.single("picture"),verifyToken,register);
app.post("/posts",verifyToken,upload.single("picture"),createPost)
app.use("/auth",authRoutes);
app.post("/posts",verifyToken,upload.single("picture"),createPost);


const PORT=process.env.PORT || 6001;
mongoose.connect(process.env.MONGODB_URL,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
}).then(()=>{
    app.listen(PORT,()=>console.log(`Server port : ${PORT}`));
    // User.insertMany(users);
    // Post.insertMany(posts);
}).catch((err)=> console.error(err));

