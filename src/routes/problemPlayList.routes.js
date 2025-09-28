import express from "express"
import { isUserLoggedIn } from "../middleware/user.auth.js";
import { addProblemsToPlayList, createPlayList, getAllPlayListDetails, getPlayListDetails, removeProblemFromPlayList } from "../controllers/problemPlayList.controller.js";
import { validateCreatePlaylist } from "../validate/validate.js";
import { validateError } from "../middleware/validateError.js";


const playListRouter = express.Router();



playListRouter.get("/",isUserLoggedIn,getAllPlayListDetails);
playListRouter.get("/:playlistId",isUserLoggedIn,getPlayListDetails);
playListRouter.post("/create-playlist",validateCreatePlaylist(),validateError,isUserLoggedIn,createPlayList);
playListRouter.post("/:playlistId/add-problem",isUserLoggedIn,addProblemsToPlayList);
playListRouter.post("/:playlistId/remove-problem",isUserLoggedIn,removeProblemFromPlayList)








export default playListRouter;