/*
Authors of the program: Jasmine Bayani & Paloma Miranda Schkrab
About the program: It is an interactive game that will help students review for their CPSC 1045 finals.
Disclaimer: We own the whole program except for the images, dice, players, board game background, displayed in it. 
			Images used are taken from Google Images (https://www.google.com/imghp)
*/

//Declaring all the global variables 
var multipleChoiceArray = [];
var fillInTheBlanksArray = [];
var getQuestion;
var indexQuestion;
var setTimeOut;
var timeLeft;
var fieldUp = [6, 12, 18, 24];
var diceImageList = ["dice1.jpg", "dice2.jpg", "dice3.jpg", "dice4.jpg", "dice5.jpg", "dice6.jpg"];
var playersList = [];
var indexCurrentPlayer;
var surface = document.getElementById("drawingSurface");
var ctx = surface.getContext("2d");
var dice;
var DEFAULT_TIME = 10;

//Loaded on setup
var setup = function () {
  alert("Hello! Welcome to Ace It! CPSC 1045 Review Game. \nWhen all players are ready to begin, press START!");
  addToMultipleChoiceArray();
  getQuestion = document.getElementById("getQuestion");
  messageForCurrentPlayer = document.getElementById("messageForCurrentPlayer");
  document.getElementById("getQuestion").style.visibility = "hidden";
  document.getElementsByName("getChoice")[0].style.visibility = "hidden";
  document.getElementsByName("getChoice")[1].style.visibility = "hidden";
  document.getElementsByName("getChoice")[2].style.visibility = "hidden";
  document.getElementsByName("getChoice")[3].style.visibility = "hidden";
  document.getElementById("timerZone").style.visibility = "hidden";
  document.getElementById("messageForCurrentPlayer").style.visibility = "hidden";
};

//Shows the game rules
var aboutGame = function () {

  var theRules = "RULES: " +
    "\n -Pick how many players. Maximum # of players is 4." +
    "\n -The player must achieve the ending spot #30 to win the game." +
    "\n -To move forward, you need to answer the review question correctly" +
    "\n -Roll the dice to determine how many spots you will be moving forward to when your answer is right" +
    "\n -As soon as you roll the dice, your question will show up and you have 10 seconds to answer it" +
    "\n -If your answer is wrong, you will remain in your current spot" +
    "\n -As soon as you move, it is time for the next player to roll the dice" +
    "\n -No cheating!";

  alert(theRules);

};

//This function starts the game.
var startGame = function () {
  resetGame();
  aboutGame();
  var numPlayers = 0;
  while (!isValidNumPlayers(numPlayers)) {
    numPlayers = prompt("How many players do you want?");
  }
  createPlayersList(numPlayers);
  //createPlayersList(4);
  indexCurrentPlayer = 0;
  initialize();
  document.getElementById("dice").disabled = false;
  document.getElementById("messageForCurrentPlayer").style.visibility = "visible";
  messageForCurrentPlayer.innerHTML = "Current player, press the ROLL DICE button";
};

//Structure for player
var players = function (timeLeft, image, actualPosition, x, y) {
  return {
    timeLeft: timeLeft,
    image: image,
    actualPosition: actualPosition,
    x: x,
    y: y
  };
};

//Function to initialize the game adding all the images on the screen
var initialize = function () {
  ctx.clearRect(0, 0, 500, 500);
  var imgTable = new Image();
  imgTable.src = "images/table.jpg";

  var imgPlayer = new Image();
  imgPlayer.src = playersList[indexCurrentPlayer].image;
  imgPlayer.onload = function () {
    ctx.drawImage(imgPlayer, 100, 430, 60, 60);
  };

  imgTable.onload = function () {
    ctx.drawImage(imgTable, 0, 0, 400, 400);
    for (var i = 0; i < playersList.length; i++) {
      var imgMovePlayer = new Image();
      imgMovePlayer.src = playersList[i].image;
      ctx.drawImage(imgMovePlayer, playersList[i].x, playersList[i].y, 30, 30);
    }
  };
};

//This function validates whether the user's input number of players is between 1 and 4 players
var isValidNumPlayers = function (numPlayers) {
  return !isNaN(numPlayers) && (numPlayers >= 1 && numPlayers <= 4);
};


