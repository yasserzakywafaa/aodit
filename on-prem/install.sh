#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
COMPOSE_FILE="${SCRIPT_DIR}/docker-compose.onprem.yml"
ENV_FILE="${SCRIPT_DIR}/.env.onprem"
DEFAULT_TARBALL="${SCRIPT_DIR}/aodit-latest.tar.gz"

TARBALL_PATH="${DEFAULT_TARBALL}"
CHECKSUM_PATH=""
VERIFY_CHECKSUM=1
SEED_ADMIN=1
CURRENT_STEP=""

log_step() {
  local step="$1"
  local message="$2"
  CURRENT_STEP="${message}"
  printf '\n[%s] %s\n' "${step}" "${message}"
}

log_info() {
  printf '  -> %s\n' "$1"
}

fail() {
  printf 'ERROR: %s\n' "$1" >&2
  exit 1
}

on_error() {
  local exit_code=$?
  if [[ -n "${CURRENT_STEP}" ]]; then
    printf '\nInstall failed during: %s\n' "${CURRENT_STEP}" >&2
  fi
  exit "${exit_code}"
}

trap on_error ERR

usage() {
  cat <<'EOF'
Usage: ./install.sh [options]

Options:
  --tar <path>        Path to image archive (default: ./aodit-latest.tar.gz)
  --checksum <path>   Path to checksum file (default: <tar>.sha256 if present)
  --no-checksum       Skip checksum verification
  --skip-seed         Skip initial admin seed
  --help              Show this help message

Expected files next to this script:
  - docker-compose.onprem.yml
  - .env.onprem
EOF
}

require_command() {
  command -v "$1" >/dev/null 2>&1 || fail "Missing required command: $1"
}

checksum_tool() {
  if command -v shasum >/dev/null 2>&1; then
    printf 'shasum'
    return
  fi

  if command -v sha256sum >/dev/null 2>&1; then
    printf 'sha256sum'
    return
  fi

  fail "No SHA-256 tool found. Install shasum or sha256sum."
}

verify_checksum() {
  local checksum_file="$1"
  local tar_file="$2"
  local expected_hash
  expected_hash="$(tr -d '[:space:]' < "${checksum_file}")"
  [[ -n "${expected_hash}" ]] || fail "Checksum file is empty: ${checksum_file}"

  case "$(checksum_tool)" in
    shasum)
      printf '%s  %s\n' "${expected_hash}" "${tar_file}" | shasum -a 256 -c
      ;;
    sha256sum)
      printf '%s  %s\n' "${expected_hash}" "${tar_file}" | sha256sum -c
      ;;
  esac
}

compose() {
  docker compose --env-file "${ENV_FILE}" -f "${COMPOSE_FILE}" "$@"
}

wait_for_health() {
  local service="$1"
  local timeout_seconds="$2"
  local elapsed=0
  local container_id=""
  local status=""

  while (( elapsed < timeout_seconds )); do
    container_id="$(compose ps -q "${service}" 2>/dev/null || true)"
    if [[ -n "${container_id}" ]]; then
      status="$(docker inspect --format '{{if .State.Health}}{{.State.Health.Status}}{{else}}{{.State.Status}}{{end}}' "${container_id}" 2>/dev/null || true)"
      if [[ "${status}" == "healthy" || "${status}" == "running" ]]; then
        log_info "${service} status: ${status}"
        return 0
      fi
    fi

    sleep 5
    elapsed=$((elapsed + 5))
  done

  compose ps || true
  fail "Timed out waiting for service '${service}' to become healthy."
}

load_env_file() {
  [[ -f "${ENV_FILE}" ]] || fail "Missing environment file: ${ENV_FILE}"
  set -a
  # shellcheck disable=SC1090
  source "${ENV_FILE}"
  set +a
}

