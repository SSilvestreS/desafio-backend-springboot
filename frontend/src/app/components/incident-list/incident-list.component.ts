import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';
import { IncidentService } from '../../services/incident.service';
import { Incident, Prioridade, Status } from '../../models/incident.model';
import { Page } from '../../models/page.model';
import { FormUtils } from '../../utils/form.utils';

@Component({
  selector: 'app-incident-list',
  templateUrl: './incident-list.component.html',
  styleUrls: ['./incident-list.component.css']
})
export class IncidentListComponent implements OnInit, OnDestroy {
  incidents: Incident[] = [];
  loading = false;
  error = '';
  
  // Paginação
  currentPage = 0;
  pageSize = 10;
  totalElements = 0;
  totalPages = 0;
  
  // Filtros
  filterForm: FormGroup;
  private filterSubject = new Subject<void>();
  private destroy$ = new Subject<void>();
  
  // Estatísticas
  stats = {
    total: 0,
    abertos: 0,
    emAndamento: 0,
    resolvidos: 0,
    cancelados: 0
  };
  
  prioridades = Object.values(Prioridade);
  statuses = Object.values(Status);
  
  // Modal de confirmação
  showDeleteModal = false;
  incidentToDelete: Incident | null = null;

  constructor(
    private incidentService: IncidentService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.filterForm = this.createFilterForm();
  }

  ngOnInit(): void {
    this.setupFilterSubscription();
    this.loadIncidents();
    this.loadStats();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  createFilterForm(): FormGroup {
    return this.fb.group({
      status: [''],
      prioridade: [''],
      q: [''], // busca textual
      tags: ['']
    });
  }

  setupFilterSubscription(): void {
    this.filterSubject
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(500),
        distinctUntilChanged()
      )
      .subscribe(() => {
        this.currentPage = 0;
        this.loadIncidents();
      });

    // Observar mudanças nos filtros
    this.filterForm.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.filterSubject.next();
      });
  }

  loadIncidents(): void {
    this.loading = true;
    this.error = '';

    const queryParams = FormUtils.buildQueryParams({
      page: this.currentPage,
      size: this.pageSize,
      ...this.filterForm.value
    });

    this.incidentService.getIncidents(queryParams).subscribe({
      next: (page: Page<Incident>) => {
        this.incidents = page.content;
        this.totalElements = page.totalElements;
        this.totalPages = page.totalPages;
        this.currentPage = page.number;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erro ao carregar incidentes';
        this.loading = false;
      }
    });
  }

  loadStats(): void {
    this.incidentService.getStats().subscribe({
      next: (stats) => {
        this.stats = stats;
      },
      error: (err) => {
        console.error('Erro ao carregar estatísticas:', err);
      }
    });
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadIncidents();
  }

  onPageSizeChange(size: number): void {
    this.pageSize = size;
    this.currentPage = 0;
    this.loadIncidents();
  }

  clearFilters(): void {
    this.filterForm.reset();
    this.currentPage = 0;
    this.loadIncidents();
  }

  createIncident(): void {
    this.router.navigate(['/incidents/new']);
  }

  editIncident(incident: Incident): void {
    this.router.navigate(['/incidents', incident.id, 'edit']);
  }

  viewIncident(incident: Incident): void {
    this.router.navigate(['/incidents', incident.id]);
  }

  deleteIncident(incident: Incident): void {
    this.incidentToDelete = incident;
    this.showDeleteModal = true;
  }

  confirmDelete(): void {
    if (this.incidentToDelete) {
      this.loading = true;
      this.incidentService.deleteIncident(this.incidentToDelete.id).subscribe({
        next: () => {
          this.loadIncidents();
          this.loadStats();
          this.showDeleteModal = false;
          this.incidentToDelete = null;
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Erro ao excluir incidente';
          this.loading = false;
        }
      });
    }
  }

  cancelDelete(): void {
    this.showDeleteModal = false;
    this.incidentToDelete = null;
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

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const start = Math.max(0, this.currentPage - 2);
    const end = Math.min(this.totalPages - 1, this.currentPage + 2);
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    return pages;
  }

  // Adicionar Math para uso no template
  Math = Math;
}
