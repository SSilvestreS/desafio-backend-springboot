# INSTRUÇÕES RÁPIDAS

## Execução Rápida

### Windows
1. Execute `start.bat` para iniciar o sistema
2. Execute `stop.bat` para parar o sistema
3. Execute `status.bat` para verificar status
4. Execute `clean.bat` para limpeza completa

### Linux/Mac
1. Execute `./start.sh` para iniciar o sistema
2. Execute `./stop.sh` para parar o sistema
3. Execute `./status.sh` para verificar status
4. Execute `./clean.sh` para limpeza completa

## Acesso às Aplicações

- **Frontend**: http://localhost:4200
- **Backend API**: http://localhost:8080
- **Swagger UI**: http://localhost:8080/swagger-ui/index.html

## Credenciais de Teste

- **Admin**: admin@incidents.com / password
- **User**: user@incidents.com / password

## Comandos Úteis

```bash
# Ver logs do backend
docker compose logs backend

# Ver logs do frontend
docker compose logs frontend

# Ver logs do banco
docker compose logs postgres

# Reiniciar apenas o backend
docker compose restart backend

# Ver status dos containers
docker compose ps
```

## Troubleshooting

1. **Porta em uso**: Altere a porta no docker-compose.yml
2. **Erro de conexão**: Verifique se o Docker está rodando
3. **Frontend não carrega**: Aguarde mais tempo para inicialização
4. **Erro de autenticação**: Use as credenciais padrão
