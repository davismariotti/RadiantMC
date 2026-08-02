#!/bin/bash
# Usage: ./scripts/deploy.sh
# Pulls the survivalconfig-build.zip asset from the latest SurvivalConfig
# release and installs it as the site served at survivalconfig.davismariotti.com.

set -e

WEB_ROOT="/home/davis/RadiantMC/SurvivalConfig/build"

echo "Deploying frontend..."
TMPDIR=$(mktemp -d)
LATEST_TAG=$(gh release list --repo davismariotti/RadiantMC --json tagName,isDraft,isPrerelease --jq '[.[] | select(.tagName | startswith("survivalconfig-v")) | select(.isDraft == false and .isPrerelease == false)][0].tagName')
gh release download "$LATEST_TAG" --pattern "survivalconfig-build.zip" --repo davismariotti/RadiantMC --output "$TMPDIR/survivalconfig-build.zip"
unzip -o "$TMPDIR/survivalconfig-build.zip" -d "$TMPDIR/extracted"
mkdir -p "$WEB_ROOT"
rm -rf "${WEB_ROOT:?}"/*
cp -r "$TMPDIR/extracted/build/." "$WEB_ROOT/"
rm -rf "$TMPDIR"
echo "Frontend deployed to $WEB_ROOT"
