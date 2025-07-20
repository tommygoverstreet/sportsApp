// Global Variables
let players = JSON.parse(localStorage.getItem('softballPlayers')) || [];
let currentGame = JSON.parse(localStorage.getItem('currentGame')) || null;
let gameHistory = JSON.parse(localStorage.getItem('gameHistory')) || [];
let fieldPositions = JSON.parse(localStorage.getItem('fieldPositions')) || {};
let savedLineup = JSON.parse(localStorage.getItem('savedLineup')) || [];
let currentBatterIndex = 0;
let teamEvents = JSON.parse(localStorage.getItem('teamEvents')) || [];
let currentUser = null;
let groupMeSettings = JSON.parse(localStorage.getItem('groupMeSettings')) || {};

// Authentication and Admin variables
let approvedEmails = JSON.parse(localStorage.getItem('approvedEmails')) || [
  { email: 'tommygoverstreet@gmail.com', role: 'admin', addedDate: new Date().toISOString() }
];
let playerContacts = JSON.parse(localStorage.getItem('playerContacts')) || {};
let teamSettings = JSON.parse(localStorage.getItem('teamSettings')) || {
  teamName: '',
  seasonYear: new Date().getFullYear(),
  leagueName: ''
};

// Calendar variables
let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();

// Whiteboard variables
let isDrawing = false;
let currentTool = 'pen';
let currentColor = '#2c5aa0';
let currentSize = 3;
let canvas, ctx;

// DOM Elements
const navButtons = document.querySelectorAll('.nav-btn');
const tabContents = document.querySelectorAll('.tab-content');
const addPlayerBtn = document.getElementById('add-player-btn');
const playerModal = document.getElementById('player-modal');
const playerForm = document.getElementById('player-form');
const closeModal = document.querySelector('.close');
const cancelPlayerBtn = document.getElementById('cancel-player');

// Initialize the app
document.addEventListener('DOMContentLoaded', function () {
  initializeAuth();
});

function initializeAuth() {
  // Check if user is already authenticated
  const storedUser = localStorage.getItem('currentUser');
  if (storedUser) {
    currentUser = JSON.parse(storedUser);
    if (isEmailApproved(currentUser.email)) {
      showApp();
      initializeApp();
    } else {
      showLoginPage();
    }
  } else {
    showLoginPage();
  }
  
  setupLoginHandlers();
}

function showLoginPage() {
  document.getElementById('login-page').style.display = 'flex';
  document.getElementById('app-container').style.display = 'none';
}

function showApp() {
  document.getElementById('login-page').style.display = 'none';
  document.getElementById('app-container').style.display = 'flex';
}

function initializeApp() {
  setupNavigation();
  setupRoster();
  setupCalendar();
  setupTeamChat();
  setupScorebook();
  setupGameTracker();
  setupFieldManager();
  setupLineupBoard();
  setupWhiteboard();
  setupGoogleAuth();
  setupAdmin();
  loadSampleData();
  updateUserInterface();
}// Navigation functionality
function setupNavigation() {
  navButtons.forEach(button => {
    button.addEventListener('click', function () {
      const targetTab = this.getAttribute('data-tab');
      switchTab(targetTab);
    });
  });
}

function switchTab(tabName) {
  // Update navigation buttons
  navButtons.forEach(btn => btn.classList.remove('active'));
  document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

  // Update tab content
  tabContents.forEach(content => content.classList.remove('active'));
  document.getElementById(tabName).classList.add('active');

  // Refresh content based on tab
  if (tabName === 'roster') {
    renderRoster();
  } else if (tabName === 'calendar') {
    renderCalendar();
  } else if (tabName === 'team-chat') {
    renderTeamChat();
  } else if (tabName === 'scorebook') {
    renderScorebook();
  } else if (tabName === 'game-tracker') {
    renderGameTracker();
  } else if (tabName === 'field-manager') {
    renderFieldManager();
  } else if (tabName === 'lineup-board') {
    renderLineupBoard();
  } else if (tabName === 'whiteboard') {
    initializeWhiteboard();
  } else if (tabName === 'admin') {
    renderAdminDashboard();
  }
}

function renderAdminDashboard() {
  if (!currentUser || !isAdmin(currentUser.email)) {
    alert('Access denied. Admin privileges required.');
    switchTab('roster');
    return;
  }
  
  renderApprovedEmails();
  renderContactsTable();
  loadTeamSettings();
}

// Roster Management
function setupRoster() {
  addPlayerBtn.addEventListener('click', () => {
    playerModal.style.display = 'block';
  });

  closeModal.addEventListener('click', () => {
    playerModal.style.display = 'none';
    playerForm.reset();
  });

  cancelPlayerBtn.addEventListener('click', () => {
    playerModal.style.display = 'none';
    playerForm.reset();
  });

  playerForm.addEventListener('submit', handleAddPlayer);

  window.addEventListener('click', (e) => {
    if (e.target === playerModal) {
      playerModal.style.display = 'none';
      playerForm.reset();
    }
  });
}

function handleAddPlayer(e) {
  e.preventDefault();

  const playerData = {
    id: Date.now(),
    name: document.getElementById('player-name').value,
    number: parseInt(document.getElementById('player-number').value),
    position: document.getElementById('player-position').value,
    bats: document.getElementById('player-bats').value,
    throws: document.getElementById('player-throws').value,
    stats: {
      gamesPlayed: 0,
      atBats: 0,
      hits: 0,
      runs: 0,
      rbis: 0,
      average: 0
    }
  };

  // Check for duplicate jersey numbers
  if (players.some(player => player.number === playerData.number)) {
    alert('Jersey number already exists!');
    return;
  }

  players.push(playerData);
  savePlayersToStorage();
  renderRoster();

  playerModal.style.display = 'none';
  playerForm.reset();
}

function renderRoster() {
  const rosterList = document.getElementById('roster-list');
  rosterList.innerHTML = '';

  players.forEach(player => {
    const playerCard = createPlayerCard(player);
    rosterList.appendChild(playerCard);
  });
}

function createPlayerCard(player) {
  const card = document.createElement('div');
  card.className = 'player-card';
  card.innerHTML = `
        <div class="player-header">
            <div class="player-name">${player.name}</div>
            <div class="player-number">${player.number}</div>
        </div>
        <div class="player-details">
            <div class="player-detail">
                <span class="detail-label">Position:</span>
                <span class="detail-value">${player.position}</span>
            </div>
            <div class="player-detail">
                <span class="detail-label">Bats:</span>
                <span class="detail-value">${player.bats}</span>
            </div>
            <div class="player-detail">
                <span class="detail-label">Throws:</span>
                <span class="detail-value">${player.throws}</span>
            </div>
            <div class="player-detail">
                <span class="detail-label">AVG:</span>
                <span class="detail-value">${player.stats.average.toFixed(3)}</span>
            </div>
        </div>
        <div class="player-actions">
            <button class="btn danger" onclick="removePlayer(${player.id})">Remove</button>
        </div>
    `;
  return card;
}

function removePlayer(playerId) {
  if (confirm('Are you sure you want to remove this player?')) {
    players = players.filter(player => player.id !== playerId);
    savePlayersToStorage();
    renderRoster();
  }
}

// Scorebook Management
function setupScorebook() {
  const exportBtn = document.getElementById('export-pdf');
  exportBtn.addEventListener('click', exportToPDF);
  renderScorebook();
}

function renderScorebook() {
  const scorebookGrid = document.getElementById('scorebook-grid');
  scorebookGrid.innerHTML = '';

  // Sort players by batting order if in a game, otherwise by jersey number
  const sortedPlayers = currentGame && currentGame.lineup
    ? currentGame.lineup.map(playerId => players.find(p => p.id === playerId))
    : [...players].sort((a, b) => a.number - b.number);

  sortedPlayers.forEach((player, index) => {
    if (player) {
      const playerRow = createPlayerRow(player, index);
      scorebookGrid.appendChild(playerRow);
    }
  });

  setupAtBatInteraction();
}

function createPlayerRow(player, battingOrder) {
  const row = document.createElement('div');
  row.className = 'player-row';
  row.innerHTML = `
        <div class="player-cell player-name-cell">${battingOrder + 1}. ${player.name}</div>
        <div class="player-cell">${player.position}</div>
        ${[1, 2, 3, 4, 5, 6, 7].map(inning => `
            <div class="player-cell at-bat-cell" data-player="${player.id}" data-inning="${inning}">
                ${getAtBatResult(player.id, inning)}
            </div>
        `).join('')}
        <div class="player-cell stats-cell">
            ${player.stats.atBats}/${player.stats.hits}<br>
            R: ${player.stats.runs} RBI: ${player.stats.rbis}
        </div>
    `;
  return row;
}

