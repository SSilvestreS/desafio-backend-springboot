import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IncidentService } from '../../services/incident.service';
import { CommentService } from '../../services/comment.service';
import { Incident, Prioridade, Status } from '../../models/incident.model';
import { Comment, CommentRequest } from '../../models/comment.model';
import { FormUtils } from '../../utils/form.utils';

@Component({
  selector: 'app-incident-detail',
  templateUrl: './incident-detail.component.html',
  styleUrls: ['./incident-detail.component.css']
})
export class IncidentDetailComponent implements OnInit {
  incident: Incident | null = null;
  comments: Comment[] = [];
  loading = false;
  error = '';
  success = '';
  
  // Formulário de comentário
  commentForm: FormGroup;
  
  // Formulário de mudança de status
  statusForm: FormGroup;
  
  // Estados
  showStatusForm = false;
  showCommentForm = false;
  deletingComment: string | null = null;
  
  prioridades = Object.values(Prioridade);
  statuses = Object.values(Status);

  constructor(
    private incidentService: IncidentService,
    private commentService: CommentService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {
    this.commentForm = this.createCommentForm();
    this.statusForm = this.createStatusForm();
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.loadIncident(params['id']);
        this.loadComments(params['id']);
      }
    });
  }

  createCommentForm(): FormGroup {
    return this.fb.group({
      mensagem: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(2000)]]
    });
  }

  createStatusForm(): FormGroup {
    return this.fb.group({
      status: ['', Validators.required]
    });
  }

  loadIncident(id: string): void {
    this.loading = true;
    this.incidentService.getIncident(id).subscribe({
      next: (incident: Incident) => {
        this.incident = incident;
        this.statusForm.patchValue({ status: incident.status });
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erro ao carregar incidente';
        this.loading = false;
      }
    });
  }

  loadComments(incidentId: string): void {
    this.commentService.getCommentsByIncident(incidentId).subscribe({
      next: (comments: Comment[]) => {
        this.comments = comments.sort((a, b) => 
          new Date(b.dataCriacao).getTime() - new Date(a.dataCriacao).getTime()
        );
      },
      error: (err) => {
        console.error('Erro ao carregar comentários:', err);
      }
    });
  }

  onSubmitComment(): void {
    if (this.commentForm.valid && this.incident) {
      const commentData = FormUtils.normalizeForm(this.commentForm);
      const commentRequest: CommentRequest = {
        incidentId: this.incident.id,
        autor: 'Usuário Atual', // Em produção, pegar do serviço de auth
        mensagem: commentData.mensagem
      };

      this.commentService.createComment(commentRequest).subscribe({
        next: () => {
          this.commentForm.reset();
          this.loadComments(this.incident!.id);
          this.success = 'Comentário adicionado com sucesso!';
          setTimeout(() => this.success = '', 3000);
        },
        error: (err) => {
          this.error = 'Erro ao adicionar comentário';
          setTimeout(() => this.error = '', 3000);
        }
      });
    }
  }

  onSubmitStatus(): void {
    if (this.statusForm.valid && this.incident) {
      const newStatus = this.statusForm.get('status')?.value;
      
      const updateData = {
        ...this.incident,
        status: newStatus
      };

      this.incidentService.updateIncident(this.incident.id, updateData).subscribe({
        next: () => {
          this.loadIncident(this.incident!.id);
          this.showStatusForm = false;
          this.success = 'Status atualizado com sucesso!';
          setTimeout(() => this.success = '', 3000);
        },
        error: (err) => {
          this.error = 'Erro ao atualizar status';
          setTimeout(() => this.error = '', 3000);
        }
      });
    }
  }

  deleteComment(commentId: string): void {
    this.deletingComment = commentId;
    this.commentService.deleteComment(commentId).subscribe({
      next: () => {
        this.loadComments(this.incident!.id);
        this.deletingComment = null;
        this.success = 'Comentário excluído com sucesso!';
        setTimeout(() => this.success = '', 3000);
      },
      error: (err) => {
        this.error = 'Erro ao excluir comentário';
        this.deletingComment = null;
        setTimeout(() => this.error = '', 3000);
      }
    });
  }

  editIncident(): void {
    this.router.navigate(['/incidents', this.incident!.id, 'edit']);
  }

  goBack(): void {
    this.router.navigate(['/incidents']);
  }

  toggleStatusForm(): void {
    this.showStatusForm = !this.showStatusForm;
  }

  toggleCommentForm(): void {
    this.showCommentForm = !this.showCommentForm;
  }

  getPriorityClass(prioridade: Prioridade): string {
    switch (prioridade) {
      case Prioridade.ALTA: return 'priority-high';
      case Prioridade.MEDIA: return 'priority-medium';
      case Prioridade.BAIXA: return 'priority-low';
      default: return '';
    }
  }

  getStatusClass(status: Status): string {
    switch (status) {
      case Status.ABERTA: return 'status-open';
      case Status.EM_ANDAMENTO: return 'status-in-progress';
      case Status.RESOLVIDA: return 'status-resolved';
      case Status.CANCELADA: return 'status-cancelled';
      default: return '';
    }
  }

  formatDate(date: string): string {
    return FormUtils.formatDate(date);
  }

  getFieldError(fieldName: string): string {
    const field = this.commentForm.get(fieldName);
    if (field?.invalid && field?.touched) {
      if (field.errors?.['required']) {
        return 'Campo obrigatório';
      }
      if (field.errors?.['minlength']) {
        return `Mínimo de ${field.errors['minlength'].requiredLength} caracteres`;
      }
      if (field.errors?.['maxlength']) {
        return `Máximo de ${field.errors['maxlength'].requiredLength} caracteres`;
      }
    }
    return '';
  }
}
