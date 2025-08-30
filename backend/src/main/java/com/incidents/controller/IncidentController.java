package com.incidents.controller;

import com.incidents.dto.IncidentRequest;
import com.incidents.model.Incident;
import com.incidents.model.enums.Prioridade;
import com.incidents.model.enums.Status;
import com.incidents.repository.IncidentRepository;
import com.incidents.util.IncidentUtils;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.UUID;

@RestController
@RequestMapping("/incidents")
@Tag(name = "Incidentes", description = "Endpoints para gestão de incidentes")
public class IncidentController {
    
    private final IncidentRepository incidentRepository;
    
    public IncidentController(IncidentRepository incidentRepository) {
        this.incidentRepository = incidentRepository;
    }
    
    @GetMapping
    @Cacheable(value = "incidents", key = "#status + '_' + #prioridade + '_' + #q + '_' + #pageable.pageNumber + '_' + #pageable.pageSize + '_' + #pageable.sort")
    @Operation(summary = "Listar incidentes", description = "Retorna uma lista paginada de incidentes com filtros opcionais")
    public ResponseEntity<Page<Incident>> listIncidents(
            @Parameter(description = "Status do incidente") @RequestParam(required = false) Status status,
            @Parameter(description = "Prioridade do incidente") @RequestParam(required = false) Prioridade prioridade,
            @Parameter(description = "Termo de busca") @RequestParam(required = false) String q,
            @Parameter(description = "Parâmetros de paginação") Pageable pageable) {
        
        Page<Incident> incidents;
        String searchTerm = IncidentUtils.buildSearchFilter(q);
        
        if (status != null && prioridade != null) {
            incidents = incidentRepository.findByStatusAndPrioridade(status, prioridade, pageable);
        } else if (status != null) {
            incidents = incidentRepository.findByStatus(status, pageable);
        } else if (prioridade != null) {
            incidents = incidentRepository.findByPrioridade(prioridade, pageable);
        } else if (searchTerm != null) {
            incidents = incidentRepository.findByTituloOrDescricaoContaining(searchTerm, pageable);
        } else {
            incidents = incidentRepository.findAll(pageable);
        }
        
        return ResponseEntity.ok(incidents);
    }
    
    @GetMapping("/{id}")
    @Cacheable(value = "incidentById", key = "#id")
    @Operation(summary = "Buscar incidente por ID", description = "Retorna um incidente específico pelo ID")
    public ResponseEntity<Incident> getIncident(@PathVariable UUID id) {
        return incidentRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    @CacheEvict(value = {"incidents", "stats"}, allEntries = true)
    @Operation(summary = "Criar incidente", description = "Cria um novo incidente")
    public ResponseEntity<Incident> createIncident(@Valid @RequestBody IncidentRequest request) {
        Incident incident = new Incident();
        incident.setTitulo(request.getTitulo());
        incident.setDescricao(request.getDescricao());
        incident.setPrioridade(request.getPrioridade());
        incident.setStatus(request.getStatus());
        incident.setResponsavelEmail(request.getResponsavelEmail());
        incident.setTags(IncidentUtils.normalizeTags(request.getTags()));
        incident.setDataAbertura(LocalDateTime.now());
        incident.setDataAtualizacao(LocalDateTime.now());
        
        Incident savedIncident = incidentRepository.save(incident);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedIncident);
    }
    
    @PutMapping("/{id}")
    @CacheEvict(value = {"incidents", "incidentById", "stats"}, allEntries = true)
    @Operation(summary = "Atualizar incidente", description = "Atualiza um incidente existente")
    public ResponseEntity<Incident> updateIncident(@PathVariable UUID id, @Valid @RequestBody IncidentRequest request) {
        return incidentRepository.findById(id)
                .map(incident -> {
                    incident.setTitulo(request.getTitulo());
                    incident.setDescricao(request.getDescricao());
                    incident.setPrioridade(request.getPrioridade());
                    incident.setStatus(request.getStatus());
                    incident.setResponsavelEmail(request.getResponsavelEmail());
                    incident.setTags(IncidentUtils.normalizeTags(request.getTags()));
                    IncidentUtils.touchUpdate(incident);
                    
                    Incident updatedIncident = incidentRepository.save(incident);
                    return ResponseEntity.ok(updatedIncident);
                })
                .orElse(ResponseEntity.notFound().build());
    }
    
    @DeleteMapping("/{id}")
    @CacheEvict(value = {"incidents", "incidentById", "stats"}, allEntries = true)
    @Operation(summary = "Excluir incidente", description = "Exclui um incidente pelo ID")
    public ResponseEntity<Void> deleteIncident(@PathVariable UUID id) {
        if (incidentRepository.existsById(id)) {
            incidentRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
    
    @PatchMapping("/{id}/status")
    @CacheEvict(value = {"incidents", "incidentById", "stats"}, allEntries = true)
    @Operation(summary = "Atualizar status", description = "Atualiza apenas o status de um incidente")
    public ResponseEntity<Incident> updateStatus(@PathVariable UUID id, @RequestParam Status status) {
        return incidentRepository.findById(id)
                .map(incident -> {
                    incident.setStatus(status);
                    IncidentUtils.touchUpdate(incident);
                    
                    Incident updatedIncident = incidentRepository.save(incident);
                    return ResponseEntity.ok(updatedIncident);
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
