import { db } from "../libs/db.js";
import {
  getJudge0LanguageId,
  submitBatch,
  pollBatchResult,
} from "../libs/judge0.lib.js";



const createProblem = async (req, res) => {
  //going to get all the data from user from the reauest.body
  const {
    title,
    description,
    difficulty,
    testCases,
    tags,
    examples,
    constraints,
    codeSnippets,
    referenceSolution,
  } = req.body;


  if (req.user.role !== "ADMIN") {
    return res.status(403).json({
      success: false,
      message: "Only admin can create problem",
    });
  }
  try {
    for (const [language, solutionCode] of Object.entries(referenceSolution)) {
      const languageId = getJudge0LanguageId(language);

      if (!languageId) {
        return res.status(400).json({
          success: false,
          message: `Langauge ${language} is not supported`,
        });
      }

      const submission = testCases.map(({ input, output }) => ({
        source_code:solutionCode,
        language_id: languageId,
        stdin: input,
        expected_output: output,
        redirect_stderr_to_stdout: true

      }));

     

      const submissionResult = await submitBatch(submission);

      console.log(submissionResult.map((s)=>console.log(s)));


      const tokens = submissionResult.map((res) => res.token);


      const results = await pollBatchResult(tokens);


      for (let i = 0; i < results.length; i++) {
        const result = results[i];

        if (result.status.id !== 3) {
          return res.status(400).json({
            success: false,
            message: `Testcase ${i + 1} failed for language ${language}`,
          });
        }
      }
    }

     // save the problem to database

      const newProblem = await db.problem.create({
        data: {
          title,
          description,
          difficulty,
          testCases,
          tags,
          examples,
          constraints,
          codeSnippets,
          referenceSolution,
          userId: req?.user?.id,
        },
      });

      return res.status(201).json({
        success: true,
        message:"problem created",
        data:newProblem
      });

     
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success:false,
      message:"Error while creating"
    })
  }

  //
};

const getAllProblem = async (req,res) =>{

  try {

    const problems = await db.problem.findMany({
      include:{
        solvedBy:{
          where:{
            userId:req?.user?.id
          }
        }
      }
    });

    if(!problems){
      return res.status(404).json({
        success:false,
        message:"kuch nahi mila "
      })
    }

    res.status(200).json({
      success:true,
      message:"Probmen fetched successfully",
      data:problems
    })



    
  } catch (error) {
     return res.status(500).json({
      success:false,
      message:"Error while Fetching Problem",
    })
  }

};

const getProblemById = async (req,res) => {

  try {

    const {id} = req?.params;

  const problem = await db.problem.findUnique({
    where:{
      id:id
    }
  });

  if(!problem){
    return res.status(404).json({
      success:false,
      message:"problem id sahi nhi hai"
    })
  }

  res.status(200).json({
    success:true,
    message:"your Problem",
    data:problem
  })
    
  } catch (error) {
    return res.status(500).json({
      success:false,
      message:"Error while Fetching ProblemById ",
    })
  }

};

const updateProblemById = async (req,res) => {
  const {
    title,
    description,
    difficulty,
    testCases,
    tags,
    examples,
    constraints,
    codeSnippets,
    referenceSolution,
  } = req.body;
  const {id} = req?.params;

  // find karenge ki jo problem ham update kar rhe hai wo hai ki nhi 

  try {
    
    const problemToUpdate = await db.problem.findUnique({
      where:{
        id:id
      }
    })

    if(!problemToUpdate){
      return res.status(404).json({
        success:false,
        message:"Problem Id is not exist"
      })
    }

    // ab create wala pura kaam phir se 

    for (const [language,solutionCode] of Object.entries(referenceSolution)){

      // get languageId
      const languageId = getJudge0LanguageId(language);

      

      // batch bnayenge testcase submisition ka 

      const submission = testCases.map(({input,output})=>({
        source_code:solutionCode,
        language_id: languageId,
        stdin: input,
        expected_output: output,
        redirect_stderr_to_stdout: true
        
      }))

      // send submission to batch to get token 

      const submissionResult = await submitBatch(submission);

      const tokens = submissionResult.map((res) => res.token);


      const results = await pollBatchResult(tokens);

      for (let i = 0; i < results.length; i++) {
        const result = results[i];

        if (result.status.id !== 3) {
          return res.status(400).json({
            success: false,
            message: `Testcase ${i + 1} failed for language ${language}`,
          });
        }
      }

    }

     const updatedProblem = await db.problem.update({
      where:{
        id:id
      },
         data: {
        // Pass the destructured body fields directly to the data object
        // Prisma will automatically update only the fields that are defined (not undefined)
        title,
        description,
        difficulty,
        testCases,
        tags,
        examples,
        constraints,
        codeSnippets,
        referenceSolution,
      },
     })

     if(!updatedProblem){
      return res.status(500).json({
        success:false,
        message:"error during updation "
      })
     }

     res.status(201).json({
      success:false,
      message:"Problem updated Successfully",
      data:updatedProblem
     })

  } catch (error) {
     return res.status(500).json({
      success:false,
      message:"Error while Fetching ProblemById ",
    })
  }

};

const deleteProblemById = async (req,res) => {

  const {id} = req.params;

 try {
  const problem = await db.problem.findUnique({where:{id:id}})
  
  if(!problem){
    return res.status(404).json({
      success:false,
      message:"problem not found"
    })
  }

  await db.problem.delete({where:{id:id}})

  res.status(200).json({
    success:true,
    message:"Problem Deleted Successfully"
  })

 } catch (error) {
   return res.status(500).json({
      success:false,
      message:"Error while Fetching ProblemById ",
    })
 }

};

const getSolvedProblemsByUser = async (req,res) => {

};

export {
  createProblem,
  getAllProblem,
  getProblemById,
  updateProblemById,
  deleteProblemById,
  getSolvedProblemsByUser,
};
