#!/usr/bin/env bash
# Backup automático dos datasets da AE para o iCloud Drive.
# Roda sozinho via launchd (com.ae.backup-datasets) — nenhum passo manual.
# Aditivo por desenho: nunca apaga nada no destino.
set -euo pipefail
ORIGEM="$HOME/hprandini/research/datasets/"
DESTINO="$HOME/Library/Mobile Documents/com~apple~CloudDocs/AE-Backups/datasets/"
LOG="$HOME/hprandini/research/scripts/backup.log"
mkdir -p "$DESTINO"
rsync -a "$ORIGEM" "$DESTINO"
echo "$(date '+%Y-%m-%d %H:%M') ok — $(ls "$DESTINO" | wc -l | tr -d ' ') arquivos no backup" >> "$LOG"
