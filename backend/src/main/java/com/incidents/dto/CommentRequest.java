package com.incidents.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.UUID;

public class CommentRequest {
    
    @NotNull(message = "ID do incidente é obrigatório")
    private UUID incidentId;
    
    @NotBlank(message = "Autor é obrigatório")
    @Size(max = 120, message = "Autor deve ter no máximo 120 caracteres")
    private String autor;
    
    @NotBlank(message = "Mensagem é obrigatória")
    @Size(min = 1, max = 2000, message = "Mensagem deve ter entre 1 e 2000 caracteres")
    private String mensagem;
    
    // Getters e Setters
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
}
