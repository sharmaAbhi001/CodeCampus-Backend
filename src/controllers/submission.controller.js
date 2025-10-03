import { db } from "../libs/db.js";
const getAllSubmission = async (req,res) => {
    
    try {

        // take user Id
        const userId = req?.user?.id;
        // find all submission of user

        const submissions = await db.submission.findMany({
            where:{
               userId:userId
            }
        });

        if(!submissions){
            return res.status(200).json({
                success:false,
                message:"You have not Submitted Yet any Problem"
            })
        }

        res.status(200).json({
            success:true,
            message:"Your Submission",
            data:submissions,
        });
        
    } catch (error) {
          console.error("Fetch Submissions Error:", error);
        res.status(500).json({ error: "Failed to fetch submissions" });
    }



}


const getSubmissionByProblemId = async (req,res) => {
    
    const  {problemId} = req?.params;
    const userId = req?.user?.id;

    
   

    try {
        
        const submission = await db.submission.findMany({
            where:{
                userId,
                problemId
            },
            include:{
                testCases:true
            }
        });

        res.status(200).json({
            success:true,
            message:"submission",
            data:submission
        })


    } catch (error) {
        console.error("Fetch Submissions Error:", error);
        res.status(500).json({ error: "Failed to fetch submissions" });
    }

}

const getAllSubmissionForProblem = async (req,res) =>{

    const {problemId} = req.params;

    try {
        
        const overAllSubmissionCount = await db.submission.count({
            where:{
                problemId,
            }
        });

        res.status(200).json({
            success:true,
            message:"Number of Submission",
            data:overAllSubmissionCount
        })

    } catch (error) {
        console.error("Fetch Submissions Error:", error);
        res.status(500).json({ error: "Failed to fetch submissions" })
    }


}


export {getAllSubmission,getSubmissionByProblemId,getAllSubmissionForProblem};