# Deployment Guide: Electron + Vercel

This guide covers deploying the Print Server as an Electron desktop application and the POS system to Vercel for cloud access.

## Architecture Overview

### 🖥️ **Desktop Application (Electron)**
- **What**: Print Server Manager - Local server control
- **Purpose**: Runs print server locally, manages printers
- **Deployment**: Desktop app installer for Windows/Mac/Linux
- **Access**: Local system tray application

### ☁️ **Cloud Frontend (Vercel)**
- **What**: Ordino POS System - Web-based POS interface
- **Purpose**: Restaurant/retail operations interface
- **Deployment**: Hosted on Vercel CDN
- **Access**: Web browser from any device

## 🚀 Quick Start

### 1. Deploy POS Frontend to Vercel

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Deploy from frontend directory**:
   ```bash
   cd frontend
   vercel --prod
   ```

3. **Follow prompts**:
   - Project name: `ordino-pos-system`
   - Framework preset: `Other`
   - Build command: `npm run vercel-build`
   - Output directory: `build`

### 2. Build Electron Desktop App

1. **Development mode**:
   ```bash
   npm run electron:dev
   ```

2. **Production build**:
   ```bash
   npm run electron
   ```

3. **Create installer**:
   ```bash
   npm run electron:dist
   ```

## 📋 Detailed Deployment Steps

### Vercel Deployment (POS Frontend)

#### Prerequisites
- Vercel account (free tier available)
- Node.js 18+ installed
- Git repository (optional but recommended)

#### Step-by-Step Deployment

1. **Prepare the frontend**:
   ```bash
   cd D:/print-server/frontend
   npm install
   ```

2. **Connect to Git (optional)**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/ordino-pos.git
   git push -u origin main
   ```

3. **Deploy to Vercel**:
   ```bash
   npx vercel
   ```

4. **Configure deployment**:
   - Project name: `ordino-pos-system`
   - Directory: `./` (current)
   - Build command: `npm run vercel-build`
   - Output directory: `build`

5. **Production deployment**:
   ```bash
   npx vercel --prod
   ```

Your POS system will be available at: `https://ordino-pos-system.vercel.app`

#### Environment Variables (if needed)
```bash
# Set environment variables
vercel env add REACT_APP_DEFAULT_PRINT_SERVER_URL production
# Value: http://localhost:3001
```

### Electron Desktop App Deployment

#### Building for Different Platforms

1. **Windows (from Windows)**:
   ```bash
   npm run electron:dist
   # Creates: dist-electron/Print Server Manager Setup.exe
   ```

2. **macOS (from macOS)**:
   ```bash
   npm run electron:dist
   # Creates: dist-electron/Print Server Manager.dmg
   ```

3. **Linux (from Linux)**:
   ```bash
   npm run electron:dist
   # Creates: dist-electron/Print Server Manager.AppImage
   ```

#### Auto-updater Setup (Optional)

Add to `package.json`:
```json
{
  "build": {
    "publish": [
      {
        "provider": "github",
        "owner": "yourusername",
        "repo": "print-server"
      }
    ]
  }
}
```

#### Code Signing (Production)

For Windows:
```json
{
  "build": {
    "win": {
      "certificateFile": "path/to/certificate.p12",
      "certificatePassword": "password"
    }
  }
}
```

For macOS:
```json
{
  "build": {
    "mac": {
      "identity": "Developer ID Application: Your Name"
    }
  }
}
```

## 🔗 Integration Setup

### Connecting POS to Local Print Server

1. **Start Electron app** on local machine
2. **Start print server** from Electron interface
3. **Open POS system** in browser: `https://your-pos-app.vercel.app`
4. **Configure connection**:
   - Go to Settings → Device Settings
   - Set Print Server URL: `http://localhost:3001`
   - Click "Discover Printers"

### Network Configuration

#### For Local Network Access
To allow other devices on your network to connect:

