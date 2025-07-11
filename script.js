console.log("Cricket Game Initialized");

// Game Data
const teams = [
    { name: 'CSK', logo: '🐅' },
    { name: 'MI', logo: '🦁' },
    { name: 'RCB', logo: '👑' },
    { name: 'KKR', logo: '🎭' },
    { name: 'SRH', logo: '☀️' },
    { name: 'RR', logo: '🎩' },
    { name: 'GT', logo: '🦁' },
    { name: 'LSG', logo: '🔵' },
    { name: 'DC', logo: '🦅' },
    { name: 'PK', logo: '🔴' }
];
// DOM Elements Cache
const dom = {
    // Main elements
    screens: {
        'main-menu': document.getElementById('main-menu'),
        'team-selection': document.getElementById('team-selection'),
        'opponent-selection': document.getElementById('opponent-selection'),
        'match-setup': document.getElementById('match-setup'),
        'toss-screen': document.getElementById('toss-screen'),
        'match-play': document.getElementById('match-play'),
        'match-result': document.getElementById('match-result'),
        'tournament-progress': document.getElementById('tournament-progress'),
        'about': document.getElementById('about'),
        'rules': document.getElementById('rules'),
        'how-to-play': document.getElementById('how-to-play'),
        'keys': document.getElementById('keys')
    },
    
    // Scoreboard elements
    runs: document.getElementById('runs'),
    wickets: document.getElementById('wickets'),
    overs: document.getElementById('overs'),
    target: document.getElementById('target'),
    currentBattingTeam: document.getElementById('current-batting-team'),
    inningsTitle: document.getElementById('innings-title'),
    
    // Toss elements
    tossResult: document.getElementById('toss-result'),
    tossDecision: document.getElementById('toss-decision'),
    decisionMessage: document.getElementById('decision-message'),
    userDecision: document.getElementById('user-decision'),
    continueAfterToss: document.getElementById('continue-after-toss'),
    
    // Match elements
    ballResult: document.getElementById('ball-result'),
    inningsSummary: document.getElementById('innings-summary'),
    nextInningsBtn: document.getElementById('next-innings-btn'),
    startNextInnings: document.getElementById('start-next-innings'),
    
    // Result elements
    resultDisplay: document.getElementById('result-display'),
    
    // Tournament elements
    pointsTableBody: document.getElementById('points-table-body'),
    
    // Buttons
    quickMatchBtn: document.getElementById('quick-match-btn'),
    tournamentBtn: document.getElementById('tournament-btn'),
    startMatchBtn: document.getElementById('start-match-btn'),
    playAgainBtn: document.getElementById('play-again-btn'),
    mainMenuBtn: document.getElementById('main-menu-btn'),
    continueTournamentBtn: document.getElementById('continue-tournament')
};

// Game State
let gameState = {
    currentScreen: 'main-menu',
    userTeam: null,
    opponentTeam: null,
    overs: 1,
    isTournament: false,
    tournamentTeams: [],
    tournamentMatches: [],
    currentMatchIndex: 0,
    pointsTable: {},
    toss: {
        winner: null,
        decision: null
    },
    innings: {
        current: 1,
        battingTeam: null,
        bowlingTeam: null,
        runs: 0,
        wickets: 0,
        balls: 0,
        overs: 0,
        target: null
    },
    matchResult: null,
    playoffMatches: [],       // Stores playoff matches
    playoffStage: null,       // 'qualifier1', 'eliminator', 'qualifier2', 'final'
    currentPlayoffMatch: 0,   // Tracks which playoff match is active
    isPlayoffs: false
};

// DOM Elements
const screens = {
    'main-menu': document.getElementById('main-menu'),
    'team-selection': document.getElementById('team-selection'),
    'opponent-selection': document.getElementById('opponent-selection'),
    'match-setup': document.getElementById('match-setup'),
    'toss-screen': document.getElementById('toss-screen'),
    'match-play': document.getElementById('match-play'),
    'match-result': document.getElementById('match-result'),
    'tournament-progress': document.getElementById('tournament-progress'),
    'about': document.getElementById('about'),
    'rules': document.getElementById('rules'),
    'how-to-play': document.getElementById('how-to-play'),
    'keys': document.getElementById('keys')
};

// Initialize the game
function initGame() {
    console.log("initGame() called");
    // Initialize points table
    teams.forEach(team => {
        gameState.pointsTable[team.name] = {
            matches: 0,
            wins: 0,
            losses: 0,
            points: 0
        };
    });

    // Set up event listeners
    setupEventListeners();
    console.log("Event listeners set up to > initgame() called");
    
    // Show main menu
    showScreen('main-menu');
}