function getAtBatResult(playerId, inning) {
  if (currentGame && currentGame.atBats) {
    const atBat = currentGame.atBats.find(ab =>
      ab.playerId === playerId && ab.inning === inning
    );
    return atBat ? `<div class="at-bat-result">${atBat.result}</div>` : '';
  }
  return '';
}

function setupAtBatInteraction() {
  const atBatCells = document.querySelectorAll('.at-bat-cell');
  atBatCells.forEach(cell => {
    cell.addEventListener('click', function () {
      const playerId = parseInt(this.getAttribute('data-player'));
      const inning = parseInt(this.getAttribute('data-inning'));
      showAtBatModal(playerId, inning, this);
    });
  });
}

function showAtBatModal(playerId, inning, cell) {
  const player = players.find(p => p.id === playerId);
  if (!player) return;

  // Create modal if it doesn't exist
  let modal = document.getElementById('at-bat-modal');
  if (!modal) {
    modal = createAtBatModal();
    document.body.appendChild(modal);
  }

  const modalContent = modal.querySelector('.at-bat-modal-content');
  modalContent.innerHTML = `
        <h3>${player.name} - Inning ${inning}</h3>
        <div class="result-buttons">
            <button class="result-btn" data-result="1B">Single</button>
            <button class="result-btn" data-result="2B">Double</button>
            <button class="result-btn" data-result="3B">Triple</button>
            <button class="result-btn" data-result="HR">Home Run</button>
            <button class="result-btn" data-result="BB">Walk</button>
            <button class="result-btn" data-result="K">Strikeout</button>
            <button class="result-btn" data-result="F7">Fly Out</button>
            <button class="result-btn" data-result="G6">Ground Out</button>
            <button class="result-btn" data-result="E6">Error</button>
        </div>
        <button class="btn secondary" onclick="closeAtBatModal()" style="margin-top: 1rem;">Cancel</button>
    `;

  // Add event listeners to result buttons
  const resultButtons = modalContent.querySelectorAll('.result-btn');
  resultButtons.forEach(btn => {
    btn.addEventListener('click', function () {
      const result = this.getAttribute('data-result');
      recordAtBat(playerId, inning, result, cell);
      closeAtBatModal();
    });
  });

  modal.style.display = 'block';
}

function createAtBatModal() {
  const modal = document.createElement('div');
  modal.id = 'at-bat-modal';
  modal.className = 'at-bat-modal';
  modal.innerHTML = '<div class="at-bat-modal-content"></div>';
  return modal;
}

function closeAtBatModal() {
  const modal = document.getElementById('at-bat-modal');
  if (modal) {
    modal.style.display = 'none';
  }
}

function recordAtBat(playerId, inning, result, cell) {
  // Initialize current game if it doesn't exist
  if (!currentGame) {
    currentGame = {
      id: Date.now(),
      homeTeam: document.getElementById('home-team').value || 'Our Team',
      awayTeam: document.getElementById('away-team').value || 'Opponent',
      date: document.getElementById('game-date').value || new Date().toISOString().split('T')[0],
      atBats: [],
      score: { home: 0, away: 0 },
      currentInning: 1
    };
  }

  // Remove any existing at-bat for this player/inning
  currentGame.atBats = currentGame.atBats.filter(ab =>
    !(ab.playerId === playerId && ab.inning === inning)
  );

  // Add new at-bat
  currentGame.atBats.push({
    playerId: playerId,
    inning: inning,
    result: result,
    timestamp: new Date().toISOString()
  });

  // Update player stats
  updatePlayerStats(playerId, result);

  // Update cell display
  cell.innerHTML = `<div class="at-bat-result">${result}</div>`;
  cell.classList.add('has-result');

  // Save game
  saveCurrentGame();

  // Check if this result scores runs
  if (['1B', '2B', '3B', 'HR'].includes(result)) {
    updateScore(result);
  }
}

function updatePlayerStats(playerId, result) {
  const player = players.find(p => p.id === playerId);
  if (!player) return;

  // Count as at-bat unless it's a walk
  if (result !== 'BB') {
    player.stats.atBats++;
  }

  // Count hits
  if (['1B', '2B', '3B', 'HR'].includes(result)) {
    player.stats.hits++;
  }

  // Count runs for home runs (simplified)
  if (result === 'HR') {
    player.stats.runs++;
    player.stats.rbis++;
  }

  // Update batting average
  player.stats.average = player.stats.atBats > 0 ?
    player.stats.hits / player.stats.atBats : 0;

  savePlayersToStorage();
}

function updateScore(result) {
  if (!currentGame) return;

  // Simplified scoring - just add runs for hits
  let runsScored = 0;
  switch (result) {
    case '1B': runsScored = 0; break;
    case '2B': runsScored = 1; break;
    case '3B': runsScored = 2; break;
    case 'HR': runsScored = 1; break;
  }

  currentGame.score.home += runsScored;
  updateScoreDisplay();
  saveCurrentGame();
}

function updateScoreDisplay() {
  const ourTotalElement = document.getElementById('our-total');
  if (ourTotalElement && currentGame) {
    ourTotalElement.textContent = currentGame.score.home;
  }
}

// Game Tracker Management
function setupGameTracker() {
  const newGameBtn = document.getElementById('new-game-btn');
  const saveGameBtn = document.getElementById('save-game-btn');
  const nextInningBtn = document.getElementById('next-inning');
  const switchBattingBtn = document.getElementById('switch-batting');
  const prevBatterBtn = document.getElementById('prev-batter');
  const nextBatterBtn = document.getElementById('next-batter');

  newGameBtn.addEventListener('click', startNewGame);
  saveGameBtn.addEventListener('click', saveGame);
  nextInningBtn.addEventListener('click', nextInning);
  switchBattingBtn.addEventListener('click', switchBattingTeam);

  if (prevBatterBtn) prevBatterBtn.addEventListener('click', previousBatter);
  if (nextBatterBtn) nextBatterBtn.addEventListener('click', nextBatter);

  renderGameTracker();
}

function startNewGame() {
  const homeTeam = prompt('Enter home team name:', 'Our Team');
  const awayTeam = prompt('Enter away team name:', 'Opponent');

  if (homeTeam && awayTeam) {
    currentGame = {
      id: Date.now(),
      homeTeam: homeTeam,
      awayTeam: awayTeam,
      date: new Date().toISOString().split('T')[0],
      atBats: [],
      score: { home: 0, away: 0 },
      currentInning: 1,
      battingTeam: 'home',
      lineup: players.slice(0, 9).map(p => p.id) // First 9 players
    };

    currentBatterIndex = 0; // Reset to first batter

    saveCurrentGame();
    renderGameTracker();
    addGameLog('Game started');
  }
}

function renderGameTracker() {
  if (!currentGame) {
    document.getElementById('home-team-display').textContent = 'Our Team';
    document.getElementById('away-team-display').textContent = 'Opponent';
    document.getElementById('home-score').textContent = '0';
    document.getElementById('away-score').textContent = '0';
    document.getElementById('current-inning').textContent = '1';
    document.getElementById('batting-team').textContent = 'Our Team';
    renderLineup([]);
    return;
  }

  document.getElementById('home-team-display').textContent = currentGame.homeTeam;
  document.getElementById('away-team-display').textContent = currentGame.awayTeam;
  document.getElementById('home-score').textContent = currentGame.score.home;
  document.getElementById('away-score').textContent = currentGame.score.away;
  document.getElementById('current-inning').textContent = currentGame.currentInning;
  document.getElementById('batting-team').textContent =
    currentGame.battingTeam === 'home' ? currentGame.homeTeam : currentGame.awayTeam;

  renderLineup(currentGame.lineup || []);
  renderCurrentBatter(currentGame.lineup || []);
}

