#!/usr/bin/env bash
set -euo pipefail

PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$PROJECT_DIR"

echo "🚀 Daffy Dark Menu başlatılıyor..."

# Dependencies yoksa kur
if [ ! -d "node_modules" ]; then
  echo "📦 node_modules bulunamadı, npm install çalıştırılıyor..."
  npm install
fi

# Portlar doluysa bilgi ver
if lsof -ti :4000 >/dev/null 2>&1; then
  echo "⚠️ 4000 portu kullanımda. API bu portu kullanıyor."
fi

if lsof -ti :5173 >/dev/null 2>&1; then
  echo "⚠️ 5173 portu kullanımda. Frontend bu portu kullanıyor."
fi

# API + Frontend birlikte
npm run dev:full
