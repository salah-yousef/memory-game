/*
 * Create a list that holds all of your cards
 */

var gameCards=["diamond","paper-plane-o","anchor","bolt","cube","leaf","bicycle","bomb","diamond","paper-plane-o","anchor","bolt","cube","leaf","bicycle","bomb"];
shuffle(gameCards);

const fragment = document.createDocumentFragment();
for (var index = 0; index <= 15; index++) {
    var myLi = document.createElement('li');
    var myIcon = document.createElement('i');
    myLi.classList.add("card");
    myLi.classList.add("animated");
    myLi.setAttribute("id",index);
    myLi.setAttribute("value",0);
    myIcon.classList.add("fa");
    myIcon.classList.add("fa-"+gameCards[index]);
    myLi.appendChild(myIcon);
    fragment.appendChild(myLi);
}

document.getElementsByClassName('deck')[0].appendChild(fragment);

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}


/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

var cardsList = [];
for (var index = 0; index < gameCards.length; index++) {
    cardsList[index]=$('#'+index).get(0);
}

var cardClicksNumber = 0;
var firstClickedCard = null;
var secondClickedCard = null;
var moves = 0;
var successfullyMatched = 0;
var stars = 3;
var onlyTwoCard = 0;
$('.card').on('click',function engine(event) {
if(onlyTwoCard==0){
    $(this).addClass('flipInY');
    $(this).addClass('cardFlipped');
    thisId = $(this).attr("id");
    
    if( $("#"+thisId).val() != 1){
        $("#"+thisId).val(1);
        $(this).addClass('show');
        for (var index = 0; index < gameCards.length; index++) {
            if(cardsList[index].value == 1){
                cardClicksNumber ++;
            }
            if((cardClicksNumber==1)&&(cardsList[index].value == 1)){
                firstClickedCard = $(this).find('i:first').attr('class').split(' ')[1];
                firstClickedCardID=thisId;
            }
            if((cardClicksNumber==2)&&(cardsList[index].value == 1)){
                secondClickedCard = $(this).find('i:first').attr('class').split(' ')[1];
                secondClickedCardID=thisId;
                break;
            }
            
        }

        if ((firstClickedCard===secondClickedCard)&&(firstClickedCard!=null)&&(secondClickedCard!=null)) {
            onlyTwoCard++;
            moves++;
            successfullyMatched++;
            $('.moves').get(0).textContent=moves;
            $('#'+firstClickedCardID).off("click");
            $('#'+secondClickedCardID).off("click");
            $('#'+firstClickedCardID).removeClass('flipInY cardWrong shake cardFlipped');
            $('#'+secondClickedCardID).removeClass('flipInY cardWrong shake cardFlipped');
            $('#'+firstClickedCardID).addClass('cardRight rubberBand');
            $('#'+secondClickedCardID).addClass('cardRight rubberBand');
            $('#'+firstClickedCardID).removeAttr('value id');
            $('#'+secondClickedCardID).removeAttr('value id');
            setTimeout(waitForFlip, 500);
            firstClickedCard = null;
            secondClickedCard = null;
            cardClicksNumber = 0;
            function waitForFlip() {
                onlyTwoCard = 0;
            }
        }
        
        if ((firstClickedCard!=secondClickedCard)&&(cardClicksNumber==2)) {
            onlyTwoCard++;
            moves++;
            $('.moves').get(0).textContent=moves;
                for (var index = 0; index < gameCards.length; index++) {
                    $("#"+index).attr("value",0);
                }
            cardClicksNumber=0;
            $('#'+firstClickedCardID).attr("value",0);
            $('#'+secondClickedCardID).attr("value",0);
            $('#'+firstClickedCardID).on('click');
            $('#'+secondClickedCardID).on('click');
            $('#'+firstClickedCardID).removeClass('card cardFlipped');
            $('#'+secondClickedCardID).removeClass('card cardFlipped');
            $('#'+firstClickedCardID).addClass('cardWrong  shake');
            $('#'+secondClickedCardID).addClass('cardWrong  shake');
            //console.log($('.'+firstClickedCard).parent().attr("id"));
            //console.log($('.'+secondClickedCard).parent().attr("id"));
            setTimeout(hide, 500);
            function hide(){
                $('#'+firstClickedCardID).removeClass('flipInY cardWrong show');
                $('#'+secondClickedCardID).removeClass('flipInY cardWrong show');
                $('#'+firstClickedCardID).addClass('card');
                $('#'+secondClickedCardID).addClass('card');
                onlyTwoCard=0;

                firstClickedCard = null;
                secondClickedCard = null;
            }
        }
    }
    // starts handling 
    if (moves>10) {
        $("#firstStar").removeClass('fa-star');
        $("#firstStar").addClass('fa-star-o');
        if (stars==3) {
            stars--;
        }
    }
    if (moves>16) {
        $("#secondStar").removeClass('fa-star');
        $("#secondStar").addClass('fa-star-o');
        audio.playbackRate = 1.5;
        if (stars==2) {
            stars--;
        }
    }
    if (moves>20) {
        $("#thirdStar").removeClass('fa-star');
        $("#thirdStar").addClass('fa-star-o');
        audio.playbackRate = 2;
        if (stars==1) {
            stars--;
                // Game Over
                audio.src = '../assets/levelfailed.mp3';
                audio.play();
                
                $(".deck").get(0).insertAdjacentHTML('afterbegin','<p class="game-message game-over">Game over!</p>');
                $(".deck").get(0).insertAdjacentHTML('beforeend','<button class="game-message-button">Play Again!</button>'); 
                $(".deck").get(0).style.display = "inline";
                $('.timer-2').remove();
                $('li').remove();
                $('.game-message-button').on('click', function(){
                    location.reload();
                });
        }
    }
    if (successfullyMatched == 8) {
        audio.src = 'assets/levelcompvared.mp3';
        audio.play();
        $(".deck").get(0).insertAdjacentHTML('afterbegin','<div class="circle-loader"><div class="checkmark draw"></div></div>');
        $(".deck").get(0).insertAdjacentHTML('beforeend','<p class="game-message">Congratulations! You Won!</p>');
        $(".deck").get(0).insertAdjacentHTML('beforeend' ,'<p class="game-message_2">with '+moves+' Moves and '+stars+' Stars</p>');
        $(".deck").get(0).insertAdjacentHTML('beforeend' ,'<p class="game-message_2">Wooooooooooo!</p>');
        $(".deck").get(0).insertAdjacentHTML('beforeend','<button class="game-message-button">Play Again!</button>'); 
        $(".deck").get(0).style.display = "inline";
        $('li').remove();
        $('.timer-2').remove();
        $('.circle-loader').toggleClass('load-compvare');
        $('.checkmark').toggle();
        $('.game-message-button').on('click', function(){
            location.reload();
        });
    }
    }
});

