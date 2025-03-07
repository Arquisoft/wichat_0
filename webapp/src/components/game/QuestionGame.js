import React, {useEffect, useState} from 'react';
import "./QuestionGame.css"
const QuestionGame = () => {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [gameCompleted, setGameCompleted] = useState(false);
    const [error, setError] = useState(null)
    const [questionShown, setQuestionShown] = useState(null)
    const [questionImg, setQuestionImg] = useState(null)


    const totalQuestions = 4;                            //TODO: unfix this parameters, delegate its assignation value to other layer
    const numberOptions = 4;
    
    const isLastQuestion = currentQuestion === totalQuestions - 1;

    function checkAnswer (questionSelected) {
        const q = questions.find(q => q.id === currentQuestion)
        if (q && q.options[questionSelected] === q.correctAnswer){
            alert("Correct!")
        } else {
            alert("Incorrect!")
        }
    }

    const handleOptionSelect = (index) => {
        setSelectedOption(index);
    };
    
    const handleNext = () => {
        if (currentQuestion < totalQuestions - 1) {
            checkAnswer(selectedOption);                        //TODO: Logic of checking the question, move it to another layer, not Presentation
            setCurrentQuestion(currentQuestion + 1);
            setSelectedOption(null);
        } else {
                                                             // TODO: implement finish logic here, save game played,... It should not be done in Presentation Layer 
            alert("Quiz completed!");
        }
    };

    const fetchQuestions = async () => {
        try {
            const response = await fetch(`http://localhost:8000/game/${totalQuestions}/${numberOptions}`);

            if (!response.ok){
                
                console.error("Error when requesting the questions");
                throw new Error("Response was not OK when requesting the questions");
            }

            const questionsJSON = await response.json()

            const formattedQuestions = questionsJSON.map((q,index) => ({
                    id: index,
                    questionText: "What is shown in the image?",                    //TODO: resolve this, it cannot be fixed
                    image: q.image_name,
                    options: q.answers,
                    correctAnswer: q.right_answer
                }));

            setQuestions(formattedQuestions);
            setError(null);
        } catch (err) {
            console.error('Error fetching questions:', err);
            setError("There was a problem when requesting the questions. Try again later.") 
        }
    }
    
    useEffect(() => {
        fetchQuestions();
    }, []);

    useEffect(() => {
        const currentQ = questions.find(q => q.id === currentQuestion);
        setQuestionShown(currentQ);
    }, [currentQuestion, questions]);

    useEffect(() => {
        if (questions.length > 0) {
            const currentQ = questions.find(q => q.id === currentQuestion);
            if (currentQ) {
                const imgURL = `http://localhost:8000${currentQ.image}`;
                setQuestionImg(imgURL);
            }
        }
    }, [currentQuestion, questions]);

    if (error && questions.length === 0) {
        return (
            <div className="quiz-container">
                <div className="blue-border"></div>
                <div className="content-area error">
                    <h2>{error}</h2>
                    <button className="next-button" onClick={() => window.location.reload()}>
                        Reintentar
                    </button>
                </div>
                <div className="blue-border"></div>
            </div>
        );
    }
    
    return (
        <div className="quiz-container">
            {/* Blue border at top */}
            <div className="blue-border"></div>
            
            {/* Main content */}
            <div className="content-area">
                {/* Question counter */}
                <div className="question-counter">
                    Question {currentQuestion + 1} of {totalQuestions}
                </div>
                
                {/* Question */}
                <h2 className="question-text">{questionShown?.questionText}</h2>
                
                <div className="flex-container">
                    {/* Image */}
                    <div className="image-container">
                        <img 
                            src={questionImg}
                            alt="Question image"                            //TODO: change this? for a descriptive one? perhaps from wikidata description 
                            className="question-image"
                            id="q-img"
                        />
                    </div>
                    
                    {/* Options */}
                    <div className="options-container">
                        {/*TODO: more flexible*/}
                        {['A', 'B', 'C', 'D'].map((letter, index) => (
                            <div 
                                key={letter}
                                className="option"
                                onClick={() => handleOptionSelect(index)}
                            >
                                <div 
                                    className={`option-letter ${selectedOption === index ? 'selected' : ''}`}
                                >
                                    {letter}
                                </div>
                                <input
                                    type="text"
                                    className="option-input"
                                    placeholder="Response..."
                                    value={questionShown?.options?.[index] || ""}
                                    readOnly
                                />
                            </div>
                        ))}
                    </div>
                </div>
                
                {/* Next/Finish button */}
                <button 
                    className="next-button"
                    onClick={handleNext}
                >
                    {isLastQuestion ? 'Finish' : 'Next'}
                </button>
            </div>
            
            {/* Blue border at bottom */}
            <div className="blue-border"></div>
        </div>
    );
};


export default QuestionGame;