seed_admin() {
  load_env_file

  [[ -n "${ADMIN_EMAIL:-}" ]] || fail "ADMIN_EMAIL is required in ${ENV_FILE} for seeding."
  [[ -n "${ADMIN_PASSWORD:-}" ]] || fail "ADMIN_PASSWORD is required in ${ENV_FILE} for seeding."
  [[ "${ADMIN_PASSWORD}" != CHANGE_ME_* ]] || fail "ADMIN_PASSWORD must be changed from the example value before seeding."
  [[ ${#ADMIN_PASSWORD} -ge 8 ]] || fail "ADMIN_PASSWORD must be at least 8 characters."

  local admin_first_name="${ADMIN_FIRST_NAME:-Admin}"
  local admin_last_name="${ADMIN_LAST_NAME:-User}"

  compose exec -T \
    -e ADMIN_EMAIL="${ADMIN_EMAIL}" \
    -e ADMIN_PASSWORD="${ADMIN_PASSWORD}" \
    -e ADMIN_FIRST_NAME="${admin_first_name}" \
    -e ADMIN_LAST_NAME="${admin_last_name}" \
    aodit node build/scripts/seed-admin.js
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --tar)
      [[ $# -ge 2 ]] || fail "--tar requires a path"
      TARBALL_PATH="$2"
      shift 2
      ;;
    --checksum)
      [[ $# -ge 2 ]] || fail "--checksum requires a path"
      CHECKSUM_PATH="$2"
      shift 2
      ;;
    --no-checksum)
      VERIFY_CHECKSUM=0
      shift
      ;;
    --skip-seed)
      SEED_ADMIN=0
      shift
      ;;
    --help)
      usage
      exit 0
      ;;
    *)
      fail "Unknown option: $1"
      ;;
  esac
done

if [[ "${TARBALL_PATH}" != /* ]]; then
  TARBALL_PATH="${PWD}/${TARBALL_PATH}"
fi

if [[ -z "${CHECKSUM_PATH}" ]]; then
  CHECKSUM_PATH="${TARBALL_PATH}.sha256"
elif [[ "${CHECKSUM_PATH}" != /* ]]; then
  CHECKSUM_PATH="${PWD}/${CHECKSUM_PATH}"
fi

log_step "1/7" "Checking prerequisites"
require_command docker
compose version >/dev/null 2>&1 || fail "docker compose plugin is required."
[[ -f "${COMPOSE_FILE}" ]] || fail "Missing compose file: ${COMPOSE_FILE}"
[[ -f "${ENV_FILE}" ]] || fail "Missing environment file: ${ENV_FILE}"
[[ -f "${TARBALL_PATH}" ]] || fail "Missing image archive: ${TARBALL_PATH}"
log_info "Compose file: ${COMPOSE_FILE}"
log_info "Environment file: ${ENV_FILE}"
log_info "Image archive: ${TARBALL_PATH}"

if (( VERIFY_CHECKSUM == 1 )); then
  log_step "2/7" "Verifying checksum"
  [[ -f "${CHECKSUM_PATH}" ]] || fail "Missing checksum file: ${CHECKSUM_PATH} (or use --no-checksum)"
  verify_checksum "${CHECKSUM_PATH}" "${TARBALL_PATH}"
else
  log_step "2/7" "Skipping checksum verification"
  log_info "Checksum verification disabled by --no-checksum"
fi

log_step "3/7" "Loading Docker image"
docker load < "${TARBALL_PATH}"

log_step "4/7" "Starting the on-prem stack"
compose up -d

log_step "5/7" "Waiting for MongoDB health"
wait_for_health "mongodb" 120

log_step "6/7" "Waiting for aodit health"
wait_for_health "aodit" 180

if (( SEED_ADMIN == 1 )); then
  log_step "7/7" "Seeding initial admin user"
  seed_admin
else
  log_step "7/7" "Skipping admin seed"
  log_info "Admin seed disabled by --skip-seed"
fi

printf '\nInstall complete.\n'
printf 'App URL: http://server-ip:16006\n'
printf 'Useful commands:\n'
printf '  docker compose -f %s ps\n' "${COMPOSE_FILE}"
printf '  docker compose -f %s logs -f aodit\n' "${COMPOSE_FILE}"
