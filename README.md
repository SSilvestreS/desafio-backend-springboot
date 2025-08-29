# Sistema de Gestão de Ocorrências

Sistema fullstack para gestão de incidentes e ocorrências com backend Spring Boot e frontend Angular.

## Tecnologias Utilizadas

### Backend
- Java 17
- Spring Boot 3.2.0
- Spring Security com JWT
- Spring Data JPA
- PostgreSQL
- Flyway (Migrations)
- Swagger/OpenAPI

### Frontend
- Angular 16+
- Angular Material
- RxJS

## Estrutura do Projeto

```
├── backend/                 # Backend Spring Boot
│   ├── src/main/java/
│   │   └── com/incidents/
│   │       ├── config/      # Configurações
│   │       ├── controller/  # Controllers REST
│   │       ├── dto/         # Data Transfer Objects
│   │       ├── model/       # Entidades JPA
│   │       ├── repository/  # Repositórios
│   │       └── security/    # Configurações de segurança
│   ├── src/main/resources/
│   │   ├── db/migration/    # Migrations Flyway
│   │   └── application.yml  # Configurações
│   └── Dockerfile
├── frontend/                # Frontend Angular
└── docker-compose.yml       # Orquestração dos containers
```

## Funcionalidades

### Incidentes
- CRUD completo de incidentes
- Filtros por status, prioridade e busca textual
- Paginação e ordenação
- Gestão de tags
- Controle de status (ABERTA, EM_ANDAMENTO, RESOLVIDA, CANCELADA)
- Controle de prioridade (BAIXA, MEDIA, ALTA)

### Comentários
- Criação de comentários em incidentes
- Listagem paginada por incidente
- Exclusão de comentários

### Autenticação
- Autenticação JWT
- Usuários seed para demonstração
- Proteção de endpoints

### Estatísticas
- Contadores por status
- Contadores por prioridade
- Total de incidentes

## Usuários de Demonstração

| Email | Senha | Perfil |
|-------|-------|---------|
| admin@incidents.com | password | ROLE_ADMIN |
| user@incidents.com | password | ROLE_USER |

## Execução Local

### Pré-requisitos
- Docker e Docker Compose
- Java 17+ (para desenvolvimento local)
- Maven 3.6+

### Com Docker Compose

1. Clone o repositório:
```bash
git clone <url-do-repositorio>
cd desafio-fullstack-springboot
```

2. Execute a aplicação:
```bash
docker-compose up --build
```

3. Acesse:
- Backend: http://localhost:8080
- Swagger UI: http://localhost:8080/swagger-ui/index.html
- API Docs: http://localhost:8080/v3/api-docs

### Desenvolvimento Local

1. Configure o banco PostgreSQL
2. Execute as migrations:
```bash
cd backend
mvn flyway:migrate
```

3. Execute a aplicação:
```bash
mvn spring-boot:run
```

## Endpoints da API

### Autenticação
- `POST /auth/login` - Login e obtenção do token JWT

### Incidentes
- `GET /incidents` - Listar incidentes (com filtros e paginação)
- `GET /incidents/{id}` - Buscar incidente por ID
- `POST /incidents` - Criar incidente
- `PUT /incidents/{id}` - Atualizar incidente
- `DELETE /incidents/{id}` - Excluir incidente
- `PATCH /incidents/{id}/status` - Atualizar status

### Comentários
- `GET /comments/incident/{incidentId}` - Listar comentários por incidente
- `POST /comments` - Criar comentário
- `DELETE /comments/{id}` - Excluir comentário

### Estatísticas
- `GET /stats/incidents` - Estatísticas dos incidentes

## Exemplos de Uso

### Login
```bash
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@incidents.com","password":"password"}'
```

### Criar Incidente
```bash
curl -X POST http://localhost:8080/incidents \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <seu-token>" \
  -d '{
    "titulo":"Erro 500 na API",
    "descricao":"Falha ao processar requisição",
    "prioridade":"ALTA",
    "status":"ABERTA",
    "responsavelEmail":"dev@exemplo.com",
    "tags":["api","bug","erro500"]
  }'
```

### Listar Incidentes
```bash
curl -H "Authorization: Bearer <seu-token>" \
  "http://localhost:8080/incidents?page=0&size=10&status=ABERTA&sort=dataAbertura,desc"
```

## Modelo de Dados

### Incident
- `id` (UUID) - Identificador único
- `titulo` (String, 5-120 chars) - Título do incidente
- `descricao` (String, 0-5000 chars) - Descrição detalhada
- `prioridade` (Enum: BAIXA, MEDIA, ALTA)
- `status` (Enum: ABERTA, EM_ANDAMENTO, RESOLVIDA, CANCELADA)
- `responsavelEmail` (String) - Email do responsável
- `tags` (List<String>) - Tags para categorização
- `dataAbertura` (DateTime) - Data de abertura
- `dataAtualizacao` (DateTime) - Data da última atualização

### Comment
- `id` (UUID) - Identificador único
- `incidentId` (UUID) - Referência ao incidente
- `autor` (String, 1-120 chars) - Nome do autor
- `mensagem` (String, 1-2000 chars) - Conteúdo do comentário
- `dataCriacao` (DateTime) - Data de criação

## Migrations

O projeto utiliza Flyway para gerenciar o esquema do banco:

1. `V1__Create_incident_table.sql` - Criação da tabela de incidentes
2. `V2__Create_comment_table.sql` - Criação da tabela de comentários
3. `V3__Create_incident_tags_table.sql` - Criação da tabela de tags

## Segurança

- Autenticação JWT obrigatória para todos os endpoints
- Swagger UI acessível sem autenticação
- Senhas criptografadas com BCrypt
- Tokens com expiração configurável (24h por padrão)

## Desenvolvimento

### Estrutura de Pacotes
- `config` - Configurações do Spring
- `controller` - Controllers REST
- `dto` - Objetos de transferência de dados
- `model` - Entidades JPA
- `repository` - Interfaces de acesso a dados
- `security` - Configurações de segurança e JWT

### Validações
- Validações Bean Validation nas entidades e DTOs
- Mensagens de erro personalizadas
- Validação de email e tamanhos de campos

### Tratamento de Erros
- Respostas HTTP padronizadas
- Códigos de status apropriados (200, 201, 400, 401, 404, 500)
- Mensagens de erro descritivas
