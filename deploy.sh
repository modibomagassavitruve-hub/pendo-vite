#!/bin/bash

echo "════════════════════════════════════════════════════════════════"
echo "🚀 PENDO Vite - Script de déploiement"
echo "════════════════════════════════════════════════════════════════"
echo ""

# Couleurs
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Vérifier qu'on est dans le bon dossier
if [ ! -f "vite.config.js" ]; then
  echo -e "${RED}❌ Erreur: vite.config.js non trouvé${NC}"
  echo "Exécutez ce script depuis /Users/magassamodibo/PENDO/pendo-vite"
  exit 1
fi

echo -e "${GREEN}✅ Dossier correct détecté${NC}"
echo ""

# Tester le build
echo "📦 Test du build..."
npm run build > /dev/null 2>&1

if [ $? -eq 0 ]; then
  echo -e "${GREEN}✅ Build réussi${NC}"
else
  echo -e "${RED}❌ Build échoué${NC}"
  exit 1
fi
echo ""

# Vérifier si Git remote existe
echo "🔍 Vérification du remote Git..."
if git remote get-url origin > /dev/null 2>&1; then
  echo -e "${GREEN}✅ Remote Git configuré${NC}"
  remote_url=$(git remote get-url origin)
  echo "   URL: $remote_url"
else
  echo -e "${YELLOW}⚠️  Remote Git non configuré${NC}"
  echo ""
  echo "Pour créer le repo GitHub:"
  echo "1. Aller sur https://github.com/new"
  echo "2. Nom: pendo-vite"
  echo "3. Créer le repo"
  echo "4. Exécuter:"
  echo "   git remote add origin git@github.com:modibomagassavitruve-hub/pendo-vite.git"
  echo "   git push -u origin main"
fi
echo ""

# Vérifier le backend
echo "🔌 Test de connexion au backend..."
status_code=$(curl -s -o /dev/null -w "%{http_code}" https://pendo-backend.onrender.com/api/status)

if [ "$status_code" = "200" ]; then
  echo -e "${GREEN}✅ Backend accessible (HTTP $status_code)${NC}"
else
  echo -e "${YELLOW}⚠️  Backend répond HTTP $status_code${NC}"
fi
echo ""

# Instructions Netlify
echo "════════════════════════════════════════════════════════════════"
echo "🌐 Déployer sur Netlify:"
echo "════════════════════════════════════════════════════════════════"
echo ""
echo "1. Aller sur https://app.netlify.com"
echo "2. Sign up / Login avec GitHub"
echo "3. New site from Git → GitHub → pendo-vite"
echo "4. Deploy site (configuration auto-détectée)"
echo ""
echo "Variables d'environnement (optionnel):"
echo "  VITE_APP_NAME=PENDO"
echo "  VITE_APP_VERSION=1.0.0"
echo "  VITE_APP_ENV=production"
echo ""
echo "════════════════════════════════════════════════════════════════"
echo ""
echo -e "${GREEN}✅ Tout est prêt pour le déploiement !${NC}"
echo ""