function renderLineup(lineup) {
  const lineupDisplay = document.getElementById('lineup-display');
  lineupDisplay.innerHTML = '';

  lineup.forEach((playerId, index) => {
    const player = players.find(p => p.id === playerId);
    if (player) {
      const lineupPlayer = document.createElement('div');
      lineupPlayer.className = 'lineup-player';

      // Highlight current batter
      if (index === currentBatterIndex) {
        lineupPlayer.classList.add('current-batter');
      }

      lineupPlayer.innerHTML = `
                <div class="player-info">
                    <div class="batting-order">${index + 1}</div>
                    <div>
                        <div class="player-name">${player.name} (#${player.number})</div>
                        <div class="player-position">${player.position} | AVG: ${player.stats.average.toFixed(3)}</div>
                    </div>
                </div>
                <div class="player-stats">
                    ${index === currentBatterIndex ? '🥎 BATTING' : index === (currentBatterIndex + 1) % lineup.length ? '⚾ ON DECK' : ''}
                </div>
            `;
      lineupDisplay.appendChild(lineupPlayer);
    }
  });
}

function nextInning() {
  if (currentGame) {
    currentGame.currentInning++;
    saveCurrentGame();
    renderGameTracker();
    addGameLog(`Inning ${currentGame.currentInning} started`);
  }
}

function switchBattingTeam() {
  if (currentGame) {
    currentGame.battingTeam = currentGame.battingTeam === 'home' ? 'away' : 'home';
    saveCurrentGame();
    renderGameTracker();
    addGameLog(`${currentGame.battingTeam === 'home' ? currentGame.homeTeam : currentGame.awayTeam} now batting`);
  }
}

function saveGame() {
  if (currentGame) {
    gameHistory.push({ ...currentGame });
    localStorage.setItem('gameHistory', JSON.stringify(gameHistory));
    alert('Game saved successfully!');
    addGameLog('Game saved');
  }
}

function renderCurrentBatter(lineup) {
  if (!lineup || lineup.length === 0) {
    updateBatterDisplay('current-batter-display', null, 1);
    updateBatterDisplay('on-deck-display', null, 2);
    return;
  }

  const currentPlayer = players.find(p => p.id === lineup[currentBatterIndex]);
  const nextBatterIndex = (currentBatterIndex + 1) % lineup.length;
  const nextPlayer = players.find(p => p.id === lineup[nextBatterIndex]);

  updateBatterDisplay('current-batter-display', currentPlayer, currentBatterIndex + 1);
  updateBatterDisplay('on-deck-display', nextPlayer, nextBatterIndex + 1);
}

function updateBatterDisplay(elementId, player, battingOrder) {
  const element = document.getElementById(elementId);
  if (!element) return;

  if (!player) {
    element.innerHTML = `
      <div class="batter-number">${battingOrder}</div>
      <div class="batter-info">
        <div class="batter-name">Select a player</div>
        <div class="batter-details">Position: - | AVG: .000</div>
      </div>
    `;
    return;
  }

  element.innerHTML = `
    <div class="batter-number">${battingOrder}</div>
    <div class="batter-info">
      <div class="batter-name">${player.name} (#${player.number})</div>
      <div class="batter-details">Position: ${player.position} | Bats: ${player.bats} | AVG: ${player.stats.average.toFixed(3)}</div>
    </div>
  `;
}

function nextBatter() {
  if (!currentGame || !currentGame.lineup) return;

  currentBatterIndex = (currentBatterIndex + 1) % currentGame.lineup.length;
  renderCurrentBatter(currentGame.lineup);

  const currentPlayer = players.find(p => p.id === currentGame.lineup[currentBatterIndex]);
  if (currentPlayer) {
    addGameLog(`Now batting: ${currentPlayer.name} (#${currentPlayer.number})`);
  }
}

function previousBatter() {
  if (!currentGame || !currentGame.lineup) return;

  currentBatterIndex = currentBatterIndex === 0 ? currentGame.lineup.length - 1 : currentBatterIndex - 1;
  renderCurrentBatter(currentGame.lineup);

  const currentPlayer = players.find(p => p.id === currentGame.lineup[currentBatterIndex]);
  if (currentPlayer) {
    addGameLog(`Now batting: ${currentPlayer.name} (#${currentPlayer.number})`);
  }
}

function addGameLog(message) {
  const gameLog = document.getElementById('game-log');
  const logEntry = document.createElement('div');
  logEntry.className = 'log-entry';
  logEntry.innerHTML = `
        <span class="log-timestamp">${new Date().toLocaleTimeString()}</span>
        ${message}
    `;
  gameLog.insertBefore(logEntry, gameLog.firstChild);
}

// PDF Export functionality
function exportToPDF() {
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF('landscape');

  // Add title
  pdf.setFontSize(20);
  pdf.text('Softball Scorebook', 20, 20);

  // Add game info
  const homeTeam = document.getElementById('home-team').value || 'Our Team';
  const awayTeam = document.getElementById('away-team').value || 'Opponent';
  const gameDate = document.getElementById('game-date').value || new Date().toISOString().split('T')[0];

  pdf.setFontSize(12);
  pdf.text(`${homeTeam} vs ${awayTeam}`, 20, 35);
  pdf.text(`Date: ${gameDate}`, 20, 45);

  // Create table data
  const tableData = [];
  const headers = ['Player', 'Pos', 'Inn 1', 'Inn 2', 'Inn 3', 'Inn 4', 'Inn 5', 'Inn 6', 'Inn 7', 'Stats'];
  tableData.push(headers);

  // Add player data
  players.forEach((player, index) => {
    const row = [
      `${index + 1}. ${player.name}`,
      player.position
    ];

    // Add at-bat results for each inning
    for (let inning = 1; inning <= 7; inning++) {
      const result = getAtBatResult(player.id, inning);
      row.push(result ? result.replace(/<[^>]*>/g, '') : '');
    }

    // Add stats
    row.push(`${player.stats.atBats}/${player.stats.hits} R:${player.stats.runs}`);
    tableData.push(row);
  });

  // Add table using autoTable plugin (if available)
  if (pdf.autoTable) {
    pdf.autoTable({
      head: [headers],
      body: tableData.slice(1),
      startY: 60,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [44, 90, 160] }
    });
  } else {
    // Fallback: simple text layout
    let y = 60;
    tableData.forEach(row => {
      pdf.text(row.join(' | '), 20, y);
      y += 10;
    });
  }

  // Save the PDF
  pdf.save(`scorebook-${gameDate}.pdf`);
}

// Local Storage functions
function savePlayersToStorage() {
  localStorage.setItem('softballPlayers', JSON.stringify(players));
}

function saveCurrentGame() {
  localStorage.setItem('currentGame', JSON.stringify(currentGame));
}

// Load sample data for demonstration
function loadSampleData() {
  if (players.length === 0) {
    const samplePlayers = [
      { id: 1, name: 'Emma Johnson', number: 12, position: 'P', bats: 'R', throws: 'R', stats: { gamesPlayed: 0, atBats: 0, hits: 0, runs: 0, rbis: 0, average: 0 } },
      { id: 2, name: 'Sofia Rodriguez', number: 8, position: 'C', bats: 'R', throws: 'R', stats: { gamesPlayed: 0, atBats: 0, hits: 0, runs: 0, rbis: 0, average: 0 } },
      { id: 3, name: 'Ava Chen', number: 3, position: '1B', bats: 'L', throws: 'R', stats: { gamesPlayed: 0, atBats: 0, hits: 0, runs: 0, rbis: 0, average: 0 } },
      { id: 4, name: 'Isabella Davis', number: 15, position: '2B', bats: 'R', throws: 'R', stats: { gamesPlayed: 0, atBats: 0, hits: 0, runs: 0, rbis: 0, average: 0 } },
      { id: 5, name: 'Mia Thompson', number: 7, position: 'SS', bats: 'R', throws: 'R', stats: { gamesPlayed: 0, atBats: 0, hits: 0, runs: 0, rbis: 0, average: 0 } },
      { id: 6, name: 'Charlotte Wilson', number: 9, position: '3B', bats: 'R', throws: 'R', stats: { gamesPlaged: 0, atBats: 0, hits: 0, runs: 0, rbis: 0, average: 0 } },
      { id: 7, name: 'Amelia Brown', number: 4, position: 'LF', bats: 'L', throws: 'R', stats: { gamesPlayed: 0, atBats: 0, hits: 0, runs: 0, rbis: 0, average: 0 } },
      { id: 8, name: 'Harper Garcia', number: 11, position: 'CF', bats: 'S', throws: 'R', stats: { gamesPlayed: 0, atBats: 0, hits: 0, runs: 0, rbis: 0, average: 0 } },
      { id: 9, name: 'Evelyn Martinez', number: 6, position: 'RF', bats: 'R', throws: 'R', stats: { gamesPlayed: 0, atBats: 0, hits: 0, runs: 0, rbis: 0, average: 0 } }
    ];

    players = samplePlayers;
    savePlayersToStorage();
  }

  renderRoster();
}

