import express from "express";
import { googleCallback, googleLogin } from "../controllers/googleAuth.controller.js";




const googleRouter = express.Router();

googleRouter.get('/login/google',googleLogin);
googleRouter.get('/google/callback',googleCallback);


export default googleRouter;