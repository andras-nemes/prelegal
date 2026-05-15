#!/usr/bin/env bash
set -euo pipefail

docker build -t prelegal .
docker run -d --name prelegal -p 8000:8000 --env-file .env prelegal
echo "PreLegal is running at http://localhost:8000"
