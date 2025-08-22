# Build and Publish Script for Print Server Docker Image (PowerShell)
# This script builds the Docker image and publishes it to a container registry

param(
    [string]$Version = "latest",
    [string]$Registry = $env:DOCKER_REGISTRY
)

$ErrorActionPreference = "Stop"

# Configuration
$ImageName = "print-server"
$Tag = if ($Registry) { "$Registry/$ImageName:$Version" } else { "$ImageName:$Version" }

Write-Host "Building Docker image: $Tag" -ForegroundColor Green

try {
    # Build the image
    docker build -t $Tag .
    
    # Tag with latest if version is not latest
    if ($Version -ne "latest") {
        $LatestTag = if ($Registry) { "$Registry/$ImageName:latest" } else { "$ImageName:latest" }
        docker tag $Tag $LatestTag
    }
    
    Write-Host "Build completed successfully!" -ForegroundColor Green
    Write-Host "Image: $Tag" -ForegroundColor Cyan
    
    # Ask if user wants to publish
    $Publish = Read-Host "Do you want to publish the image to the registry? (y/N)"
    
    if ($Publish -match "^[Yy]$") {
        Write-Host "Publishing image to registry..." -ForegroundColor Yellow
        
        # Login to registry if needed
        if ($Registry) {
            Write-Host "Logging in to registry: $Registry" -ForegroundColor Yellow
            docker login $Registry
        }
        
        # Push the image
        docker push $Tag
        
        if ($Version -ne "latest") {
            $LatestTag = if ($Registry) { "$Registry/$ImageName:latest" } else { "$ImageName:latest" }
            docker push $LatestTag
        }
        
        Write-Host "Image published successfully!" -ForegroundColor Green
        Write-Host "Published: $Tag" -ForegroundColor Cyan
        
        if ($Version -ne "latest") {
            $LatestTag = if ($Registry) { "$Registry/$ImageName:latest" } else { "$ImageName:latest" }
            Write-Host "Published: $LatestTag" -ForegroundColor Cyan
        }
    } else {
        Write-Host "Skipping image publication." -ForegroundColor Yellow
    }
    
    Write-Host "Done!" -ForegroundColor Green
}
catch {
    Write-Error "An error occurred: $($_.Exception.Message)"
    exit 1
}
