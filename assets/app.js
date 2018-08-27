$(document).ready(function(){
  
    // event listeners
    $("#remaining-time").hide();
    $("#start").on('click', trivia.startGame);
    $("#restart").on('click', trivia.restartGame);
    $(document).on('click' , '.option', trivia.guessChecker);
    
  })
  
  //hide restart button
  $("#restart").hide();
  var trivia = {
    // trivia game properties
    correct: 0,
    incorrect: 0,
    unanswered: 0,
    currentSet: 0,
    timer: 20,
    timerOn: false,
    timerId : '',
    // questions, answer choices and answers data
    questions: {
      q1: 'Which infinity Stone did Thanos recover from the planet Xandar?',
      q2: 'Which Avenger posesses the time stone?',
      q3: 'Who did Thanos sacrifice to obatin the soul stone?',
      q4: 'The mark L iron man suit created and donned by Tony Stark uses what technology?',
      q5: 'What is the name of the weapon forged for Thor on Nidavellir?',
      q6: 'Who secretly had posession of the space stone?',
      q7: 'Thanos wanted to bring balance by wiping out what amount of life in the universe?',
      q8: 'Infinity War centers around the Infinity Stones. How many are on Earth at the beginning of the movie?',
      q9: 'What kind of being is Thanos?',
      q10:'Where is the Soul Stone located?'
    },
    options: {
      q1: ['Space Stone', 'Power Stone', 'Soul Stone', 'Mind Stone'],
      q2: ['Iron Man', 'Vision', 'Dr. Strange', 'Thor'],
      q3: ['Nebula', 'Star Lord', 'Gamora', 'Tony Stark'],
      q4: ['Microtech', 'Macrotech', 'Nanotech', 'Vibranium'],
      q5: ['Mjolnir','Stormbreaker','Windbreaker','God Killer'],
      q6: ['Loki','Thor','Hela', 'Bruce Banner'],
      q7: ['One-Half', 'One-Quarter', 'One-Third','All'],
      q8: ['1','2','3','5'],
      q9: ['A Titan', 'A Beyonder', 'Demigod', 'Watcher'],
      q10:['Knowhere', 'Vormir', 'Ego', 'Contraxia']
    },
    answers: {
      q1: 'Power Stone',
      q2: 'Dr. Strange',
      q3: 'Gamora',
      q4: 'Nanotech',
      q5: 'Stormbreaker',
      q6: 'Loki',
      q7: 'One-Half',
      q8: '2',
      q9: 'A Titan',
      q10: 'Vormir'
    },
    // trivia methods
    // Start game
    startGame: function(){
      // start game results
      trivia.currentSet = 0;
      trivia.correct = 0;
      trivia.incorrect = 0;
      trivia.unanswered = 0;
      clearInterval(trivia.timerId);
      
      // show game section
      $('#game').show();
      
      //  empty last results
      $('#results').html('');
      
      // show timer
      $('#timer').text(trivia.timer);
      
      // remove start button
      $('#start').hide();
  
      $('#remaining-time').show();
      
      // ask first question
      trivia.nextQuestion();
      
    },

    restartGame: function(){
      // start game results
      trivia.currentSet = 0;
      trivia.correct = 0;
      trivia.incorrect = 0;
      trivia.unanswered = 0;
      clearInterval(trivia.timerId);
      
      // show game section
      $('#game').show();
      
      //  empty last results
      $('#results').html('');
      
      // show timer
      $('#timer').text(trivia.timer);
      
      // remove restart button
      $('#restart').hide();
  
      $('#remaining-time').show();
      
      // ask first question
      trivia.nextQuestion();
      
    },
    // method to loop through and display questions and options 
    nextQuestion : function(){
      
      // set timer to 30 seconds each question
      trivia.timer = 30;
       $('#timer').removeClass('last-seconds');
      $('#timer').text(trivia.timer);
      
      // to prevent timer speed up
      if(!trivia.timerOn){
        trivia.timerId = setInterval(trivia.timerRunning, 1000);
      }
      
      // gets all the questions then indexes the current questions
      var questionContent = Object.values(trivia.questions)[trivia.currentSet];
      $('#question').text(questionContent);
      
      // an array of all the user options for the current question
      var questionOptions = Object.values(trivia.options)[trivia.currentSet];
      
      // creates all the trivia guess options in the html
      $.each(questionOptions, function(index, key){
        $('#options').append($('<button class="option btn btn-info">'+key+'</button>'));
      })
      
    },
    // Function for the question timer
    timerRunning : function(){
      // if timer still has time left and there are still questions left to ask
      if(trivia.timer > -1 && trivia.currentSet < Object.keys(trivia.questions).length){
        $('#timer').text(trivia.timer);
        trivia.timer--;
      }
      // the time has run out and increment unanswered, run result
      else if(trivia.timer === -1){
        trivia.unanswered++;
        trivia.result = false;
        clearInterval(trivia.timerId);
        resultId = setTimeout(trivia.guessResult, 1000);
        $('#results').html('<h3>Out of time! The answer was '+ Object.values(trivia.answers)[trivia.currentSet] +'</h3>');
      }
      // if all the questions have been shown end the game, show results
      else if(trivia.currentSet === Object.keys(trivia.questions).length){
      
      //Calculate the % of correct answers to display at the end of the game
        var percent_correct = ((trivia.correct/10)*100);
        var rounded = percent_correct.toFixed();
        
      // adds results of game (correct, incorrect, unanswered) to the page
        $('#results')
          .html('<h3>Thanks for playing!</h3>'+
          '<p>Correct: '+ trivia.correct +'</p>'+
          '<p>Incorrect: '+ trivia.incorrect +'</p>'+
          '<p>Unanswered: '+ trivia.unanswered +'</p>'+
          '<p> Percent Correct: '+ rounded + '%' + '</p>');
        
        // hide game sction
        $('#game').hide();
        
        // show start button to begin a new game
        $('#restart').show();
      }
      
    },
    // method to evaluate the option clicked
    guessChecker : function() {
      
      // timer ID for gameResult setTimeout
      var resultId;
      
      // the answer to the current question being asked
      var currentAnswer = Object.values(trivia.answers)[trivia.currentSet];
      
      // if the text of the option picked matches the answer of the current question, increment correct
      if($(this).text() === currentAnswer){
        // Clicked button turns green if the correct answer is chosen
        $(this).addClass('btn-success').removeClass('btn-info');
        
        trivia.correct++;
        clearInterval(trivia.timerId);
        resultId = setTimeout(trivia.guessResult, 1000);
        $('#results').html('<h3>Correct Answer!</h3>');
      }
      // else the user picked the wrong option, increment incorrect
      else{
        // Clicked button turns red if the wrong answer was selected
        $(this).addClass('btn-danger').removeClass('btn-info');
        
        trivia.incorrect++;
        clearInterval(trivia.timerId);
        resultId = setTimeout(trivia.guessResult, 1000);
        $('#results').html('<h3>Wrong Try Again! '+ currentAnswer +'</h3>');
      }
      
    },
    // Move from previous question to next question
    guessResult : function(){
      
      // increment to next question in the set 
      trivia.currentSet++;
      
      // remove the answer choices and results
      $('.option').remove();
      $('#results h3').remove();
      
      // Move to the next question
      trivia.nextQuestion();
       
    }
  
  }