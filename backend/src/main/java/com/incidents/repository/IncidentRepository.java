package com.incidents.repository;

import com.incidents.model.Incident;
import com.incidents.model.enums.Prioridade;
import com.incidents.model.enums.Status;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface IncidentRepository extends JpaRepository<Incident, UUID> {
    
    // Busca por status
    Page<Incident> findByStatus(Status status, Pageable pageable);
    
    // Busca por prioridade
    Page<Incident> findByPrioridade(Prioridade prioridade, Pageable pageable);
    
    // Busca por responsável
    Page<Incident> findByResponsavelEmail(String responsavelEmail, Pageable pageable);
    
    // Busca por status e prioridade
    Page<Incident> findByStatusAndPrioridade(Status status, Prioridade prioridade, Pageable pageable);
    
    // Busca por título ou descrição (LIKE)
    @Query("SELECT i FROM Incident i WHERE LOWER(i.titulo) LIKE LOWER(CONCAT('%', :termo, '%')) OR LOWER(i.descricao) LIKE LOWER(CONCAT('%', :termo, '%'))")
    Page<Incident> findByTituloOrDescricaoContaining(@Param("termo") String termo, Pageable pageable);
    
    // Contagem por status
    long countByStatus(Status status);
    
    // Contagem por prioridade
    long countByPrioridade(Prioridade prioridade);
    
    // Contagem total
    @Query("SELECT COUNT(i) FROM Incident i")
    long countTotal();
}
