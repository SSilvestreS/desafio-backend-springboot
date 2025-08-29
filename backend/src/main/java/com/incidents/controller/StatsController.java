package com.incidents.controller;

import com.incidents.model.enums.Prioridade;
import com.incidents.model.enums.Status;
import com.incidents.repository.IncidentRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/stats")
@Tag(name = "Estatísticas", description = "Endpoints para estatísticas dos incidentes")
public class StatsController {
    
    private final IncidentRepository incidentRepository;
    
    public StatsController(IncidentRepository incidentRepository) {
        this.incidentRepository = incidentRepository;
    }
    
    @GetMapping("/incidents")
    @Operation(summary = "Estatísticas dos incidentes", description = "Retorna contadores por status e prioridade")
    public ResponseEntity<Map<String, Object>> getIncidentStats() {
        Map<String, Object> stats = new HashMap<>();
        
        // Contagem total
        stats.put("total", incidentRepository.countTotal());
        
        // Contagem por status
        stats.put("porStatus", Map.of(
            "ABERTA", incidentRepository.countByStatus(Status.ABERTA),
            "EM_ANDAMENTO", incidentRepository.countByStatus(Status.EM_ANDAMENTO),
            "RESOLVIDA", incidentRepository.countByStatus(Status.RESOLVIDA),
            "CANCELADA", incidentRepository.countByStatus(Status.CANCELADA)
        ));
        
        // Contagem por prioridade
        stats.put("porPrioridade", Map.of(
            "BAIXA", incidentRepository.countByPrioridade(Prioridade.BAIXA),
            "MEDIA", incidentRepository.countByPrioridade(Prioridade.MEDIA),
            "ALTA", incidentRepository.countByPrioridade(Prioridade.ALTA)
        ));
        
        return ResponseEntity.ok(stats);
    }
}
