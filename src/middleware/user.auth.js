import jwt from "jsonwebtoken";
import { db } from "../libs/db.js";

const isUserLoggedIn = async (req, res, next) => {
  try {
    const token = req.cookies.token;
   

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Please login to access this resource",
      });
    }

    console.log(token)

    // verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);


    // search user in db
    const user = await db.user.findUnique({
      where: {
        id: decoded.userId,
      },
      select:{
        id:true,
        email:true,
        role:true,
      }
    });



    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found, Invalid token",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Something went wrong while verifying the user",
    });
  }
};



const  isAdmin = async(req,res,next)=>{

  try {

    const {id }= req?.user;

    if(!id){
      return res.status(403).json({
        success:false,
        message:"You are not authenticated"
      })
    }

    const user = await db.user.findUnique({
      where:{
        id:id
      },
      select:{
        role:true,
      }
    })

    if(!user){
      return res.status(404).json({
        success:false,
        message:"kuch bigad gya hai"
      })
    }

    if(user.role!=="ADMIN"){
      return res.status(403).json({
        success:false,
        message:"tum naukar ho maalik nhi"
      })
    }
    

    

    next();
  } catch (error) {
    return res.status(500).json({
      success:false,
      message:`hello${error}`
    })
  }


}

export {isUserLoggedIn,isAdmin};