// Field Manager Management
function setupFieldManager() {
  const autoPositionBtn = document.getElementById('auto-position-btn');
  const clearFieldBtn = document.getElementById('clear-field-btn');
  const savePositionsBtn = document.getElementById('save-positions-btn');

  autoPositionBtn.addEventListener('click', autoPositionPlayers);
  clearFieldBtn.addEventListener('click', clearField);
  savePositionsBtn.addEventListener('click', saveFieldPositions);

  setupDragAndDrop();
}

function renderFieldManager() {
  renderBenchPlayers();
  renderFieldPositions();
}

function renderBenchPlayers() {
  const benchPlayers = document.getElementById('bench-players');
  const substitutePlayers = document.getElementById('substitute-players');

  benchPlayers.innerHTML = '';
  substitutePlayers.innerHTML = '';

  // Get players not currently on field
  const playersOnField = Object.values(fieldPositions);
  const availablePlayers = players.filter(player => !playersOnField.includes(player.id));

  // Split into starters and subs (first 9 are starters, rest are subs)
  const starters = availablePlayers.slice(0, 9);
  const subs = availablePlayers.slice(9);

  starters.forEach(player => {
    const chip = createPlayerChip(player);
    benchPlayers.appendChild(chip);
  });

  subs.forEach(player => {
    const chip = createPlayerChip(player);
    substitutePlayers.appendChild(chip);
  });
}

function createPlayerChip(player) {
  const chip = document.createElement('div');
  chip.className = 'player-chip';
  chip.draggable = true;
  chip.setAttribute('data-player-id', player.id);

  const initials = getPlayerInitials(player.name);
  chip.innerHTML = `
        <div class="player-initials">${initials}</div>
        <span>${player.name}</span>
        <small>(${player.position})</small>
    `;

  return chip;
}

function getPlayerInitials(name) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

function renderFieldPositions() {
  // Clear existing field players
  document.querySelectorAll('.field-player').forEach(el => el.remove());

  // Add players to their positions
  Object.entries(fieldPositions).forEach(([position, playerId]) => {
    const player = players.find(p => p.id === playerId);
    if (player) {
      const positionElement = document.querySelector(`[data-position="${position}"] .player-slot`);
      if (positionElement) {
        positionElement.classList.add('occupied');
        positionElement.textContent = getPlayerInitials(player.name);
        positionElement.setAttribute('data-player-id', playerId);
      }
    }
  });
}

function setupDragAndDrop() {
  // Make player chips draggable
  document.addEventListener('dragstart', function (e) {
    if (e.target.classList.contains('player-chip') || e.target.classList.contains('field-player')) {
      e.target.classList.add('dragging');
      e.dataTransfer.setData('text/plain', e.target.getAttribute('data-player-id'));
    }
  });

  document.addEventListener('dragend', function (e) {
    e.target.classList.remove('dragging');
  });

  // Make field positions droppable
  document.querySelectorAll('.player-slot').forEach(slot => {
    slot.addEventListener('dragover', function (e) {
      e.preventDefault();
      this.style.backgroundColor = 'rgba(40, 167, 69, 0.3)';
    });

    slot.addEventListener('dragleave', function (e) {
      this.style.backgroundColor = '';
    });

    slot.addEventListener('drop', function (e) {
      e.preventDefault();
      this.style.backgroundColor = '';

      const playerId = parseInt(e.dataTransfer.getData('text/plain'));
      const position = this.closest('.field-position').getAttribute('data-position');

      assignPlayerToPosition(playerId, position);
      renderFieldManager();
    });
  });

  // Make bench droppable for removing players from field
  document.getElementById('bench-players').addEventListener('dragover', function (e) {
    e.preventDefault();
  });

  document.getElementById('bench-players').addEventListener('drop', function (e) {
    e.preventDefault();
    const playerId = parseInt(e.dataTransfer.getData('text/plain'));
    removePlayerFromField(playerId);
    renderFieldManager();
  });
}

function assignPlayerToPosition(playerId, position) {
  // Remove player from any existing position
  Object.keys(fieldPositions).forEach(pos => {
    if (fieldPositions[pos] === playerId) {
      delete fieldPositions[pos];
    }
  });

  // Remove any existing player from this position
  if (fieldPositions[position]) {
    delete fieldPositions[position];
  }

  // Assign player to new position
  fieldPositions[position] = playerId;
  saveFieldPositions();
}

function removePlayerFromField(playerId) {
  Object.keys(fieldPositions).forEach(position => {
    if (fieldPositions[position] === playerId) {
      delete fieldPositions[position];
    }
  });
  saveFieldPositions();
}

function autoPositionPlayers() {
  fieldPositions = {};
  const positions = ['P', 'C', '1B', '2B', '3B', 'SS', 'LF', 'CF', 'RF'];
  const availablePlayers = players.slice(0, 9); // First 9 players

  positions.forEach((position, index) => {
    if (availablePlayers[index]) {
      fieldPositions[position] = availablePlayers[index].id;
    }
  });

  saveFieldPositions();
  renderFieldManager();
}

function clearField() {
  fieldPositions = {};
  saveFieldPositions();
  renderFieldManager();
}

function saveFieldPositions() {
  localStorage.setItem('fieldPositions', JSON.stringify(fieldPositions));
}

// Lineup Board Management
function setupLineupBoard() {
  const generateLineupBtn = document.getElementById('generate-lineup-btn');
  const printLineupBtn = document.getElementById('print-lineup-btn');
  const randomizeLineupBtn = document.getElementById('randomize-lineup-btn');

  generateLineupBtn.addEventListener('click', generateLineup);
  printLineupBtn.addEventListener('click', printLineup);
  randomizeLineupBtn.addEventListener('click', randomizeLineup);
}

function renderLineupBoard() {
  if (savedLineup.length === 0) {
    generateLineup();
  } else {
    displayLineup(savedLineup);
  }
}

function generateLineup() {
  // Use field positions if available, otherwise use first 9 players
  let lineupPlayers = [];

  if (Object.keys(fieldPositions).length > 0) {
    const positions = ['P', 'C', '1B', '2B', '3B', 'SS', 'LF', 'CF', 'RF'];
    lineupPlayers = positions.map(pos => {
      const playerId = fieldPositions[pos];
      return players.find(p => p.id === playerId);
    }).filter(Boolean);
  } else {
    lineupPlayers = players.slice(0, 9);
  }

  savedLineup = lineupPlayers;
  localStorage.setItem('savedLineup', JSON.stringify(savedLineup));
  displayLineup(lineupPlayers);
}

function displayLineup(lineupPlayers) {
  const lineupCards = document.getElementById('lineup-cards');
  const lineupSubs = document.getElementById('lineup-subs');

  lineupCards.innerHTML = '';
  lineupSubs.innerHTML = '';

  // Display batting order
  lineupPlayers.forEach((player, index) => {
    const card = createLineupCard(player, index + 1);
    lineupCards.appendChild(card);
  });

  // Display substitutes
  const substitutes = players.filter(p => !lineupPlayers.includes(p));
  substitutes.forEach(player => {
    const subCard = createSubstituteCard(player);
    lineupSubs.appendChild(subCard);
  });
}

function createLineupCard(player, battingOrder) {
  const card = document.createElement('div');
  card.className = 'lineup-card';
  card.innerHTML = `
        <div class="batting-number">${battingOrder}</div>
        <div class="lineup-player-info">
            <div class="lineup-player-name">${player.name}</div>
            <div class="lineup-player-details">
                <div><strong>Position:</strong> ${player.position}</div>
                <div><strong>Jersey:</strong> #${player.number}</div>
                <div><strong>Bats:</strong> ${player.bats}</div>
                <div><strong>AVG:</strong> ${player.stats.average.toFixed(3)}</div>
            </div>
        </div>
    `;
  return card;
}

function createSubstituteCard(player) {
  const card = document.createElement('div');
  card.className = 'sub-player';
  card.innerHTML = `
        <div class="sub-player-name">${player.name}</div>
        <div>#${player.number} - ${player.position}</div>
        <div>AVG: ${player.stats.average.toFixed(3)}</div>
    `;
  return card;
}

