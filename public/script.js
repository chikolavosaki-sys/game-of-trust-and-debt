const socket = io();

const joinBtn = document.getElementById('joinBtn');
const voteSection = document.getElementById('voteSection');
const resultDiv = document.getElementById('result');
const playersDiv = document.getElementById('playersList');
const roundInfoDiv = document.getElementById('roundInfo');
const coin = document.getElementById('coin');
const chatInput = document.getElementById('chatInput');
const sendBtn = document.getElementById('sendBtn');
const envelope = document.getElementById('envelope');
const countdownDiv = document.getElementById('countdown');
const coinSound = new Audio('assets/coin-flip.mp3');

let playerName = '';
let roomId = '';

joinBtn.addEventListener('click', () => {
    playerName = document.getElementById('playerName').value;
    roomId = document.getElementById('roomId').value;
    if (!playerName || !roomId) return alert('Enter name and room ID');

    socket.emit('joinRoom', { roomId, playerName });
    voteSection.style.display = 'block';
});

document.querySelectorAll('.voteBtn').forEach(btn => {
    btn.addEventListener('click', () => {
        const vote = btn.dataset.vote;
        socket.emit('submitVote', { roomId, vote });
        resultDiv.innerHTML = 'Vote submitted!';
    });
});

socket.on('updatePlayers', (players) => {
    playersDiv.innerHTML = '';
    players.forEach(p => {
        const div = document.createElement('div');
        div.textContent = `${p.name} - Debt: ${p.debt}`;
        if (p.isReader) div.classList.add('reader');
        playersDiv.appendChild(div);
    });
});

socket.on('newReader', (readerName) => {
    roundInfoDiv.innerHTML = `Round: ${roundInfoDiv.dataset.round || 1} | Reader: ${readerName}`;
    voteSection.style.border = '2px solid red';
    setTimeout(() => voteSection.style.border = 'none', 1500);
    startCountdown(10);
});

socket.on('questionForReader', (question) => {
    envelope.style.display = 'block';
    envelope.style.transform = 'scale(1.2)';
    setTimeout(() => envelope.style.transform = 'scale(1)', 500);
    setTimeout(() => {
        alert(`Reader Question: ${question.q} (Answer: ${question.answer})`);
        envelope.style.display = 'none';
    }, 700);
});

function startCountdown(seconds) {
    countdownDiv.innerHTML = `Time Left: ${seconds}`;
    let time = seconds;
    const timer = setInterval(() => {
        time--;
        countdownDiv.innerHTML = `Time Left: ${time}`;
        if (time <= 0) {
            clearInterval(timer);
            countdownDiv.innerHTML = "Time's Up!";
        }
    }, 1000);
}

socket.on('roundResult', ({ round, coinResult, votesCount, players }) => {
    roundInfoDiv.dataset.round = round + 1;
    resultDiv.innerHTML = `Coin Result: ${coinResult} | Yes: ${votesCount.yes || 0}, No: ${votesCount.no || 0}`;

    playersDiv.innerHTML = '';
    players.forEach(p => {
        const div = document.createElement('div');
        div.textContent = `${p.name} - Debt: ${p.debt}`;
        if (p.isReader) div.classList.add('reader');
        playersDiv.appendChild(div);
    });

    coinSound.currentTime = 0;
    coinSound.play();

    coin.style.transition = 'transform 1s ease-in-out';
    coin.style.transform = 'translateX(0px) rotate(0deg)';
    setTimeout(() => {
        if (coinResult === 'Yes') coin.style.transform = 'translateX(120px) rotate(720deg)';
        else coin.style.transform = 'translateX(-120px) rotate(-720deg)';
    }, 200);
});

socket.on('gameEnd', (players) => {
    resultDiv.innerHTML = `<h3>Game Over!</h3>` +
        players.map(p => `${p.name} - Debt: ${p.debt}`).join('<br>');
    voteSection.style.display = 'none';
});

sendBtn.addEventListener('click', () => {
    socket.emit('talkingPenalty', roomId);
});

socket.on('applyPenalty', (playerId) => {
    if (socket.id === playerId) alert("You spoke! Debt doubled!");
});