//This function creates a list of players
var createPlayersList = function (numPlayers) {
  var x = 0;
  var y = 330;
  for (var i = 1; i <= numPlayers; i++) {
    var player = players(i, "images/player" + i + ".png", 1, x, y);
    playersList.push(player);
    x = x + 35;
    if (i % 2 === 0) {
      x = 0;
      y = y + 35;
    }
  }
};


//Function to print all the players and its positions
var printPlayers = function () {
  for (var i = 0; i < playersList.length; i++) {
    console.log("Number " + playersList[i].number + " Image: " + playersList[i].image + " X: " + playersList[i].x + " Y: " + playersList[i].y);
  }
};


var imgMovePlayer1 = new Image();
imgMovePlayer1.src = "images/player1.png";

var imgMovePlayer2 = new Image();
imgMovePlayer2.src = "images/player2.png";

var imgMovePlayer3 = new Image();
imgMovePlayer3.src = "images/player3.png";

var imgMovePlayer4 = new Image();
imgMovePlayer4.src = "images/player4.png";

var imgTable = new Image();
imgTable.src = "images/table.jpg";
imgTable.onload = function () {
  ctx.drawImage(imgTable, 0, 0, 400, 400);
};

//Function to move the players
var movement = function () {
  document.getElementById("messageForCurrentPlayer").style.visibility = "hidden";
  console.log("Current Player: " + playersList[indexCurrentPlayer].player);
  for (var i = 0; i < dice; i++) {
    var nextPosition = playersList[indexCurrentPlayer].actualPosition + 1;
    if (isMoveUp(playersList[indexCurrentPlayer].actualPosition, nextPosition)) {
      moveUp(1);
      playersList[indexCurrentPlayer].actualPosition += 1;
    } else if (isMoveRight(playersList[indexCurrentPlayer].actualPosition)) {
      moveRight(1);
      playersList[indexCurrentPlayer].actualPosition += 1;
    } else if (isMoveLeft(playersList[indexCurrentPlayer].actualPosition)) {
      moveLeft(1);
      playersList[indexCurrentPlayer].actualPosition += 1;
    }

    if (playersList[indexCurrentPlayer].actualPosition == 30) {
      alert("CONGRATULATIONS!!!! You won!");
      break;
    }
  }
  
    callNextPlayer();
    initialize();
    document.getElementById("dice").disabled = false;
    document.getElementById("move").disabled = true;
    document.getElementById("messageForCurrentPlayer").style.visibility = "visible";
    messageForCurrentPlayer.innerHTML = "Current player, press the ROLL DICE button";
};

//Switches to the next player
var callNextPlayer = function () {
  if (indexCurrentPlayer + 1 > (playersList.length - 1)) {
    indexCurrentPlayer = 0;
  } else {
    indexCurrentPlayer += 1;
  }

  messageForCurrentPlayer.innerHTML = "Current player, press the ROLL DICE button";
};

var moveLeft = function (dice) {
  playersList[indexCurrentPlayer].x -= 67 * dice;
};

var moveRight = function (dice) {
  playersList[indexCurrentPlayer].x += 67 * dice;
};

var moveUp = function (dice) {
  playersList[indexCurrentPlayer].y -= 80 * dice;
};

var moveDown = function (dice) {
  playersList[indexCurrentPlayer].y += 80 * dice;
};

var isMoveRight = function (actualPosition) {
  if ((actualPosition >= 1 && actualPosition <= 5) || (actualPosition >= 13 && actualPosition <= 17) || (actualPosition >= 25 && actualPosition <= 29)) {
    return true;
  }
  return false;
};


var isMoveLeft = function (actualPosition) {
  if ((actualPosition >= 7 && actualPosition <= 11) || (actualPosition >= 19 && actualPosition <= 23)) {
    return true;
  }
  return false;
};

var isMoveUp = function (actualPosition) {
  for (var i = 0; i < fieldUp.length; i++) {
    if (fieldUp[i] == actualPosition) {
      return true;
    }
  }
  return false;
};

