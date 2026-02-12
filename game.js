// Game State
const gameState = {
    currentLevel: 0,
    score: 0,
    questionsPerLevel: 3,
    currentQuestion: 0,
    correctAnswers: 0
};

// Levels and Questions
const levels = [
    {
        name: "Python",
        color: "#3776ab",
        questions: [
            {
                question: "What does 'print()' do in Python?",
                answers: ["Displays output", "Creates a printer", "Deletes code", "Compiles program"],
                correct: 0
            },
            {
                question: "How do you create a list in Python?",
                answers: ["list()", "[]", "new List()", "createList()"],
                correct: 1
            },
            {
                question: "What keyword defines a function in Python?",
                answers: ["function", "def", "func", "define"],
                correct: 1
            }
        ]
    },
    {
        name: "JavaScript",
        color: "#f7df1e",
        questions: [
            {
                question: "How do you declare a variable in JavaScript?",
                answers: ["var x", "variable x", "int x", "dim x"],
                correct: 0
            },
            {
                question: "What does '===' check in JavaScript?",
                answers: ["Assignment", "Strict equality", "Not equal", "Less than"],
                correct: 1
            },
            {
                question: "How do you write a comment in JavaScript?",
                answers: ["# comment", "// comment", "<!-- comment -->", "/* only */"],
                correct: 1
            }
        ]
    },
    {
        name: "HTML/CSS",
        color: "#e34f26",
        questions: [
            {
                question: "What does HTML stand for?",
                answers: ["Hyper Text Markup Language", "High Tech Modern Language", "Home Tool Markup Language", "Hyperlinks and Text Markup Language"],
                correct: 0
            },
            {
                question: "Which CSS property changes text color?",
                answers: ["text-color", "font-color", "color", "text-style"],
                correct: 2
            },
            {
                question: "Which tag creates a hyperlink?",
                answers: ["<link>", "<a>", "<href>", "<url>"],
                correct: 1
            }
        ]
    },
    {
        name: "Java",
        color: "#007396",
        questions: [
            {
                question: "What is the main method signature in Java?",
                answers: ["public static void main(String[] args)", "void main()", "main(): void", "public main()"],
                correct: 0
            },
            {
                question: "How do you create an object in Java?",
                answers: ["Object.create()", "new Object()", "create Object()", "Object()"],
                correct: 1
            },
            {
                question: "What keyword is used for inheritance in Java?",
                answers: ["inherits", "extends", "implements", "inherit"],
                correct: 1
            }
        ]
    },
    {
        name: "C++",
        color: "#00599c",
        questions: [
            {
                question: "What library is needed for cout?",
                answers: ["<stdio.h>", "<iostream>", "<cout.h>", "<stream>"],
                correct: 1
            },
            {
                question: "How do you declare a pointer in C++?",
                answers: ["int* ptr", "ptr int", "pointer int", "int ptr*"],
                correct: 0
            },
            {
                question: "What does 'endl' do in C++?",
                answers: ["Ends program", "New line and flush", "End loop", "Delete line"],
                correct: 1
            }
        ]
    }
];

// Canvas and Igor
let canvas, ctx;
let igor = {
    x: 50,
    y: 200,
    width: 40,
    height: 60,
    speed: 3,
    direction: 1,
    frame: 0
};

// Code Symbols (collectibles)
let codeSymbols = [];

// DOM Elements
const titleScreen = document.getElementById('title-screen');
const gameScreen = document.getElementById('game-screen');
const victoryScreen = document.getElementById('victory-screen');
const startBtn = document.getElementById('start-btn');
const playAgainBtn = document.getElementById('play-again-btn');
const currentLevelEl = document.getElementById('current-level');
const languageNameEl = document.getElementById('language-name');
const scoreValueEl = document.getElementById('score-value');
const progressFillEl = document.getElementById('progress-fill');
const questionTextEl = document.getElementById('question-text');
const answersEl = document.getElementById('answers');

// Event Listeners
startBtn.addEventListener('click', startGame);
playAgainBtn.addEventListener('click', resetGame);

// Keyboard Controls
const keys = {};
window.addEventListener('keydown', (e) => keys[e.key] = true);
window.addEventListener('keyup', (e) => keys[e.key] = false);

function startGame() {
    titleScreen.classList.remove('active');
    gameScreen.classList.add('active');
    
    canvas = document.getElementById('game-canvas');
    ctx = canvas.getContext('2d');
    canvas.width = 752;
    canvas.height = 400;
    
    initLevel();
    gameLoop();
}

function initLevel() {
    const level = levels[gameState.currentLevel];
    currentLevelEl.textContent = `Level ${gameState.currentLevel + 1}/5`;
    languageNameEl.textContent = level.name;
    gameState.currentQuestion = 0;
    gameState.correctAnswers = 0;
    
    // Reset Igor position
    igor.x = 50;
    igor.y = 200;
    
    // Create code symbols to collect
    codeSymbols = [];
    for (let i = 0; i < 5; i++) {
        codeSymbols.push({
            x: 150 + i * 120,
            y: Math.random() * 250 + 50,
            size: 20,
            collected: false,
            symbol: ['{}', '()', '[]', '<>', '//'][i]
        });
    }
    
    showQuestion();
}

function showQuestion() {
    const level = levels[gameState.currentLevel];
    const question = level.questions[gameState.currentQuestion];
    
    questionTextEl.textContent = question.question;
    answersEl.innerHTML = '';
    
    question.answers.forEach((answer, index) => {
        const btn = document.createElement('button');
        btn.className = 'answer-btn';
        btn.textContent = answer;
        btn.addEventListener('click', () => checkAnswer(index));
        answersEl.appendChild(btn);
    });
    
    updateProgress();
}