function randomizeLineup() {
  const currentLineup = [...savedLineup];
  for (let i = currentLineup.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [currentLineup[i], currentLineup[j]] = [currentLineup[j], currentLineup[i]];
  }
  savedLineup = currentLineup;
  localStorage.setItem('savedLineup', JSON.stringify(savedLineup));
  displayLineup(savedLineup);
}

function printLineup() {
  const printWindow = window.open('', '_blank');
  const homeTeam = document.getElementById('lineup-home-team').value || 'Our Team';
  const awayTeam = document.getElementById('lineup-away-team').value || 'Opponent';
  const gameDate = document.getElementById('lineup-date').value || new Date().toISOString().split('T')[0];

  let printContent = `
        <html>
        <head>
            <title>Batting Lineup</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 20px; }
                .header { text-align: center; margin-bottom: 30px; }
                .game-info { text-align: center; margin-bottom: 20px; font-size: 18px; }
                .lineup { max-width: 600px; margin: 0 auto; }
                .player { padding: 15px; border: 2px solid #2c5aa0; margin-bottom: 10px; border-radius: 10px; }
                .batting-order { font-size: 24px; font-weight: bold; color: #2c5aa0; }
                .player-name { font-size: 20px; font-weight: bold; margin: 5px 0; }
                .player-details { font-size: 14px; color: #666; }
                .subs { margin-top: 30px; }
                @media print { body { margin: 0; } }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>🥎 BATTING LINEUP 🥎</h1>
                <div class="game-info">${homeTeam} vs ${awayTeam} - ${gameDate}</div>
            </div>
            <div class="lineup">
    `;

  savedLineup.forEach((player, index) => {
    printContent += `
            <div class="player">
                <span class="batting-order">${index + 1}.</span>
                <div class="player-name">${player.name} (#${player.number})</div>
                <div class="player-details">Position: ${player.position} | Bats: ${player.bats} | AVG: ${player.stats.average.toFixed(3)}</div>
            </div>
        `;
  });

  const substitutes = players.filter(p => !savedLineup.includes(p));
  if (substitutes.length > 0) {
    printContent += `
            <div class="subs">
                <h3>Available Substitutes:</h3>
                ${substitutes.map(player =>
      `<div style="margin: 5px 0;">${player.name} (#${player.number}) - ${player.position}</div>`
    ).join('')}
            </div>
        `;
  }

  printContent += '</div></body></html>';

  printWindow.document.write(printContent);
  printWindow.document.close();
  printWindow.print();
}

// Whiteboard Management
function setupWhiteboard() {
  canvas = document.getElementById('whiteboard-canvas');
  ctx = canvas.getContext('2d');

  const penTool = document.getElementById('pen-tool');
  const eraserTool = document.getElementById('eraser-tool');
  const textTool = document.getElementById('text-tool');
  const penColor = document.getElementById('pen-color');
  const penSize = document.getElementById('pen-size');
  const clearBtn = document.getElementById('clear-whiteboard');
  const saveBtn = document.getElementById('save-whiteboard');
  const loadBtn = document.getElementById('load-plays');

  // Tool selection
  document.querySelectorAll('.tool-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      document.querySelectorAll('.tool-btn').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      currentTool = this.getAttribute('data-tool');
      updateCursor();
    });
  });

  penColor.addEventListener('change', (e) => {
    currentColor = e.target.value;
  });

  penSize.addEventListener('input', (e) => {
    currentSize = parseInt(e.target.value);
  });

  clearBtn.addEventListener('click', clearWhiteboard);
  saveBtn.addEventListener('click', saveWhiteboard);
  loadBtn.addEventListener('click', loadSavedPlays);

  // Drawing events
  canvas.addEventListener('mousedown', startDrawing);
  canvas.addEventListener('mousemove', draw);
  canvas.addEventListener('mouseup', stopDrawing);
  canvas.addEventListener('mouseout', stopDrawing);

  // Touch events for mobile
  canvas.addEventListener('touchstart', handleTouch);
  canvas.addEventListener('touchmove', handleTouch);
  canvas.addEventListener('touchend', stopDrawing);

  // Play template buttons
  document.querySelectorAll('.play-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      const playType = this.getAttribute('data-play');
      drawPlayTemplate(playType);
    });
  });

  initializeWhiteboard();
}

function initializeWhiteboard() {
  if (canvas && ctx) {
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    updateCursor();

    // Load saved whiteboard if exists
    const savedBoard = localStorage.getItem('whiteboardData');
    if (savedBoard) {
      const img = new Image();
      img.onload = function () {
        ctx.drawImage(img, 0, 0);
      };
      img.src = savedBoard;
    }
  }
}

function updateCursor() {
  if (currentTool === 'pen') {
    canvas.style.cursor = 'crosshair';
  } else if (currentTool === 'eraser') {
    canvas.style.cursor = 'grab';
  } else if (currentTool === 'text') {
    canvas.style.cursor = 'text';
  }
}

function startDrawing(e) {
  if (currentTool !== 'pen' && currentTool !== 'eraser') return;

  isDrawing = true;
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  ctx.beginPath();
  ctx.moveTo(x, y);
}

function draw(e) {
  if (!isDrawing) return;

  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  ctx.lineWidth = currentSize;

  if (currentTool === 'pen') {
    ctx.globalCompositeOperation = 'source-over';
    ctx.strokeStyle = currentColor;
  } else if (currentTool === 'eraser') {
    ctx.globalCompositeOperation = 'destination-out';
  }

  ctx.lineTo(x, y);
  ctx.stroke();
}

function stopDrawing() {
  isDrawing = false;
  ctx.beginPath();
}

function handleTouch(e) {
  e.preventDefault();
  const touch = e.touches[0];
  const mouseEvent = new MouseEvent(e.type === 'touchstart' ? 'mousedown' :
    e.type === 'touchmove' ? 'mousemove' : 'mouseup', {
    clientX: touch.clientX,
    clientY: touch.clientY
  });
  canvas.dispatchEvent(mouseEvent);
}

function clearWhiteboard() {
  if (confirm('Clear the entire whiteboard?')) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
}

function saveWhiteboard() {
  const dataURL = canvas.toDataURL();
  localStorage.setItem('whiteboardData', dataURL);

  // Also save to downloads
  const link = document.createElement('a');
  link.download = `softball-play-${new Date().toISOString().split('T')[0]}.png`;
  link.href = dataURL;
  link.click();

  alert('Whiteboard saved!');
}

function loadSavedPlays() {
  const savedBoard = localStorage.getItem('whiteboardData');
  if (savedBoard) {
    const img = new Image();
    img.onload = function () {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
    };
    img.src = savedBoard;
  } else {
    alert('No saved plays found.');
  }
}

function drawPlayTemplate(playType) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Set up common drawing styles
  ctx.strokeStyle = '#2c5aa0';
  ctx.fillStyle = '#2c5aa0';
  ctx.lineWidth = 3;
  ctx.font = 'bold 16px Arial';

  switch (playType) {
    case 'bunt-coverage':
      drawBuntCoverage();
      break;
    case 'steal-defense':
      drawStealDefense();
      break;
    case 'rundown':
      drawRundown();
      break;
    case 'double-play':
      drawDoublePlay();
      break;
  }
}

function drawBuntCoverage() {
  // Draw field positions
  drawFieldBase();

  // Draw player movements for bunt coverage
  ctx.strokeStyle = '#ff6b6b';
  ctx.lineWidth = 4;

  // Pitcher to first base line
  drawArrow(400, 300, 500, 400, '#ff6b6b');

  // First baseman charges
  drawArrow(500, 400, 450, 350, '#ff6b6b');

  // Third baseman charges
  drawArrow(300, 400, 350, 350, '#ff6b6b');

  // Add text instructions
  ctx.fillStyle = '#333';
  ctx.fillText('BUNT COVERAGE', 50, 50);
  ctx.fillText('P - Cover 1B', 50, 80);
  ctx.fillText('1B & 3B - Charge', 50, 110);
  ctx.fillText('2B - Cover 1B if P can\'t', 50, 140);
}

function drawStealDefense() {
  drawFieldBase();

  ctx.strokeStyle = '#4ecdc4';
  ctx.lineWidth = 4;

  // Catcher to second
  drawArrow(400, 480, 400, 300, '#4ecdc4');

  // Second baseman covers
  drawArrow(450, 300, 400, 300, '#4ecdc4');

  ctx.fillStyle = '#333';
  ctx.fillText('STEAL DEFENSE (2B)', 50, 50);
  ctx.fillText('C - Quick release to 2B', 50, 80);
  ctx.fillText('2B - Cover base', 50, 110);
  ctx.fillText('CF - Back up throw', 50, 140);
}

function drawRundown() {
  drawFieldBase();

  ctx.strokeStyle = '#45b7d1';
  ctx.lineWidth = 4;

  // Draw rundown between first and second
  drawArrow(500, 400, 450, 350, '#45b7d1');
  drawArrow(450, 300, 500, 350, '#45b7d1');

  ctx.fillStyle = '#333';
  ctx.fillText('RUNDOWN PLAY', 50, 50);
  ctx.fillText('Run runner back to base', 50, 80);
  ctx.fillText('Maximum 2 throws', 50, 110);
  ctx.fillText('Trail runner to backup', 50, 140);
}

function drawDoublePlay() {
  drawFieldBase();

  ctx.strokeStyle = '#f7dc6f';
  ctx.lineWidth = 4;

  // 6-4-3 double play
  drawArrow(350, 350, 400, 300, '#f7dc6f'); // SS to 2B
  drawArrow(400, 300, 500, 400, '#f7dc6f'); // 2B to 1B

  ctx.fillStyle = '#333';
  ctx.fillText('DOUBLE PLAY (6-4-3)', 50, 50);
  ctx.fillText('SS - Feed to 2B', 50, 80);
  ctx.fillText('2B - Turn and throw to 1B', 50, 110);
  ctx.fillText('Stay low, quick feet', 50, 140);
}

function drawFieldBase() {
  // Draw basic field outline
  ctx.strokeStyle = '#8fbc8f';
  ctx.lineWidth = 2;

  // Home plate
  ctx.fillRect(395, 475, 10, 10);

  // Bases
  ctx.fillRect(495, 395, 10, 10); // First
  ctx.fillRect(395, 295, 10, 10); // Second
  ctx.fillRect(295, 395, 10, 10); // Third

  // Pitcher's mound
  ctx.beginPath();
  ctx.arc(400, 350, 8, 0, 2 * Math.PI);
  ctx.fill();

  // Position labels
  ctx.fillStyle = '#2c5aa0';
  ctx.font = 'bold 12px Arial';
  ctx.fillText('P', 395, 340);
  ctx.fillText('C', 395, 495);
  ctx.fillText('1B', 505, 405);
  ctx.fillText('2B', 425, 305);
  ctx.fillText('3B', 280, 405);
  ctx.fillText('SS', 365, 325);
}

function drawArrow(fromX, fromY, toX, toY, color) {
  const headLength = 15;
  const angle = Math.atan2(toY - fromY, toX - fromX);

  ctx.strokeStyle = color;
  ctx.fillStyle = color;

  // Draw line
  ctx.beginPath();
  ctx.moveTo(fromX, fromY);
  ctx.lineTo(toX, toY);
  ctx.stroke();

  // Draw arrowhead
  ctx.beginPath();
  ctx.moveTo(toX, toY);
  ctx.lineTo(toX - headLength * Math.cos(angle - Math.PI / 6), toY - headLength * Math.sin(angle - Math.PI / 6));
  ctx.moveTo(toX, toY);
  ctx.lineTo(toX - headLength * Math.cos(angle + Math.PI / 6), toY - headLength * Math.sin(angle + Math.PI / 6));
  ctx.stroke();
}

// Calendar Management
function setupCalendar() {
  const addEventBtn = document.getElementById('add-event-btn');
  const eventModal = document.getElementById('event-modal');
  const eventForm = document.getElementById('event-form');
  const closeEventModal = document.querySelector('.close-event');
  const cancelEventBtn = document.getElementById('cancel-event');

  if (addEventBtn) {
    addEventBtn.addEventListener('click', () => {
      eventModal.style.display = 'block';
    });
  }

  if (closeEventModal) {
    closeEventModal.addEventListener('click', () => {
      eventModal.style.display = 'none';
      eventForm.reset();
    });
  }

  if (cancelEventBtn) {
    cancelEventBtn.addEventListener('click', () => {
      eventModal.style.display = 'none';
      eventForm.reset();
    });
  }

  if (eventForm) {
    eventForm.addEventListener('submit', handleAddEvent);
  }

  // Setup month navigation
  const prevMonthBtn = document.getElementById('prev-month');
  const nextMonthBtn = document.getElementById('next-month');

  if (prevMonthBtn) {
    prevMonthBtn.addEventListener('click', () => {
      currentMonth--;
      if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
      }
      renderCalendar();
    });
  }

  if (nextMonthBtn) {
    nextMonthBtn.addEventListener('click', () => {
      currentMonth++;
      if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
      }
      renderCalendar();
    });
  }
}

function renderCalendar() {
  const calendarGrid = document.getElementById('calendar-grid');
  const monthYear = document.getElementById('month-year');

  if (!calendarGrid || !monthYear) return;

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];

  monthYear.textContent = `${monthNames[currentMonth]} ${currentYear}`;

  // Clear existing grid
  calendarGrid.innerHTML = '';

  // Add day headers
  const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  dayHeaders.forEach(day => {
    const dayHeader = document.createElement('div');
    dayHeader.className = 'calendar-day-header';
    dayHeader.textContent = day;
    calendarGrid.appendChild(dayHeader);
  });

  // Get first day of month and number of days
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  // Add empty cells for days before month starts
  for (let i = 0; i < firstDay; i++) {
    const emptyDay = document.createElement('div');
    emptyDay.className = 'calendar-day empty';
    calendarGrid.appendChild(emptyDay);
  }

  // Add days of month
  for (let day = 1; day <= daysInMonth; day++) {
    const dayElement = document.createElement('div');
    dayElement.className = 'calendar-day';
    dayElement.textContent = day;

    // Check for events on this day
    const dayEvents = teamEvents.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.getDate() === day &&
        eventDate.getMonth() === currentMonth &&
        eventDate.getFullYear() === currentYear;
    });

    if (dayEvents.length > 0) {
      dayElement.classList.add('has-events');
      const eventList = document.createElement('div');
      eventList.className = 'day-events';
      dayEvents.forEach(event => {
        const eventDiv = document.createElement('div');
        eventDiv.className = `event event-${event.type}`;
        eventDiv.textContent = event.title;
        eventDiv.title = `${event.title} - ${event.location} at ${event.time}`;
        eventList.appendChild(eventDiv);
      });
      dayElement.appendChild(eventList);
    }

    calendarGrid.appendChild(dayElement);
  }
}

function handleAddEvent(e) {
  e.preventDefault();

  const formData = new FormData(e.target);
  const newEvent = {
    id: Date.now(),
    title: formData.get('event-title'),
    date: formData.get('event-date'),
    time: formData.get('event-time'),
    type: formData.get('event-type'),
    location: formData.get('event-location'),
    description: formData.get('event-description') || ''
  };

  teamEvents.push(newEvent);
  localStorage.setItem('teamEvents', JSON.stringify(teamEvents));

  document.getElementById('event-modal').style.display = 'none';
  e.target.reset();
  renderCalendar();
}

// Team Chat Management
function setupTeamChat() {
  const sendMessageBtn = document.getElementById('send-message');
  const messageInput = document.getElementById('message-input');
  const loginBtn = document.getElementById('google-login');
  const logoutBtn = document.getElementById('google-logout');

  if (sendMessageBtn && messageInput) {
    sendMessageBtn.addEventListener('click', sendMessage);
    messageInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });
  }

  if (loginBtn) {
    loginBtn.addEventListener('click', signInWithGoogle);
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', signOutFromGoogle);
  }
}

function renderTeamChat() {
  const chatMessages = document.getElementById('chat-messages');
  const userInfo = document.getElementById('user-info');

  if (!chatMessages) return;

  // Update user info
  if (userInfo) {
    if (currentUser) {
      userInfo.innerHTML = `
        <img src="${currentUser.photoURL}" alt="Profile" class="profile-pic">
        <span>Welcome, ${currentUser.displayName}</span>
        <button id="google-logout" class="btn-secondary">Logout</button>
      `;
      document.getElementById('google-logout').addEventListener('click', signOutFromGoogle);
    } else {
      userInfo.innerHTML = `
        <button id="google-login" class="btn-primary">Login with Google</button>
      `;
      document.getElementById('google-login').addEventListener('click', signInWithGoogle);
    }
  }

  // Load and display messages (placeholder for now)
  chatMessages.innerHTML = `
    <div class="message coach-message">
      <div class="message-header">
        <strong>Coach Sarah</strong>
        <span class="message-time">2:30 PM</span>
      </div>
      <div class="message-content">Great practice today everyone! Don't forget we have a game Saturday at 10 AM at Central Park Field 3.</div>
    </div>
    <div class="message parent-message">
      <div class="message-header">
        <strong>Emma's Mom</strong>
        <span class="message-time">2:45 PM</span>
      </div>
      <div class="message-content">Thanks for the reminder! Emma is so excited for the game.</div>
    </div>
  `;
}

function sendMessage() {
  const messageInput = document.getElementById('message-input');
  const chatMessages = document.getElementById('chat-messages');

  if (!messageInput || !chatMessages || !currentUser) return;

  const message = messageInput.value.trim();
  if (!message) return;

  // Create message element
  const messageDiv = document.createElement('div');
  messageDiv.className = 'message user-message';
  messageDiv.innerHTML = `
    <div class="message-header">
      <strong>${currentUser.displayName}</strong>
      <span class="message-time">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
    </div>
    <div class="message-content">${message}</div>
  `;

  chatMessages.appendChild(messageDiv);
  messageInput.value = '';
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Google Authentication
function setupGoogleAuth() {
  // This will be initialized when Google API loads
  window.initGoogleAuth = function () {
    gapi.load('auth2', function () {
      gapi.auth2.init({
        client_id: 'your-google-client-id.apps.googleusercontent.com'
      }).then(function () {
        const authInstance = gapi.auth2.getAuthInstance();
        if (authInstance.isSignedIn.get()) {
          const user = authInstance.currentUser.get();
          currentUser = {
            id: user.getId(),
            email: user.getBasicProfile().getEmail(),
            displayName: user.getBasicProfile().getName(),
            photoURL: user.getBasicProfile().getImageUrl()
          };
          renderTeamChat();
        }
      });
    });
  };
}

function signInWithGoogle() {
  if (typeof gapi !== 'undefined' && gapi.auth2) {
    const authInstance = gapi.auth2.getAuthInstance();
    authInstance.signIn().then(function (user) {
      currentUser = {
        id: user.getId(),
        email: user.getBasicProfile().getEmail(),
        displayName: user.getBasicProfile().getName(),
        photoURL: user.getBasicProfile().getImageUrl()
      };
      renderTeamChat();
    });
  } else {
    alert('Google Sign-In is not available. Please check your internet connection.');
  }
}

function signOutFromGoogle() {
  if (typeof gapi !== 'undefined' && gapi.auth2) {
    const authInstance = gapi.auth2.getAuthInstance();
    authInstance.signOut().then(function () {
      currentUser = null;
      renderTeamChat();
    });
  }
}

// Load sample data for demonstration
function loadSampleData() {
  if (players.length === 0) {
    const samplePlayers = [
      { id: 1, name: 'Emma Johnson', number: 12, position: 'P', bats: 'R', throws: 'R', stats: { gamesPlayed: 0, atBats: 0, hits: 0, runs: 0, rbis: 0, average: 0 } },
      { id: 2, name: 'Sofia Rodriguez', number: 8, position: 'C', bats: 'R', throws: 'R', stats: { gamesPlayed: 0, atBats: 0, hits: 0, runs: 0, rbis: 0, average: 0 } },
      { id: 3, name: 'Ava Chen', number: 3, position: '1B', bats: 'L', throws: 'R', stats: { gamesPlayed: 0, atBats: 0, hits: 0, runs: 0, rbis: 0, average: 0 } },
      { id: 4, name: 'Isabella Davis', number: 15, position: '2B', bats: 'R', throws: 'R', stats: { gamesPlayed: 0, atBats: 0, hits: 0, runs: 0, rbis: 0, average: 0 } },
      { id: 5, name: 'Mia Thompson', number: 7, position: 'SS', bats: 'R', throws: 'R', stats: { gamesPlayed: 0, atBats: 0, hits: 0, runs: 0, rbis: 0, average: 0 } },
      { id: 6, name: 'Charlotte Wilson', number: 9, position: '3B', bats: 'R', throws: 'R', stats: { gamesPlayed: 0, atBats: 0, hits: 0, runs: 0, rbis: 0, average: 0 } },
      { id: 7, name: 'Amelia Brown', number: 4, position: 'LF', bats: 'L', throws: 'R', stats: { gamesPlayed: 0, atBats: 0, hits: 0, runs: 0, rbis: 0, average: 0 } },
      { id: 8, name: 'Harper Garcia', number: 11, position: 'CF', bats: 'S', throws: 'R', stats: { gamesPlayed: 0, atBats: 0, hits: 0, runs: 0, rbis: 0, average: 0 } },
      { id: 9, name: 'Evelyn Martinez', number: 6, position: 'RF', bats: 'R', throws: 'R', stats: { gamesPlayed: 0, atBats: 0, hits: 0, runs: 0, rbis: 0, average: 0 } },
      { id: 10, name: 'Grace Taylor', number: 14, position: 'P', bats: 'R', throws: 'R', stats: { gamesPlayed: 0, atBats: 0, hits: 0, runs: 0, rbis: 0, average: 0 } },
      { id: 11, name: 'Lily Anderson', number: 2, position: 'OF', bats: 'L', throws: 'R', stats: { gamesPlayed: 0, atBats: 0, hits: 0, runs: 0, rbis: 0, average: 0 } },
      { id: 12, name: 'Zoe White', number: 5, position: 'IF', bats: 'R', throws: 'R', stats: { gamesPlayed: 0, atBats: 0, hits: 0, runs: 0, rbis: 0, average: 0 } }
    ];

    players = samplePlayers;
    savePlayersToStorage();
  }

  // Load sample events if none exist
  if (teamEvents.length === 0) {
    const today = new Date();
    const sampleEvents = [
      {
        id: 1,
        title: 'Practice',
        date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2).toISOString().split('T')[0],
        time: '17:00',
        type: 'practice',
        location: 'Central Park Field 1',
        description: 'Regular team practice - bring gloves and cleats'
      },
      {
        id: 2,
        title: 'Game vs Thunder',
        date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7).toISOString().split('T')[0],
        time: '10:00',
        type: 'game',
        location: 'Riverside Sports Complex Field 3',
        description: 'League game - arrive 30 minutes early'
      },
      {
        id: 3,
        title: 'Practice',
        date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 9).toISOString().split('T')[0],
        time: '17:00',
        type: 'practice',
        location: 'Central Park Field 1',
        description: 'Batting practice focus'
      }
    ];

    teamEvents = sampleEvents;
    localStorage.setItem('teamEvents', JSON.stringify(teamEvents));
  }

  renderRoster();
}

// Authentication Functions
function setupLoginHandlers() {
  const loginBtn = document.getElementById('login-google-btn');
  if (loginBtn) {
    loginBtn.addEventListener('click', handleGoogleLogin);
  }
}

function handleGoogleLogin() {
  // Simulate Google login for demo purposes
  // In a real implementation, this would use Google OAuth
  const email = prompt('Enter your email address for demo:');
  if (email) {
    if (isEmailApproved(email)) {
      currentUser = {
        email: email,
        displayName: email.split('@')[0],
        photoURL: 'https://via.placeholder.com/40'
      };
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
      showApp();
      initializeApp();
    } else {
      document.getElementById('login-error').style.display = 'block';
      document.getElementById('login-error').textContent = 'Your email address is not approved for access. Please contact the team administrator.';
    }
  }
}

function isEmailApproved(email) {
  return approvedEmails.some(approved => approved.email.toLowerCase() === email.toLowerCase());
}

function isAdmin(email) {
  const user = approvedEmails.find(approved => approved.email.toLowerCase() === email.toLowerCase());
  return user && (user.role === 'admin' || email.toLowerCase() === 'tommygoverstreet@gmail.com');
}

function updateUserInterface() {
  // Update user info in header
  const userInfo = document.getElementById('user-info');
  const authStatus = document.getElementById('auth-status');
  
  if (currentUser) {
    userInfo.style.display = 'flex';
    document.getElementById('user-avatar').src = currentUser.photoURL || 'https://via.placeholder.com/40';
    document.getElementById('user-name').textContent = currentUser.displayName || currentUser.email;
    
    // Show admin tab if user is admin
    const adminTab = document.querySelector('.nav-btn[data-tab="admin"]');
    if (adminTab && isAdmin(currentUser.email)) {
      adminTab.style.display = 'block';
    }
  }
  
  // Setup sign out handler
  const signOutBtn = document.getElementById('sign-out');
  if (signOutBtn) {
    signOutBtn.addEventListener('click', handleSignOut);
  }
}

function handleSignOut() {
  currentUser = null;
  localStorage.removeItem('currentUser');
  showLoginPage();
}

// Admin Functions
function setupAdmin() {
  if (!currentUser || !isAdmin(currentUser.email)) return;
  
  // Setup admin event handlers
  const addEmailBtn = document.getElementById('add-email-btn');
  const exportContactsBtn = document.getElementById('export-contacts-btn');
  const refreshContactsBtn = document.getElementById('refresh-contacts-btn');
  
  if (addEmailBtn) {
    addEmailBtn.addEventListener('click', handleAddEmail);
  }
  
  if (exportContactsBtn) {
    exportContactsBtn.addEventListener('click', exportContactsToPDF);
  }
  
  if (refreshContactsBtn) {
    refreshContactsBtn.addEventListener('click', renderContactsTable);
  }
  
  // Setup settings handlers
  document.getElementById('save-team-name')?.addEventListener('click', () => saveTeamSetting('teamName', 'team-name'));
  document.getElementById('save-season-year')?.addEventListener('click', () => saveTeamSetting('seasonYear', 'season-year'));
  document.getElementById('save-league-name')?.addEventListener('click', () => saveTeamSetting('leagueName', 'league-name'));
  
  // Setup contact modal
  setupContactModal();
  
  // Initial render
  renderApprovedEmails();
  renderContactsTable();
  loadTeamSettings();
}

function handleAddEmail() {
  const emailInput = document.getElementById('new-email');
  const roleSelect = document.getElementById('email-role');
  
  const email = emailInput.value.trim();
  const role = roleSelect.value;
  
  if (!email) {
    alert('Please enter a valid email address');
    return;
  }
  
  if (isEmailApproved(email)) {
    alert('This email is already approved');
    return;
  }
  
  const newApprovedEmail = {
    email: email,
    role: role,
    addedDate: new Date().toISOString(),
    addedBy: currentUser.email
  };
  
  approvedEmails.push(newApprovedEmail);
  localStorage.setItem('approvedEmails', JSON.stringify(approvedEmails));
  
  emailInput.value = '';
  renderApprovedEmails();
}

function renderApprovedEmails() {
  const container = document.getElementById('approved-emails-container');
  if (!container) return;
  
  container.innerHTML = '';
  
  approvedEmails.forEach(approvedEmail => {
    const emailDiv = document.createElement('div');
    emailDiv.className = 'email-item';
    emailDiv.innerHTML = `
      <div class="email-info">
        <div class="email-address">${approvedEmail.email}</div>
        <div class="email-role">${approvedEmail.role}</div>
      </div>
      <div class="email-actions">
        ${approvedEmail.email !== 'tommygoverstreet@gmail.com' ? 
          `<button class="btn-remove" onclick="removeApprovedEmail('${approvedEmail.email}')">Remove</button>` : 
          '<span style="color: #666; font-size: 0.8rem;">Owner</span>'
        }
      </div>
    `;
    container.appendChild(emailDiv);
  });
}

function removeApprovedEmail(email) {
  if (email === 'tommygoverstreet@gmail.com') {
    alert('Cannot remove the owner email');
    return;
  }
  
  if (confirm(`Remove access for ${email}?`)) {
    approvedEmails = approvedEmails.filter(approved => approved.email !== email);
    localStorage.setItem('approvedEmails', JSON.stringify(approvedEmails));
    renderApprovedEmails();
  }
}

function renderContactsTable() {
  const tbody = document.getElementById('contacts-tbody');
  if (!tbody) return;
  
  tbody.innerHTML = '';
  
  players.forEach(player => {
    const contact = playerContacts[player.id] || {};
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${player.name}</td>
      <td>${player.number}</td>
      <td>${contact.parentName || 'Not provided'}</td>
      <td>${contact.parentPhone || 'Not provided'}</td>
      <td>${contact.parentEmail || 'Not provided'}</td>
      <td>${contact.emergencyContact || 'Not provided'}</td>
      <td>${contact.emergencyPhone || 'Not provided'}</td>
      <td class="contact-actions-cell">
        <button class="btn-edit-contact" onclick="editPlayerContact(${player.id})">
          ${contact.parentName ? 'Edit' : 'Add'}
        </button>
      </td>
    `;
    tbody.appendChild(row);
  });
}