//Rolls the dice to determine the number of movement
var rollDice = function () {
  document.getElementById("messageForCurrentPlayer").style.visibility = "hidden";
  var indexDice = Math.floor((Math.random() * 6));
  console.log("Dice: " + indexDice);
  dice = indexDice + 1;
  var imgDice = new Image();
  imgDice.src = "images/" + diceImageList[indexDice];
  imgDice.onload = function () {
    ctx.drawImage(imgDice, 200, 430, 60, 60);
  };
  document.getElementById("move").disabled = true;
  document.getElementById("dice").disabled = true;

  var myTimer = setTimeout(countDown, 1000);
  timeLeft = DEFAULT_TIME;
  habilitateAnswerChoices(false);
  cleanAnswers();
  showQuestionandChoices();
};

//Constructor for the questions
var MultipleChoice = function (question, choice1, choice2, choice3, choice4, answer) {

  return {
    question: question,
    choice1: choice1,
    choice2: choice2,
    choice3: choice3,
    choice4: choice4,
    answer: answer
  };

};

//Pushes data to the array
var addToMultipleChoiceArray = function () {

  var question1MC = MultipleChoice("What defines the context in which drawing and animation occurs.", "drawing context", "defining context ", "rendering context", "rendering content", 3);
  var question2MC = MultipleChoice("What is the process of checking the conditions and changing the behaviour of the program accordingly.", "conditional execution", "the check method", "behavioural execution", "conditioning", 1);
  var question3MC = MultipleChoice("What command asks the user for an input in JavaScript?", "prompt", "alert", "getInput", "inputCommand", 1);
  var question4MC = MultipleChoice("What is a block of code that has a name and are executed when they are called.", "variable", "function", "array", "object", 2);
  var question5MC = MultipleChoice("What is an interactive thing that can happen on the page, for example, a button pressed, a key pressed, a timer expiring, etc.", "interactive", " interactive handler", "object", "event", 4);
  var question6MC = MultipleChoice("What is a special variable that accepts more than one declaration value.", "array", "function", "event", "object", 1);
  var question7MC = MultipleChoice("What is the symbol used for the operator type, remainder?", "/", "&", "%", "||", 3);
  var question8MC = MultipleChoice("Id, width, and height are all main attributes of what html tag?", "body", "main", "script", "canvas", 4);
  var question9MC = MultipleChoice("What do you use to assign a value to a variable?", "=", "==", "===", "==!", 1);
  var question10MC = MultipleChoice("What command do you use to check if a value given is a number?", "Number()", "!isNaN()", "isNaN()", "Num()", 2);
  var question11MC = MultipleChoice("What command do you use to convert a string into a number?", "Number()", "!isNaN()", "isNaN()", "Num()", 1);
  var question12MC = MultipleChoice("It is a box that does not go away until the user enters some input", "alert box", "dialog box", "modal dialog box", "prompt box", 3);
  var question13MC = MultipleChoice("The prompt command always returns to you an answer that has a value type of _______.", "boolean", "string", "number", "undefined", 2);
  var question14MC = MultipleChoice("What are the two different kinds of loops constructed by the use of the reserved words <i>for</i> and <i>while</i> in JavaScript?", "for loop & while loop", "fruit loops & waffle loops", "counting loop & unknown-counting loop", "count-controlled loop & sentinel-controlled loop", 4);
  var question15MC = MultipleChoice("What do you call the variables that are declared outside functions?", "global variables", "inbound variables", "outbound variables", "local variables", 1);
  var question16MC = MultipleChoice("What is the keyword used in JavaScript when declaring a variable?", "int", "byte", "var", "char", 3);
  var question17MC = MultipleChoice("What are the variables declared inside a function and are only recreated every time the function they are in is called?", "global variables", "inbound variables", "outbound variables", "local variables", 4);
  var question18MC = MultipleChoice("The ___________ command is an example of a function that has a side effect of moving the local coordinate system for all subsequent drawing commands.", "ctx.save", "ctx.restore", "ctx.translate", "ctx.beginPath", 3);
  var question19MC = MultipleChoice("What are functions that uses the reserved word, return?", "value returning functions", "void functions", "return function", "reserved return function", 1);
  var question20MC = MultipleChoice("How do you call a function?", "functionName{arguments};", "functionName(arguments);", "functionName(arguments):", "functionName[arguments];", 2);
  var question21MC = MultipleChoice("var calculateArea = computeTriangleArea; is an example of: ", "Comparing two variables", "Calling the calculateArea function", "Assigning a function's value to a new variable name.", "Calling the computeTriangleArea function", 3);
  var question22MC = MultipleChoice("To limit the effects of ctx.translate to a small region of code, you need to remember to use _______ and ________. ", "ctx.beginPath(); and ctx.closePath();", "ctx.fill(); and ctx.stroke();", "ctx.undoTranslate(); and ctx.undoRotate();", "ctx.save(); and ctx.restore();", 4);
  var question23MC = MultipleChoice("It is an event triggered by the browser only after the entire webpage has been loaded", "load", "change", "onload", "click", 1);
  var question24MC = MultipleChoice("These are types of input of an HTML input element except for: ", "text", "function", "number", "button", 2);
  var question25MC = MultipleChoice("To access what the user typed inside the HTML text field, we need to get the text field element using: ", "var function() = document.getElementById", "var variablename = document.getElementById();", "var variablename = document.getElementId();", "var variablename = document.getElementById[];", 2);
  var question26MC = MultipleChoice("What do you call the position of the element within an array?", "elements", "index", "position", "order", 2);
  var question27MC = MultipleChoice("Which of these creates an empty array?", "var arrayList = [];", "var arrayList = ();", "var arrayList();", "var arrayList[];", 1);
  var question28MC = MultipleChoice("What do you use to add elements at the end of the array?", "pop", "addElement", "pull", "push", 4);
  var question29MC = MultipleChoice("It removes the last element of the array and returns its value.", "delete", "cut", "pop", "push", 3);
  var question30MC = MultipleChoice("________ allow us to organize information using meaningful names, allow us to conveniently organize our information, make the code more readable, and make it less cumbersome to pass larger amounts of information as parameters.", "arrays", "objects", "constructors", "functions", 2);
  var question31MC = MultipleChoice("var Square = function(color, size){ <br> this.color = color; <br>this.size = size; }; is an example of a: ", "factory based constructor", "traditional constructor", "old style constructor", "the new constructor", 2);
  var question32MC = MultipleChoice("var Square = function(color, size){ <br> return { color : color, <br> size : size}; }; is an example of a: ", "factory based constructor", "traditional constructor", "old style constructor", "the new constructor", 1);
  var question33MC = MultipleChoice("How do we access an object's property?", "objectName.property", "objectName.property()", "objectName[property]", "objectName_property", 1);
  var question34MC = MultipleChoice("It executes a JavaScript code and determines what happens next when an event happens, such as pressing a button, moving your mouse over a link, submitting a form etc.", "event", "event handler", "calling a function", "event handling", 2);
  var question35MC = MultipleChoice("The two key methods to use for timing events with JavaScript are: ", "setTimeout(function, milliseconds) & setInterval(function, milliseconds)", "setTimeout(milliseconds) & setInterval(milliseconds)", "setTimeOut[function, milliseconds] & setInterval[function, milliseconds]", "setTimeout(function, seconds) & setInterval(function, seconds)", 1);

  multipleChoiceArray.push(question1MC);
  multipleChoiceArray.push(question2MC);
  multipleChoiceArray.push(question3MC);
  multipleChoiceArray.push(question4MC);
  multipleChoiceArray.push(question5MC);
  multipleChoiceArray.push(question6MC);
  multipleChoiceArray.push(question7MC);
  multipleChoiceArray.push(question8MC);
  multipleChoiceArray.push(question9MC);
  multipleChoiceArray.push(question10MC);
  multipleChoiceArray.push(question11MC);
  multipleChoiceArray.push(question12MC);
  multipleChoiceArray.push(question13MC);
  multipleChoiceArray.push(question14MC);
  multipleChoiceArray.push(question15MC);
  multipleChoiceArray.push(question16MC);
  multipleChoiceArray.push(question17MC);
  multipleChoiceArray.push(question18MC);
  multipleChoiceArray.push(question19MC);
  multipleChoiceArray.push(question20MC);
  multipleChoiceArray.push(question21MC);
  multipleChoiceArray.push(question22MC);
  multipleChoiceArray.push(question23MC);
  multipleChoiceArray.push(question24MC);
  multipleChoiceArray.push(question25MC);
  multipleChoiceArray.push(question26MC);
  multipleChoiceArray.push(question27MC);
  multipleChoiceArray.push(question28MC);
  multipleChoiceArray.push(question29MC);
  multipleChoiceArray.push(question30MC);
  multipleChoiceArray.push(question31MC);
  multipleChoiceArray.push(question32MC);
  multipleChoiceArray.push(question33MC);
  multipleChoiceArray.push(question34MC);
  multipleChoiceArray.push(question35MC);

};

