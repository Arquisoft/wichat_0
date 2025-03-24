import React, { useEffect, useState } from 'react';
import GameComponent from '../components/GameComponent';
import { Navigate } from "react-router-dom";
import { Grid } from '@mui/material';
import AiChat from '../components/AiChat';

const GamePage = ({numQuestions,questionType,timePerQuestion}) => {
  const gatewayUrl = process.env.GATEWAY_SERVICE_URL || 'http://localhost:8000';
  const [questionNum,setQuestionNum] = useState(0);
  const [score,setScore] = useState(0);

  const [questions,setQuestions] = useState(null);
  const [loadedQuestions,setLoadedQuestions] =useState(false);
  const [endGame, setEndGame] = useState(false);
  const fetchData = async () =>{ 
    try{
        const response = await fetch(gatewayUrl+'/generate-questions?type='+questionType+'&numQuestions='+numQuestions);
        if(!response.ok){
            throw new Error('Network error')
        }
        const result = await response.json();
        setQuestions(result);
        setLoadedQuestions(true);
    }catch(err){
        console.error('Error fetching questions: ',err);
    }
  }
  useEffect(()=>{
      if (!loadedQuestions) {
          fetchData();
      }
  });
  
  const handleQuestionAnswered = (correct) => {
    console.log("change question")
      if(correct===true){
        setScore(score+1);
      }
      if (questionNum < questions.length - 1) { // Check if there are more questions
        setTimeout(() => {setQuestionNum((prev) => prev + 1);}, 1000);
      } else {
        sessionStorage.setItem('score',score);
        sessionStorage.setItem('questionNum',questionNum+1);
        setEndGame(true);
      }
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={3}><AiChat></AiChat></Grid>
      <Grid item xs={12} md={9}>
        {loadedQuestions && questions? (
            endGame?(<Navigate to="/results"/>):(
          <GameComponent key={questionNum} question={questions[questionNum]} // Pass current question
          onQuestionAnswered={handleQuestionAnswered} // Pass callback
          timePerQuestion={timePerQuestion}
          />)
      ) : (
        <div>Loading...</div>
      )}</Grid>
    </Grid>
  )
}
GamePage.defaultProps ={
  numQuestions:20,
  questionType:'flag',
  timePerQuestion:60,
};

export default GamePage