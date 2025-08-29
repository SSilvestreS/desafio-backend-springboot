package com.incidents.dto;

import com.incidents.model.enums.Prioridade;
import com.incidents.model.enums.Status;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.List;

public class IncidentRequest {
    
    @NotBlank(message = "Título é obrigatório")
    @Size(min = 5, max = 120, message = "Título deve ter entre 5 e 120 caracteres")
    private String titulo;
    
    @Size(max = 5000, message = "Descrição deve ter no máximo 5000 caracteres")
    private String descricao;
    
    @NotNull(message = "Prioridade é obrigatória")
    private Prioridade prioridade;
    
    @NotNull(message = "Status é obrigatório")
    private Status status;
    
    @NotBlank(message = "Email do responsável é obrigatório")
    @Email(message = "Email do responsável deve ser válido")
    private String responsavelEmail;
    
    private List<String> tags;
    
    // Getters e Setters
    public String getTitulo() {
        return titulo;
    }
    
    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }
    
    public String getDescricao() {
        return descricao;
    }
    
    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }
    
    public Prioridade getPrioridade() {
        return prioridade;
    }
    
    public void setPrioridade(Prioridade prioridade) {
        this.prioridade = prioridade;
    }
    
    public Status getStatus() {
        return status;
    }
    
    public void setStatus(Status status) {
        this.status = status;
    }
    
    public String getResponsavelEmail() {
        return responsavelEmail;
    }
    
    public void setResponsavelEmail(String responsavelEmail) {
        this.responsavelEmail = responsavelEmail;
    }
    
    public List<String> getTags() {
        return tags;
    }
    
    public void setTags(List<String> tags) {
        this.tags = tags;
    }
}
