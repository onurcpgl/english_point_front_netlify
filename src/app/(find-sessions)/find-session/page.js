import React from "react";
import StartQuiz from "../../../components/quiz/StartQuiz";
function page() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen max-lg:not-first:pt-20">
      <StartQuiz />
    </div>
  );
}

export default page;
