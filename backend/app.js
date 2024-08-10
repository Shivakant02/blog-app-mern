const express = require('express')
const app = express();

const cors = require('cors')
const path=require("path")
const cookieParser = require('cookie-parser')
const multer=require('multer')



const authRoute=require('./routes/auth')
const userRoute=require('./routes/users')
const postRoute=require('./routes/posts')
const commentRoute=require('./routes/comments')
const dotenv=require('dotenv')



dotenv.config();

// Built in middlewares
app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

//Third party middleware
app.use(
    cors({
        origin: [process.env.FRONTEND_URL],
        credentials: true
    })
);




//Server status check
app.get('/hello', (_req, res) => {
    res.send('Hello world')
});

app.use("/images",express.static(path.join(__dirname,"/images")))
app.use(cors({origin:"http://localhost:5173",credentials:true}))
app.use(cookieParser())
app.use("/api/auth",authRoute)
app.use("/api/users",userRoute)
app.use("/api/posts",postRoute)
app.use("/api/comments",commentRoute)

// Default catch all route - 404
app.all('*', (_req, res) => {
  res.status(404).send('OOPS!!! 404 Page Not Found');
});


//image upload
const storage=multer.diskStorage({
    destination:(req,file,fn)=>{
        fn(null,"images")
    },
    filename:(req,file,fn)=>{
        fn(null,req.body.img)
        // fn(null,"image1.jpg")
    }
})

const upload=multer({storage:storage})
app.post("/api/upload",upload.single("file"),(req,res)=>{
    // console.log(req.body)
    res.status(200).json("Image has been uploaded successfully!")
})

module.exports = app;