package com.incidents.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "comment")
public class Comment {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @NotNull(message = "ID do incidente é obrigatório")
    @Column(name = "incident_id", nullable = false)
    private UUID incidentId;
    
    @NotBlank(message = "Autor é obrigatório")
    @Size(max = 120, message = "Autor deve ter no máximo 120 caracteres")
    @Column(name = "autor", nullable = false, length = 120)
    private String autor;
    
    @NotBlank(message = "Mensagem é obrigatória")
    @Size(min = 1, max = 2000, message = "Mensagem deve ter entre 1 e 2000 caracteres")
    @Column(name = "mensagem", nullable = false, columnDefinition = "TEXT")
    private String mensagem;
    
    @NotNull
    @Column(name = "data_criacao", nullable = false)
    private LocalDateTime dataCriacao;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "incident_id", insertable = false, updatable = false)
    private Incident incident;
    
    // Construtores
    public Comment() {
        this.dataCriacao = LocalDateTime.now();
    }
    
    // Getters e Setters
    public UUID getId() {
        return id;
    }
    
    public void setId(UUID id) {
        this.id = id;
    }
    
    public UUID getIncidentId() {
        return incidentId;
    }
    
    public void setIncidentId(UUID incidentId) {
        this.incidentId = incidentId;
    }
    
    public String getAutor() {
        return autor;
    }
    
    public void setAutor(String autor) {
        this.autor = autor;
    }
    
    public String getMensagem() {
        return mensagem;
    }
    
    public void setMensagem(String mensagem) {
        this.mensagem = mensagem;
    }
    
    public LocalDateTime getDataCriacao() {
        return dataCriacao;
    }
    
    public void setDataCriacao(LocalDateTime dataCriacao) {
        this.dataCriacao = dataCriacao;
    }
    
    public Incident getIncident() {
        return incident;
    }
    
    public void setIncident(Incident incident) {
        this.incident = incident;
    }
}
