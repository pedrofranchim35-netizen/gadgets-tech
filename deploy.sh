#!/bin/bash
# Script de Publicação Automática no GitHub Pages
# Projeto: Gadgets Tech • 4º Bimestre (Prof. Danilo Bezerra)
# Grupo: Alexandre, Pedro Franchim, Marcus e Julio

set -e

if [ -z "$1" ]; then
  echo "=========================================================="
  echo "❌ Erro: Informe seu usuário do GitHub."
  echo "Uso: ./deploy.sh [seu_usuario_do_github] [nome_do_repositorio (opcional)]"
  echo "Exemplo: ./deploy.sh pedrofranchim gadgets-tech"
  echo "=========================================================="
  exit 1
fi

GITHUB_USER="$1"
REPO_NAME="${2:-gadgets-tech}"

echo "=========================================================="
echo "🚀 Publicando Gadgets Tech no GitHub..."
echo "👤 Usuário: $GITHUB_USER"
echo "📦 Repositório: $REPO_NAME"
echo "=========================================================="

# 1. Configurar branch e remoto
git branch -M main

REMOTE_URL="https://github.com/$GITHUB_USER/$REPO_NAME.git"
if git remote | grep -q "origin"; then
  git remote set-url origin "$REMOTE_URL"
else
  git remote add origin "$REMOTE_URL"
fi

# 2. Atualizar ENTREGA_PARCIAL.txt com os links finais
sed -i '' "s|https://\[seu_usuario\]\.github\.io/\[repositorio\]/|https://$GITHUB_USER.github.io/$REPO_NAME/|g" ENTREGA_PARCIAL.txt 2>/dev/null || true
sed -i '' "s|https://github\.com/\[seu_usuario\]/\[repositorio\]|https://github.com/$GITHUB_USER/$REPO_NAME|g" ENTREGA_PARCIAL.txt 2>/dev/null || true

git add .
git commit -m "chore: atualiza links finais para entrega" 2>/dev/null || true

# 3. Instruções de envio
echo ""
echo "📤 Agora execute o comando abaixo para enviar ao GitHub:"
echo "----------------------------------------------------------"
echo "git push -u origin main"
echo "----------------------------------------------------------"
echo ""
echo "Após o push, ative o GitHub Pages no seu repositório:"
echo "1. Abra https://github.com/$GITHUB_USER/$REPO_NAME/settings/pages"
echo "2. Em 'Build and deployment' > 'Branch', selecione 'main' e pasta '/ (root)' e clique em Save."
echo "3. Seu site estará no ar em: https://$GITHUB_USER.github.io/$REPO_NAME/"
echo "4. O arquivo ENTREGA_PARCIAL.txt já foi atualizado com seus links!"
echo "=========================================================="
