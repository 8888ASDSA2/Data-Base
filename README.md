# Word Finder - User Tracking System

A complete web-based tracking dashboard to monitor Word Finder users, track device information, IP addresses, and manage serial keys.

## Features

● **Real-time User Tracking** - Monitor active users and their activity
● **Serial Key Management** - Generate and validate unique serial keys
● **Device Information** - Track device type, OS, and browser
● **IP Address Logging** - Record and display user IP addresses
● **Activity Status** - Show online/offline status based on last activity
● **Statistics Dashboard** - View total users, active users, and unique IPs
● **Auto-refresh** - Dashboard updates every 30 seconds

## Setup Instructions

### Backend Setup (Node.js API)

1. Navigate to the API directory:
```bash
cd web/api
```

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
npm start
```

The API will run on `http://localhost:3000`

### Frontend Setup

1. Open `web/index.html` in a web browser
2. The dashboard will load with demo data
3. To connect to real API, update `API_URL` in `script.js`

### C++ Integration

1. Add `Tracking.h` and `Tracking.cpp` to your Visual Studio project
2. Update `WordFinder.vcxproj` to include the new files
3. Initialize tracking in your main.cpp:

```cpp
#include "Tracking.h"

// In WinMain or initialization
Tracking tracker;
tracker.Initialize("http://your-server.com:3000");

// Validate serial on startup
std::string serial = "WF-XXXX-XXXX-XXXX-XXXX";
if (tracker.ValidateSerial(serial)) {
    // Serial is valid, send tracking data
    tracker.SendTrackingData(serial);
} else {
    // Invalid serial, show error
    MessageBoxA(NULL, "Invalid serial key!", "Error", MB_OK | MB_ICONERROR);
    return 1;
}
```

## API Endpoints

### POST /api/track
Track user activity
```json
{
  "serial": "WF-XXXX-XXXX-XXXX-XXXX",
  "device": "Windows PC",
  "os": "Windows 11",
  "browser": "Native App"
}
```

### GET /api/users
Get all tracked users

### POST /api/serial/generate
Generate new serial key
```json
{
  "prefix": "WF"
}
```

### POST /api/serial/validate
Validate serial key
```json
{
  "serial": "WF-XXXX-XXXX-XXXX-XXXX"
}
```

### GET /api/stats
Get dashboard statistics

## Serial Key Format

Serial keys follow this format: `PREFIX-XXXX-XXXX-XXXX-XXXX`

Example: `WF-A7B9-C2D4-E6F8-G1H3`

- Default prefix: `WF` (Word Finder)
- 4 segments of 4 characters each
- Characters: A-Z and 0-9

## Database

The system uses a simple JSON file (`users.json`) for storage. For production:

- Replace with PostgreSQL, MySQL, or MongoDB
- Add user authentication
- Implement rate limiting
- Add encryption for sensitive data

## Security Considerations

⚠️ **Important for Production:**

1. Use HTTPS for all API requests
2. Implement API authentication (JWT tokens)
3. Add rate limiting to prevent abuse
4. Encrypt serial keys in database
5. Validate and sanitize all inputs
6. Use environment variables for sensitive config
7. Implement CORS properly
8. Add logging and monitoring

## Deployment

### Deploy Backend (Node.js)

**Option 1: Heroku**
```bash
heroku create wordfinder-api
git push heroku main
```

**Option 2: DigitalOcean/AWS**
- Use PM2 for process management
- Set up Nginx as reverse proxy
- Configure SSL certificate

### Deploy Frontend

**Option 1: GitHub Pages**
- Push to GitHub repository
- Enable GitHub Pages in settings

**Option 2: Netlify/Vercel**
- Connect repository
- Auto-deploy on push

## Dashboard Features

### Statistics Cards
- Total Users
- Active Users (online now)
- Total Serial Keys
- Unique IP Addresses

### User Activity Table
- Serial Number
- IP Address
- Device Type
- Operating System
- Browser/App
- Last Seen
- Online/Offline Status

### Serial Generator
- Generate new serial keys
- Custom prefix support
- Auto-copy to clipboard

## Customization

### Change Colors
Edit `style.css` and modify the color variables:
```css
/* Primary color */
border: 2px solid rgba(120, 185, 255, 0.3);

/* Gradient */
background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
```

### Change Serial Format
Edit `generateSerial()` function in `script.js` and `Tracking.cpp`

### Add More Tracking Data
Extend the tracking object in `server.js` and update the UI accordingly

## License

MIT License - See LICENSE file for details

## Author

Made by Noah (@0x6e6f6168)
