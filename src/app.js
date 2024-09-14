import express from "express"
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express()

app.use(cors({
  origin: ['http://localhost:5173', 'https://batchmanagemnt.vercel.app'], // Frontend origins (localhost and Vercel)
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true, 
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