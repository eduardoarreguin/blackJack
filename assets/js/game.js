const game = (() => {
    'use strict'

    let deck          = [];
    let pointsPlayers = [];

    const types       = [ 'C', 'D', 'H', 'S' ],
        specials      = [ 'A', 'J', 'Q', 'K' ];
    

    //html referencs
    const btnAsk        = document.querySelector('#btnAsk'),
        btnStop         = document.querySelector('#btnStop'),
        btnNew          = document.querySelector('#btnNew'),
        divCardsPlayers = document.querySelectorAll('.divCards'),
        points          = document.querySelectorAll('small');
    btnAsk.disabled  = true;
    btnStop.disabled = true;

    const gameStart = ( numberPlayers = 2 ) => {
        deck = createDeck();
        pointsPlayers = [];
        for( let i = 0; i < numberPlayers; i++ ){
            pointsPlayers.push(0);
            points[ i ].innerText = 0;
            divCardsPlayers[ i ].innerHTML = '';
        };
        btnAsk.disabled         = false;
        btnStop.disabled        = false;
    }

    //this function create new deck
    const createDeck = () => {
        deck = [];
        for( let i = 2; i <= 10; i++ ){
            for( let type of types ){
                deck.push( `${ i }${ type }`)
            }
        }
        for( let type of types ){
            for( let special of specials ){
                deck.push( `${ special }${ type }`)
            }
        }
        return _.shuffle( deck ); 
    };

    

    //this function ask for a Card
    const askCard = () => deck[0] ? deck.pop() : console.error('the letters are finished');

    const valueCard = ( card ) =>{
        let value = card.substring( 0, card.length - 1 ); 
        return isNaN( value ) ? 
                value === 'A' ? 11 : 10 
            : value * 1;
    }

    const accumulatePoints = ( card, turn ) => {
        pointsPlayers[ turn ] += valueCard( card );
        points[ turn ].innerText = pointsPlayers[ turn ];
        return pointsPlayers[ turn ];
    }

    const createCard = ( card, turn  ) => {
        const imgCard = document.createElement('img');
        imgCard.src   = `assets/cartas/${ card }.png`;
        imgCard.classList.add( 'card' );
        divCardsPlayers[ turn ].append( imgCard );
    }

    const decideWinner = () => {
        const [ minimumPoints, pointsCompuer ] = pointsPlayers;
        setTimeout(() => {
            if ( minimumPoints === pointsCompuer ) alert('Draw try again'); 
            else if ( ( minimumPoints > 21 ) || ( ( minimumPoints < 21 ) && ( pointsCompuer > minimumPoints ) && ( pointsCompuer <= 21 ) ) ) alert('Sorry, you are loser');
            else if ( ( pointsCompuer > 21 ) || ( pointsCompuer < minimumPoints ) ) alert('Congratulations you are winer');

        }, 100);
    }

    //computer turn
    const computerTurn = ( minimumPoints ) => {
        let pointsCompuer = 0;
        do{
            const card = askCard()
            pointsCompuer = accumulatePoints( card, pointsPlayers.length - 1 );
            createCard(card, pointsPlayers.length - 1 );

        }while( ( pointsCompuer < minimumPoints ) && ( minimumPoints < 21 ) );

        decideWinner()

    }

    //Events
    btnAsk.addEventListener( 'click', () => {
        const card = askCard();
        pointsPlayers[ 0 ] = accumulatePoints( card, 0 )

        createCard( card, 0 );

        if( pointsPlayers[ 0 ] >= 21){
            console.warn('You are loser');
            btnAsk.disabled  = true;
            btnStop.disabled = true;
            computerTurn( pointsPlayers[ 0 ] );
        }
    } );

    btnStop.addEventListener( 'click', () => {
        btnAsk.disabled  = true;
        btnStop.disabled = true;
        computerTurn( pointsPlayers[ 0 ] );
    });

    btnNew.addEventListener( 'click', () => {
        gameStart();
    });

    return {
        start: gameStart
    }
} )();
