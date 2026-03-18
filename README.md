# Modern Typing Speed Test

A premium, interactive web-based typing game to test and improve your typing speed and accuracy.

## Features

- **Modern UI**: A sleek, dark theme with glassmorphism design and smooth animations.
- **Dynamic Quotes**: Fetches an endless streams of random quotes from the `dummyjson` API, with an offline fallback.
- **Real-Time Highlighting**: Keystrokes are instantly validated as you type, highlighting correct characters in green and incorrect ones in red.
- **Live Metrics**:
  - **Timer/Stopwatch**: Counts how long it takes to complete a quote.
  - **Accuracy**: Calculates the exact percentage of correct vs incorrect keystrokes.
  - **WPM (Words Per Minute)**: Calculates your true Words Per Minute based on the standard `(characters / 5) / minutes` formula.
- **Personal Leaderboard**: Automatically saves your highest WPM score to your browser's local storage so you can compete against yourself.

## How to Play

1. Open `index.html` in your web browser (or start a local server).
2. Click **Start Game**.
3. Type the quote exactly as it appears.
4. When you reach the end of the quote, press the **Enter** key to submit your score.
5. Review your final WPM, Accuracy, and Time, then click "Start Game" again for a new quote!

## Technologies Used

- **HTML5**: Semantic layout.
- **Vanilla CSS3**: Styling, Flexbox, custom animations, and responsive design.
- **Vanilla JavaScript**: DOM manipulation, REST API fetching (`fetch`), event listeners, and timing logic.

## Setup & Running Locally

Since this is a vanilla frontend project, no build tools are strictly required. You can simply open `index.html` in your browser.

However, to avoid any CORS issues with the API fetch, it's recommended to run a simple HTTP server. For example, if you have Python installed:

```bash
python -m http.server 8000
```

Then visit `http://localhost:8000`.

## License

This project is open-source and available for anyone to modify and improve!
