data = null;
currentQuiz = null;
currentQuestionNumber = 0;
totalScore = 0;
timeLeft = 0;
timerId = 0;

filterText = document.getElementById("search-input").value;

function isSubstring(s, substr) {
    return (String(s).search(new RegExp(substr, "i"))) != -1;
}

function containsText(obj, text, ignoreFields) {
    for (var key in obj) {
        if(ignoreFields && ignoreFields.includes(key)){
            continue;
        }
        if (obj.hasOwnProperty(key)) {
            if (isSubstring(obj[key], text)) {
                return true;
            }
        }
    }
    return false;
}


function showDeck() {
    document.getElementById("card-deck").style.display = "flex";
    document.getElementById("question").style.display = "none";
    document.getElementById("yourScore").style.display = "none";
}

function showQuiz() {
    document.getElementById("card-deck").style.display = "none";
    document.getElementById("question").style.display = "block";
    document.getElementById("yourScore").style.display = "none";
}

function showScore() {
    document.getElementById("card-deck").style.display = "none";
    document.getElementById("question").style.display = "none";
    document.getElementById("yourScore").style.display = "block";
}

function startQuiz(i) {
    totalScore = 0;
    currentQuiz = data.quizzes[i];
    currentQuestionNumber = 0;
    showQuiz();
    renderQuestion();
}

function getQuestionScore() {
    const question = currentQuiz.questions[currentQuestionNumber];
    for (let i=0; i<question.answers.length; i++) {
        const answer = document.getElementById(`answer-${i}`).checked;
        if (answer !== question.answers[i].correct) {
            return 0;
        }
    }
    return 1;
}

function renderQuestion(){
    timeLeft = 30;
    document.getElementById("timer").textContent = timeLeft;
    timerId = setInterval(()=>{
        timeLeft -= 1;
        if (timeLeft <=0 ) {
            nextQuestion();
        } else {
            document.getElementById("timer").textContent = timeLeft;
        }
    }, 1000);
    const question = currentQuiz.questions[currentQuestionNumber];
    document.getElementById("questionText").textContent = question.text;
    document.getElementById("currentQuizNumber").textContent = currentQuestionNumber + 1;
    document.getElementById("totalQuizNumber").textContent = currentQuiz.questions.length;
    let html = "";
    for(let i=0; i<question.answers.length; i++) {
        const answerHtml = ` <label class="container">${question.answers[i].text}
                <input type="checkbox" id="answer-${i}">
                <span class="checkmark"></span>
            </label>\n`;
        html += answerHtml;
    }
    document.getElementById("answers").innerHTML = html;
}

function renderResult() {
    showScore();
    document.getElementById("yourResult").textContent = totalScore;
}

function scoreOk() {
    showDeck();
}

function nextQuestion() {
    clearInterval(timerId);
    totalScore += getQuestionScore();
    if(currentQuestionNumber === currentQuiz.questions.length - 1) {
        renderResult()
    } else {
        currentQuestionNumber += 1;
        renderQuestion();
    }
}

function renderDeck() {
    const cardsDeck = document.getElementById("card-deck");

    let quizzes = data.quizzes;
    if(filterText != ""){
        quizzes = quizzes.filter(function(obj) {
            return containsText(obj, filterText, ["questions"]);
        });
    }

    let deckHtml = "";
    for(let i=0; i < quizzes.length; i++) {
        const quiz = quizzes[i];
        const elemHtml = `<div class="card text-center" style="width: 12rem;">
    <div class="card-body">
        <h5 class="card-title">${quiz.name}</h5>
        <p class="card-text">${quiz.description}</p>
        <div class="btn btn-primary" onclick="startQuiz(${i})">Start</div>
    </div>
</div>\n`;
        deckHtml += elemHtml;
    }
    cardsDeck.innerHTML = deckHtml;
}

function updateFilterText(text) {
    filterText = text;
    renderDeck();
}


fetch('json/questions_1.json')
    .then(function(response) {
        return response.json()

    })
    .then(function(myJson) {
        console.log(myJson);
        data = myJson;
        renderDeck();
    });


