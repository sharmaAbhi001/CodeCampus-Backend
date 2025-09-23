
import { body } from "express-validator";

export const validateSignup = () =>{

    return [
        body('name')
        .trim()
        .notEmpty().withMessage("Enter your name")
        .isLength({min:3}).withMessage("username should include 3 charrecter")
        .isLength({max:13}).withMessage("username not more than 13 charecter")
        ,

        body('email')
        .trim()
        .notEmpty().withMessage("Enter email")
        .isEmail().withMessage("Enter a valid Email") ,

        body('password')
        .trim()
        .notEmpty().withMessage("Enter password")
        .isStrongPassword().withMessage("Enter strong Password")
    ]

}


export const validateLogin = () =>{

    return [        
        body('email')
        .trim()
        .notEmpty().withMessage("Enter email")
        .isEmail().withMessage("Enter a valid Email") , 

        body('password')
        .trim()
        .notEmpty().withMessage("Enter password") 
        .isStrongPassword().withMessage("Enter strong Password")       
    ]       

}