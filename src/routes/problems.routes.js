import express from 'express';
import {isUserLoggedIn,isAdmin} from '../middleware/user.auth.js';

import {createProblem,getAllProblem,getProblemById,updateProblemById,deleteProblemById,getSolvedProblemsByUser} from '../controllers/problems.controller.js'

const problemsRouter = express.Router();



problemsRouter.post('/create-problem',isUserLoggedIn,isAdmin,createProblem);
problemsRouter.get('/get-all-problems',isUserLoggedIn,getAllProblem)

problemsRouter.get('/get-problem/:id',isUserLoggedIn,getProblemById)

problemsRouter.put('/update-problem/:id',isUserLoggedIn,isAdmin,updateProblemById)


problemsRouter.delete("/delete-problem/:id",isUserLoggedIn,isAdmin,deleteProblemById)

problemsRouter.get('/get-solve-problems',isUserLoggedIn,getSolvedProblemsByUser)










export default problemsRouter;