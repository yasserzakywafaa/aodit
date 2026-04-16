# On-Prem Quick Commands

Use these commands for the most common workflows.

## 1) Install everything with one command (customer side)

Run from the `on-prem/` directory after placing these files together:
- `install.sh`
- `docker-compose.onprem.yml`
- `.env.onprem`
- `aodit-latest.tar.gz`
- `aodit-latest.tar.gz.sha256`

```bash
./install.sh
```

Useful flags:

```bash
./install.sh --skip-seed
./install.sh --no-checksum
./install.sh --tar /opt/aodit/aodit-v2.tar.gz --checksum /opt/aodit/aodit-v2.tar.gz.sha256
```

## 2) Package distributable image (vendor side)

```bash
./on-prem/package-image.sh
```

Outputs:
- `aodit-latest.tar.gz`
- `aodit-latest.tar.gz.sha256`

Custom tag/output:

```bash
IMAGE_TAG=v2 OUTPUT_TARBALL=aodit-v2.tar.gz ./on-prem/package-image.sh
```

## 3) Start/stop stack (customer side)

```bash
docker compose -f docker-compose.onprem.yml up -d
docker compose -f docker-compose.onprem.yml down
```

## 4) Health and logs

```bash
docker compose -f docker-compose.onprem.yml ps
docker compose -f docker-compose.onprem.yml logs -f aodit
docker compose -f docker-compose.onprem.yml logs -f mongodb
```

For full deployment steps, see `on-prem/DEPLOYMENT.md`.
