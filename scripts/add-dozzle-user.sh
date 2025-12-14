#!/bin/bash
# Points to the correct directory
USERS_FILE="./dozzle_data/users.yml"

if [ ! -f "$USERS_FILE" ]; then 
    echo "Creating new users file at $USERS_FILE..."
    mkdir -p "$(dirname "$USERS_FILE")"
    touch "$USERS_FILE"
fi

echo "Adding a new user to Dozzle..."
read -p "Username: " USERNAME
if [ -z "$USERNAME" ]; then echo "Username cannot be empty."; exit 1; fi

read -p "Full Name (Optional): " NAME
read -p "Email (Optional): " EMAIL
read -s -p "Password: " PASSWORD
echo ""

if [ -z "$PASSWORD" ]; then echo "Password cannot be empty."; exit 1; fi

echo "Generating secure hash..."
# Ensure docker can run
if ! docker ps > /dev/null; then echo "Error: Docker not running or no permission."; exit 1; fi

HASH_OUTPUT=$(docker run --rm -i amir20/dozzle:latest generate "$USERNAME" --password "$PASSWORD" --name "$NAME" --email "$EMAIL")

if [ -z "$HASH_OUTPUT" ]; then echo "Error generating hash."; exit 1; fi

echo "Appending user to $USERS_FILE..."
# Fix permissions so we can write to it (if owned by root)
sudo chmod 666 "$USERS_FILE"

sudo chmod 666 "$USERS_FILE"

# Check if "users:" key exists. If not, add it.
if ! grep -q "^users:" "$USERS_FILE"; then
    echo "users:" > "$USERS_FILE"
fi

# Append the new user with correct indentation (2 spaces)
# We strip the 'users:' line from the generated output if it exists to avoid duplication
echo "$HASH_OUTPUT" | grep -v "users:" | sed 's/^/  /' >> "$USERS_FILE"

echo "User $USERNAME added successfully. Restarting Dozzle..."
docker restart dozzle || docker compose up -d dozzle
echo "Done! Login at http://localhost:8888"
