# 🎮 Tomodachi Coin Game

An **interactive multiplayer psychological coin game** inspired by the *Tomodachi Game* anime.  
Built using **Node.js**, **Express**, and **Socket.IO**, this project recreates the tension-filled coin challenge where trust, lies, and friendship are tested.

---

## 🚀 Features

- 🧠 Psychological yes/no coin game (5 rounds)
- 👥 Multiplayer (room-based system)
- 🔁 Reader rotation after each round
- 💰 Debt system (auto updates after results)
- 🤐 Talking penalty (doubles debt)
- 🪙 Real-time coin animation with sound
- ⏱️ Countdown timer per round
- ✉️ Animated envelope for reader question
- 🌟 Modern UI/UX with blinking reader & effects

---

## 🧩 Tech Stack

| Technology | Purpose |
|-------------|----------|
| **Node.js** | Backend runtime |
| **Express.js** | HTTP server |
| **Socket.IO** | Real-time multiplayer communication |
| **HTML, CSS, JS** | Frontend and animations |

---

## 📁 Folder Structure

tomodachi-game/
│
├── server.js
├── package.json
└── public/
├── index.html
├── style.css
├── script.js
└── assets/
├── envelope.png
└── coin-flip.mp3

yaml
Copy code

---

## ⚙️ Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/chikolavosaki-sys/game-of-trust-and-debt.git
   cd tomodachi-coin-game
Install dependencies

bash
Copy code
npm install
Run the server

bash
Copy code
node server.js
or (recommended for auto-reload)

bash
Copy code
npx nodemon server.js
Open in browser

arduino
Copy code
http://localhost:3000
🕹️ How to Play
Open the game in multiple browsers/tabs.

Enter a name and the same Room ID to join together.

The first player becomes the Reader.

The Reader gets a secret question in an envelope.

All players vote Yes/No secretly.

Coin flips to show result → debts update.

After 5 rounds, the player with highest debt loses.

🎨 UI & Effects
Blinking Reader Name

Animated Envelope Reveal

Coin Flip Animation with Sound

Countdown Timer

Dynamic Debt Display

🔒 Disclaimer
This game is meant for educational & entertainment purposes only.
No real-money transactions or gambling elements are included.

💡 Future Enhancements
🎵 Background suspense music

📱 Responsive mobile version

🧩 AI-driven traitor hint system

🌐 Online deployment (Render / Vercel)


🧑‍💻 Author
PRITHVI CHANDRA SURYA
📧 p.c.surya001@gmail.com


⭐ Contribute
If you’d like to improve this project:

Fork it

Create a branch (feature/new-feature)

Commit changes

Create a Pull Request
