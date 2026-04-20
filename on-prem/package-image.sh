#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"

IMAGE_NAME="${IMAGE_NAME:-aodit}"
IMAGE_TAG="${IMAGE_TAG:-latest}"
OUTPUT_TARBALL="${OUTPUT_TARBALL:-${IMAGE_NAME}-${IMAGE_TAG}.tar.gz}"

if [[ "${OUTPUT_TARBALL}" != /* ]]; then
  OUTPUT_TARBALL="${REPO_ROOT}/${OUTPUT_TARBALL}"
fi

mkdir -p "$(dirname "${OUTPUT_TARBALL}")"

echo "Building Docker image ${IMAGE_NAME}:${IMAGE_TAG}..."
docker build -f "${REPO_ROOT}/on-prem/Dockerfile.onprem" -t "${IMAGE_NAME}:${IMAGE_TAG}" "${REPO_ROOT}"

echo "Exporting image to ${OUTPUT_TARBALL}..."
docker save "${IMAGE_NAME}:${IMAGE_TAG}" | gzip > "${OUTPUT_TARBALL}"

CHECKSUM_FILE="${OUTPUT_TARBALL}.sha256"
echo "Generating SHA-256 checksum ${CHECKSUM_FILE}..."
if command -v shasum >/dev/null 2>&1; then
  shasum -a 256 "${OUTPUT_TARBALL}" | awk '{print $1}' > "${CHECKSUM_FILE}"
elif command -v sha256sum >/dev/null 2>&1; then
  sha256sum "${OUTPUT_TARBALL}" | awk '{print $1}' > "${CHECKSUM_FILE}"
else
  echo "ERROR: No SHA-256 tool found. Install shasum or sha256sum." >&2
  exit 1
fi

echo "Done. Image archive created at ${OUTPUT_TARBALL}"
