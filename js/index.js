const quoteDisplayElement = document.getElementById('quoteDisplay');
const hiddenInputElement = document.getElementById('hiddenInput');
const timerElement = document.getElementById('timeDisplay');
const wpmElement = document.getElementById('wpm');
const accuracyElement = document.getElementById('accuracy');
const bestWpmElement = document.getElementById('bestWpm');
const btn = document.getElementById('btn');
const quoteContainer = document.querySelector('.quote-container');

const FALLBACK_QUOTES = [
    "The way to get started is to quit talking and begin doing.",
    "If life were predictable it would cease to be life, and be without flavor.",
    "If you look at what you have in life, you'll always have more.",
    "Life is what happens when you're busy making other plans.",
    "Spread love everywhere you go. Let no one ever come to you without leaving happier.",
    "It is during our darkest moments that we must focus to see the light.",
    "Do not go where the path may lead, go instead where there is no path and leave a trail."
];

let timeElapsed = 0;
let timer = null;
let isPlaying = false;

// Tracking vars for current quote
let totalCharactersTyped = 0;
let correctCharactersTyped = 0;

// Initialize Best WPM from localStorage
let bestWpm = localStorage.getItem('bestWpm') || 0;
bestWpmElement.innerText = bestWpm;

async function fetchQuote() {
    try {
        const response = await fetch('https://dummyjson.com/quotes/random');
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        return data.quote;
    } catch (error) {
        console.error("Error fetching quote, using fallback.", error);
        return FALLBACK_QUOTES[Math.floor(Math.random() * FALLBACK_QUOTES.length)];
    }
}

async function renderNewQuote() {
    const quote = await fetchQuote();
    quoteDisplayElement.innerHTML = '';
    
    quote.split('').forEach(character => {
        const characterSpan = document.createElement('span');
        characterSpan.innerText = character;
        quoteDisplayElement.appendChild(characterSpan);
    });
    
    if (quoteDisplayElement.firstChild) {
        quoteDisplayElement.firstChild.classList.add('active');
    }
    hiddenInputElement.value = null; // reset input
}

function startGame() {
    if (isPlaying) {
        // If restarting mid-game
        stopGame();
        return;
    }
    
    isPlaying = true;
    timeElapsed = 0;
    totalCharactersTyped = 0;
    correctCharactersTyped = 0;
    
    timerElement.innerText = `${timeElapsed}s`;
    wpmElement.innerText = '0';
    accuracyElement.innerText = '100%';
    
    btn.innerText = "Stop Game";
    
    renderNewQuote().then(() => {
        hiddenInputElement.focus();
        clearInterval(timer);
        timer = setInterval(updateTimer, 1000);
    });
}

function stopGame() {
    isPlaying = false;
    clearInterval(timer);
    hiddenInputElement.blur();
    btn.innerText = "Start Game";
    
    // Save Best WPM
    const currentWpm = calculateWpm();
    if (currentWpm > bestWpm && correctCharactersTyped > 0) {
        bestWpm = currentWpm;
        localStorage.setItem('bestWpm', bestWpm);
        bestWpmElement.innerText = bestWpm;
    }
}

function updateTimer() {
    timeElapsed++;
    timerElement.innerText = `${timeElapsed}s`;
    updateStats(); 
}

function calculateWpm() {
    if (timeElapsed === 0) return 0;
    // Standard WPM formula: (Correct Characters Typed / 5) / Time Elapsed (in minutes)
    let timeInMinutes = timeElapsed / 60;
    let wpm = Math.round((correctCharactersTyped / 5) / timeInMinutes);
    return isNaN(wpm) || wpm < 0 ? 0 : wpm;
}

function calculateAccuracy() {
    if (totalCharactersTyped === 0) return 100;
    let accuracy = Math.round((correctCharactersTyped / totalCharactersTyped) * 100);
    return isNaN(accuracy) || accuracy < 0 ? 0 : accuracy > 100 ? 100 : accuracy;
}

function updateStats() {
    wpmElement.innerText = calculateWpm();
    accuracyElement.innerText = `${calculateAccuracy()}%`;
}

quoteContainer.addEventListener('click', () => {
    if (isPlaying) hiddenInputElement.focus();
});

btn.addEventListener('click', startGame);

hiddenInputElement.addEventListener('input', () => {
    if (!isPlaying) return;

    totalCharactersTyped++;

    const arrayQuote = quoteDisplayElement.querySelectorAll('span');
    const arrayValue = hiddenInputElement.value.split('');
    
    let currentQuoteCorrect = 0;

    arrayQuote.forEach((characterSpan, index) => {
        const character = arrayValue[index];
        characterSpan.classList.remove('active');
        
        if (character == null) {
            characterSpan.classList.remove('correct');
            characterSpan.classList.remove('incorrect');
        } else if (character === characterSpan.innerText) {
            characterSpan.classList.add('correct');
            characterSpan.classList.remove('incorrect');
            currentQuoteCorrect++;
        } else {
            characterSpan.classList.remove('correct');
            characterSpan.classList.add('incorrect');
        }
    });

    correctCharactersTyped = currentQuoteCorrect;
    updateStats();
    
    // Setup active cursor on the next character to be typed
    if (arrayValue.length < arrayQuote.length) {
        arrayQuote[arrayValue.length].classList.add('active');
    }
});

// Submit quote on Enter key press
hiddenInputElement.addEventListener('keydown', (e) => {
    if (!isPlaying) return;
    
    if (e.key === 'Enter') {
        const arrayQuote = quoteDisplayElement.querySelectorAll('span');
        const arrayValue = hiddenInputElement.value.split('');
        
        let currentQuoteCorrect = 0;
        arrayQuote.forEach((characterSpan, index) => {
            const character = arrayValue[index];
            if (character === characterSpan.innerText) {
                currentQuoteCorrect++;
            }
        });
        
        correctCharactersTyped = currentQuoteCorrect;
        updateStats();
        
        // Change text display to show done message, stop game timer
        quoteDisplayElement.innerHTML = `Finished in ${timeElapsed}s! Press "Start Game" for another quote.`;
        stopGame();
        
        e.preventDefault();
    }
});
