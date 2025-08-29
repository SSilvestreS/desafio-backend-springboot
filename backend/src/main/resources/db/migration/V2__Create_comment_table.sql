CREATE TABLE comment (
    id UUID PRIMARY KEY,
    incident_id UUID NOT NULL REFERENCES incident(id) ON DELETE CASCADE,
    autor VARCHAR(120) NOT NULL,
    mensagem TEXT NOT NULL,
    data_criacao TIMESTAMP NOT NULL
);

-- Índices para comentários
CREATE INDEX idx_comment_incident_id ON comment(incident_id);
CREATE INDEX idx_comment_data_criacao ON comment(data_criacao);
