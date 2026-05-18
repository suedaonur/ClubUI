import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ChatResponse {
  answer: string;
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private apiUrl = `${environment.apiUrl}/Chat/ask`;

  constructor(private http: HttpClient) { }

  askQuestion(question: string): Observable<ChatResponse> {
    return this.http.post<ChatResponse>(this.apiUrl, { question });
  }
}
