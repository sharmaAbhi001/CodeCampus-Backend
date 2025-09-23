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

      console.log(submission)

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
        message: newProblem,
      });

     
  } catch (error) {
    console.log(error);
  }

  //
};

const getAllProblem = async () => {};

const getProblemById = async () => {};

const updateProblemById = async () => {};

const deleteProblemById = async () => {};

const getSolvedProblemsByUser = async () => {};

export {
  createProblem,
  getAllProblem,
  getProblemById,
  updateProblemById,
  deleteProblemById,
  getSolvedProblemsByUser,
};