// Set up all event listeners
function setupEventListeners() {
    console.log("setupEventListeners() called");
    // Main menu buttons
    document.getElementById('quick-match-btn').addEventListener('click', () => {
        gameState.isTournament = false;
        console.log("Quick Match selected");
        showScreen('team-selection');
    });
    
    document.getElementById('tournament-btn').addEventListener('click', () => {
        gameState.isTournament = true;
        console.log("Tournament Match selected");
        showScreen('team-selection');
    });
    
    // Back buttons
    document.getElementById('back-to-menu').addEventListener('click', () => {
        showScreen('main-menu');
    });
    
    document.getElementById('back-to-teams').addEventListener('click', () => {
        showScreen('team-selection');
    });
    
    document.getElementById('back-to-opponents').addEventListener('click', () => {
        showScreen('opponent-selection');
    });
    
    document.getElementById('back-from-instructions').addEventListener('click', () => {
        showScreen('main-menu');
    });
    
    // Team selection
    const teamsContainer = document.getElementById('teams-container');
    teams.forEach(team => {
        const teamBtn = document.createElement('div');
        teamBtn.className = 'team-btn';
        teamBtn.innerHTML = `
            <div class="team-logo ${team.name.toLowerCase()}">${team.logo}</div>
            <div class="team-name">${team.name}</div>
        `;
        teamBtn.addEventListener('click', () => {
            selectTeam(team.name);
        });
        teamsContainer.appendChild(teamBtn);
    });
    
    // Opponent selection
    const opponentsContainer = document.getElementById('opponents-container');
    teams.forEach(team => {
        if (team.name === gameState.userTeam) return;
        
        const opponentBtn = document.createElement('div');
        opponentBtn.className = 'team-btn';
        opponentBtn.innerHTML = `
            <div class="team-logo ${team.name.toLowerCase()}">${team.logo}</div>
            <div class="team-name">${team.name}</div>
        `;
        opponentBtn.addEventListener('click', () => {
            console.log(`opponent Team selected: ${team.name}`); 
            selectOpponent(team.name);
        });
        opponentsContainer.appendChild(opponentBtn);
    });
    
    // Match setup
    document.getElementById('overs-input').addEventListener('change', (e) => {
        gameState.overs = parseInt(e.target.value);
    });
    
    document.getElementById('start-match-btn').addEventListener('click', startMatch);
    
    // Toss screen
    document.querySelectorAll('.toss-choice-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const choice = e.target.dataset.choice;
            
            // Remove 'selected' class from all buttons first
            document.querySelectorAll('.toss-choice-btn').forEach(button => {
                button.classList.remove('selected');
            });
            
            // Add 'selected' class to the clicked button
            e.target.classList.add('selected');
            
            console.log("playtoss calling");
            playToss(choice);
        });
    });
    
    document.querySelectorAll('.number-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const number = parseInt(e.target.dataset.number);
            completeToss(number);
        });
    });
    
    document.addEventListener('click', function(e) {
    if (e.target.classList.contains('decision-btn')) {
        const decision = e.target.dataset.decision;
        console.log("Decision button clicked:", decision);
        gameState.toss.decision = decision;
        makeTossDecision(decision);
    }
});
    
    // Match play
    document.querySelectorAll('.run-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const run = parseInt(e.target.dataset.run);
            playBall(run);
        });
    });
    
    document.getElementById('start-next-innings').addEventListener('click', startNextInnings);
    
    // Match result
    document.getElementById('play-again-btn').addEventListener('click', () => {
        if (gameState.isTournament) {
            continueTournament();
        } else {
            resetGame();
            showScreen('team-selection');
        }
    });
    
    // document.getElementById('main-menu-btn').addEventListener('click', () => {
    //     resetGame();
    //     showScreen('main-menu');
    // });
    
    // Tournament progress
    document.getElementById('continue-tournament').addEventListener('click', continueTournament);
    
    // Keyboard shortcuts for runs
    document.addEventListener('keydown', (e) => {
        if (gameState.currentScreen === 'match-play' && e.key >= '1' && e.key <= '6') {
            playBall(parseInt(e.key));
        }
    });
    const nextInningsBtn = document.getElementById('start-next-innings');
    if (nextInningsBtn) {
        nextInningsBtn.addEventListener('click', function() {
            console.log("Next innings triggered");
            startNextInnings();
        });
    }

    document.addEventListener('keydown', (e) => {
        // Escape key goes back to main menu
        if (e.key === 'Escape') {
            showScreen('main-menu');
        }
        
        // Existing run key handling
        if (gameState.currentScreen === 'match-play' && e.key >= '1' && e.key <= '6') {
            playBall(parseInt(e.key));
        }
    });
}

// Show a specific screen
function showScreen(screenId) {
    console.log("showScreen() called with screenId:", screenId);
    // Hide all screens
    Object.values(dom.screens).forEach(screen => {
        screen.classList.remove('active');
    });
    
    // Show the requested screen
    dom.screens[screenId].classList.add('active');
    gameState.currentScreen = screenId;
    
    // Perform any screen-specific setup
    switch(screenId) {
        case 'team-selection':
            setupTeamSelection();
            break;
        case 'opponent-selection':
            setupOpponentSelection();
            break;
        case 'match-setup':
            setupMatch();
            break;
        case 'tournament-progress':
            updatePointsTable();
            break;
    }
}

