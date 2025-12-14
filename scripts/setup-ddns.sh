#!/bin/bash
set -e

# Colors for output
GREEN='\033[0;32m'
NC='\033[0m'

echo -e "${GREEN}Starting Cloudflare DDNS Setup...${NC}"

# Check for root privileges
if [ "$EUID" -ne 0 ]; then 
  echo "Please run as root (sudo)"
  exit 1
fi

# Install dependencies
echo "Installing jq..."
if command -v apt-get &> /dev/null; then
    apt-get update && apt-get install -y jq curl
elif command -v yum &> /dev/null; then
    yum install -y jq curl
fi

# Setup Directory
echo "Creating config directory..."
mkdir -p /etc/cloudflare-ddns
chmod 700 /etc/cloudflare-ddns

# Create Config Template if it doesn't exist
CONFIG_PATH="/etc/cloudflare-ddns/config.env"
if [ ! -f "$CONFIG_PATH" ]; then
    echo "Creating config template at $CONFIG_PATH..."
    cat > "$CONFIG_PATH" <<EOF
# Cloudflare API Token (Edit DNS permissions required)
API_TOKEN=your_api_token_here
# Zone ID (Found in Cloudflare Dashboard > Overview)
ZONE_ID=your_zone_id_here
# The domain records to update (comma separated)
# Example: api.example.com,ssh.example.com
RECORD_NAME=api.example.com,ssh.example.com
EOF
    chmod 600 "$CONFIG_PATH"
    echo -e "${GREEN}Config created. PLEASE EDIT $CONFIG_PATH with your details!${NC}"
else
    echo "Config file already exists."
fi

# Copy the update script
echo "Installing update script..."
# Assuming scripts are in the current directory or scripts/ subdirectory
SCRIPT_SRC="./scripts/update-cloudflare-dns.sh"
if [ ! -f "$SCRIPT_SRC" ]; then
    SCRIPT_SRC="./update-cloudflare-dns.sh"
    if [ ! -f "$SCRIPT_SRC" ]; then
         echo "Error: Could not find update-cloudflare-dns.sh"
         exit 1
    fi
fi

cp "$SCRIPT_SRC" /usr/local/bin/update-cloudflare-dns
chmod +x /usr/local/bin/update-cloudflare-dns

# Create Systemd Service
echo "Creating systemd service..."
cat > /etc/systemd/system/cloudflare-ddns.service <<EOF
[Unit]
Description=Cloudflare Dynamic DNS Update
After=network-online.target
Wants=network-online.target

[Service]
Type=oneshot
ExecStart=/usr/local/bin/update-cloudflare-dns
User=root

[Install]
WantedBy=multi-user.target
EOF

# Create Timer for periodic updates
cat > /etc/systemd/system/cloudflare-ddns.timer <<EOF
[Unit]
Description=Run Cloudflare DDNS update every 5 minutes

[Timer]
OnBootSec=1min
OnUnitActiveSec=5min

[Install]
WantedBy=timers.target
EOF

# Reload and Enable
systemctl daemon-reload
systemctl enable --now cloudflare-ddns.timer

echo -e "${GREEN}Setup Complete!${NC}"
echo "1. Edit the config file: sudo nano $CONFIG_PATH"
echo "2. Test the service: sudo systemctl start cloudflare-ddns"
echo "3. Check status: sudo systemctl status cloudflare-ddns"
