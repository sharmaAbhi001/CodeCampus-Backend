import axios from "axios";

export const getJudge0LanguageId = (language) => {
  const languageMap = {
    PYTHON: 71,
    JAVA: 62,
    JAVASCRIPT: 63,
  };

  return languageMap[language.toUpperCase()];
};

export const submitBatch = async (submissions) => {
  try {
    const { data } = await axios.post(
      `${process.env.BASE_API_JUDGE0_URL}/submissions/batch`,
       { submissions },
      {
        params: {
          base64_encoded: "false",
        },
        headers: {
          "x-rapidapi-key": process.env.X_RAPID_API_KEY,
          "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
          "Content-Type": "application/json",
        },
      }
    );

    return data;
  } catch (error) {
    console.log(error);
  }
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const pollBatchResult = async (tokens) => {
  while (true) {
    const { data } = await axios.get(
      `${process.env.BASE_API_JUDGE0_URL}/submissions/batch`,
      {
        params: {
          tokens: tokens.join(","),
          base64_encoded: "false",
          fields: "*",
        },
        headers: {
          "x-rapidapi-key": process.env.X_RAPID_API_KEY,
          "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
        },
      }
    );

    const results = data.submissions;
    const isAllDone = results.every(
      (r) => r.status.id !== 1 && r.status.id !== 2
    );

    if (isAllDone) return results;
    await sleep(1000);
  }
};


export const getLanguageName =(languageId)=>{

  const LANGUAGE_NAMES = {
    63:"JavaScript",
    71:"Python",
    62:"Java",
  }

  return LANGUAGE_NAMES[languageId] || "Unknown"

}
