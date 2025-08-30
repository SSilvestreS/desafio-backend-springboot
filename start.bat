@echo off
echo Iniciando Sistema de Gestao de Incidentes...
echo.

echo Parando containers existentes...
docker compose down

echo Removendo imagens antigas...
docker image prune -a -f

echo Compilando e iniciando containers...
docker compose up --build -d

echo Aguardando inicializacao...
timeout /t 30 /nobreak

echo Verificando status dos containers...
docker compose ps

echo.
echo Sistema iniciado com sucesso!
echo Frontend: http://localhost:4200
echo Backend: http://localhost:8080
echo Swagger: http://localhost:8080/swagger-ui/index.html
echo.
pause
