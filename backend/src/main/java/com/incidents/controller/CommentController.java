package com.incidents.controller;

import com.incidents.dto.CommentRequest;
import com.incidents.model.Comment;
import com.incidents.repository.CommentRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/comments")
@Tag(name = "Comentários", description = "Endpoints para gestão de comentários")
public class CommentController {
    
    private final CommentRepository commentRepository;
    
    public CommentController(CommentRepository commentRepository) {
        this.commentRepository = commentRepository;
    }
    
    @GetMapping("/incident/{incidentId}")
    @Cacheable(value = "commentsByIncident", key = "#incidentId")
    @Operation(summary = "Listar comentários por incidente", description = "Retorna comentários de um incidente específico")
    public ResponseEntity<List<Comment>> getCommentsByIncident(@PathVariable UUID incidentId) {
        List<Comment> comments = commentRepository.findByIncidentIdOrderByDataCriacaoDesc(incidentId);
        return ResponseEntity.ok(comments);
    }
    
    @PostMapping
    @CacheEvict(value = {"commentsByIncident", "incidentById"}, allEntries = true)
    @Operation(summary = "Criar comentário", description = "Cria um novo comentário")
    public ResponseEntity<Comment> createComment(@Valid @RequestBody CommentRequest request) {
        Comment comment = new Comment();
        comment.setIncidentId(request.getIncidentId());
        comment.setAutor(request.getAutor());
        comment.setMensagem(request.getMensagem());
        
        Comment savedComment = commentRepository.save(comment);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedComment);
    }
    
    @DeleteMapping("/{id}")
    @CacheEvict(value = {"commentsByIncident", "incidentById"}, allEntries = true)
    @Operation(summary = "Excluir comentário", description = "Exclui um comentário pelo ID")
    public ResponseEntity<Void> deleteComment(@PathVariable UUID id) {
        if (commentRepository.existsById(id)) {
            commentRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
