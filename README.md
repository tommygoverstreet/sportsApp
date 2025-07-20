# 🥎 Softball Assistant Coach

A comprehensive web application designed specifically for coaching staff of 12-year-old girls softball teams. This app provides an interactive and dynamic scorebook, roster management, game tracking capabilities, and secure team communication.

## 🔐 New Security & Admin Features

### 🔑 Authentication System
- **Secure Login**: Google-based authentication for approved users only
- **Access Control**: Only pre-approved email addresses can access the app
- **Role Management**: Separate access levels for coaches, parents, and administrators
- **Owner Protection**: `tommygoverstreet@gmail.com` has permanent admin access

### 👑 Admin Dashboard
- **Email Management**: Add and remove approved email addresses
- **Contact Database**: Complete parent/guardian contact information for all players
- **Team Settings**: Configure team name, season, and league information
- **PDF Export**: Export contact lists for emergency situations
- **System Security**: Protected admin functions with role verification

### 📅 Team Calendar
- **Event Scheduling**: Add practices, games, and team events
- **Location Tracking**: Store field locations and addresses
- **Monthly View**: Easy calendar navigation with event indicators
- **Event Details**: Time, location, and description for each event

### 💬 Team Communication
- **Secure Chat**: Team communication with Google authentication
- **Role-Based Access**: Coaches and approved parents only
- **Real-Time Messaging**: Instant team updates and announcements
- **User Profiles**: Display names and profile pictures

## New Features 🎯

### 🏟️ Field Manager
- **Interactive Field Layout**: Visual softball field with drag-and-drop player positioning
- **Player Initials Display**: Players show as initials on their field positions
- **Substitute Management**: Separate area for substitute players
- **Auto-Positioning**: Automatically position players based on their primary positions
- **Save Positions**: Save and load field arrangements

### 📋 Lineup Board
- **Large Print-Friendly Lineup**: Easy-to-read batting order for players and parents
- **Professional Cards**: Each batter displayed with large numbers and clear information
- **Substitute List**: Available substitutes clearly listed
- **Print Function**: Print lineup cards for dugout use
- **Randomize Feature**: Shuffle batting order while maintaining player data

### 🎨 Coaching Whiteboard
- **Digital Drawing Canvas**: Draw plays, responsibilities, and strategies
- **Multiple Tools**: Pen, eraser, and text tools with customizable colors and sizes
- **Play Templates**: Pre-drawn templates for common plays (bunt coverage, steal defense, rundowns, double plays)
- **Save/Load**: Save whiteboard drawings and reload them later
- **Touch Support**: Works on tablets and touch devices for sideline coaching

## 🚀 Quick Netlify Deployment

### Step 1: Prepare Your Files
Your app is ready to deploy! All files are configured for Netlify hosting.

### Step 2: Deploy to Netlify

#### Option A: Drag & Drop (Fastest)
1. **Zip your project folder**:
   - Select all files in `Softball Assistant Coach` folder
   - Create a ZIP file

