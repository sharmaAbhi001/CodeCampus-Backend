import express from "express"
import dotenv from "dotenv"
import authRouter from "./routes/auth.routes.js"
import problemsRouter from "./routes/problems.route.js";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";



dotenv.config();
const app = express();

const PORT = process.env.PORT || 8080
app.use(express.json())
app.use(cookieParser())
app.use(bodyParser.urlencoded({extended:true}))

app.get("/",(req,res)=>{
    res.send("hello")
})

app.use("/api/v1/auth",authRouter);
app.use("/api/v1/problem",problemsRouter)


app.listen(PORT,()=>{
    console.log(`Server is running at port ${PORT}`)
})