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

# Get the current DNS record details to check if update is needed
# We filter by name and type A
RECORD_INFO=$(curl -s -X GET "$API_URL?name=$RECORD_NAME&type=A" \
    -H "Authorization: Bearer $API_TOKEN" \
    -H "Content-Type: application/json")

# Check if the API call was successful
SUCCESS=$(echo "$RECORD_INFO" | jq -r '.success')
if [ "$SUCCESS" != "true" ]; then
    echo "Error: Failed to fetch DNS record info from Cloudflare"
    echo "Response: $RECORD_INFO" | jq .
    exit 1
fi

# Extract the Record ID and current IP in Cloudflare
RECORD_ID=$(echo "$RECORD_INFO" | jq -r '.result[0].id')
CURRENT_DNS_IP=$(echo "$RECORD_INFO" | jq -r '.result[0].content')

if [ "$RECORD_ID" == "null" ]; then
    echo "Error: Record $RECORD_NAME not found in Cloudflare zone"
    exit 1
fi

if [ "$IP" == "$CURRENT_DNS_IP" ]; then
    echo "IP has not changed ($IP). No update needed."
    exit 0
fi

echo "IP changed from $CURRENT_DNS_IP to $IP. Updating..."

# Update the record
UPDATE_RESPONSE=$(curl -s -X PUT "$API_URL/$RECORD_ID" \
    -H "Authorization: Bearer $API_TOKEN" \
    -H "Content-Type: application/json" \
    --data "{\"type\":\"A\",\"name\":\"$RECORD_NAME\",\"content\":\"$IP\",\"proxied\":true}")

UPDATE_SUCCESS=$(echo "$UPDATE_RESPONSE" | jq -r '.success')

if [ "$UPDATE_SUCCESS" == "true" ]; then
    echo "Successfully updated $RECORD_NAME to $IP"
else
    echo "Error: Failed to update DNS record"
    echo "Response: $UPDATE_RESPONSE" | jq .
    exit 1
fi
