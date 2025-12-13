#!/bin/bash

# Script to add a user to Dozzle's users.yml
# Usage: ./add-dozzle-user.sh

USERS_FILE="./dozzle_users.yml"

if [ ! -f "$USERS_FILE" ]; then
    echo "Error: $USERS_FILE not found."
    echo "Please run this script from the project root."
    exit 1
fi

echo "Adding a new user to Dozzle..."
read -p "Username: " USERNAME
if [ -z "$USERNAME" ]; then
    echo "Username cannot be empty."
    exit 1
fi

read -p "Full Name (Optional): " NAME
read -p "Email (Optional): " EMAIL
read -s -p "Password: " PASSWORD
echo ""

if [ -z "$PASSWORD" ]; then
    echo "Password cannot be empty."
    exit 1
fi

# Generate hash using temporary dozzle container
echo "Generating secure hash..."
HASH_OUTPUT=$(docker run --rm -it amir20/dozzle:latest generate "$USERNAME" --password "$PASSWORD" --name "$NAME" --email "$EMAIL")

# Extract the YAML part (Dozzle output might contain other text, but usually it outputs just the YAML block or lines)
# The generate command outputs something like:
# - username: ...
#   password: ...
#   name: ...
#   email: ...

if [ -z "$HASH_OUTPUT" ]; then
    echo "Error generating hash. Make sure Docker is running."
    exit 1
fi

echo "Appending user to $USERS_FILE..."

# Check if users: [] exists and remove it if we are adding the first real user
if grep -q "users: \[\]" "$USERS_FILE"; then
    sed -i.bak 's/users: \[\]/users:/' "$USERS_FILE"
    rm "${USERS_FILE}.bak"
fi

# If "users:" key doesn't exist at all (empty file), add it
if ! grep -q "^users:" "$USERS_FILE"; then
    echo "users:" >> "$USERS_FILE"
fi

# Append the new user block
echo "$HASH_OUTPUT" >> "$USERS_FILE"

echo "User $USERNAME added successfully."
echo "Restarting Dozzle to apply changes..."
docker restart dozzle

echo "Done! You can now login at http://localhost:8888"
