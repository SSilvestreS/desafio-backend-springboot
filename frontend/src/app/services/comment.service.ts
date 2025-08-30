import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Comment, CommentRequest } from '../models/comment.model';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private readonly baseUrl = '/comments';

  constructor(private apiService: ApiService) {}

  getCommentsByIncident(incidentId: string): Observable<Comment[]> {
    return this.apiService.get<Comment[]>(`${this.baseUrl}/incident/${incidentId}`);
  }

  getComment(id: string): Observable<Comment> {
    return this.apiService.get<Comment>(`${this.baseUrl}/${id}`);
  }

  createComment(commentRequest: CommentRequest): Observable<Comment> {
    return this.apiService.post<Comment>(this.baseUrl, commentRequest);
  }

  updateComment(id: string, commentRequest: CommentRequest): Observable<Comment> {
    return this.apiService.put<Comment>(`${this.baseUrl}/${id}`, commentRequest);
  }

  deleteComment(id: string): Observable<void> {
    return this.apiService.delete(`${this.baseUrl}/${id}`);
  }
}
