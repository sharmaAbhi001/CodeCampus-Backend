
import express from 'express';

import { registerUser,loginUser,logoutUser,getUserProfile } from '../controllers/auth.controller.js';
import { validateError } from '../middleware/validateError.js';
import { validateLogin, validateSignup } from '../validate/validate.js';
import {isUserLoggedIn} from '../middleware/user.auth.js';




const authRouter = express.Router();

authRouter.get("/check",(req,res)=>{

    res.send("fine bro")

})


authRouter.post('/register',validateSignup(),validateError, registerUser);
authRouter.post('/login',validateLogin(),validateError , loginUser);  
authRouter.post('/logout',isUserLoggedIn,logoutUser);
authRouter.get('/profile',isUserLoggedIn,getUserProfile);


export default authRouter;