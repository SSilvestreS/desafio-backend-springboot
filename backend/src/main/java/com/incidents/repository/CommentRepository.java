package com.incidents.repository;

import com.incidents.model.Comment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface CommentRepository extends JpaRepository<Comment, UUID> {
    
    // Buscar comentários por incidente
    Page<Comment> findByIncidentIdOrderByDataCriacaoDesc(UUID incidentId, Pageable pageable);
    
    // Buscar comentários por incidente (sem paginação)
    List<Comment> findByIncidentIdOrderByDataCriacaoDesc(UUID incidentId);
    
    // Contar comentários por incidente
    long countByIncidentId(UUID incidentId);
}
