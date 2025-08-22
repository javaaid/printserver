# Print Server with Ordino POS Integration

A comprehensive Node.js print server with thermal printer support, PDF generation capabilities, and full integration with the Ordino POS (Point of Sale) system. This solution provides both backend APIs and a complete frontend interface for managing printers, processing orders, and monitoring print queues.

## Features

### Backend API
- Express.js REST API server with TypeScript
- Cross-platform printer discovery (Windows wmic, Unix lpstat)
- Silent printing for HTML content and remote URLs
- Thermal printer integration (node-thermal-printer)
- PDF and PNG generation (Puppeteer)
- Print job queue monitoring and status tracking
- Configuration validation (AJV)
- Structured logging with rotation (Winston)
- CORS support for web applications
- Environment-based configuration

### Frontend Interface
- React 18+ with TypeScript
- Redux Toolkit for state management
- Device settings management
- Real-time printer discovery
- Print queue monitoring
- Responsive design for desktop and mobile
- Connection testing and health checks

## Installation

```bash
npm install
```

## Configuration

1. Copy `.env.example` to `.env`
2. Modify the configuration in `config/default.json` as needed
3. Configure environment variables in `.env`

## Development

```bash
# Start development server with hot reload
npm run dev

# Build the project
npm run build

# Start production server
npm start

# Clean build files
npm run clean
```

## API Endpoints

### Health & Status
- `GET /` - Service status and information
- `GET /health` - Health check endpoint
- `GET /ping` - Simple ping endpoint
- `GET /api/health` - API health check
- `GET /config` - Non-sensitive configuration info

### Printer Discovery
- `GET /api/printers` - Discover available printers on the system
  - Returns: Array of printer objects with capabilities and status
  - Uses platform-specific commands (wmic on Windows, lpstat on Unix)

### Silent Printing
- `POST /api/print/silent` - Print HTML content or remote URLs
  - Body: `{ html?, url?, printer?, options? }`
  - Supports PDF and PNG output formats
  - Returns job ID and status

### Print Job Management
- `GET /api/print/jobs` - List all print jobs
- `GET /api/print/jobs/:jobId` - Get specific job status

## Usage Examples

### Discover Printers
```bash
curl http://localhost:3000/api/printers
```

### Print HTML Content
```bash
curl -X POST http://localhost:3000/api/print/silent \
  -H "Content-Type: application/json" \
  -d '{
    "html": "<h1>Test Print</h1><p>Hello World</p>",
    "printer": "Microsoft Print to PDF",
    "options": {
      "format": "pdf",
      "copies": 1
    }
  }'
```

### Print Remote URL
```bash
curl -X POST http://localhost:3000/api/print/silent \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://example.com",
    "printer": "HP LaserJet",
    "options": {
      "format": "pdf",
      "scale": 0.8
    }
  }'
```

## 🚀 Deployment Options

### Option 1: Local Development (Previous Setup)
1. **Start Print Server**: `npm run dev` (runs on port 3001)
2. **Start POS Frontend**: `cd frontend && npm start` (runs on port 8080)
3. **Configure Integration**: 
   - Open POS at http://localhost:8080
   - Navigate to Settings > Device Settings
   - Set Print Server URL to `http://localhost:3001`

### Option 2: Electron Desktop App + Vercel Cloud POS (Recommended)

#### 🖥️ **Desktop Print Server (Electron)**
1. **Run Desktop App**: `npm run electron:dev`
2. **Features**:
   - System tray integration
   - Auto-start server on launch
   - Visual server management
   - Local printer control
   - Real-time logging

#### ☁️ **Cloud POS System (Vercel)**
1. **Deploy to Vercel**:
   ```bash
   cd frontend
   npx vercel --prod
   ```
2. **Access from anywhere**: `https://your-pos-app.vercel.app`
3. **Connect to local print server**: Configure in Device Settings

### Benefits of Cloud + Desktop Architecture
- 🌍 **Access POS from anywhere** - Web-based, works on any device
- 🖨️ **Local printer control** - Print server runs locally for direct hardware access
- 📱 **Mobile-friendly** - POS works on tablets and phones
- 🔄 **Always updated** - Cloud deployment updates automatically
- 🛡️ **Secure** - Local print server only handles printing, POS in cloud

## POS System Integration

### POS Integration Features

#### Print Queue Monitor
- Real-time monitoring of print jobs
- Automatic processing of receipts, kitchen tickets, and invoices
- Pause/resume print queue functionality
- Clear queue and retry failed jobs

#### Printer Management
- Automatic printer discovery from print server
- Support for thermal printers and standard printers
- Individual printer configuration and settings
- Connection status monitoring

#### Device Settings
- Centralized print server URL configuration
- Default printer assignments (receipt, kitchen, bar, reports)
- Display and hardware device management
- Connection testing and validation

### Integration Testing

Run the integration test suite to verify POS-Print Server communication:

```bash
# Install test dependencies
npm install node-fetch@2

# Run integration tests
node test-pos-integration.js
```

Test results:
- ✅ Print Server Backend: Health, printer discovery, API endpoints
- ✅ POS Frontend: Accessibility, component loading
- ✅ Integration Workflow: Print job processing, printer discovery

## Frontend Development

The React frontend provides a complete POS interface with print server management:

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server (runs on port 8080)
npm start

# Build for production
npm run build
```

### POS Frontend Features
- **Complete POS System**: Order processing, inventory, customer management
- **Print Integration**: Seamless connection to print server APIs
- **Device Management**: Printer discovery, configuration, status monitoring
- **Print Queue**: Real-time job monitoring with pause/resume/retry controls
- **Receipt Templates**: Built-in templates for receipts, kitchen tickets, invoices
- **Multi-language Support**: Localization for international use
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## Docker Deployment

See `DOCKER_README.md` for containerized deployment options.

## Testing

### Manual QA Testing
Recent manual QA testing results:

✅ **Health Endpoint** - Returns proper status at `/health`
✅ **Printer Discovery** - Successfully discovers system printers via `/api/printers`
⚠️ **Print Functionality** - API validation works, rendering requires Puppeteer setup
✅ **React UI** - Components built successfully with proper API integration

### Running Tests
```bash
# Backend tests
npm test
npm run test:coverage

# Frontend tests
cd frontend
npm test
```

## Project Structure

```
print-server/
├── src/                    # Backend TypeScript source files
│   ├── config/            # Configuration management
│   ├── middleware/        # Express middleware
│   ├── services/          # Business logic services
│   └── validation/        # Request validation
├── frontend/              # React frontend application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── contexts/      # React contexts
│   │   ├── store/         # Redux store
│   │   └── types/         # TypeScript types
│   ├── build/             # Production build
│   └── package.json       # Frontend dependencies
├── config/                # Configuration files
├── logs/                  # Log files (auto-generated)
├── tests/                 # Test files
├── docs/                  # Documentation
├── dist/                  # Compiled JavaScript (auto-generated)
└── node_modules/          # Dependencies
```

## Dependencies

### Runtime Dependencies
- express - Web framework
- puppeteer - PDF generation
- node-thermal-printer - Thermal printer support
- body-parser - Request body parsing
- cors - Cross-Origin Resource Sharing
- ping - Network connectivity testing
- ajv - JSON schema validation
- dotenv - Environment variable loading
- winston - Logging

### Development Dependencies
- typescript - TypeScript compiler
- ts-node-dev - Development server with hot reload
- @types/* - TypeScript type definitions

## License

ISC
