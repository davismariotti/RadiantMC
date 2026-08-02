#!/bin/bash
# Usage: ./docker/deploy.sh
# Pulls the latest davismariotti/survivalapi image from Docker Hub and
# restarts the SurvivalAPI container to run it.

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
COMPOSE_FILE="$SCRIPT_DIR/../docker-compose.yml"

echo "Pulling latest SurvivalAPI image..."
docker pull davismariotti/survivalapi:latest

echo "Restarting SurvivalAPI container..."
docker compose -f "$COMPOSE_FILE" up -d

echo "SurvivalAPI deployed."
