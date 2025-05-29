#!/bin/bash

# Azure VM Setup Script for CuddlePhish Video Performance Optimization
# Run with: sudo bash setup.sh

echo "Starting CuddlePhish Azure VM optimization..."

# Update package list
apt-get update

# Install required packages
echo "Installing required packages..."
apt-get install -y \
    xvfb \
    chromium-browser \
    fonts-liberation \
    libappindicator3-1 \
    libasound2 \
    libatk-bridge2.0-0 \
    libdrm2 \
    libgtk-3-0 \
    libnspr4 \
    libnss3 \
    libx11-xcb1 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    xdg-utils \
    libxss1 \
    libgconf-2-4

# Increase shared memory for better video performance
echo "Optimizing shared memory..."
if ! grep -q "/dev/shm" /etc/fstab; then
    echo 'tmpfs /dev/shm tmpfs defaults,size=2g 0 0' >> /etc/fstab
    mount -o remount /dev/shm
    echo "Shared memory increased to 2GB"
else
    echo "Shared memory already optimized"
fi

# Optimize TCP settings for WebRTC
echo "Optimizing network settings for WebRTC..."
cat >> /etc/sysctl.conf << EOF

# WebRTC Performance Optimizations
net.core.rmem_default = 262144
net.core.rmem_max = 16777216
net.core.wmem_default = 262144
net.core.wmem_max = 16777216

# Additional network optimizations
net.core.netdev_max_backlog = 5000
net.ipv4.tcp_window_scaling = 1
net.ipv4.tcp_congestion_control = bbr
net.ipv4.tcp_slow_start_after_idle = 0
EOF

# Apply sysctl changes
sysctl -p

# Optimize kernel parameters for video processing
echo "Optimizing kernel parameters..."
cat >> /etc/sysctl.conf << EOF

# Video processing optimizations
kernel.shmmax = 2147483648
kernel.shmall = 524288
vm.swappiness = 10
vm.dirty_ratio = 15
vm.dirty_background_ratio = 5
EOF

# Apply sysctl changes again
sysctl -p

# Set up GPU acceleration (if available)
echo "Checking for GPU acceleration..."
if lspci | grep -i vga | grep -i nvidia; then
    echo "NVIDIA GPU detected - installing drivers..."
    apt-get install -y nvidia-driver-470
elif lspci | grep -i vga | grep -i amd; then
    echo "AMD GPU detected - installing drivers..."
    apt-get install -y mesa-vulkan-drivers
else
    echo "No dedicated GPU detected - using software rendering"
fi

# Create systemd service for automatic startup (optional)
echo "Creating systemd service..."
cat > /etc/systemd/system/cuddlephish.service << EOF
[Unit]
Description=CuddlePhish Browser-in-the-Middle Attack Tool
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/opt/cuddlephish
ExecStart=/usr/bin/node index.js
Restart=always
RestartSec=5
Environment=DISPLAY=:99
Environment=NODE_ENV=production

# Performance settings
LimitNOFILE=65536
LimitNPROC=32768

[Install]
WantedBy=multi-user.target
EOF

# Set file limits for better performance
echo "Optimizing file limits..."
cat >> /etc/security/limits.conf << EOF

# CuddlePhish performance optimizations
* soft nofile 65536
* hard nofile 65536
* soft nproc 32768
* hard nproc 32768
root soft nofile 65536
root hard nofile 65536
root soft nproc 32768
root hard nproc 32768
EOF

# Optimize disk I/O for better performance
echo "Optimizing disk I/O..."
if [ -b /dev/sda ]; then
    echo deadline > /sys/block/sda/queue/scheduler
    echo "Disk scheduler set to deadline"
fi

# Install Node.js if not present
if ! command -v node &> /dev/null; then
    echo "Installing Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
    apt-get install -y nodejs
fi

# Install pm2 for process management
npm install -g pm2

echo ""
echo "==================================="
echo "Azure VM optimization complete!"
echo "==================================="
echo ""
echo "Next steps:"
echo "1. Reboot the system: sudo reboot"
echo "2. Navigate to your CuddlePhish directory"
echo "3. Install dependencies: npm install"
echo "4. Run the application with: node index.js [target]"
echo ""
echo "For production deployment, consider using:"
echo "pm2 start index.js --name cuddlephish -- [target]"
echo ""
echo "Performance monitoring:"
echo "- Check memory usage: free -h"
echo "- Check CPU usage: top"
echo "- Check network stats: ss -tuln"
echo "- Monitor WebRTC: netstat -an | grep 58082"
echo "" 