function setupContactModal() {
  const contactModal = document.getElementById('contact-modal');
  const contactForm = document.getElementById('contact-form');
  const closeContactModal = document.querySelector('.close-contact');
  const cancelContactBtn = document.querySelector('.cancel-contact');
  
  if (closeContactModal) {
    closeContactModal.addEventListener('click', () => {
      contactModal.style.display = 'none';
    });
  }
  
  if (cancelContactBtn) {
    cancelContactBtn.addEventListener('click', () => {
      contactModal.style.display = 'none';
    });
  }
  
  if (contactForm) {
    contactForm.addEventListener('submit', handleSaveContact);
  }
}

function editPlayerContact(playerId) {
  const player = players.find(p => p.id === playerId);
  const contact = playerContacts[playerId] || {};
  
  document.getElementById('contact-player-id').value = playerId;
  document.getElementById('contact-modal-title').textContent = `Contact Info - ${player.name}`;
  
  document.getElementById('parent-name').value = contact.parentName || '';
  document.getElementById('parent-phone').value = contact.parentPhone || '';
  document.getElementById('parent-email').value = contact.parentEmail || '';
  document.getElementById('emergency-contact').value = contact.emergencyContact || '';
  document.getElementById('emergency-phone').value = contact.emergencyPhone || '';
  
  document.getElementById('contact-modal').style.display = 'block';
}

