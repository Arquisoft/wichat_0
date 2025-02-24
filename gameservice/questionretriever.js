const express = require('express');
const Question = require('./question-model');
const router = express.Router();

// Route to get a random question
router.get('/game', async (req, res) => {
    try {
        // Retrieve all questions from the database
        const allQuestions = await Question.find();

        if (allQuestions.length < 3) {
            return res.status(400).json({ error: 'No hay suficientes preguntas en la base de datos' });
        }
        
        const formattedQuestions = allQuestions.map(q => {
            // Obtain random fake answers
            let fakeAnswers = allQuestions
                .filter(item => item.answer !== q.answer)
                .map(item => item.answer);

            // Select two random incorrect answers and mix them with the correct answer
            fakeAnswers = fakeAnswers.sort(() => 0.5 - Math.random()).slice(0, 2);
            const answers = [q.answer, ...fakeAnswers].sort(() => 0.5 - Math.random());

            return {
                image_name: `/images/${q._id}.jpg`,
                answers,
                right_answer: q.answer
            };
        });

        res.status(200).json(formattedQuestions);

    } catch (error) {
        console.error('Error retrieving questions:', error);
        res.status(500).json({ error: 'Error retrieving questions' });
    }
});

module.exports = router;