package com.incidents.util;

import com.incidents.model.Incident;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class IncidentUtils {
    
    /**
     * Normaliza tags: remove nulos/vazios, aplica trim, converte para minúsculas, 
     * remove duplicatas e ordena (critério DRY A)
     */
    public static List<String> normalizeTags(List<String> tags) {
        if (tags == null || tags.isEmpty()) {
            return List.of();
        }
        
        return tags.stream()
                .filter(tag -> tag != null && !tag.trim().isEmpty())
                .map(String::trim)
                .map(String::toLowerCase)
                .distinct()
                .sorted()
                .collect(Collectors.toList());
    }
    
    /**
     * Atualiza dataAtualizacao (critério DRY B)
     */
    public static void touchUpdate(Incident incident) {
        if (incident != null) {
            incident.setDataAtualizacao(LocalDateTime.now());
        }
    }
    
    /**
     * Construtor de filtros para busca (critério DRY C)
     */
    public static String buildSearchFilter(String termo) {
        if (termo == null || termo.trim().isEmpty()) {
            return null;
        }
        return termo.trim().toLowerCase();
    }
}
