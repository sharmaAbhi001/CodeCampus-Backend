import { JwksClient } from "jwks-rsa";
import { generateNonce, generateState } from "../libs/googleAuth.js";
import axios from "axios";
import jwt from 'jsonwebtoken'
import { db } from "../libs/db.js";


// create a jwks client for google's certificate endpoinrt

const getJwksClient = () =>{
    return new JwksClient({
        jwksUri:process.env.GOOGLE_JWKS_URI,
        cache:true,
        rateLimit:true,
    })
}


// function to get the signing key for given key ID

const getSigningKey = async (kid) => {
    
    const client = getJwksClient();
    return new Promise((resolve,reject)=>{
         client.getSigningKey(kid,(err,key)=>{
            if(err){
                return reject(err)
            }
            const signingKey = key.getPublicKey();
            resolve(signingKey)
         })
    })
}




const verifyGoogleToken = async (token)=>{

    try {
        const decoded = jwt.decode(token,{complete:true});
        if(!decoded){
            throw new Error('Invalid or malformed token.');
        }

        const kid = decoded.header.kid;
        const signingKey = await getSigningKey(kid);

        // the token usign signing key 
        const verifiedToken = jwt.verify(token,signingKey,{
            algorithms:['RS256'],
            audience:process.env.GOOGLE_CLIENT_ID
        });

        return verifiedToken;

    } catch (error) {
        
        throw new Error("Faild during verify token")

    }

}





const googleLogin = async (req,res) => {

   const state = generateState();
  const nonce = generateNonce();
  console.log("state",state,"nonce",nonce)
  res.cookie("oauth_state", state, { httpOnly: true, maxAge: 600000, sameSite: "lax", secure: false });
  res.cookie("oauth_nonce", nonce, { httpOnly: true, maxAge: 600000, sameSite: "lax", secure: false });

  const  googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${process.env.GOOGLE_REDIRECT_URI}&response_type=code&scope=email%20profile%20openid&state=${state}&nonce=${nonce}`;
  res.redirect(googleAuthUrl)
    
};


// handle callbak google redirected  user , Exchange code for token

const googleCallback = async (req,res) => {
    
  try {
    // console.log("cookies",req.cookies)
      const {state,code}= req.query;
    const savedState = req.cookies.oauth_state;
    const savedNonce = req.cookies.oauth_nonce;

    // console.log("state",state,"code",code,"savedState",savedState,"savedNonce",savedNonce)

    // clear the cookie
    res.clearCookie("oauth_state");
    res.clearCookie("oauth_nonce");

    if(!state ||!savedState || state !== savedState){
        return res.status(401).json({
            success:false,
            message:"Invalid State Parameter"
        });
    }


    // Exchange code for google token 
       const tokenResponse = await axios.post(
            "https://oauth2.googleapis.com/token",
            null,
            {
                params:{
                    client_id:process.env.GOOGLE_CLIENT_ID,
                    client_secret:process.env.GOOGLE_CLIENT_SECRET,
                    redirect_uri:process.env.GOOGLE_REDIRECT_URI,
                    code,
                    grant_type: "authorization_code",
                },
            }
        );

    const {id_token,refresh_token} = tokenResponse.data;
    if(!id_token){
        return res.status(401).json({
            success:false,
            message:"ID token not found",
        });
    }

    //verify the Id token
    const decodedToken = await verifyGoogleToken(id_token);
    if(!decodedToken){
        return res.status(401).json({
            success:false,
            message:"INvalid token"
        })
    }

    // console.log("decode",decodedToken)

    // check if the nonce matches the one store in the cookie
    if(!decodedToken.nonce || decodedToken.nonce !== savedNonce){
        return res.status(401).json({
            success:false,
            message:"Invalid nonce parameter"
        })
    }


    let user = await db.user.findUnique({
        where:{
            googleId:decodedToken.sub,
        }
    });

    // console.log(user)

    if(!user){

        const emailUser = await db.user.findUnique({
            where:{
                email:decodedToken.email,
            }
        });

        if(emailUser){
            return res.status(401).json({
                success:false,
                message:"User already exists please login with credentials"
            })
        }

        user = await db.user.create({
            data:{
                googleId:decodedToken.sub,
                email:decodedToken.email,
                name:decodedToken.name,
                provider:"GOOGLE_PROVIDER"
            }
        });

    };

    const token = jwt.sign({userId:user.id},process.env.JWT_SECRET,{
        expiresIn:'7d',
    })

    const cookiesOptions = {
        expires: new Date(Date.now() + 7 *24*60*60*1000),
        httpOnly:true,
        sameSite:"lax",
        secure:false
    }
    res.cookie("token",token,cookiesOptions);


res.redirect(process.env.CLIENT_SIDE_URL);

// res.send(`
// <html>
//   <body>
//     <script>
//       // 1️⃣ Try normal close
//       try {
//         if (window.opener) {
//           window.opener.location.reload(); // main window refresh
//           window.close();
//         }
//       } catch(e) {}

//       // 2️⃣ Safari/Chrome fallback
//       setTimeout(() => {
//         if (window.opener) {
//           window.opener.location.href = "/"; // force redirect parent
//         }
//         // force self close
//         window.open('', '_self', ''); 
//         window.close();
//       }, 100);

//     </script>
//     <p>Login successful! Closing popup...</p>
//   </body>
// </html>
// `);



    
  } catch (error) {
    console.log(error)
    res.status(500).json({
        success:false,
        message:"internal server error" 
    })
  }



}


export {googleLogin,googleCallback}


