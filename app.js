document.querySelectorAll('.btns button').forEach(button => {
    button.addEventListener('click', (e) => {
        const choosenDifficulty = e.currentTarget.dataset.difficultylvl;
        startGame(choosenDifficulty);
        document.querySelector('.chooseDifficulty').classList.add('hidden');
        document.querySelector('main').classList.remove('hidden');
    });

    button.addEventListener('mouseover', (e) => {
        const hoveredLVL = e.currentTarget.dataset.difficultylvl;
        const opisPoziomu = document.querySelector('.description .opis');
        if(hoveredLVL === 'easy'){
            opisPoziomu.innerText = 'Poziom trudności "Easy" charakteryzuje się najmniejsza ilością kolorów które należy odgadnąć, aby wygrać gre, wynosi ona 5 pól';
        }else if(hoveredLVL === 'medium'){
            opisPoziomu.innerText = 'Poziom trudności "Medium" jest najlepiej zbilansowaną rozgrywką jeżeli chodzi o poziom trudności. Ilość pól jest nieco większą niż na poziomie "Easy" jednak dostarcza to większej zabawy i satysfakcji z gry. Liczba pól wynosi 8.';
        }else{
            opisPoziomu.innerText = 'Poziom trudności "Hard" jest przeznaczony dla osób zaznajomionych z grą. Poziom ten jak sama nazwa wskazuje cechuje się wymagającą rozgrywką, ponieważ ilość pól jest znacznie większa, co łączy się z większą ilością kombinacji które możemy ustawić. Zaleca się rozegranie kilku rozgrywek przez wybraniem tego poziomu. Liczba pól znajdujących się na tym poziomie wynosi aż 12 pól!';
        };
    });
});