function checkAnswer(answerIndex) {
    const level = levels[gameState.currentLevel];
    const question = level.questions[gameState.currentQuestion];
    const buttons = answersEl.querySelectorAll('.answer-btn');
    
    if (answerIndex === question.correct) {
        buttons[answerIndex].classList.add('correct');
        gameState.correctAnswers++;
        gameState.score += 100;
        scoreValueEl.textContent = gameState.score;
    } else {
        buttons[answerIndex].classList.add('wrong');
        buttons[question.correct].classList.add('correct');
    }
    
    // Disable all buttons
    buttons.forEach(btn => btn.disabled = true);
    
    setTimeout(() => {
        gameState.currentQuestion++;
        if (gameState.currentQuestion < gameState.questionsPerLevel) {
            showQuestion();
        } else {
            completeLevel();
        }
    }, 1500);
}

function completeLevel() {
    if (gameState.currentLevel < levels.length - 1) {
        gameState.currentLevel++;
        setTimeout(() => {
            initLevel();
        }, 1000);
    } else {
        // Game completed!
        setTimeout(() => {
            gameScreen.classList.remove('active');
            victoryScreen.classList.add('active');
        }, 1000);
    }
}

function updateProgress() {
    const totalQuestions = levels.length * gameState.questionsPerLevel;
    const completedQuestions = gameState.currentLevel * gameState.questionsPerLevel + gameState.currentQuestion;
    const progress = (completedQuestions / totalQuestions) * 100;
    progressFillEl.style.width = progress + '%';
}

function resetGame() {
    gameState.currentLevel = 0;
    gameState.score = 0;
    gameState.currentQuestion = 0;
    gameState.correctAnswers = 0;
    
    victoryScreen.classList.remove('active');
    titleScreen.classList.add('active');
    
    scoreValueEl.textContent = '0';
    progressFillEl.style.width = '0%';
}

// Game Loop
function gameLoop() {
    if (!gameScreen.classList.contains('active')) return;
    
    // Update
    updateIgor();
    updateCodeSymbols();
    
    // Render
    render();
    
    requestAnimationFrame(gameLoop);
}

function updateIgor() {
    // Move Igor with arrow keys
    if (keys['ArrowLeft'] && igor.x > 0) {
        igor.x -= igor.speed;
        igor.direction = -1;
        igor.frame++;
    }
    if (keys['ArrowRight'] && igor.x < canvas.width - igor.width) {
        igor.x += igor.speed;
        igor.direction = 1;
        igor.frame++;
    }
    if (keys['ArrowUp'] && igor.y > 0) {
        igor.y -= igor.speed;
        igor.frame++;
    }
    if (keys['ArrowDown'] && igor.y < canvas.height - igor.height) {
        igor.y += igor.speed;
        igor.frame++;
    }
}

function updateCodeSymbols() {
    codeSymbols.forEach(symbol => {
        if (!symbol.collected) {
            // Check collision with Igor
            if (igor.x < symbol.x + symbol.size &&
                igor.x + igor.width > symbol.x &&
                igor.y < symbol.y + symbol.size &&
                igor.y + igor.height > symbol.y) {
                symbol.collected = true;
                gameState.score += 50;
                scoreValueEl.textContent = gameState.score;
            }
        }
    });
}

function render() {
    // Clear canvas
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw grid background
    ctx.strokeStyle = '#00ff0022';
    ctx.lineWidth = 1;
    for (let x = 0; x < canvas.width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }
    
    // Draw code symbols
    ctx.font = 'bold 20px Courier New';
    codeSymbols.forEach(symbol => {
        if (!symbol.collected) {
            ctx.fillStyle = levels[gameState.currentLevel].color;
            ctx.fillRect(symbol.x, symbol.y, symbol.size, symbol.size);
            ctx.fillStyle = '#000';
            ctx.fillText(symbol.symbol, symbol.x + 2, symbol.y + 16);
        }
    });
    
    // Draw Igor (pixelated character)
    drawIgor();
    
    // Draw instructions
    ctx.fillStyle = '#00ffff';
    ctx.font = '14px Courier New';
    ctx.fillText('Use Arrow Keys to move Igor and collect code symbols!', 10, 20);
}

function drawIgor() {
    // Hair (blond)
    ctx.fillStyle = '#FFD700';
    ctx.fillRect(igor.x + 5, igor.y, 30, 15);
    
    // Face
    ctx.fillStyle = '#FFB6C1';
    ctx.fillRect(igor.x + 5, igor.y + 15, 30, 20);
    
    // Eyes
    ctx.fillStyle = '#000';
    if (igor.direction === 1) {
        ctx.fillRect(igor.x + 15, igor.y + 20, 4, 4);
        ctx.fillRect(igor.x + 25, igor.y + 20, 4, 4);
    } else {
        ctx.fillRect(igor.x + 10, igor.y + 20, 4, 4);
        ctx.fillRect(igor.x + 20, igor.y + 20, 4, 4);
    }
    
    // Smile
    ctx.fillRect(igor.x + 15, igor.y + 28, 10, 2);
    
    // Body (shirt)
    ctx.fillStyle = '#FF0000';
    ctx.fillRect(igor.x + 5, igor.y + 35, 30, 15);
    
    // Pants
    ctx.fillStyle = '#0000FF';
    ctx.fillRect(igor.x + 5, igor.y + 50, 30, 10);
    
    // Legs
    ctx.fillStyle = '#654321';
    ctx.fillRect(igor.x + 10, igor.y + 50, 8, 10);
    ctx.fillRect(igor.x + 22, igor.y + 50, 8, 10);
    
    // Outline
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.strokeRect(igor.x + 5, igor.y, 30, 60);
}

// Initialize
console.log('Igor\'s Coding Quest - Ready to play!');
