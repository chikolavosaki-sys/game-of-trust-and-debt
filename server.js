const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));

const rooms = {};
const questions = [
    { q: "Do you trust the person next to you?", answer: "Yes" },
    { q: "Would you betray a friend for money?", answer: "No" },
    { q: "Do you think someone here is a traitor?", answer: "Yes" },
    { q: "Will the group pass the coin challenge?", answer: "Yes" },
    { q: "Are you keeping a secret?", answer: "No" }
];

function getNextReader(room) {
    const players = room.players;
    room.readerIndex = (room.readerIndex + 1) % players.length;
    players.forEach(p => p.isReader = false);
    players[room.readerIndex].isReader = true;
    return players[room.readerIndex];
}

io.on('connection', (socket) => {
    console.log('Player connected: ' + socket.id);

    socket.on('joinRoom', ({ roomId, playerName }) => {
        if (!rooms[roomId]) {
            rooms[roomId] = { players: [], votes: {}, round: 1, maxRounds: 5, readerIndex: -1 };
        }
        const room = rooms[roomId];
        room.players.push({ id: socket.id, name: playerName, debt: 1000, isReader: false });
        socket.join(roomId);

        if (room.players.length === 1) {
            const reader = getNextReader(room);
            io.to(roomId).emit('newReader', reader.name);
            io.to(reader.id).emit('questionForReader', questions[room.round - 1]);
        }

        io.to(roomId).emit('updatePlayers', room.players);
    });

    socket.on('submitVote', ({ roomId, vote }) => {
        const room = rooms[roomId];
        if (!room) return;

        room.votes[socket.id] = vote;

        if (Object.keys(room.votes).length === room.players.length) {
            const votes = Object.values(room.votes);
            const yesCount = votes.filter(v => v === 'Yes').length;
            const noCount = votes.filter(v => v === 'No').length;

            let coinResult = '';
            if (yesCount === votes.length) coinResult = 'Yes';
            else if (noCount === votes.length) coinResult = 'No';
            else coinResult = yesCount < noCount ? 'Yes' : 'No';

            const reader = room.players.find(p => p.isReader);
            room.players.forEach(p => {
                if (p.id !== reader.id && coinResult === 'No') p.debt *= 2;
            });
            reader.debt = Math.floor(reader.debt / 2);

            io.to(roomId).emit('roundResult', {
                round: room.round,
                coinResult,
                votesCount: { yes: yesCount, no: noCount },
                players: room.players
            });

            room.votes = {};
            room.round++;

            if (room.round <= room.maxRounds) {
                const nextReader = getNextReader(room);
                io.to(roomId).emit('newReader', nextReader.name);
                io.to(nextReader.id).emit('questionForReader', questions[room.round - 1]);
            } else {
                io.to(roomId).emit('gameEnd', room.players);
            }
        }
    });

    socket.on('talkingPenalty', (roomId) => {
        const room = rooms[roomId];
        if (!room) return;
        const player = room.players.find(p => p.id === socket.id);
        if (player) player.debt *= 2;
        io.to(socket.id).emit('applyPenalty', socket.id);
        io.to(roomId).emit('updatePlayers', room.players);
    });

    socket.on('disconnect', () => {
        for (let roomId in rooms) {
            const room = rooms[roomId];
            room.players = room.players.filter(p => p.id !== socket.id);
            io.to(roomId).emit('updatePlayers', room.players);
        }
    });
});

server.listen(3000, () => console.log('Server running on http://localhost:3000'));
