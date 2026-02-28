#!/usr/bin/env bash
set -euo pipefail

LSOF_BIN="$(command -v lsof || true)"
if [ -z "$LSOF_BIN" ] && [ -x /usr/sbin/lsof ]; then
  LSOF_BIN="/usr/sbin/lsof"
fi

PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$PROJECT_DIR"

echo "🛑 Daffy Dark Menu servisleri durduruluyor..."

stopped_any=false

stop_port() {
  local port="$1"
  local pids
  pids="$("$LSOF_BIN" -ti :"$port" || true)"

  if [ -n "$pids" ]; then
    echo "• Port $port için süreçler sonlandırılıyor: $pids"
    kill $pids || true
    sleep 1

    # Hâlâ kapanmadıysa zorla kapat
    pids="$("$LSOF_BIN" -ti :"$port" || true)"
    if [ -n "$pids" ]; then
      echo "  ↳ Zorla kapatılıyor: $pids"
      kill -9 $pids || true
    fi

    stopped_any=true
  else
    echo "• Port $port zaten boş"
  fi
}

stop_port 5173
stop_port 4000

if [ "$stopped_any" = true ]; then
  echo "✅ Durdurma tamamlandı"
else
  echo "ℹ️ Çalışan servis bulunamadı"
fi
