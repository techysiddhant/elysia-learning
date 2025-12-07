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

### 5. Update Environment Variables & Redeploy
If you missed an environment variable, for example `DATABASE_URL`, you can generate it from your existing variables:

```bash
# 1. Source the current variables so we can use them
source .env

# 2. Append the constructed DATABASE_URL to .env
# Note: "db" is the service name in docker-compose
echo "DATABASE_URL=postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@db:5432/${POSTGRES_DB}" >> .env

# 3. Check the file to verify
cat .env

# 4. Rebuild and restart
docker compose up -d --build
```

### 6. Debugging Issues (502 Bad Gateway)
If you see a **502 Bad Gateway**, it usually means Nginx cannot talk to your App. This often happens if the App crashed or is still starting up.

#### Check Logs
To see what is happening inside your containers:

```bash
# View logs for the application (Elysia)
docker compose logs -f app

# View logs for the database
docker compose logs -f db

# View logs for Nginx
docker compose logs -f nginx
```

#### Common Fixes
1.  **Database Connection**: If the app logs say "Connection refused" to the DB, ensure the `DATABASE_URL` is correct.
    *   Check it: `docker compose exec app env`
    *   Fix it: Follow Step 5 above.
2.  **App Crash**: If the app logs show a crash error, fix the error in your code, push to git, pull on VPS, and rebuild (`docker compose up -d --build`).
3.  **Port Mismatch**: Ensure your app listens on port 3000 (defined in `docker-compose.yml` and `nginx/conf.d/default.conf`).
