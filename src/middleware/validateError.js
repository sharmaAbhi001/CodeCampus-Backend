
import { validationResult } from "express-validator";


export const validateError = (req,res,next) =>{

  const errors = validationResult(req);

  if(errors.isEmpty())
  {
    return next();
  }

  const extractedErrors = [];

  errors.array().map((err)=> extractedErrors.push({
    [err.path]:err.msg
  }));

   return res.status(400).json({
    success: false,
    errors: extractedErrors,
  });

}