//Displays the question and choices
var showQuestionandChoices = function () {
  indexQuestion = Math.floor(Math.random() * 35);
  getQuestion.innerHTML = multipleChoiceArray[indexQuestion].question;
  getChoice1.innerHTML = multipleChoiceArray[indexQuestion].choice1;
  getChoice2.innerHTML = multipleChoiceArray[indexQuestion].choice2;
  getChoice3.innerHTML = multipleChoiceArray[indexQuestion].choice3;
  getChoice4.innerHTML = multipleChoiceArray[indexQuestion].choice4;

  document.getElementById("getQuestion").style.visibility = "visible";
  document.getElementsByName("getChoice")[0].style.visibility = "visible";
  document.getElementsByName("getChoice")[1].style.visibility = "visible";
  document.getElementsByName("getChoice")[2].style.visibility = "visible";
  document.getElementsByName("getChoice")[3].style.visibility = "visible";
  document.getElementById("timerZone").style.visibility = "visible";
};

//Checking if answer is right or wrong
var answerQuestion = function (x) {
  if (x === multipleChoiceArray[indexQuestion].answer) {
    timeLeft = -1;
    alert("You're right! Hit the MOVE! button now.");
    habilitateAnswerChoices(true);
    document.getElementById("move").disabled = false;
    cleanAnswers();
    document.getElementById("messageForCurrentPlayer").style.visibility = "visible";
    messageForCurrentPlayer.innerHTML = "Current player, press the MOVE! button";
  } else {
    habilitateAnswerChoices(true);
    callNextPlayer();
    initialize();
    document.getElementById("move").disabled = true;
    document.getElementById("dice").disabled = false;
    alert("Oops!! That's not the right answer. Next player's turn..");
    timeLeft = DEFAULT_TIME;
    timeLeft = -1;
    document.getElementById("timerZone").style.visibility = "hidden";
    cleanAnswers();
    document.getElementById("messageForCurrentPlayer").style.visibility = "visible";
    messageForCurrentPlayer.innerHTML = "Current player, press the ROLL DICE button";

  }

};

