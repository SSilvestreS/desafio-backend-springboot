# Sistema de Gestão de Incidentes

Aplicação fullstack para gestão de incidentes desenvolvida com Spring Boot 3+ e Angular 16+.

## Descrição

Sistema completo de gestão de incidentes com funcionalidades de CRUD, autenticação JWT, cache com Caffeine, documentação Swagger e deploy containerizado.

## Tecnologias Utilizadas

### Backend
- Java 17+
- Spring Boot 3.2.0
- Spring Security com JWT
- Spring Data JPA
- PostgreSQL 15
- Flyway (migrations)
- Caffeine (cache)
- Swagger/OpenAPI

### Frontend
- Angular 16+
- TypeScript
- Reactive Forms
- Angular Router
- HttpClient
- RxJS

### Infraestrutura
- Docker
- Docker Compose
- Nginx

## Pré-requisitos

- Docker Desktop instalado e rodando
- Git
- Maven (opcional, para desenvolvimento local)
- Node.js (opcional, para desenvolvimento local)

## Estrutura do Projeto

```
desafio-fullstack-springboot/
├── backend/                    # Aplicação Spring Boot
│   ├── src/main/java/
│   │   └── com/incidents/
│   │       ├── controller/     # Controllers REST
│   │       ├── model/         # Entidades JPA
│   │       ├── repository/    # Repositórios JPA
│   │       ├── security/      # Configurações de segurança
│   │       ├── util/          # Utilitários (DRY)
│   │       └── dto/           # Data Transfer Objects
│   ├── src/main/resources/
│   │   ├── application.yml    # Configurações
│   │   └── db/migration/      # Migrations Flyway
│   └── pom.xml
├── frontend/                   # Aplicação Angular
│   ├── src/app/
│   │   ├── components/        # Componentes Angular
│   │   ├── services/          # Serviços de API
│   │   ├── models/           # Interfaces TypeScript
│   │   ├── guards/           # Guards de rota
│   │   ├── interceptors/     # Interceptors HTTP
│   │   └── utils/            # Utilitários (DRY)
│   ├── src/environments/     # Configurações de ambiente
│   └── package.json
├── docker-compose.yml         # Orquestração Docker
├── .gitignore
└── README.md
```

## Instalação e Execução

### Método 1: Docker Compose (Recomendado)

1. Clone o repositório:
```bash
git clone https://github.com/SSilvestreS/desafio-backend-springboot.git
cd desafio-backend-springboot
```

2. Execute o script de inicialização:
```bash
# Windows
.\start.bat

# Linux/Mac
./start.sh
```

3. Aguarde a inicialização completa (aproximadamente 2-3 minutos)

4. Acesse as aplicações:
- Frontend: http://localhost:4200
- Backend API: http://localhost:8080
- Swagger UI: http://localhost:8080/swagger-ui/index.html

### Método 2: Execução Manual

1. Clone o repositório:
```bash
git clone https://github.com/SSilvestreS/desafio-backend-springboot.git
cd desafio-backend-springboot
```

2. Inicie o banco de dados:
```bash
docker run -d --name postgres-incidents \
  -e POSTGRES_DB=incidents_db \
  -e POSTGRES_USER=incidents_user \
  -e POSTGRES_PASSWORD=incidents_pass \
  -p 5432:5432 \
  postgres:15
```

3. Compile e execute o backend:
```bash
cd backend
mvn clean install
mvn spring-boot:run
```

4. Em outro terminal, compile e execute o frontend:
```bash
cd frontend
npm install
npm start
```

## Configuração

### Variáveis de Ambiente

O projeto utiliza as seguintes variáveis de ambiente (configuradas no docker-compose.yml):

- `POSTGRES_DB`: incidents_db
- `POSTGRES_USER`: incidents_user
- `POSTGRES_PASSWORD`: incidents_pass
- `JWT_SECRET`: Chave secreta para JWT
- `JWT_EXPIRATION`: 24h

### Portas Utilizadas

- **8080**: Backend Spring Boot
- **4200**: Frontend Angular
- **5432**: PostgreSQL

## Funcionalidades

### Autenticação
- Login com JWT
- Usuários padrão:
  - admin@incidents.com / password
  - user@incidents.com / password