1. **Update Electron app** to bind to `0.0.0.0`:
   ```javascript
   // In electron/main.js
   const serverPort = process.env.PORT || 3001;
   const serverHost = process.env.HOST || '0.0.0.0';
   ```

2. **Configure firewall**:
   ```bash
   # Windows
   netsh advfirewall firewall add rule name="Print Server" dir=in action=allow protocol=TCP localport=3001
   
   # macOS
   sudo /usr/libexec/ApplicationFirewall/socketfilterfw --add /path/to/app
   
   # Linux
   sudo ufw allow 3001
   ```

3. **Use local IP** in POS settings:
   - Find local IP: `ipconfig` (Windows) or `ifconfig` (Mac/Linux)
   - Use: `http://192.168.1.100:3001` (replace with your IP)

## 📱 Mobile & Tablet Access

### Progressive Web App (PWA)
The POS system supports PWA installation:

1. **Open in mobile browser**: `https://your-pos-app.vercel.app`
2. **Add to home screen** when prompted
3. **Launch like native app** from home screen

### iOS Safari
- Tap Share button → "Add to Home Screen"

### Android Chrome
- Tap menu → "Add to Home screen" or "Install App"

## 🔧 Configuration Files

### Frontend Environment Variables
Create `.env.production` in frontend directory:
```env
REACT_APP_DEFAULT_PRINT_SERVER_URL=http://localhost:3001
REACT_APP_POS_NAME=Ordino POS System
REACT_APP_VERSION=1.0.0
```

### Electron App Configuration
Located in user's home directory: `.print-server-config.json`
```json
{
  "autoStart": true,
  "startMinimized": false,
  "port": 3001,
  "host": "localhost"
}
```

## 🚀 Production Considerations

### Security
- **HTTPS**: Use HTTPS for production POS deployment
- **CORS**: Configure CORS properly for cross-origin requests
- **Authentication**: Implement user authentication for multi-user setups

### Performance
- **CDN**: Vercel provides global CDN automatically
- **Caching**: Configure appropriate cache headers
- **Compression**: Enable gzip compression (automatic in Vercel)

### Monitoring
- **Logs**: Monitor both Electron app and Vercel deployment logs
- **Analytics**: Add analytics to track usage patterns
- **Error Reporting**: Implement error reporting (Sentry, etc.)

## 🛠️ Troubleshooting

### Common Issues

#### Print Server Connection Failed
1. Check if Electron app is running
2. Verify port 3001 is not blocked
3. Check firewall settings
4. Try using IP address instead of localhost

#### Vercel Deployment Failed
1. Check build logs in Vercel dashboard
2. Verify Node.js version compatibility
3. Check package.json scripts
4. Review vercel.json configuration

#### Electron App Won't Start
1. Check if ports are available
2. Verify Node.js installation
3. Run in development mode for detailed logs
4. Check electron/logs directory

### Getting Help
- **GitHub Issues**: Report bugs and feature requests
- **Discord**: Join community discussions
- **Documentation**: Check latest docs for updates

---

## 📦 Deployment Checklist

### Before Deployment
- [ ] Test print server functionality
- [ ] Verify POS system works offline
- [ ] Check all printer integrations
- [ ] Test on target devices/browsers
- [ ] Configure environment variables
- [ ] Set up analytics/monitoring

### Vercel Deployment
- [ ] Create Vercel account
- [ ] Configure build settings
- [ ] Set custom domain (optional)
- [ ] Test production deployment
- [ ] Configure environment variables

### Electron Distribution
- [ ] Build for target platforms
- [ ] Test installers on clean machines
- [ ] Set up code signing certificates
- [ ] Configure auto-updater (optional)
- [ ] Create installation documentation

### Post-Deployment
- [ ] Monitor application performance
- [ ] Set up user feedback collection
- [ ] Plan update/maintenance schedule
- [ ] Document troubleshooting procedures

---

*Last updated: August 2025*
