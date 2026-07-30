#!/usr/bin/env bash
#
# VozEmoção — instalar no iPhone com o mínimo de esforço.
# Rode ISTO no SEU Mac (não funciona em Linux/Windows):
#
#     ./ios/run.sh
#
# Ele instala o que falta, gera o projeto e abre o Xcode pronto pra você
# clicar em ▶. Os únicos passos manuais (exigidos pela Apple) são: escolher
# seu Apple ID em Signing e, no iPhone, confiar no certificado + autorizar
# microfone.

set -euo pipefail

BOLD="\033[1m"; GREEN="\033[32m"; YELLOW="\033[33m"; RED="\033[31m"; RESET="\033[0m"
say()  { echo -e "${BOLD}$*${RESET}"; }
ok()   { echo -e "${GREEN}✓ $*${RESET}"; }
warn() { echo -e "${YELLOW}! $*${RESET}"; }
fail() { echo -e "${RED}✗ $*${RESET}"; exit 1; }

# 1. Precisa ser macOS -------------------------------------------------------
if [[ "$(uname)" != "Darwin" ]]; then
  fail "Isto só roda no macOS (o Xcode é obrigatório para instalar no iPhone)."
fi
ok "macOS detectado"

# 2. Xcode instalado? --------------------------------------------------------
if ! xcode-select -p >/dev/null 2>&1; then
  fail "Xcode não encontrado. Instale o Xcode pela App Store e rode de novo."
fi
ok "Xcode encontrado"

# 3. Homebrew + XcodeGen ------------------------------------------------------
if ! command -v brew >/dev/null 2>&1; then
  warn "Homebrew não encontrado. Instalando (pode pedir sua senha)…"
  /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
  # coloca o brew no PATH para esta sessão (Apple Silicon e Intel)
  eval "$(/opt/homebrew/bin/brew shellenv 2>/dev/null || /usr/local/bin/brew shellenv)"
fi
ok "Homebrew disponível"

if ! command -v xcodegen >/dev/null 2>&1; then
  warn "Instalando o XcodeGen…"
  brew install xcodegen
fi
ok "XcodeGen disponível"

# 4. Gerar o projeto ---------------------------------------------------------
cd "$(dirname "$0")"   # entra na pasta ios/
say "Gerando o projeto Xcode…"
xcodegen generate
ok "Projeto gerado: ios/VozEmocao.xcodeproj"

# 5. Abrir o Xcode -----------------------------------------------------------
open VozEmocao.xcodeproj
ok "Xcode aberto"

cat <<'EOF'

──────────────────────────────────────────────────────────────
 Agora faltam só 3 cliques seus dentro do Xcode:
──────────────────────────────────────────────────────────────
 1) Selecione o alvo "VozEmocao" → aba "Signing & Capabilities"
    → em "Team", escolha o SEU Apple ID.
 2) Conecte o iPhone por cabo e escolha ele no topo do Xcode.
 3) Clique em ▶ (Run).

 No iPhone (primeira vez):
  • Ajustes → Geral → VPN e Gerenciamento → confie no seu Apple ID.
  • Ao abrir o app, autorize Microfone, Fala e Notificações.

 Testar: toque "Ouvir", bloqueie a tela e diga "proposta" ou
 "desconto". Deve chegar a notificação com "🔴 Gravar agora".
──────────────────────────────────────────────────────────────
EOF
