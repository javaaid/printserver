# Silent Print API Documentation

## POST /api/print/silent

The silent print endpoint allows you to print HTML content or remote URLs to thermal or regular printers with comprehensive error handling and payload size limits.

### Request Format

```json
{
  "html": "string (optional)",
  "url": "string (optional)", 
  "printer": "string (optional)",
  "options": {
    "copies": "number (optional, 1-100)",
    "format": "string (optional, 'pdf' | 'png')", 
    "width": "number (optional, 100-4096px)",
    "height": "number (optional, 100-4096px)",
    "scale": "number (optional, 0.1-3.0)",
    "timeout": "number (optional, 1000-120000ms)"
  }
}
```

### Validation Rules

- Must provide either `html` OR `url`, but not both
- `html`: 1 to 1MB in length
- `url`: Valid URL format, max 2048 characters
- `printer`: 1-255 characters (defaults to configured printer)
- `options.copies`: 1-100 copies (default: 1)
- `options.format`: 'pdf' or 'png' (default: 'pdf')
- `options.width/height`: 100-4096 pixels for PNG rendering
- `options.scale`: 0.1-3.0 scaling factor
- `options.timeout`: 1000-120000ms timeout
- Total payload size limit: 10MB

### Success Response (200 OK)

```json
{
  "success": true,
  "jobId": "job_1234567890_abc123",
  "printer": "HP_LaserJet",
  "format": "pdf",
  "copies": 2,
  "duration": 3245,
  "timestamp": "2024-01-01T12:00:00.000Z",
  "requestId": "req_abc123"
}
```

### Error Responses

#### 400 Bad Request - Invalid Payload
```json
{
  "success": false,
  "error": "Invalid request payload",
  "details": [
    "Request must contain either \"html\" OR \"url\" property, but not both"
  ],
  "timestamp": "2024-01-01T12:00:00.000Z",
  "requestId": "req_abc123"
}
```

#### 413 Payload Too Large
```json
{
  "success": false,
  "error": "Payload Too Large",
  "details": "Payload size (15.23MB) exceeds maximum allowed size of 10MB",
  "maxSize": "10MB",
  "actualSize": "15.23MB",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "requestId": "req_abc123"
}
```

#### 500 Internal Server Error
```json
{
  "success": false,
  "error": "Render failed",
  "details": "Failed to render HTML: Navigation timeout exceeded",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "requestId": "req_abc123",
  "duration": 30000
}
```

## Example Usage

### Print HTML Content as PDF

```bash
curl -X POST http://localhost:3000/api/print/silent \
  -H "Content-Type: application/json" \
  -d '{
    "html": "<h1>Hello World</h1><p>This is a test print job.</p>",
    "printer": "HP_LaserJet",
    "options": {
      "copies": 2,
      "format": "pdf"
    }
  }'
```

### Print Remote URL as PNG

```bash
curl -X POST http://localhost:3000/api/print/silent \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://example.com",
    "options": {
      "format": "png",
      "width": 1024,
      "height": 768,
      "scale": 1.0,
      "copies": 1
    }
  }'
```

### Print Receipt Template

```bash
curl -X POST http://localhost:3000/api/print/silent \
  -H "Content-Type: application/json" \
  -d '{
    "html": "<div style=\"width:300px; font-family: monospace; text-align: center;\"><h2>RECEIPT</h2><hr><p>Date: 2024-01-01</p><p>Item: Test Product</p><p>Price: $10.00</p><hr><p>Thank you!</p></div>",
    "printer": "Thermal_Printer",
    "options": {
      "format": "png",
      "width": 384,
      "height": 600
    }
  }'
```

## Job Status Tracking

### Get Job Status
```bash
curl http://localhost:3000/api/print/jobs/{jobId}
```

### Get All Jobs
```bash
curl http://localhost:3000/api/print/jobs
```

## Workflow Details

1. **Payload Validation**: Request is validated against JSON schema with size limits
2. **HTML/URL Rendering**: Content is rendered to PDF/PNG using Puppeteer headless Chrome
3. **Printer Resolution**: Printer is resolved from payload or default configuration
4. **Print Processing**: Buffer is sent to thermal printer (node-thermal-printer) or system printer (lp command)
5. **Job Tracking**: Print job is tracked with unique ID and status updates
6. **Response**: Success/failure response with job details and duration

## Error Handling

- **Validation Errors**: Detailed field-level validation messages
- **Size Limits**: 10MB payload limit with specific error response
- **Render Failures**: Puppeteer timeout, navigation, and rendering errors
- **Print Failures**: Printer communication and hardware errors
- **Fallback Support**: Automatic fallback from thermal to system printer

## Supported Features

- ✅ HTML content rendering
- ✅ Remote URL rendering  
- ✅ PDF and PNG output formats
- ✅ Thermal printer support (node-thermal-printer)
- ✅ System printer support (lp command)
- ✅ Multiple copies
- ✅ Custom render dimensions and scaling
- ✅ Timeout configuration
- ✅ Job tracking and status
- ✅ Comprehensive error handling
- ✅ Payload size limits (413 responses)
- ✅ Request validation
- ✅ Automatic printer fallback
- ✅ Job cleanup (1-hour retention)
