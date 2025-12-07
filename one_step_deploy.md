# One-Step Deployment Guide

Deploy your Elysia app to a VPS in minutes.

## Prerequisites
- A VPS (Ubuntu 20.04/22.04 recommended)
- SSH access
- Git (usually installed by default)

## The Deployment Script

Connect to your VPS and run the following commands block by block.

### 1. Install Docker & Docker Compose
If you haven't installed Docker yet:

```bash
# Update package index and install curl
sudo apt-get update
sudo apt-get install -y curl

# Install Docker using the convenience script
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Verify installation
docker compose version
```

### 2. Clone & Setup
Replace the repository URL if needed.

```bash
# Clone the repository
git clone https://github.com/techysiddhant/10xcoder-backend.git
cd 10xcoder-backend

# Create .env file
# REPLACE 'your_secure_password' and 'your_secret' with real values!
cat <<EOF > .env
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_secure_password
POSTGRES_DB=myapp
LOG_LEVEL=info

# Better Auth Configuration
BETTER_AUTH_SECRET=your_generated_secret_string
# Use your VPS IP or Domain
BETTER_AUTH_URL=http://$(curl -s ifconfig.me)
EOF
```

> **Note**: You can generate a random secret for `BETTER_AUTH_SECRET` using `openssl rand -base64 32`.

### 3. Launch
This builds the images and starts the containers in detached mode.

```bash
docker compose up -d --build
```

### 4. Verify
Check if the services are running:

```bash
docker compose ps
```

You should see:
- `app` (Elysia application)
- `db` (Postgres)
- `nginx` (Reverse Proxy listening on port 80)

Visit `http://<your-vps-ip>` in your browser.
