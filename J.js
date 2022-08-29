let blackjackGame = {
    'you': { 'scorespan': '#your-blackjack-result', 'div': '#your-box', 'score': 0 },
    'dealer': { 'scorespan': '#computer-blackjack-result', 'div': '#dealer-box', 'score': 0 },
    'card': ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'],
    'cardsMap': { '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10, 'J': 10, 'Q': 10, 'K': 10, 'A': 1 },
    'wins': 0,
    'losses': 0,
    'draws': 0,
    'isStand': false,
    'turnsOver': false,
};

const YOU = blackjackGame['you'];
const DEALER = blackjackGame['dealer'];
const hitSound = new Audio('swish.m4a');
const winSound = new Audio('cash.mp3');
const lossSound = new Audio('aww.mp3');

document.querySelector('#hit-btn').addEventListener('click', blackjackHit);

document.querySelector('#stand-btn').addEventListener('click', dealerLogic);

function blackjackHit() {
    if (blackjackGame['isStand'] == false) {
        let card = randomCard();
        showCard(YOU, card);
        updateScore(card, YOU);
        console.log(blackjackGame['you']['score']);
        showScore(YOU);
    }

}
function showCard(activePlayer, card) {
    let cardImage = document.createElement('img');
    cardImage.src = `${card}.png`;
    cardImage.style.height = '125px';
    document.querySelector(activePlayer['div']).appendChild(cardImage);
    hitSound.play();
}
document.querySelector('#deal-btn').addEventListener('click', blackjackDeal);

function blackjackDeal() {
    if (blackjackGame['turnsOver'] == true) {

        blackjackGame['isStand'] = false;
        let yourImages = document.querySelector('#your-box').querySelectorAll('img');
        let dealerImages = document.querySelector('#dealer-box').querySelectorAll('img');
        YOU['score'] = 0;
        DEALER['score'] = 0;

        document.querySelector('#your-blackjack-result').textContent = 0;
        document.querySelector('#computer-blackjack-result').textContent = 0;
        document.querySelector('#your-blackjack-result').style.color = '#ffffff';
        document.querySelector('#computer-blackjack-result').style.color = '#ffffff';

        for (let i = 0; i < yourImages.length; i++) {
            yourImages[i].remove();
        }
        for (let i = 0; i < dealerImages.length; i++) {
            dealerImages[i].remove();
        }

        document.querySelector('#head').textContent = "Let's Play BlackJack";
        document.querySelector('#head').style.color = "black";
        blackjackGame['turnsOver'] = true;

    }
}

function randomCard() {
    let randomIndex = Math.floor(Math.random() * 13);
    return blackjackGame['card'][randomIndex];
}

function updateScore(card, activePlayer) {
    activePlayer['score'] += blackjackGame['cardsMap'][card];
}

function showScore(activePlayer) {
    if (activePlayer['score'] > 21) {
        document.querySelector(activePlayer['scorespan']).textContent = "BUST !";
        document.querySelector(activePlayer['scorespan']).style.color = "red";

    }
    else {
        document.querySelector(activePlayer['scorespan']).textContent = activePlayer['score'];
    }
}

function sleep(ms){
    return new Promise(resolve => setTimeout(resolve,ms));
}

async function dealerLogic() {
    blackjackGame['isStand'] = true;
    while (DEALER['score'] < 16 && blackjackGame['turnsOver'] == true) {

        let card = randomCard();
        showCard(DEALER, card);
        updateScore(card, DEALER);
        showScore(DEALER);
        await sleep(1000);
    }


    let winner = computerWinner();
    showResult(winner);
    console.log(blackjackGame['turnsOver'])
    blackjackGame['turnsOver'] = true;
}


function computerWinner() {
    let winner;
    if (YOU['score'] <= 21) {
        if (YOU['score'] > DEALER['score'] || DEALER['score'] > 21) {
            console.log['You Win'];
            winner = YOU;
            blackjackGame['wins'] += 1;
        }
        else if (YOU['score'] < DEALER['score']) {
            console.log('You Lost');
            winner = DEALER;
            blackjackGame['losses'] += 1;
        }
        else if (YOU['score'] == DEALER['score']) {
            console.log('Draw');
            blackjackGame['draws'] += 1;
        }
    }
    else if (YOU['score'] > 21 && DEALER['score'] <= 21) {
        console.log('You Lost');
        blackjackGame['losses'] += 1;
        winner = DEALER;
    }
    else if (YOU['score'] > 21 && DEALER['score'] > 21) {
        console.log('Draw');
        blackjackGame['draws'] += 1;
    }
    console.log(winner + ' is the winner');
    return winner;
}

function showResult(winner) {
    let message, messageColor;

    if (blackjackGame['turnsOver'] == true) {


        if (winner == YOU) {
            message = 'You Won!';
            messageColor = 'green';
            document.querySelector('#wins').textContent = blackjackGame['wins'];
            winSound.play();
        }

        else if (winner == DEALER) {
            message = 'You Lost!';
            messageColor = 'red';
            document.querySelector('#losses').textContent = blackjackGame['losses'];
            lossSound.play();
        }

        else {
            message = 'Draw!';
            messageColor = 'black';
            document.querySelector('#draws').textContent = blackjackGame['draws'];
        }

        document.querySelector('#head').textContent = message;
        document.querySelector('#head').style.color = messageColor;
    }
}
