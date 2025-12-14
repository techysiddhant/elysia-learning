#!/bin/bash
set -e

# Load configuration
CONFIG_FILE="/etc/cloudflare-ddns/config.env"
if [ ! -f "$CONFIG_FILE" ]; then
    echo "Error: Config file not found at $CONFIG_FILE"
    exit 1
fi
source "$CONFIG_FILE"

# Build the API URL
API_URL="https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns_records"

# Get the current public IP
IP=$(curl -s http://ipv4.icanhazip.com)

if [ -z "$IP" ]; then
    echo "Error: Failed to get public IP"
    exit 1
fi

echo "Current IP: $IP"


# Loop through the comma-separated list of records
IFS=',' read -ra RECORDS <<< "$RECORD_NAME"
for RECORD in "${RECORDS[@]}"; do
    echo "Processing $RECORD..."

    # Determine proxy setting: 'ssh' subdomain should NOT be proxied, others SHOULD be.
    PROXIED=true
    if [[ "$RECORD" == *"ssh"* ]]; then
        PROXIED=false
    fi

    # Get the current DNS record details
    RECORD_INFO=$(curl -s -X GET "$API_URL?name=$RECORD&type=A" \
        -H "Authorization: Bearer $API_TOKEN" \
        -H "Content-Type: application/json")

    SUCCESS=$(echo "$RECORD_INFO" | jq -r '.success')
    if [ "$SUCCESS" != "true" ]; then
        echo "Error: Failed to fetch info for $RECORD"
        continue
    fi

    RECORD_ID=$(echo "$RECORD_INFO" | jq -r '.result[0].id')
    CURRENT_DNS_IP=$(echo "$RECORD_INFO" | jq -r '.result[0].content')

    if [ "$RECORD_ID" == "null" ]; then
        echo "Warning: Record $RECORD not found in Cloudflare zone. Please create it manually first."
        continue
    fi

    if [ "$IP" == "$CURRENT_DNS_IP" ]; then
        echo "IP for $RECORD has not changed. Skipping."
        continue
    fi

    echo "Updating $RECORD to $IP (Proxied: $PROXIED)..."

    UPDATE_RESPONSE=$(curl -s -X PUT "$API_URL/$RECORD_ID" \
        -H "Authorization: Bearer $API_TOKEN" \
        -H "Content-Type: application/json" \
        --data "{\"type\":\"A\",\"name\":\"$RECORD\",\"content\":\"$IP\",\"proxied\":$PROXIED}")

    UPDATE_SUCCESS=$(echo "$UPDATE_RESPONSE" | jq -r '.success')

    if [ "$UPDATE_SUCCESS" == "true" ]; then
        echo "Successfully updated $RECORD"
    else
        echo "Error: Failed to update $RECORD"
        echo "$UPDATE_RESPONSE" | jq .
    fi
done
