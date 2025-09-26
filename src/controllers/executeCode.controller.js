import { db } from "../libs/db.js";
import { pollBatchResult, submitBatch ,getLanguageName} from "../libs/judge0.lib.js";



const executeCodeForRun = async (req,res)=>{

   try {
    
     const {source_code,language_id,stdin,expected_outputs,} = req.body;

    const userId = req.user.id;

    // validate test cases
    if(!Array.isArray(stdin) ||
    stdin.length ===0 ||
    !Array.isArray(expected_outputs) ||
    expected_outputs.length !== stdin.length
    ){
        return res.status(400).json({
            success:false,
            message:"Invalid or Missing Test cases"
        });
    }


    //2. prepare submission

    const submissions = stdin.map((input)=>({
        source_code,
        language_id,
        stdin:input,

    }))


    //3. send batch of ubmission to judge0

    const submitResponse = await submitBatch(submissions)

    const tokens = submitResponse.map((res)=> res.token);


    // 4. poll judge
    const results = await pollBatchResult(tokens);

    console.log("Result>>>>>>>>>");
   

    // Analyze test case result

    let allPassed = true;


    const detailedResults = results.map((result,i)=>{
     const stdout = result.stdout?.trim();
     const expected_output = expected_outputs[i]?.trim();
     const passed = stdout === expected_output;
     const input = stdin[i]?.trim();
     // 

    //  console.log(`testcase #${i+1}`);
    //  console.log(`Input ${stdin[i]}`);
    //  console.log(`actual stdout ${stdout}`);
    //  console.log(`expected out put ${expected_output}`)
    //  console.log(`Matched ${passed} `)

    if(!passed) allPassed =false;

    return {
        tastCase:i+1,
        passed,
        stdout,
        expected_output,
        input
    }

    })

    if(!allPassed){
        return res.status(422).json({
            success:false,
            message:"Test case failed: Output did not match expected result",
            data:detailedResults
        })
    }


    res.status(200).json({
       success:true,
       message:"All accepted",
       data:detailedResults
    })


   } catch (error) {

    console.log(error)
    
   }

}

const executeCodeForSubmit = async (req,res) => {
     try {
    
     const {source_code,language_id,stdin,expected_outputs,problemId} = req.body;

    const userId = req?.user?.id;

    // validate test cases
    if(!Array.isArray(stdin) ||
    stdin.length ===0 ||
    !Array.isArray(expected_outputs) ||
    expected_outputs.length !== stdin.length
    ){
        return res.status(400).json({
            success:false,
            message:"Invalid or Missing Test cases"
        });
    }


    //2. prepare submission

    const submissions = stdin.map((input)=>({
        source_code,
        language_id,
        stdin:input,

    }))


    //3. send batch of ubmission to judge0

    const submitResponse = await submitBatch(submissions)

    const tokens = submitResponse.map((res)=> res.token);


    // 4. poll judge
    const results = await pollBatchResult(tokens);

    console.log("Result>>>>>>>>>");
   

    // Analyze test case result

    let allPassed = true;


    const detailedResults = results.map((result,i)=>{
     const stdout = result.stdout?.trim();
     const expected_output = expected_outputs[i]?.trim();
     const passed = stdout === expected_output;
     const input = stdin[i]?.trim();
    

    if(!passed) allPassed =false;

    return {
        tastCase:i+1,
        passed,
        stdout,
       expected:expected_output,
       stderr:result.stderr || null,
       compileOutput:result.compile_output || null,
       status:result.status.description,
       memory:result.memory ? `${result.memory} KB` :undefined,
       time:result.time ? `${result.time} s` : undefined,


    }

     // 

    //  console.log(`testcase #${i+1}`);
    //  console.log(`Input ${stdin[i]}`);
    //  console.log(`actual stdout ${stdout}`);
    //  console.log(`expected out put ${expected_output}`)
    //  console.log(`Matched ${passed} `)

    })


   // store submission summary 
   const submission = await db.submission.create({
    data:{
        sourceCode:source_code,
        language:getLanguageName(language_id),
        stdin:stdin.join("\n"),
        stdout:JSON.stringify(detailedResults.map((r)=>r.stdout)),
        stderr:detailedResults.some((r)=>r.stderr)
        ? JSON.stringify(detailedResults.map((r)=>r.stderr))
        :null,
        compileOutput:detailedResults.some((r)=>r.compileOutput)
        ? JSON.stringify(detailedResults.map((r)=>r.compileOutput))
        :null,
        status:allPassed ? "Accepted" : "Wrong Answer",
        memory:detailedResults.some((r)=>r.memory)
        ? JSON.stringify(detailedResults.map((r)=>r.memory))
        :null,
        time:detailedResults.some((r)=>r.time)
        ? JSON.stringify(detailedResults.map((r)=>r.time))
        :null,
        userId,
        problemId
    }
   });

   // if all passed = true mark problem for current user

   if(allPassed){
    await db.problemSolved.upsert({
        where :{
            userId_problemId:{
                userId,problemId 
            }
        },
        update:{},
        create:{
            userId,problemId 
        }
    })
   }



   // 8. Save individual test cases using detailedResult 
   const testCaseResult = detailedResults.map((result) =>({
    submissionId:submission.id,
    testCase:result.tastCase,
    passed:result.passed,
    stdout:result.stdout,
    expected: result.expected,
    stderr:result.stderr,
    compileOutput:result.compileOutput,
    status:result.status,
    memory:result.memory,
    time:result.time,
   }));

   await db.testCaseResult.createMany({
    data:testCaseResult
   });


   const submissionWithTestCase = await db.submission.findUnique({
    where:{
        id:submission.id
    },
    include:{
        testCases:true
    }
   })

//
    res.status(200).json({
       success:true,
       message:"Code Execute Successfully",
       data:submissionWithTestCase
    })


   } catch (error) {

    console.log(error)
    
   }
}


export {executeCodeForRun,executeCodeForSubmit};