const questions = [
    {
        title: 'macska',
        alternatives: [ 'dog', 'door', 'cat', 'table' ],
        correctIndex: 2
    },
    {
        title: 'kutya',
        alternatives: [ 'dog', 'carrot', 'card', 'door' ],
        correctIndex: 0
    },
    {
        title: 'ajtó',
        alternatives: [ 'window', 'door', 'card', 'knife' ],
        correctIndex: 1
    }
];

const app = {
    start: function start() {
        this.currentIndex = 0;
        this.score = 0;

        const alternatives = document.querySelectorAll('.alternative');
        alternatives.forEach((alternative, index) => {
            alternative.addEventListener('click', () => {
                // check answer
                this.checkAnswer(index);

                // step question
                this.stepQuestion();

                // show question
                this.showQuestion(questions[this.currentIndex]);
            });
        });

        this.showQuestion(questions[this.currentIndex]);

        this.displayScore();
    },

    showQuestion: function showQuestion(q) {
        const titleDiv = document.querySelector('#title');
        titleDiv.innerHTML = q.title;
    
        const alternatives = document.querySelectorAll('.alternative');
        alternatives.forEach((alternative, index) => {
            alternative.innerHTML = q.alternatives[index];
        });
    },

    checkAnswer: function (clickedIndex) {
        const currentQuestion = questions[this.currentIndex];
        const correctIndex = currentQuestion.correctIndex;

        if (correctIndex == clickedIndex) {
            this.showResult(true);
            this.score++;
        } else {
            this.showResult(false);
        }

        this.displayScore();
    },

    stepQuestion: function() {
        this.currentIndex++;

        if (questions.length == this.currentIndex) {
            this.currentIndex = 0;
        }
    },

    displayScore: function () {
        const scoreDiv = document.querySelector('#score');
        scoreDiv.innerHTML = 'Score: ' + this.score;
    },

    showResult: function (isCorrect) {
        let result;

        if (isCorrect) {
            result = 'Correct answer!';
        } else {
            const currentQuestion = questions[this.currentIndex];
            const correctIndex = currentQuestion.correctIndex;
            const correctAnswer = currentQuestion.alternatives[correctIndex];

            result = 'Wrong answer, correct was ' + correctAnswer;
        }

        const resultDiv = document.querySelector('#result');
        resultDiv.innerHTML = result;
    }
};

app.start();