var habilitateAnswerChoices = function (value) {
  document.getElementsByName("getChoice")[0].disabled = value;
  document.getElementsByName("getChoice")[1].disabled = value;
  document.getElementsByName("getChoice")[2].disabled = value;
  document.getElementsByName("getChoice")[3].disabled = value;
};

//Timer countdown
var countDown = function () {
  if (timeLeft >= 0) {
    showTimer(timeLeft);
    timeLeft -= 1;
    if (timeLeft >= 0) {
      setTimeout(countDown, 1000);

    } else if (timeLeft <= 0) {
      habilitateAnswerChoices(true);
      callNextPlayer();
      initialize();
      document.getElementById("move").disabled = true;
      document.getElementById("dice").disabled = false;
      alert("Time's up! Switching to next player..");
      document.getElementById("messageForCurrentPlayer").style.visibility = "visible";
      messageForCurrentPlayer.innerHTML = "Current player, press the ROLL DICE button";
    }
  }
};

//Shows timer on HTML
var showTimer = function (timeLeft) {
  if (timeLeft <= DEFAULT_TIME) timerZone.innerHTML = timeLeft;

};

//Function to reset the game
var resetGame = function () {
  questions = [];
  playersList = [];
  indexCurrentPlayer = 0;
};

//Removes button previously pressed on the radio buttons
var cleanAnswers = function () {
  document.getElementsByName("getChoice")[0].checked = false;
  document.getElementsByName("getChoice")[1].checked = false;
  document.getElementsByName("getChoice")[2].checked = false;
  document.getElementsByName("getChoice")[3].checked = false;
};