// repeat action 
$('.fa-repeat').on('click', function(){
    location.reload();
});

// audio control 
$(document).on('click', '.play', function() {
    audio.play();
    $(this).removeClass('play').addClass('pause');
    $('a .fa-volume-up').removeClass('fa-volume-up').addClass('fa-volume-off');
});
  

$(document).on('click', '.pause', function() {
    audio.pause();
    $(this).removeClass('pause').addClass('play');
    $('a .fa-volume-off').removeClass('fa-volume-off').addClass('fa-volume-up');
});

// play audio
var audio = new Audio('assets/ToonMemoryGame.mp3');

audio.addEventListener('ended', function() {
    if ((duration.s >0)&&(stars>0)) {
        this.currentTime = 0;
        this.play();   
    }
}, false);
audio.play();
var duration = {s: 60 },
    sf = 120, 
    maxS = 60;

setInterval(function() {
  
  $('.s').html(duration.s)
    .attr('data-t', duration.s - 1);
  duration.s--;
  $('.s').addClass('flip');
  $('.is .circle').css('stroke-dashoffset', sf-(duration.s*(sf/maxS)));
  
  if (duration.s < 25) {
    audio.playbackRate = 1.5;
  }
  
  if (duration.s < 15) {
    audio.playbackRate = 2;
  }
  if ((duration.s === 0)&&(successfullyMatched<8)&&(stars>0)) {
    // Game Over
    audio.src = 'assets/levelfailed.mp3';
    audio.play();
    $(".deck").get(0).insertAdjacentHTML('afterbegin','<p class="game-message game-over">Game over!</p>');
    $(".deck").get(0).insertAdjacentHTML('beforeend','<button class="game-message-button">Play Again!</button>'); 
    $(".deck").get(0).style.display = "inline";
    $('li').remove();
    $('.timer-2').remove();
    $('.game-message-button').on('click', function(){
        location.reload();
    });
  }
}, 1000);