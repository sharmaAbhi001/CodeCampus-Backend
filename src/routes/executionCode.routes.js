import express from "express"
import { isUserLoggedIn } from "../middleware/user.auth.js";
import { executeCodeForRun, executeCodeForSubmit } from "../controllers/executeCode.controller.js";


const executionRoute = express.Router();



executionRoute.post("/",isUserLoggedIn,executeCodeForRun);
executionRoute.post("/submit",isUserLoggedIn,executeCodeForSubmit)






export default executionRoute