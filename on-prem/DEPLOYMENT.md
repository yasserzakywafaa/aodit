# aodit — On-Premises Deployment Guide

**Confidential — for IT administrators only.**

---

## What you're getting

The aodit application is delivered as a single Docker image that bundles the full application stack (frontend + backend) with **no internet access required at runtime**. It runs as two containers on your own infrastructure:

| Container | Role | Exposed |
|-----------|------|---------|
| `aodit` | Application server + web client | Port `16006` (put behind your reverse proxy) |
| `mongodb` | Database | Internal only — never reachable from outside the Docker network |

No source code is included. No data leaves your network.

---

## Prerequisites

On the server machine (Linux recommended):

```bash
# Verify Docker Engine >= 24
docker --version

# Verify Docker Compose plugin >= 2.20
docker compose version
```

Install guide if missing: https://docs.docker.com/engine/install/

Minimum server specs: **4 vCPU / 4 GB RAM / 40 GB disk**

---

## Fast Path — One Command Install

If you already have these files in `/opt/aodit/`:
- `install.sh`
- `docker-compose.onprem.yml`
- `.env.onprem`
- `aodit-latest.tar.gz`
- `aodit-latest.tar.gz.sha256`

Run:

```bash
cd /opt/aodit
./install.sh
```

Useful flags:

```bash
./install.sh --skip-seed
./install.sh --no-checksum
./install.sh --tar /opt/aodit/aodit-v2.tar.gz --checksum /opt/aodit/aodit-v2.tar.gz.sha256
```

If the script fails, use the manual step-by-step process below to isolate the failing step.

---

## Packaging the distributable image (vendor side)

From the repository root, generate the image archive and checksum:

```bash
./on-prem/package-image.sh
```

By default this creates:
- `aodit-latest.tar.gz`
- `aodit-latest.tar.gz.sha256`

You can override name/tag/output when needed:

```bash
IMAGE_TAG=v2 OUTPUT_TARBALL=aodit-v2.tar.gz ./on-prem/package-image.sh
```

When handing off to the client, provide these files together:
- `install.sh`
- `docker-compose.onprem.yml`
- `.env.onprem.example`
- `README.md`
- `DEPLOYMENT.md`
- `aodit-latest.tar.gz`
- `aodit-latest.tar.gz.sha256`

---

## Step 1 — Load the Docker image

You received `aodit-latest.tar.gz` (or `aodit-<tag>.tar.gz`) along with this folder. Load it into Docker on the target server:

```bash
# Transfer the tarball (+ checksum file) to the server (USB, internal SCP, etc.)
scp aodit-latest.tar.gz admin@server-ip:/opt/aodit/
scp aodit-latest.tar.gz.sha256 admin@server-ip:/opt/aodit/

# Verify checksum before loading (recommended)
# Option A (if shasum is available):
echo "$(cat /opt/aodit/aodit-latest.tar.gz.sha256)  /opt/aodit/aodit-latest.tar.gz" | shasum -a 256 -c
# Option B (if sha256sum is available):
echo "$(cat /opt/aodit/aodit-latest.tar.gz.sha256)  /opt/aodit/aodit-latest.tar.gz" | sha256sum -c

# On the server — load the image
docker load < /opt/aodit/aodit-latest.tar.gz
```

Verify it loaded:

```bash
docker images | grep aodit
# aodit    latest    a1b2c3d4e5f6    ...
```

---

## Step 2 — Configure the environment

Copy the example config file and fill in your values:

```bash
cd /opt/aodit
cp .env.onprem.example .env.onprem
nano .env.onprem        # or use any text editor
```

**Minimum required changes:**

| Variable | What to set |
|----------|-------------|
| `MONGODB_URI_PROD` | Keep as-is if using the bundled MongoDB — only the password must match `MONGO_INITDB_ROOT_PASSWORD` |
| `MONGO_INITDB_ROOT_PASSWORD` | Strong password for the database root user |
| `JWT_SECRET` | Random 64-char hex string — run: `openssl rand -hex 32` |
| `ADMIN_EMAIL` | Email address for the first administrator account |
| `ADMIN_PASSWORD` | Password for the first administrator (min 8 characters) |
| `OPENROUTER_BASE_URL` | URL of your internal LLM server (Ollama, vLLM, Azure OpenAI, etc.) |
| `OPENROUTER_MODEL_NAME` | Model name your LLM server recognises (e.g. `llama3.1:8b`) |
| `PUBLIC_URLS_CLIENT_PROD` | Internal URL employees use to reach the app (e.g. `https://aodit.bank.internal`) |

> **Security note:** Set restrictive permissions on `.env.onprem` — it contains secrets.
> ```bash
> chmod 600 /opt/aodit/.env.onprem
> ```

---

## Step 3 — Start the stack

