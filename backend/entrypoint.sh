#!/bin/sh

# Verifique a configuração do banco de dados
if [ -z "$DATABASE_URL" ]; then
  echo "Erro: DATABASE_URL não configurada"
  exit 1
fi

# Rode as migrations
npm run deploy

# Inicie a aplicação
npm start