### Gestão de Incidentes
- Criar, editar, visualizar e excluir incidentes
- Filtros por status, prioridade e busca textual
- Paginação
- Estatísticas em tempo real

### Comentários
- Adicionar comentários aos incidentes
- Visualizar histórico de comentários
- Exclusão de comentários

### Cache
- Cache de leitura com Caffeine
- Invalidação automática em operações de escrita
- Configuração otimizada para performance

## API Endpoints

### Autenticação
- `POST /auth/login` - Login e geração de token JWT

### Incidentes
- `GET /incidents` - Listar incidentes com filtros e paginação
- `POST /incidents` - Criar novo incidente
- `GET /incidents/{id}` - Obter incidente específico
- `PUT /incidents/{id}` - Atualizar incidente
- `DELETE /incidents/{id}` - Excluir incidente
- `PATCH /incidents/{id}/status` - Alterar status do incidente

### Comentários
- `GET /comments/incident/{incidentId}` - Listar comentários do incidente
- `POST /comments` - Criar novo comentário
- `DELETE /comments/{id}` - Excluir comentário

### Estatísticas
- `GET /stats/incidents` - Estatísticas de incidentes

## Documentação da API

A documentação completa da API está disponível através do Swagger UI:
- URL: http://localhost:8080/swagger-ui/index.html
- Especificação OpenAPI: http://localhost:8080/v3/api-docs

## Desenvolvimento

### Estrutura de Desenvolvimento

O projeto segue os princípios SOLID e implementa o critério DRY (Don't Repeat Yourself):

#### Backend - Utilitários (DRY)
- `IncidentUtils`: Normalização de tags, auditoria de atualização, filtros
- Reutilização em todos os controllers

#### Frontend - Utilitários (DRY)
- `FormUtils`: Normalização de formulários, construção de query params
- `ApiService`: Cliente genérico para todas as APIs
- Reutilização em todos os componentes

### Cache com Caffeine

O sistema implementa cache de leitura com invalidação automática:

- **Configuração**: `application.yml`
- **Anotações**: `@Cacheable` em GETs, `@CacheEvict` em operações de escrita
- **Cache Names**: incidents, incidentById, stats, commentsByIncident

### Migrations

O banco de dados é gerenciado através do Flyway:

1. `V1__Create_incident_table.sql` - Tabela de incidentes
2. `V2__Create_comment_table.sql` - Tabela de comentários
3. `V3__Create_incident_tags_table.sql` - Tabela de tags

## Scripts de Automação

### Windows (start.bat)
```batch
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
```

### Linux/Mac (start.sh)
```bash
#!/bin/bash

echo "Iniciando Sistema de Gestao de Incidentes..."
echo

echo "Parando containers existentes..."
docker compose down

echo "Removendo imagens antigas..."
docker image prune -a -f

echo "Compilando e iniciando containers..."
docker compose up --build -d

echo "Aguardando inicializacao..."
sleep 30

echo "Verificando status dos containers..."
docker compose ps

echo
echo "Sistema iniciado com sucesso!"
echo "Frontend: http://localhost:4200"
echo "Backend: http://localhost:8080"
echo "Swagger: http://localhost:8080/swagger-ui/index.html"
echo
```

### Script de Parada (stop.bat/stop.sh)
```bash
#!/bin/bash
echo "Parando Sistema de Gestao de Incidentes..."
docker compose down
echo "Sistema parado com sucesso!"
```

## Troubleshooting

### Problemas Comuns

1. **Porta 8080 em uso**
   - Verifique se não há outras aplicações usando a porta
   - Altere a porta no docker-compose.yml se necessário

2. **Erro de conexão com banco**
   - Verifique se o PostgreSQL está rodando
   - Confirme as credenciais no application.yml

3. **Frontend não carrega**
   - Verifique se o container frontend está rodando
   - Confirme se a porta 4200 está livre

4. **Erro de autenticação**
   - Use as credenciais padrão: admin@incidents.com / password
   - Verifique se o token JWT não expirou

### Logs

Para verificar logs dos containers:
```bash
# Todos os serviços
docker compose logs

# Backend específico
docker compose logs backend

# Frontend específico
docker compose logs frontend
```

## Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.
