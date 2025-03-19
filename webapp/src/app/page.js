"use client";

import QuestionGame from "@/components/game/QuestionGame";

export default function Page() {
  return <QuestionGame topic={'Q515'} totalQuestions={'10'} numberOptions={'4'} timerDuration={'60'} question={'What\'s the city in the image?'} />;
}
