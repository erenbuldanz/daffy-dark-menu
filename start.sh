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

api_busy=false
web_busy=false

if lsof -ti :4000 >/dev/null 2>&1; then
  api_busy=true
  echo "⚠️ 4000 portu kullanımda (API zaten çalışıyor olabilir)."
fi

if lsof -ti :5173 >/dev/null 2>&1; then
  web_busy=true
  echo "⚠️ 5173 portu kullanımda (Frontend zaten çalışıyor olabilir)."
fi

# İkisi de açıksa yeniden başlatma denemeyip direkt bilgi ver
if [ "$api_busy" = true ] && [ "$web_busy" = true ]; then
  echo "✅ Servisler zaten çalışıyor."
  echo "🌐 Menü:  http://localhost:5173/"
  echo "🔐 Admin: http://localhost:5173/#/admin/login"
  echo "🧩 API:   http://localhost:4000/api/menu"
  echo "(Yeniden başlatmak için önce ./stop.sh çalıştırın.)"
  exit 0
fi

# API + Frontend birlikte
npm run dev:full