function handleSaveContact(e) {
  e.preventDefault();
  
  const playerId = parseInt(document.getElementById('contact-player-id').value);
  const formData = new FormData(e.target);
  
  playerContacts[playerId] = {
    parentName: formData.get('parent-name'),
    parentPhone: formData.get('parent-phone'),
    parentEmail: formData.get('parent-email'),
    emergencyContact: formData.get('emergency-contact'),
    emergencyPhone: formData.get('emergency-phone'),
    lastUpdated: new Date().toISOString()
  };
  
  localStorage.setItem('playerContacts', JSON.stringify(playerContacts));
  document.getElementById('contact-modal').style.display = 'none';
  renderContactsTable();
}

function exportContactsToPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  
  doc.setFontSize(20);
  doc.text('Team Contact Information', 20, 20);
  
  doc.setFontSize(12);
  let yPos = 40;
  
  players.forEach(player => {
    const contact = playerContacts[player.id] || {};
    
    doc.text(`Player: ${player.name} (#${player.number})`, 20, yPos);
    yPos += 7;
    doc.text(`Parent: ${contact.parentName || 'Not provided'}`, 20, yPos);
    yPos += 7;
    doc.text(`Phone: ${contact.parentPhone || 'Not provided'}`, 20, yPos);
    yPos += 7;
    doc.text(`Email: ${contact.parentEmail || 'Not provided'}`, 20, yPos);
    yPos += 7;
    doc.text(`Emergency: ${contact.emergencyContact || 'Not provided'}`, 20, yPos);
    yPos += 7;
    doc.text(`Emergency Phone: ${contact.emergencyPhone || 'Not provided'}`, 20, yPos);
    yPos += 15;
    
    if (yPos > 270) {
      doc.addPage();
      yPos = 20;
    }
  });
  
  doc.save('team-contacts.pdf');
}

function saveTeamSetting(setting, inputId) {
  const input = document.getElementById(inputId);
  const value = input.value.trim();
  
  if (value) {
    teamSettings[setting] = setting === 'seasonYear' ? parseInt(value) : value;
    localStorage.setItem('teamSettings', JSON.stringify(teamSettings));
    alert('Setting saved successfully!');
  }
}

function loadTeamSettings() {
  document.getElementById('team-name').value = teamSettings.teamName || '';
  document.getElementById('season-year').value = teamSettings.seasonYear || new Date().getFullYear();
  document.getElementById('league-name').value = teamSettings.leagueName || '';
}
