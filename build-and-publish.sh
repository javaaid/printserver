#!/bin/bash

# Build and Publish Script for Print Server Docker Image
# This script builds the Docker image and publishes it to a container registry

set -e

# Configuration
IMAGE_NAME="print-server"
VERSION=${1:-latest}
REGISTRY=${DOCKER_REGISTRY:-""}  # Set DOCKER_REGISTRY env var or pass as parameter
TAG="${REGISTRY:+$REGISTRY/}${IMAGE_NAME}:${VERSION}"

echo "Building Docker image: $TAG"

# Build the image
docker build -t "$TAG" .

# Tag with latest if version is not latest
if [ "$VERSION" != "latest" ]; then
    docker tag "$TAG" "${REGISTRY:+$REGISTRY/}${IMAGE_NAME}:latest"
fi

echo "Build completed successfully!"
echo "Image: $TAG"

# Ask if user wants to publish
read -p "Do you want to publish the image to the registry? (y/N): " -n 1 -r
echo

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "Publishing image to registry..."
    
    # Login to registry if needed
    if [ -n "$REGISTRY" ]; then
        echo "Logging in to registry: $REGISTRY"
        docker login "$REGISTRY"
    fi
    
    # Push the image
    docker push "$TAG"
    
    if [ "$VERSION" != "latest" ]; then
        docker push "${REGISTRY:+$REGISTRY/}${IMAGE_NAME}:latest"
    fi
    
    echo "Image published successfully!"
    echo "Published: $TAG"
    
    if [ "$VERSION" != "latest" ]; then
        echo "Published: ${REGISTRY:+$REGISTRY/}${IMAGE_NAME}:latest"
    fi
else
    echo "Skipping image publication."
fi

echo "Done!"
