import express from "express"
import { isUserLoggedIn } from "../middleware/user.auth.js";
import { getAllSubmission, getAllSubmissionForProblem, getSubmissionByProblemId } from "../controllers/submission.controller.js";




const submissionRouter = express.Router();


submissionRouter.get("/get-all-submission",isUserLoggedIn,getAllSubmission);
submissionRouter.get("/get-submission/:problemId",isUserLoggedIn,getSubmissionByProblemId);
submissionRouter.get("/get-submission-count/:problemId",isUserLoggedIn,getAllSubmissionForProblem)



export default submissionRouter;