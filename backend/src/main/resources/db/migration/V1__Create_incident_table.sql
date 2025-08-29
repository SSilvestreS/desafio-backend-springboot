CREATE TABLE incident (
    id UUID PRIMARY KEY,
    titulo VARCHAR(120) NOT NULL,
    descricao TEXT,
    prioridade VARCHAR(10) NOT NULL CHECK (prioridade IN ('BAIXA','MEDIA','ALTA')),
    status VARCHAR(15) NOT NULL CHECK (status IN ('ABERTA','EM_ANDAMENTO','RESOLVIDA','CANCELADA')),
    responsavel_email VARCHAR(255) NOT NULL,
    data_abertura TIMESTAMP NOT NULL,
    data_atualizacao TIMESTAMP NOT NULL
);

-- Índices sugeridos
CREATE INDEX idx_incident_status ON incident(status);
CREATE INDEX idx_incident_prioridade ON incident(prioridade);
CREATE INDEX idx_incident_titulo ON incident(titulo);
CREATE INDEX idx_incident_data_abertura ON incident(data_abertura);
