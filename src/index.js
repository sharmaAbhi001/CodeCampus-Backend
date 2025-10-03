import express from "express"
import dotenv from "dotenv"
import authRouter from "./routes/auth.routes.js"
import problemsRouter from "./routes/problems.routes.js";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import executionRoute from "./routes/executionCode.routes.js";
import submissionRouter from "./routes/submission.routes.js";
import playListRouter from "./routes/problemPlayList.routes.js";
import cors from "cors";
import googleRouter from "./routes/googleAuth.routes.js";


dotenv.config();
const app = express();

const PORT = process.env.PORT || 8080

app.use(cors({
    origin:process.env.CLIENT_URL,
    methods:["GET","POST","PUT","DELETE"],
    credentials:true
}))


app.use(express.json())
app.use(cookieParser())
app.use(bodyParser.urlencoded({extended:true}))

app.get("/",(req,res)=>{
    res.send("hello")
})

app.use("/api/v1/auth",authRouter);
app.use("/api/v1/problem",problemsRouter);
app.use("/api/v1/execute-code",executionRoute);
app.use("/api/v1/submission",submissionRouter);
app.use("/api/v1/playlist",playListRouter);
app.use("/api/v1/google/auth",googleRouter)


app.listen(PORT,()=>{
    console.log(`Server is running at port ${PORT}`)
})