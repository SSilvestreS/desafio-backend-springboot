import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Incident, IncidentRequest } from '../models/incident.model';
import { Page } from '../models/page.model';

@Injectable({
  providedIn: 'root'
})
export class IncidentService {
  constructor(private apiService: ApiService) {}

  getIncidents(params?: any): Observable<Page<Incident>> {
    return this.apiService.get<Page<Incident>>('/incidents', params);
  }

  getIncident(id: string): Observable<Incident> {
    return this.apiService.get<Incident>(`/incidents/${id}`);
  }

  createIncident(incident: IncidentRequest): Observable<Incident> {
    return this.apiService.post<Incident>('/incidents', incident);
  }

  updateIncident(id: string, incident: IncidentRequest): Observable<Incident> {
    return this.apiService.put<Incident>(`/incidents/${id}`, incident);
  }

  deleteIncident(id: string): Observable<void> {
    return this.apiService.delete<void>(`/incidents/${id}`);
  }

  updateStatus(id: string, status: string): Observable<Incident> {
    return this.apiService.patch<Incident>(`/incidents/${id}/status?status=${status}`, {});
  }

  getStats(): Observable<any> {
    return this.apiService.get<any>('/stats/incidents');
  }
}
