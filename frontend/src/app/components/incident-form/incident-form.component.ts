import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { IncidentService } from '../../services/incident.service';
import { Incident, IncidentRequest, Prioridade, Status } from '../../models/incident.model';
import { FormUtils } from '../../utils/form.utils';

@Component({
  selector: 'app-incident-form',
  templateUrl: './incident-form.component.html',
  styleUrls: ['./incident-form.component.css']
})
export class IncidentFormComponent implements OnInit {
  incidentForm: FormGroup;
  isEditMode = false;
  incidentId: string | null = null;
  loading = false;
  error = '';
  success = '';

  prioridades = Object.values(Prioridade);
  statuses = Object.values(Status);

  constructor(
    private fb: FormBuilder,
    private incidentService: IncidentService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.incidentForm = this.createForm();
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id'] && params['id'] !== 'new') {
        this.isEditMode = true;
        this.incidentId = params['id'];
        this.loadIncident(this.incidentId!);
      }
    });
  }

  createForm(): FormGroup {
    return this.fb.group({
      titulo: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(120)]],
      descricao: ['', [Validators.maxLength(5000)]],
      prioridade: ['', Validators.required],
      status: ['', Validators.required],
      responsavelEmail: ['', [Validators.required, Validators.email]],
      tags: this.fb.array([])
    });
  }

  get tagsArray(): FormArray {
    return this.incidentForm.get('tags') as FormArray;
  }

  addTag(): void {
    this.tagsArray.push(this.fb.control('', [Validators.required, Validators.minLength(1)]));
  }

  removeTag(index: number): void {
    this.tagsArray.removeAt(index);
  }

  loadIncident(id: string): void {
    this.loading = true;
    this.incidentService.getIncident(id).subscribe({
      next: (incident: Incident) => {
        this.populateForm(incident);
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erro ao carregar incidente';
        this.loading = false;
      }
    });
  }

  populateForm(incident: Incident): void {
    // Limpar tags existentes
    while (this.tagsArray.length !== 0) {
      this.tagsArray.removeAt(0);
    }

    // Adicionar tags do incidente
    incident.tags.forEach(tag => {
      this.tagsArray.push(this.fb.control(tag, [Validators.required, Validators.minLength(1)]));
    });

    this.incidentForm.patchValue({
      titulo: incident.titulo,
      descricao: incident.descricao,
      prioridade: incident.prioridade,
      status: incident.status,
      responsavelEmail: incident.responsavelEmail
    });
  }

  onSubmit(): void {
    if (this.incidentForm.valid) {
      this.loading = true;
      this.error = '';
      this.success = '';

      const formData = FormUtils.normalizeForm(this.incidentForm);
      const incidentRequest: IncidentRequest = {
        titulo: formData.titulo,
        descricao: formData.descricao,
        prioridade: formData.prioridade,
        status: formData.status,
        responsavelEmail: formData.responsavelEmail,
        tags: formData.tags || []
      };

      if (this.isEditMode && this.incidentId) {
        this.incidentService.updateIncident(this.incidentId, incidentRequest).subscribe({
          next: () => {
            this.success = 'Incidente atualizado com sucesso!';
            this.loading = false;
            setTimeout(() => {
              this.router.navigate(['/incidents']);
            }, 2000);
          },
          error: (err) => {
            this.error = 'Erro ao atualizar incidente';
            this.loading = false;
          }
        });
      } else {
        this.incidentService.createIncident(incidentRequest).subscribe({
          next: () => {
            this.success = 'Incidente criado com sucesso!';
            this.loading = false;
            setTimeout(() => {
              this.router.navigate(['/incidents']);
            }, 2000);
          },
          error: (err) => {
            this.error = 'Erro ao criar incidente';
            this.loading = false;
          }
        });
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  markFormGroupTouched(): void {
    Object.keys(this.incidentForm.controls).forEach(key => {
      const control = this.incidentForm.get(key);
      if (control instanceof FormGroup) {
        this.markFormGroupTouched();
      } else {
        control?.markAsTouched();
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/incidents']);
  }

  getFieldError(fieldName: string): string {
    const field = this.incidentForm.get(fieldName);
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
      if (field.errors?.['email']) {
        return 'Email inválido';
      }
    }
    return '';
  }
}
