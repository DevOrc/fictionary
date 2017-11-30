
var def_card_0, def_card_1, def_card_2, def_card_3;
var correct_color = "#0A942F";
var wrong_color = "#962b2b";
/**When the player is still Guessing */
var neutralColor = "#9D9D9F";
var wordsString = "";
var wordsArray;
var defsArray;
var requestSleepTime = 20;
var answered = false;
var correctAnswer = -1;
var highScore = 0;
var currentScore = 0;
var cookieNeverExpire = 365 * 20;
 
function onCreate() {
    def_card_0 = document.getElementById("def-card-0");
    def_card_1 = document.getElementById("def-card-1");
    def_card_2 = document.getElementById("def-card-2");
    def_card_3 = document.getElementById("def-card-3");

    getFile("words.txt");
    setInterval(updateScore, 100);

    var highScoreCookie = Cookies.get('highscore');
    if(highScoreCookie != undefined){
        highScore = highScoreCookie;
    }
}

function updateScore(){
    if(currentScore > highScore){
        highScore = currentScore;
        Cookies.set('highscore', highScore, { expires: cookieNeverExpire });
    }

    var scoreText = document.getElementById("score-box");
    scoreText.innerHTML = "Score: " + currentScore + " &nbsp; &nbsp; " + "High Score: " + highScore;
}

function parseWordString(request) {
    wordsString = request.responseText;

    wordsArray = [];
    defsArray = [];
    wordsString.split("\n").forEach(function (item, index, array) {
        var separator = item.indexOf(" ");
        var word = item.substring(0, separator);
        var def = item.substring(separator);
        wordsArray.push(word);
        defsArray.push(def);
    });

    console.log("Number of Words: " + wordsArray.length);

    pickWords();
}

function pickWords(){
    correctAnswer = getRandomNumber(0, 4);
    var correctWord = "";

    for (let index = 0; index < 4; index++) {
        const num = getRandomNumber(0, wordsArray.length);
        const word = wordsArray[num];
        const def = defsArray[num];

        if(index == correctAnswer)
            correctWord = word;

        document.getElementById("def-" + index).innerHTML = def;
    }

  
    document.getElementById("prompt-card").innerHTML = "Definition of " + correctWord;
}

function getRandomNumber(min, max){
    return Math.floor(Math.random() * max) + min;  
}

function onGuess(name) {
    let buttons =  document.getElementsByClassName("correct-button");

    console.log(buttons.length);
    if(answered){
        pickWords();
        answered = false;
        def_card_0.style.backgroundColor = neutralColor;
        def_card_1.style.backgroundColor = neutralColor;
        def_card_2.style.backgroundColor = neutralColor;
        def_card_3.style.backgroundColor = neutralColor;
        for (let index = 0; index < buttons.length; index++) {
            const element = buttons[index];
            element.innerHTML = "Guess!";
        }
        return;
    }

    console.log("Guessed: " + name);
    def_card_0.style.backgroundColor = wrong_color;
    def_card_1.style.backgroundColor = wrong_color;
    def_card_2.style.backgroundColor = wrong_color;
    def_card_3.style.backgroundColor = wrong_color;

    document.getElementById("def-card-" + correctAnswer).style.backgroundColor = correct_color;

    if(correctAnswer == name){
        console.log("Correct");
        currentScore++;
    }else{
        currentScore = 0;
    }
    for (let index = 0; index < buttons.length; index++) {
        const element = buttons[index];
        console.log("t");
        element.innerHTML = "Next Word!";
    }

    answered = true;
}

function getFile(pathToRead) {
    console.log("Getting File: " + pathToRead);
    var request = new XMLHttpRequest();
    request.open("GET", pathToRead, false);
    setTimeout(function() { updateRequest(request, parseWordString); }, requestSleepTime);
    request.send(null);
}

function updateRequest(request, funcToCall){
    if(request.readyState == request.DONE){
        if(request.status == 200){
            funcToCall(request);
            return;
        }
    }
    setTimeout(function() { updateRequest(request, parseWordString); }, requestSleepTime);
}