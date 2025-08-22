# Print Server Docker Deployment

This document provides instructions for containerizing and deploying the Print Server using Docker.

## Overview

The Print Server Docker image is built on Alpine Linux with libc6 compatibility to support Puppeteer for PDF generation and thermal printer functionality.

## Files

- `Dockerfile` - Multi-stage Docker build configuration
- `docker-compose.yml` - Orchestration for the print server and CORS testing
- `.dockerignore` - Excludes unnecessary files from build context
- `build-and-publish.sh` - Bash script for building and publishing (Linux/macOS)
- `build-and-publish.ps1` - PowerShell script for building and publishing (Windows)
- `test-web/` - CORS testing web interface

## Image Features

- **Base Image**: Node.js 18 on Alpine Linux
- **Puppeteer Support**: Pre-installed Chromium with libc6 compatibility
- **Security**: Runs as non-root user (`nextjs`)
- **Health Checks**: Built-in health monitoring
- **Signal Handling**: Proper signal forwarding with dumb-init

## Quick Start

### Using Docker Compose (Recommended)

1. **Start the services**:
   ```bash
   docker-compose up -d
   ```

2. **Access the services**:
   - Print Server: http://localhost:3000
   - CORS Test Web (Port 8080): http://localhost:8080
   - CORS Test Web (Port 8081): http://localhost:8081

3. **View logs**:
   ```bash
   docker-compose logs -f print-server
   ```

4. **Stop the services**:
   ```bash
   docker-compose down
   ```

### Manual Docker Build

1. **Build the image**:
   ```bash
   docker build -t print-server:latest .
   ```

2. **Run the container**:
   ```bash
   docker run -d \
     --name print-server \
     -p 3000:3000 \
     -v $(pwd)/config:/usr/src/app/config:ro \
     -v $(pwd)/logs:/usr/src/app/logs \
     print-server:latest
   ```

## Building and Publishing

### Using the Build Scripts

**Linux/macOS**:
```bash
chmod +x build-and-publish.sh
./build-and-publish.sh [version] [registry]

# Examples:
./build-and-publish.sh                    # Build as latest
./build-and-publish.sh v1.0.0            # Build with version tag
DOCKER_REGISTRY=your-registry.com ./build-and-publish.sh v1.0.0
```

**Windows**:
```powershell
.\build-and-publish.ps1 -Version "v1.0.0" -Registry "your-registry.com"
```

### Manual Publishing

1. **Build the image**:
   ```bash
   docker build -t your-registry.com/print-server:v1.0.0 .
   ```

2. **Login to registry**:
   ```bash
   docker login your-registry.com
   ```

3. **Push the image**:
   ```bash
   docker push your-registry.com/print-server:v1.0.0
   ```

## CORS Testing

The docker-compose setup includes two nginx servers on different ports to test CORS functionality:

1. **Start the test environment**:
   ```bash
   docker-compose up -d
   ```

2. **Open the test interfaces**:
   - Primary test: http://localhost:8080
   - Alternative origin test: http://localhost:8081

3. **Run CORS tests**:
   - Click the test buttons in the web interface
   - Check browser developer tools for CORS headers
   - Verify cross-origin requests work properly

### Test Scenarios

The CORS test interface includes:
- **Health Check**: Basic GET request to `/health`
- **Print Test**: POST request to `/print` with JSON payload
- **PDF Generation**: POST request to `/pdf` with HTML content
- **Preflight Test**: OPTIONS request to test CORS preflight handling

## Environment Variables

Configure the container using these environment variables:

- `NODE_ENV`: Environment mode (development/production)
- `LOG_LEVEL`: Logging verbosity (debug, info, warn, error)
- `PORT`: Server port (default: 3000)
- `PUPPETEER_EXECUTABLE_PATH`: Path to Chromium executable (pre-configured)
- `PUPPETEER_SKIP_CHROMIUM_DOWNLOAD`: Skip Puppeteer Chromium download (pre-configured)

## Volumes

Mount these directories for persistence and configuration:

- `/usr/src/app/config` - Configuration files (read-only recommended)
- `/usr/src/app/logs` - Application logs
- `/usr/src/app/data` - Optional: Application data

## Health Monitoring

The container includes health checks:

- **Endpoint**: `GET /health`
- **Interval**: 30 seconds
- **Timeout**: 10 seconds
- **Retries**: 3 attempts

Monitor container health:
```bash
docker ps                           # Check health status
docker inspect print-server        # Detailed health info
```

## Troubleshooting

### Common Issues

1. **Puppeteer/Chromium Issues**:
   ```bash
   # Check if Chromium is properly installed
   docker exec -it print-server /usr/bin/chromium-browser --version
   ```

2. **Permission Issues**:
   ```bash
   # Ensure proper volume permissions
   docker exec -it print-server ls -la /usr/src/app/logs
   ```

3. **Memory Issues**:
   ```bash
   # Increase container memory limit
   docker run --memory=512m print-server:latest
   ```

### Debugging

**Access container shell**:
```bash
docker exec -it print-server sh
```

**View real-time logs**:
```bash
docker logs -f print-server
```

**Check container resource usage**:
```bash
docker stats print-server
```

## Production Deployment

### Recommendations

1. **Use specific version tags** instead of `latest`
2. **Set resource limits**:
   ```yaml
   deploy:
     resources:
       limits:
         memory: 512M
         cpus: "1.0"
   ```

3. **Configure log rotation**:
   ```yaml
   logging:
     driver: "json-file"
     options:
       max-size: "10m"
       max-file: "3"
   ```

4. **Use secrets for sensitive configuration**:
   ```yaml
   secrets:
     - printer_config
   ```

5. **Monitor with health checks**:
   ```yaml
   healthcheck:
     test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
     interval: 30s
     timeout: 10s
     retries: 3
   ```

### Kubernetes Deployment

For Kubernetes deployment, create these resources:

- **Deployment**: Application pods
- **Service**: Load balancing and service discovery
- **ConfigMap**: Configuration management
- **Secret**: Sensitive data
- **Ingress**: External access and TLS termination

Example deployment command:
```bash
kubectl apply -f k8s/
```

## Security Considerations

- Container runs as non-root user (`nextjs:nodejs`)
- Uses minimal Alpine Linux base image
- Excludes sensitive files via `.dockerignore`
- Supports secrets management
- Includes security headers in HTTP responses

## Registry Support

The build scripts support various container registries:

- **Docker Hub**: `docker.io/username/print-server`
- **GitHub Container Registry**: `ghcr.io/username/print-server`
- **AWS ECR**: `account.dkr.ecr.region.amazonaws.com/print-server`
- **Google Container Registry**: `gcr.io/project/print-server`
- **Azure Container Registry**: `registry.azurecr.io/print-server`

Set the `DOCKER_REGISTRY` environment variable or pass it as a parameter to the build scripts.