// Team selection screen setup
function setupTeamSelection() {
    console.log("setupTeamSelection() called");
    // Clear any previous selections
    document.querySelectorAll('.team-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
}

// Opponent selection screen setup
function setupOpponentSelection() {
    console.log("setupOpponentSelection() called");

    const opponentsContainer = document.getElementById('opponents-container');
    opponentsContainer.innerHTML = '';
    
    teams.forEach(team => {
        if (team.name === gameState.userTeam) return;
        
        const opponentBtn = document.createElement('div');
        opponentBtn.className = 'team-btn';
        opponentBtn.innerHTML = `
            <div class="team-logo ${team.name.toLowerCase()}">${team.logo}</div>
            <div class="team-name">${team.name}</div>
        `;
        opponentBtn.addEventListener('click', () => {
            
            console.log(`opponent Team selected: ${team.name}`);
            selectOpponent(team.name);
        });
        opponentsContainer.appendChild(opponentBtn);
    });
}

// Select user team
function selectTeam(teamName) {
    gameState.userTeam = teamName;
    
    // Highlight selected team
    document.querySelectorAll('.team-btn').forEach(btn => {
        btn.classList.remove('selected');
        if (btn.querySelector('.team-name').textContent === teamName) {
            btn.classList.add('selected');
        }
    });
    
    if (gameState.isTournament) {
        startTournament();
    } else {
        // For quick match, reset opponent selection UI
        const opponentsContainer = document.getElementById('opponents-container');
        opponentsContainer.innerHTML = '';
        
        teams.forEach(team => {
            if (team.name !== gameState.userTeam) {
                const opponentBtn = document.createElement('div');
                opponentBtn.className = 'team-btn';
                opponentBtn.innerHTML = `
                    <div class="team-logo ${team.name.toLowerCase()}">${team.logo}</div>
                    <div class="team-name">${team.name}</div>
                `;
                opponentBtn.addEventListener('click', () => selectOpponent(team.name));
                opponentsContainer.appendChild(opponentBtn);
            }
        });
        
        showScreen('opponent-selection');
    }
}

// Select opponent team
function selectOpponent(teamName) {
    console.log("selectOpponent() called ");

    gameState.opponentTeam = teamName;
    showScreen('match-setup');
}

// Setup match screen
function setupMatch() {
    console.log("setupMatch() called");
    document.getElementById('user-team-name').textContent = gameState.userTeam;
    document.getElementById('opponent-team-name').textContent = gameState.opponentTeam;
    
    // Set team logos
    const userTeam = teams.find(t => t.name === gameState.userTeam);
    const opponentTeam = teams.find(t => t.name === gameState.opponentTeam);
    
    document.getElementById('user-team-logo').className = `team-logo ${userTeam.name.toLowerCase()}`;
    document.getElementById('user-team-logo').textContent = userTeam.logo;
    
    document.getElementById('opponent-team-logo').className = `team-logo ${opponentTeam.name.toLowerCase()}`;
    document.getElementById('opponent-team-logo').textContent = opponentTeam.logo;
    
    // Set match title
    document.getElementById('match-title').textContent = 
        gameState.isTournament ? `Match ${gameState.currentMatchIndex + 1}` : 'Quick Match';
}

// Start a match
function startMatch() {
    console.log("Starting new match");
    
    // Reset game state for new match
    gameState.innings = {
        current: 1,
        battingTeam: null,
        bowlingTeam: null,
        runs: 0,
        wickets: 0,
        balls: 0,
        overs: 0,
        target: null
    };
    
    gameState.toss = {
        winner: null,
        decision: null,
        userChoice: null,
        computerChoice: null,
        userNumber: null,
        computerNumber: null,
        total: null
    };
    
    // Reset UI elements
    resetTossUI();
    resetMatchUI();
    
    showScreen('toss-screen');
}

// Play the toss
function playToss(userChoice) {
    console.log("playToss() called with choice:", userChoice);
    document.querySelector('.toss-choice-btn').classList.remove('toss-choice-btn-selected');
    document.querySelector('.number-btn').classList.remove('number-btn-selected');
    // Validate selection
    if (!userChoice) return;
    
    // Store the choice
    gameState.toss.userChoice = userChoice;
    gameState.toss.computerChoice = userChoice === 'odd' ? 'even' : 'odd';
    
    // Update UI
    document.querySelector('.toss-options').classList.add('hidden');
    document.querySelector('.toss-number-selection').classList.remove('hidden');
}

// Complete the toss with number selection
function completeToss(userNumber) {
    console.log("completeToss() called with number:", userNumber);
    // Validate input more strictly
    if (typeof userNumber !== 'number' || userNumber < 1 || userNumber > 6) {
        console.error("Invalid number selected for toss");
        return;
    }
    if (!gameState.toss.userChoice) {
        console.error("No odd/even choice made before number selection");
        return;
    }

    // Generate computer's number and calculate total
    const computerNumber = Math.floor(Math.random() * 6) + 1;
    const total = userNumber + computerNumber;
    const isEven = total % 2 === 0;
    const userWon = (isEven && gameState.toss.userChoice === 'even') ||  (!isEven && gameState.toss.userChoice === 'odd');

    // Update game state immutably
    gameState.toss = {
        ...gameState.toss,
        userNumber,
        computerNumber,
        total,
        winner: userWon ? gameState.userTeam : gameState.opponentTeam,
        decision: null // Reset decision for this toss
    };

    // DOM elements
    const tossResult = document.getElementById('toss-result');
    const tossDecision = document.getElementById('toss-decision');
    const decisionMessage = document.getElementById('decision-message');
    const userDecision = document.getElementById('user-decision');
    const continueBtn = document.getElementById('continue-after-toss');

    // Display toss result
    tossResult.innerHTML = `
        <p>You chose ${gameState.toss.userChoice} and threw ${userNumber}</p>
        <p>${gameState.opponentTeam} threw ${computerNumber}</p>
        <p>Total: ${total} (${isEven ? 'EVEN' : 'ODD'})</p>
        <p><strong>${gameState.toss.winner} won the toss!</strong></p>
    `;
    
    // Show appropriate UI based on who won
    tossDecision.classList.remove('hidden');
    tossResult.classList.remove('hidden');

    if (userWon) {
        // User won - show bat/bowl options
        decisionMessage.textContent = 'Choose to bat or bowl:';
        userDecision.classList.remove('hidden');
        continueBtn.classList.add('hidden');
        
        // Remove any existing event listeners to prevent duplicates
        document.querySelectorAll('.decision-btn').forEach(btn => {
            btn.replaceWith(btn.cloneNode(true));
        });
    } else {
        // Opponent won - show their choice and continue button
        const opponentDecision = Math.random() > 0.5 ? 'bat' : 'bowl';
        gameState.toss.decision = opponentDecision;
        
        decisionMessage.textContent = `${gameState.opponentTeam} chose to ${opponentDecision}`;
        userDecision.classList.add('hidden');
        continueBtn.classList.remove('hidden');
        
        // Update continue button
        continueBtn.replaceWith(continueBtn.cloneNode(true));
        document.getElementById('continue-after-toss').onclick = () => {
            makeTossDecision(opponentDecision);
        };
    }
}

// Make sure to update your makeTossDecision() function:
function makeTossDecision(decision) {
    console.log("makeTossDecision() called with decision:", decision);
    if (!['bat', 'bowl'].includes(decision)) {
        console.error("Invalid toss decision:", decision);
        return;
    }
    gameState.toss.decision = decision;
    
    // Set innings order
    if (gameState.toss.winner === gameState.userTeam) {
        gameState.innings.battingTeam = decision === 'bat' ? gameState.userTeam : gameState.opponentTeam;
        gameState.innings.bowlingTeam = decision === 'bat' ? gameState.opponentTeam : gameState.userTeam;
    } else {
        gameState.innings.battingTeam = decision === 'bat' ? gameState.opponentTeam : gameState.userTeam;
        gameState.innings.bowlingTeam = decision === 'bat' ? gameState.userTeam : gameState.opponentTeam;
    }
    
    startInnings();
}


// Start an innings
function startInnings() {
    console.log("startInnings() called");
    // Reset innings state
    gameState.innings.runs = 0;
    gameState.innings.wickets = 0;
    gameState.innings.balls = 0;
    gameState.innings.overs = 0;
    
    // Update UI
    document.getElementById('current-batting-team').textContent = gameState.innings.battingTeam;
    document.getElementById('runs').textContent = '0';
    document.getElementById('wickets').textContent = '0';
    document.getElementById('overs').textContent = '0.0';
    
    if (gameState.innings.current === 2) {
        document.getElementById('target').textContent = gameState.innings.target;
        document.getElementById('innings-title').textContent = '2nd Innings (Chasing)';
    } else {
        document.getElementById('target').textContent = '-';
        document.getElementById('innings-title').textContent = '1st Innings';
    }
    
    document.getElementById('ball-result').innerHTML = '';
    document.getElementById('innings-summary').classList.add('hidden');
    document.getElementById('next-innings-btn').classList.add('hidden');
    
    showScreen('match-play');
}

// Play a ball
function playBall(userRun) {
    console.log("playBall() called with userRun:", userRun);
    const computerRun = Math.floor(Math.random() * 6) + 1;
    const ballResult = document.getElementById('ball-result');
    
    // Check if user is batting or bowling
    const isBatting = gameState.innings.battingTeam === gameState.userTeam;
    
    if (isBatting) {
        // User is batting
        if (userRun === computerRun) {
            // Out!
            gameState.innings.wickets++;
            ballResult.innerHTML = `<p class="out">OUT! ${gameState.userTeam} loses a wicket!</p>`;
        } else {
            // Runs scored
            gameState.innings.runs += userRun;
            ballResult.innerHTML = `<p class="runs">${userRun} run${userRun > 1 ? 's' : ''} scored!</p>`;
        }
    } else {
        // User is bowling
        if (userRun === computerRun) {
            // Out!
            gameState.innings.wickets++;
            ballResult.innerHTML = `<p class="out">OUT! ${gameState.opponentTeam} loses a wicket!</p>`;
        } else {
            // Runs scored
            gameState.innings.runs += computerRun;
            ballResult.innerHTML = `<p class="runs">${computerRun} run${computerRun > 1 ? 's' : ''} scored by ${gameState.opponentTeam}!</p>`;
        }
    }
    
    // Update ball count
    gameState.innings.balls++;
    
    // Check if over is complete
    if (gameState.innings.balls >= 6) {
        gameState.innings.balls = 0;
        gameState.innings.overs++;
    }
    
    // Update scoreboard
    document.getElementById('runs').textContent = gameState.innings.runs;
    document.getElementById('wickets').textContent = gameState.innings.wickets;
    document.getElementById('overs').textContent = `${gameState.innings.overs}.${gameState.innings.balls}`;
    
    // Check for innings end conditions
    if (gameState.innings.wickets >= 10 || 
        gameState.innings.overs >= gameState.overs ||
        (gameState.innings.current === 2 && gameState.innings.runs >= gameState.innings.target)) {
        endInnings();
        
        // Hide run buttons when innings ends
        document.querySelectorAll('.run-btn').forEach(btn => {
            btn.disabled = true;
        });
    }
}

// End the current innings
function endInnings() {
    console.log("endInnings() called");
    const inningsSummary = document.getElementById('innings-summary');
    
    if (gameState.innings.current === 1) {
        // First innings ended
        gameState.innings.target = gameState.innings.runs + 1;
        
        inningsSummary.innerHTML = `
            <h3>1st Innings Summary</h3>
            <p>${gameState.innings.battingTeam} scored ${gameState.innings.runs}/${gameState.innings.wickets} in ${gameState.innings.overs}.${gameState.innings.balls} overs</p>
            <p>${gameState.innings.bowlingTeam} needs ${gameState.innings.target} runs to win</p>
        `;
        
        // Show summary and next innings button
        inningsSummary.classList.remove('hidden');
        document.getElementById('next-innings-btn').classList.remove('hidden');
        
        // Hide match controls during the break between innings
        document.querySelector('.match-controls').style.display = 'none';
        
        // Swap batting and bowling teams for next innings
        const temp = gameState.innings.battingTeam;
        gameState.innings.battingTeam = gameState.innings.bowlingTeam;
        gameState.innings.bowlingTeam = temp;
        gameState.innings.current = 2;
        
    } else {
        // Second innings ended - show match result
        inningsSummary.classList.remove('hidden');
        determineMatchResult();
    }
}

// Start the next innings
function startNextInnings() {
    console.log("Starting next innings");
    
    // 1. Reset the innings state while preserving the target
    gameState.innings = {
        current: 2,
        battingTeam: gameState.innings.bowlingTeam,  // Teams swap roles
        bowlingTeam: gameState.innings.battingTeam,
        runs: 0,
        wickets: 0,
        balls: 0,
        overs: 0,
        target: gameState.innings.target  // Keep the target from first innings
    };
    
    // 2. Update all UI elements
    document.getElementById('current-batting-team').textContent = gameState.innings.battingTeam;
    document.getElementById('runs').textContent = '0';
    document.getElementById('wickets').textContent = '0';
    document.getElementById('overs').textContent = '0.0';
    document.getElementById('target').textContent = gameState.innings.target;
    document.getElementById('innings-title').textContent = '2nd Innings (Chasing)';
    
    // 3. Clear any previous ball results
    document.getElementById('ball-result').innerHTML = '';
    
    // 4. Hide the innings summary and next innings button
    document.getElementById('innings-summary').classList.add('hidden');
    document.getElementById('next-innings-btn').classList.add('hidden');
    
    // 5. Re-enable all run buttons
    document.querySelectorAll('.run-btn').forEach(btn => {
        btn.disabled = false;
    });
    
    // 6. Make sure match controls are visible
    document.querySelector('.match-controls').style.display = 'block';
    
    // 7. Force UI refresh by showing the screen again
    showScreen('match-play');
    
    console.log("Next innings started successfully", gameState.innings);
}

// Determine match result
function determineMatchResult() {
    console.log("Determining match result");
    
    const firstInningsRuns = gameState.innings.target - 1;
    const secondInningsRuns = gameState.innings.runs;
    
    let winner, loser, resultText;
    
    if (secondInningsRuns >= gameState.innings.target) {
        // Chasing team won
        winner = gameState.innings.battingTeam;
        loser = gameState.innings.bowlingTeam;
        const wicketsLeft = 10 - gameState.innings.wickets;
        resultText = `${winner} won by ${wicketsLeft} wicket${wicketsLeft > 1 ? 's' : ''}`;
    } else if (secondInningsRuns < firstInningsRuns) {
        // Defending team won
        winner = gameState.innings.bowlingTeam;
        loser = gameState.innings.battingTeam;
        const margin = firstInningsRuns - secondInningsRuns;
        resultText = `${winner} won by ${margin} run${margin > 1 ? 's' : ''}`;
    } else {
        // Tie
        winner = [gameState.userTeam, gameState.opponentTeam][Math.floor(Math.random() * 2)];
        loser = winner === gameState.userTeam ? gameState.opponentTeam : gameState.userTeam;
        resultText = `Match tied! ${winner} wins by super over`;
    }
    
    // Update match result
    gameState.matchResult = { winner, loser, resultText };
    
    // Update points table if tournament
    if (gameState.isTournament) {
        gameState.pointsTable[winner].matches++;
        gameState.pointsTable[winner].wins++;
        gameState.pointsTable[winner].points += 2;
        
        gameState.pointsTable[loser].matches++;
        gameState.pointsTable[loser].losses++;
    }

    // Show match result
    const resultDisplay = document.getElementById('result-display');
    resultDisplay.innerHTML = `
        <h3>Match Result</h3>
        <p>${gameState.matchResult.resultText}</p>
        <p>${gameState.innings.bowlingTeam} scored ${firstInningsRuns}</p>
        <p>${gameState.innings.battingTeam} scored ${secondInningsRuns}/${gameState.innings.wickets}</p>
    `;

    // Clear previous buttons
    const resultOptions = document.querySelector('.result-options');
    resultOptions.innerHTML = '';

    if (gameState.isTournament) {
        // Tournament mode - show Continue Tournament button
        const continueBtn = document.createElement('button');
        continueBtn.className = 'btn';
        continueBtn.textContent = 'Continue Tournament';
        continueBtn.addEventListener('click', () => {
            // Reset UI elements
            resetTossUI();
            resetMatchUI();
            
            // Mark current match as played
            const currentMatch = gameState.tournamentMatches[gameState.currentMatchIndex];
            currentMatch.played = true;
            currentMatch.winner = gameState.matchResult.winner;
            
            // Show tournament progress screen
            updatePointsTable();
            showScreen('tournament-progress');
        });
        resultOptions.appendChild(continueBtn);
    }  else {
        // Quick match - show Play Again and Main Menu buttons
        const playAgainBtn = document.createElement('button');
        playAgainBtn.className = 'btn';
        playAgainBtn.textContent = 'Play Again';
        playAgainBtn.addEventListener('click', () => {
            resetGame();
            showScreen('team-selection');
        });

        const menuBtn = document.createElement('button');
        menuBtn.className = 'btn back-btn';
        menuBtn.textContent = 'Main Menu';
        menuBtn.addEventListener('click', () => {
            resetGame();
            showScreen('main-menu');
        });

        resultOptions.appendChild(playAgainBtn);
        resultOptions.appendChild(menuBtn);
    }

    showScreen('match-result');
}
// Start a tournament
function startTournament() {
    console.log("startTournament() called");
    // Reset tournament state
    gameState.tournamentTeams = [...teams];
    gameState.currentMatchIndex = 0;
    
    // Generate all possible matches (round-robin)
    gameState.tournamentMatches = [];
    for (let i = 0; i < teams.length; i++) {
        for (let j = i + 1; j < teams.length; j++) {
            gameState.tournamentMatches.push({
                team1: teams[i].name,
                team2: teams[j].name,
                played: false,
                winner: null
            });
        }
    }
    
    // Shuffle matches for variety
    shuffleArray(gameState.tournamentMatches);
    
    // Start first match
    playNextTournamentMatch();
}

// Play next tournament match
function playNextTournamentMatch() {
    console.log("playNextTournamentMatch() called");
    // Find next unplayed match
    const nextMatch = gameState.tournamentMatches.find(match => !match.played);
    
    if (!nextMatch) {
        // Tournament complete
        endTournament();
        return;
    }
    
    gameState.currentMatchIndex = gameState.tournamentMatches.indexOf(nextMatch);
    
    // Set up match
    if (nextMatch.team1 === gameState.userTeam || nextMatch.team2 === gameState.userTeam) {
        // User's match
        gameState.opponentTeam = nextMatch.team1 === gameState.userTeam ? nextMatch.team2 : nextMatch.team1;
        document.getElementById('match-title').textContent = `Match ${gameState.currentMatchIndex + 1}`;
        showScreen('match-setup');
    } else {
        // Simulate AI match
        simulateAIMatch(nextMatch);
        // After simulation, show points table
        updatePointsTable();
        showScreen('tournament-progress');
    }
}

// Simulate an AI vs AI match
function simulateAIMatch(match) {
    console.log("simulateAIMatch() called for match:", match);
    // Simple simulation - can be enhanced
    const winner = Math.random() > 0.5 ? match.team1 : match.team2;
    const loser = winner === match.team1 ? match.team2 : match.team1;
    
    // Update match result
    match.played = true;
    match.winner = winner;
    
    // Update points table
    gameState.pointsTable[winner].matches++;
    gameState.pointsTable[winner].wins++;
    gameState.pointsTable[winner].points += 2;
    
    gameState.pointsTable[loser].matches++;
    gameState.pointsTable[loser].losses++;
    
    // Show tournament progress
    showScreen('tournament-progress');
}

// Continue tournament after a match
function continueTournament() {
    console.log("continueTournament() called");
    // Reset toss UI elements (in case they were left in a state)
    document.querySelector('.toss-options').classList.remove('hidden');
    document.querySelector('.toss-number-selection').classList.add('hidden');
    document.getElementById('toss-result').classList.add('hidden');
    document.getElementById('toss-decision').classList.add('hidden');
    document.querySelectorAll('.toss-choice-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    
    gameState.currentMatchIndex++;
    playNextTournamentMatch();
}

// End tournament and determine playoffs
function endTournament() {
    console.log("endTournament() called");
    // Sort teams by points
    const sortedTeams = Object.entries(gameState.pointsTable)
        .sort((a, b) => b[1].points - a[1].points || a[0].localeCompare(b[0]));
    
    // Top 4 teams qualify for playoffs
    const playoffTeams = sortedTeams.slice(0, 4).map(team => team[0]);

    // Generate playoff matches (IPL format)
    gameState.playoffMatches = [
        { type: 'qualifier1', team1: playoffTeams[0], team2: playoffTeams[1], winner: null },
        { type: 'eliminator', team1: playoffTeams[2], team2: playoffTeams[3], winner: null },
        { type: 'qualifier2', team1: 'TBD', team2: 'TBD', winner: null }, // Loser Q1 vs Winner Eliminator
        { type: 'final', team1: 'TBD', team2: 'TBD', winner: null }
    ];

    gameState.isPlayoffs = true;
    gameState.playoffStage = 'qualifier1';
    gameState.currentPlayoffMatch = 0;

    // Show playoff qualification screen
    const resultDisplay = document.getElementById('result-display');
    resultDisplay.innerHTML = `
        <h3>League Stage Complete!</h3>
        <p>Top 4 teams advancing to playoffs:</p>
        <ol>
            ${playoffTeams.map((team, i) => 
                `<li>${team} ${i === 0 ? '(1st Place)' : i === 1 ? '(2nd Place)' : i === 2 ? '(3rd Place)' : '(4th Place)'}</li>`
            ).join('')}
        </ol>
        <button id="start-playoffs" class="btn">Start Playoffs</button>
    `;

    document.getElementById('start-playoffs').addEventListener('click', startNextPlayoffMatch);
    showScreen('match-result');
}

function startNextPlayoffMatch() {
    console.log("startNextPlayoffMatch() called");
    const match = gameState.playoffMatches[gameState.currentPlayoffMatch];
    
    // Set dynamic matchups for later stages
    if (match.type === 'qualifier2') {
        const qual1 = gameState.playoffMatches[0];
        const elim = gameState.playoffMatches[1];
        match.team1 = qual1.winner === qual1.team1 ? qual1.team2 : qual1.team1; // Loser of Q1
        match.team2 = elim.winner; // Winner of Eliminator
    } 
    else if (match.type === 'final') {
        const qual1 = gameState.playoffMatches[0];
        const qual2 = gameState.playoffMatches[2];
        match.team1 = qual1.winner; // Winner of Q1
        match.team2 = qual2.winner; // Winner of Q2
    }

    // Check if user is in this match
    if ([match.team1, match.team2].includes(gameState.userTeam)) {
        gameState.opponentTeam = match.team1 === gameState.userTeam ? match.team2 : match.team1;
        document.getElementById('match-title').textContent = `${match.type.toUpperCase()}`;
        showScreen('match-setup');
    } else {
        simulateAIMatch(match);
        showScreen('tournament-progress');
    }
}

function completePlayoffMatch(winner) {
    console.log("completePlayoffMatch() called with winner:", winner);
    const match = gameState.playoffMatches[gameState.currentPlayoffMatch];
    match.winner = winner;
    
    // Move to next match or end playoffs
    gameState.currentPlayoffMatch++;
    
    if (gameState.currentPlayoffMatch < gameState.playoffMatches.length) {
        gameState.playoffStage = gameState.playoffMatches[gameState.currentPlayoffMatch].type;
        startNextPlayoffMatch();
    } else {
        endPlayoffs();
    }
}

function endPlayoffs() {
    console.log("endPlayoffs() called");
    const champion = gameState.playoffMatches[3].winner; // Final winner
    const resultDisplay = document.getElementById('result-display');
    
    resultDisplay.innerHTML = `
        <h2>🏆 TOURNAMENT CHAMPION 🏆</h2>
        <p class="champion">${champion}</p>
        ${champion === gameState.userTeam ? 
            '<p>Congratulations! You won the tournament!</p>' : 
            '<p>Better luck next time!</p>'}
        <button id="back-to-menu" class="btn">Main Menu</button>
    `;
    
    document.getElementById('back-to-menu').addEventListener('click', () => {
        resetGame();
        showScreen('main-menu');
    });
}
// POINTS TABLE AND PLAYOFF BRACKET RENDERING
function updatePointsTable() {
    console.log("updatePointsTable() called");
    const tableBody = document.getElementById('points-table-body');
    if (!tableBody) return; // Exit if no table found
    
    // Clear existing rows
    tableBody.innerHTML = '';

    // Sort teams by points (descending)
    const sortedTeams = Object.entries(gameState.pointsTable)
        .sort((a, b) => b[1].points - a[1].points || a[0].localeCompare(b[0]));

    // Populate table rows
    sortedTeams.forEach(([team, stats]) => {
        const row = document.createElement('tr');
        if (team === gameState.userTeam) row.classList.add('user-team');
        
        row.innerHTML = `
            <td>${team}</td>
            <td>${stats.matches}</td>
            <td>${stats.wins}</td>
            <td>${stats.losses}</td>
            <td>${stats.points}</td>
        `;
        tableBody.appendChild(row);
    });

    // Add playoff bracket visualization
    if (gameState.isPlayoffs) {
        let playoffHTML = `
            <div class="playoff-bracket">
                <h3>Playoff Stage: ${gameState.playoffStage.toUpperCase()}</h3>
        `;

        gameState.playoffMatches.forEach(match => {
            playoffHTML += `
                <div class="playoff-match ${match.type === gameState.playoffStage ? 'current' : ''}">
                    <p><strong>${match.type.replace(/([a-z])([A-Z])/g, '$1 $2').toUpperCase()}</strong></p>
                    <p>${match.team1} vs ${match.team2}</p>
                    ${match.winner ? `<p class="winner">🏆 ${match.winner}</p>` : ''}
                </div>
            `;
        });

        playoffHTML += `</div>`;
        
        // Insert after points table
        const pointsTableSection = document.querySelector('.points-table');
        if (pointsTableSection) {
            pointsTableSection.insertAdjacentHTML('afterend', playoffHTML);
        }
    }
}
// Reset game state
function resetGame() {
    console.log("Resetting game state");
    gameState = {
        currentScreen: 'main-menu',
        userTeam: null,
        opponentTeam: null,
        overs: 1,
        isTournament: false,
        tournamentTeams: [],
        tournamentMatches: [],
        currentMatchIndex: 0,
        pointsTable: {},
        toss: {
            winner: null,
            decision: null,
            userChoice: null,
            computerChoice: null,
            userNumber: null,
            computerNumber: null,
            total: null
        },
        innings: {
            current: 1,
            battingTeam: null,
            bowlingTeam: null,
            runs: 0,
            wickets: 0,
            balls: 0,
            overs: 0,
            target: null
        },
        matchResult: null
    };

    // Reinitialize points table
    teams.forEach(team => {
        gameState.pointsTable[team.name] = {
            matches: 0,
            wins: 0,
            losses: 0,
            points: 0
        };
    });

    // Reset all UI elements
    resetTossUI();
    resetMatchUI();
}

function resetTossUI() {
    // Reset toss screen UI
    document.querySelector('.toss-options').classList.remove('hidden');
    document.querySelector('.toss-number-selection').classList.add('hidden');
    document.getElementById('toss-result').classList.add('hidden');
    document.getElementById('toss-decision').classList.add('hidden');
    
    // Remove selected class from all toss choice buttons
    document.querySelectorAll('.toss-choice-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    
    // Remove selected class from all number buttons
    document.querySelectorAll('.number-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
}

function resetMatchUI() {
    // Reset match play UI
    document.getElementById('runs').textContent = '0';
    document.getElementById('wickets').textContent = '0';
    document.getElementById('overs').textContent = '0.0';
    document.getElementById('target').textContent = '-';
    document.getElementById('ball-result').innerHTML = '';
    document.getElementById('innings-summary').classList.add('hidden');
    document.getElementById('next-innings-btn').classList.add('hidden');
    
    // Enable all run buttons
    document.querySelectorAll('.run-btn').forEach(btn => {
        btn.disabled = false;
    });
}

// Utility function to shuffle array
function shuffleArray(array) {
    console.log("shuffleArray() called");
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Initialize the game when DOM is loaded
document.addEventListener('DOMContentLoaded', initGame);