const startGame = (difficultyLvl) => {
    const canvas = document.querySelector('#game_canvas');
    const ctx = canvas.getContext('2d');

    const ok = new Image(50, 50);
    ok.src = 'assets/ok.png';

    const elsewhere = new Image(50, 50);
    elsewhere.src = 'assets/elsewhere.png';

    const none = new Image(50, 50);
    none.src = 'assets/none.png';

    const PILL_WIDTH = 80;
    const PILL_HEIGHT = 80;

    let activePill = 0;
    let roundNumber = 1;

    let colors = ["firebrick", "seagreen", "dodgerblue", "orange", "yellow", "sienna", "magenta", "gray"];

    let solution = [];

    let difficulty = difficultyLvl;

    let moreBlock = undefined;
    let Moved = undefined;
    let boardSize = undefined;
    let row = 0;
    let howManyMove = undefined;
    let howLongRow = undefined;
    let arrowRow = undefined;

    if(difficulty === 'easy'){
        solution = [colors[Math.floor(Math.random()*8)], colors[Math.floor(Math.random()*8)], colors[Math.floor(Math.random()*8)], colors[Math.floor(Math.random()*8)], colors[Math.floor(Math.random()*8)]];

        boardSize = 5;
        howManyMove = 4;
        Moved = 1;
        moreBlock = 0;
        howLongRow = 5;
    }else if(difficulty === 'medium'){
        solution = [colors[Math.floor(Math.random()*8)], colors[Math.floor(Math.random()*8)], colors[Math.floor(Math.random()*8)], colors[Math.floor(Math.random()*8)], colors[Math.floor(Math.random()*8)], colors[Math.floor(Math.random()*8)], colors[Math.floor(Math.random()*8)], colors[Math.floor(Math.random()*8)]];

        boardSize = 8;
        howManyMove = 7;
        Moved = 4;
        howLongRow = 4;
        arrowRow = 3;
        moreBlock = 1;
    }else if(difficulty === 'hard'){
        solution = [colors[Math.floor(Math.random()*8)], colors[Math.floor(Math.random()*8)], colors[Math.floor(Math.random()*8)], colors[Math.floor(Math.random()*8)], colors[Math.floor(Math.random()*8)], colors[Math.floor(Math.random()*8)], colors[Math.floor(Math.random()*8)], colors[Math.floor(Math.random()*8)], colors[Math.floor(Math.random()*8)], colors[Math.floor(Math.random()*8)], colors[Math.floor(Math.random()*8)], colors[Math.floor(Math.random()*8)]];

        boardSize = 12;
        howManyMove = 11;
        Moved = 6;
        howLongRow = 6;
        arrowRow = 4;
        moreBlock = 1;
    };

let state = ["empty", "empty", "empty", "empty", "empty"];

const guess = (e) => {
    if(activePill >= 0 && activePill <= boardSize){
        let pillColor = e.currentTarget.color;
        if(difficulty === 'easy'){
            drawPill(100 + activePill * 100, 50, pillColor);
        }
        if(difficulty === 'medium'){
            if(row < 4){
                drawPill(100 + activePill * 100, 50, pillColor);
            }else if(row > 3){
                drawPill(100 + (activePill - Moved) * 100, 215, pillColor);
            }
            row++;
        }
        if(difficulty === 'hard'){
            if(row < 6){
                drawPill(100 + activePill * 100, 50, pillColor);
            }else if(row > 5){
                drawPill(100 + (activePill - Moved) * 100, 215, pillColor);
            }
            row++;
        }
        state[activePill] = pillColor;
        if(activePill < howManyMove){
            activePill++;
        }else{
            checkBoard();
        }
        drawArrow();
    };
};

const checkBoard = () => {
    activePill = 0;
    row = 0;
    startBoard();
    drawArrow();

    let win = true;

    for(let i = 0; i < boardSize; i++){
        if(i < howLongRow){
            drawPill(100 + i * 100, 360, state[i]);
        }else{
            drawPill(100 + (i - Moved) * 100, 530, state[i]);
        };

        if(state[i] != solution[i]){
            win = false;
        };
    };

    ctx.fillStyle = 'black';
    ctx.fillRect(100, 450, 600, 80);

    ctx.fillStyle = 'black';
    ctx.fillRect(100, 620, 600, 80);

    infoEmotes();

    if(win){
        winGame();
    }else{
        roundNumber++;
        drawScore();
    };
};

const winGame = () => {
    ctx.fillStyle = 'black';
    ctx.fillRect(80, 20, 650, 280);
    activePill = -999;
    drawArrow();
    ctx.fillStyle = 'orange';
    ctx.font = '78px Arial';
    ctx.fillText('YOU WIN!', 240, 130);
    document.querySelector('.comment').innerHTML = `Udało Ci się ustalić kolory wszystkich bloków w rundzie nr: ${roundNumber}`;
    document.querySelectorAll('.colorBlock').forEach(element => {
        element.style.display = 'none';
    });
    document.querySelector('#delete').style.display = 'none';
    const endBtn = document.createElement('span');
    endBtn.setAttribute('id', 'again');
    endBtn.textContent = 'Zagraj ponownie!';
    document.querySelector('.controls').appendChild(endBtn);
    document.querySelector('#again').addEventListener('click', () => {
        window.location.reload();
    });
}

const infoEmotes = () => {
    for(let i = 0; i < boardSize; i++){
        if(state[i] === solution[i]){
            if(i < howLongRow){
                ctx.drawImage(ok, 115 + i * 100, 460);
            }else{
                ctx.drawImage(ok, 115 + (i - Moved) * 100, 630);
            }
        }else{
            let innySpot = false;
            for(let j = 0; j < boardSize; j++){
                if(state[i] === solution[j]){
                    innySpot = true;
                };
            };
            if(innySpot){
                if(i < howLongRow){
                    ctx.drawImage(elsewhere, 115 + i * 100, 460);
                }else{
                    ctx.drawImage(elsewhere, 115 + (i - Moved) * 100, 630);
                }
            }else{
                if(i < howLongRow){
                    ctx.drawImage(none, 115 + i * 100, 460);
                }else{
                    ctx.drawImage(none, 115 + (i - Moved) * 100, 630);
                }
            };
        };
    };
};

document.querySelectorAll('.colorBlock').forEach(element => {
    element.style.backgroundColor = colors[element.dataset.color];
    element.addEventListener('click', guess);
    element.color = colors[element.dataset.color];
});


const drawPill = (x, y, type) => {
    ctx.fillStyle = 'black';
    ctx.fillRect(x - 5, y - 5, PILL_WIDTH + 10, PILL_HEIGHT + 10);

    if(type === 'empty'){
        ctx.strokeStyle = "white";
        ctx.strokeRect(x, y, PILL_WIDTH, PILL_HEIGHT);
    }else{
        ctx.fillStyle = type;
        ctx.fillRect(x, y, PILL_WIDTH, PILL_HEIGHT);
    }
}

const drawArrow = () => {
    ctx.fillStyle = 'black';
    ctx.fillRect(100, 140, 580, 60);

    ctx.fillStyle = 'black';
    ctx.fillRect(100, 295, 580, 60);
    
    ctx.fillStyle = 'white';
    ctx.font = '32px Arial';
    if(row < howLongRow){
        ctx.fillText('↑', 135 + activePill * 100, 180);
    }else if(row > arrowRow){
        ctx.fillText('↑', 135 + (activePill - Moved) * 100, 340);
    };
};

const startBoard = () => {
    ctx.fillStyle = 'black';
    ctx.fillRect(90, 40, 500, 100);

    for(let i = 0; i < (boardSize + moreBlock); i++){
        if(i < howLongRow){
            drawPill(100 + i * 100, 50, 'empty');
        }else if(i > howLongRow){
            drawPill(100 + (i - (Moved + 1)) * 100, 215, 'empty');
        }
    };

    drawArrow();
};

const resetPill = () => {
    if(activePill > 0){
        if(row < howLongRow){
            drawPill(100 + (activePill - 1) * 100, 50, 'empty');
            state[activePill-1] = 'empty';
            activePill--;
            row--;
            drawArrow();
        }else if(row === howLongRow){
            drawPill(100 + (activePill - 1) * 100, 50, 'empty');
            state[activePill-1] = 'empty';
            activePill--;
            row--;
            drawArrow();
        }else{
            drawPill(100 + (activePill - (Moved + 1)) * 100, 215, 'empty');
            state[activePill-1] = 'empty';
            activePill--;
            row--;
            drawArrow();
        }
    }
};

const drawScore = () => {
    ctx.fillStyle = 'black';
    ctx.fillRect(740, 40, 110, 130);

    ctx.strokeStyle = 'orange';
    ctx.beginPath();
    ctx.arc(795, 90, 45, 0, 2 * Math.PI);
    ctx.stroke();

    ctx.fillStyle = 'orange';
    ctx.font = '44px Arial';
    if(roundNumber < 10){
        ctx.fillText(roundNumber, 780, 105);
    }else{
        ctx.fillText(roundNumber, 770, 105);
    }
    ctx.font = '20px Arial';
    ctx.fillText('Runda', 765, 165);
}

const showHelp = () => {
    document.querySelector('.help').classList.add('show');
};

const closeHelp = () => {
    document.querySelector('.help').classList.remove('show');
};

document.querySelector('#delete').addEventListener('click', resetPill);
document.querySelector('#help').addEventListener('click', showHelp);
document.querySelector('#closeHelp').addEventListener('click', closeHelp);

startBoard();
drawScore();
}