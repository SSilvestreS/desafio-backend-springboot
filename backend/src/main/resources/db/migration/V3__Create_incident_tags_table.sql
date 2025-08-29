CREATE TABLE incident_tags (
    incident_id UUID NOT NULL REFERENCES incident(id) ON DELETE CASCADE,
    tag VARCHAR(100) NOT NULL,
    PRIMARY KEY (incident_id, tag)
);

-- Índice para busca por tags
CREATE INDEX idx_incident_tags_tag ON incident_tags(tag);
