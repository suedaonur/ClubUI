import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Post {
  id: number;
  clubId: number;
  clubName: string;
  title: string;
  content: string;
  createdDate: string;
  voteScore: number;
}

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/Posts`;

  getAllPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(this.apiUrl);
    
  }
  createPost(postData: { clubId: number, title: string, content: string }): Observable<any> {
    return this.http.post(this.apiUrl, postData);
  }

  deletePost(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  likePost(postId: number, studentId: number): Observable<any> {
    return this.http.post(`${environment.apiUrl}/Votes`, {
      studentId,
      postId,
      isUpvote: true
    });
  }
}