#!/bin/bash
echo "Limpando Sistema de Gestao de Incidentes..."
echo

echo "Parando containers..."
docker compose down

echo "Removendo containers..."
docker container prune -f

echo "Removendo imagens..."
docker image prune -a -f

echo "Removendo volumes..."
docker volume prune -f

echo "Removendo redes..."
docker network prune -f

echo "Limpeza concluida!"
