import express from "express"
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN1 ||  process.env.CORS_ORIGIN2 ,
    credentials: true
}))
app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(cookieParser())

//importing routes
import teacherRouter from "./routes/teacher.routes.js";

app.get("/",(req, res) => {
    res.send('hello world')
  })

//route decleare
app.use("/api/v1/teacher",teacherRouter)

export {app}