2. **Deploy on Netlify**:
   - Go to [netlify.com](https://netlify.com)
   - Sign up/log in
   - Drag and drop your ZIP file to the deploy area
   - Your site will be live instantly!

#### Option B: GitHub Integration (Recommended)
1. **Create GitHub repository**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Softball Assistant Coach App"
   git remote add origin https://github.com/yourusername/softball-assistant-coach.git
   git push -u origin main
   ```

2. **Connect to Netlify**:
   - Go to [netlify.com](https://netlify.com)
   - Click "New site from Git"
   - Choose your GitHub repository
   - Deploy settings:
     - **Build command**: Leave empty
     - **Publish directory**: "." or leave empty
   - Click "Deploy site"

### Step 3: Configure Your Site
1. **Custom Site Name**: Change from random name to something like `yourteam-softball-coach`
2. **Your app URL**: `https://yourteam-softball-coach.netlify.app`
3. **Share with team**: Send the URL to coaches and parents

### Step 4: Set Up Authentication (Production)
For full Google authentication in production:
1. **Google Cloud Console**: Create OAuth credentials
2. **Update script.js**: Replace demo authentication with real Google OAuth
3. **Add approved emails**: Use admin dashboard to approve team members

## Usage Guide

### 🔐 Getting Started
1. **Access the app** at your Netlify URL
2. **Login**: Use an approved email address (start with `tommygoverstreet@gmail.com`)
3. **Admin Setup**: Add approved emails for your coaching staff and parents
4. **Team Setup**: Configure team name, season, and league in Admin dashboard

### 👥 Managing Your Team
- Add and manage player information
- Track player positions, batting preferences, and throwing hand
- Maintain player statistics (batting average, hits, runs, RBIs)
- Visual player cards with complete player profiles

### 📊 Interactive Scorebook
- Traditional scorebook layout that looks and feels like a physical scorebook
- Click-to-record at-bat results for each player and inning
- Real-time statistics updates
- Export scorebook to PDF for record keeping
- Game information tracking (teams, date, scores)

### 🎯 Game Tracker
- Live game tracking with current score display
- Inning-by-inning progression
- Batting order management
- Game event logging with timestamps
- Save and load game states

## Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- Node.js (optional, for development server)

### Installation

1. **Clone or download this repository**
   ```bash
   git clone <repository-url>
   cd softball-assistant-coach
   ```

2. **Install dependencies (optional, for development server)**
   ```bash
   npm install
   ```

3. **Run the application**
   
   **Option A: Simple file opening**
   - Simply open `index.html` in your web browser
   
   **Option B: Development server (recommended)**
   ```bash
   npm start
   ```
   This will start a local server at `http://localhost:8080`

## Usage Guide

### 1. Managing Your Roster
- Click "Roster" in the navigation
- Use "Add Player" to add new team members
- Fill in player details including name, jersey number, position, and batting/throwing preferences
- Player cards will display all information and current statistics

### 2. Recording Games with the Scorebook
- Click "Scorebook" in the navigation
- Enter game information (home team, away team, date)
- Click on any player's inning box to record their at-bat result
- Choose from options like Single, Double, Triple, Home Run, Walk, Strikeout, etc.
- Statistics automatically update as you record results
- Use "Export PDF" to save a permanent record of the game

### 3. Live Game Tracking
- Click "Game Tracker" in the navigation
- Start a new game with "New Game"
- Track the current score and inning
- Monitor batting lineup and player rotation
- View real-time game log of events
- Save completed games for future reference

## Technical Details

### Built With
- **HTML5** - Structure and semantic markup
- **CSS3** - Styling and responsive design
- **Vanilla JavaScript** - All functionality and interactivity
- **jsPDF** - PDF export functionality
- **Local Storage** - Data persistence

### Browser Compatibility
- Chrome 70+
- Firefox 65+
- Safari 12+
- Edge 79+

### Data Storage
All data is stored locally in your browser using Local Storage:
- Player roster information
- Current game state
- Game history
- Statistics

**Note**: Data is tied to the specific browser and device. For data backup, use the PDF export feature.

## Features in Detail

### Scorebook Interface
The scorebook mimics traditional paper scorebooks used in softball:
- Grid layout with players on rows and innings on columns
- Click any cell to record an at-bat result
- Visual indicators for completed at-bats
- Real-time statistics calculation
- Professional PDF export with proper formatting

### Statistics Tracking
Automatically calculated statistics include:
- At-bats (AB)
- Hits (H)
- Batting Average (AVG)
- Runs (R)
- RBIs (Run Batted In)

### Game Types Supported
Designed for 12U girls softball with:
- 7-inning games
- Standard positions and rules
- Age-appropriate interface design
- Simplified scoring for youth sports

## Customization

### Adding New At-Bat Results
To add new at-bat result types, modify the `showAtBatModal()` function in `script.js`:

```javascript
// Add new buttons to the result-buttons section
<button class="result-btn" data-result="FC">Fielder's Choice</button>
```

### Styling Changes
All visual customization can be done in `styles.css`:
- Colors are defined using CSS custom properties
- Responsive design breakpoints at 768px
- Grid layouts for flexible arrangements

## Troubleshooting

### Common Issues

**PDF Export Not Working**
- Ensure you have an internet connection (for CDN libraries)
- Try refreshing the page and attempting export again

**Data Not Saving**
- Check that Local Storage is enabled in your browser
- Ensure you're not in Private/Incognito mode

**Players Not Appearing in Scorebook**
- Make sure players are added to the roster first
- Check that the current game has been initialized

## Contributing

This is an open-source project. Contributions are welcome:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - feel free to use and modify for your team's needs.

## Support

For questions or issues:
- Check the troubleshooting section above
- Review the code comments in the JavaScript files
- Ensure all dependencies are properly loaded

---

**Perfect for**: Youth softball coaches, team managers, parents helping with scorekeeping, and anyone involved in 12U girls softball who wants a modern, digital approach to game management while maintaining the familiar scorebook experience.