```bash
docker compose --env-file .env.onprem -f docker-compose.onprem.yml up -d
```

Docker will:
1. Start MongoDB first and wait until it passes its health check (~30 seconds)
2. Start the aodit application once the database is ready (~60 seconds)

Watch it come up:

```bash
docker compose --env-file .env.onprem -f docker-compose.onprem.yml logs -f
```

Press `Ctrl+C` to stop following logs — the containers keep running.

Verify both containers are healthy:

```bash
docker compose --env-file .env.onprem -f docker-compose.onprem.yml ps
```

Both should show `healthy` in the STATUS column. The app is now reachable at `http://server-ip:16006`.

---

## Step 4 — Seed the first admin account

**Run this once only**, after the stack is healthy:

```bash
docker compose --env-file .env.onprem -f docker-compose.onprem.yml exec aodit \
  sh -c "ADMIN_EMAIL=admin@bank.internal \
         ADMIN_PASSWORD=YourAdminPassword \
         ADMIN_FIRST_NAME=Admin \
         ADMIN_LAST_NAME=User \
         node build/scripts/seed-admin.js"
```

Replace the values with the ones you set in `.env.onprem`.

Expected output:
```
✅  Connected to MongoDB.
✅  Super admin created: admin@bank.internal
ℹ️   You can now log in with the email and password you set.
✅  MongoDB connection closed.
```

> **Safe to re-run** — the script is idempotent. If the email already exists it skips creation and exits cleanly.

---

## Step 5 — Create employee accounts

1. Open `http://server-ip:16006` in a browser (or your reverse-proxy URL)
2. Log in with the admin email and password you seeded
3. Navigate to **Dashboard → Users**
4. Click **"Create User"** for each employee — set their name, email, password, and role
5. Distribute credentials to employees through your internal password manager or IT ticketing system

> **Note:** In on-prem mode (`ON_PREM=true`) the self-registration page is disabled. All accounts must be created by an administrator.

---

## Connecting to MongoDB for inspection (optional)

Port `27017` is intentionally **not published** to the host network (security requirement). To inspect the database, open a shell inside the running container:

```bash
docker compose --env-file .env.onprem -f docker-compose.onprem.yml exec mongodb \
  mongosh "mongodb://aodit_user:YOUR_DB_PASSWORD@localhost:27017/aodit_prod?authSource=admin"
```

If you need GUI access via MongoDB Compass **temporarily**, add a localhost-only port mapping to the `mongodb` service in `docker-compose.onprem.yml`:

```yaml
ports:
  - "127.0.0.1:27017:27017"   # localhost only — never use 0.0.0.0
```

Then connect Compass to: `mongodb://aodit_user:PASSWORD@localhost:27017/?authSource=admin`

**Remove the port mapping again when done.**

---

## Day-to-day operations

```bash
# Stop all containers (data is preserved in the named volume)
docker compose --env-file .env.onprem -f docker-compose.onprem.yml down

# Start after a server reboot
docker compose --env-file .env.onprem -f docker-compose.onprem.yml up -d

# View live application logs
docker compose --env-file .env.onprem -f docker-compose.onprem.yml logs -f aodit

# View live database logs
docker compose --env-file .env.onprem -f docker-compose.onprem.yml logs -f mongodb

# Check container health
docker compose --env-file .env.onprem -f docker-compose.onprem.yml ps

# Update to a new image version
docker load < aodit-v2.tar.gz
docker compose --env-file .env.onprem -f docker-compose.onprem.yml up -d   # restarts with new image

# Backup the database (produces a compressed archive)
docker compose --env-file .env.onprem -f docker-compose.onprem.yml exec mongodb \
  mongodump \
    --uri="mongodb://aodit_user:YOUR_DB_PASSWORD@localhost:27017/aodit_prod?authSource=admin" \
    --archive \
  | gzip > backup-$(date +%Y%m%d-%H%M%S).gz

# Restore from backup
gunzip -c backup-20260101-120000.gz | \
  docker compose --env-file .env.onprem -f docker-compose.onprem.yml exec -T mongodb \
    mongorestore --uri="mongodb://aodit_user:YOUR_DB_PASSWORD@localhost:27017/?authSource=admin" \
    --archive --drop
```

---

## Reverse proxy (recommended for production)

Place nginx or your bank's existing load balancer in front of port `16006` to handle TLS termination:

```nginx
server {
    listen 443 ssl;
    server_name aodit.bank.internal;

    ssl_certificate     /etc/ssl/aodit.crt;
    ssl_certificate_key /etc/ssl/aodit.key;

    location / {
        proxy_pass         http://127.0.0.1:16006;
        proxy_set_header   Host $host;
        proxy_set_header   X-Real-IP $remote_addr;
        proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto $scheme;
    }
}
```

---

## Support

Contact your aodit vendor representative for assistance.
