import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Club {
  id: number;
  name: string;
  description: string;
  presidentId: number;
  president: any | null;
  status: number;
  members: Member[];
  posts: any[] | null; 
  createdDate: string; 
  updatedDate: string | null;
  isDeleted: boolean;
}

export interface Member {
  id: number;
  studentId: number;
  clubId: number;
  isAdmin: boolean;
  isWriteable: boolean;
  isRemoveableMember: boolean;
  student: any | null;
  club: any | null;
  createdDate: string;
  updatedDate: string | null;
  isDeleted: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ClubService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/Clubs`;

  getAllClubs(): Observable<Club[]> {
    return this.http.get<Club[]>(this.apiUrl);
  }

  getClubById(id: number): Observable<Club> {
    return this.http.get<Club>(`${this.apiUrl}/${id}`);
  }

  
  getMyClubs(studentId: number): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/Students/student/${studentId}`);
  }

  joinClub(studentId: number, clubId: number): Observable<any> {
    const payload = {
      studentId: studentId,
      clubId: clubId
    };
    return this.http.post(`${environment.apiUrl}/ClubMembers/join`, payload);
  }

  getClubMembers(clubId: number): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/ClubMembers/${clubId}`);
  }

  updateMemberPermissions(payload: { id: number, updaterStudentId: number, isAdmin: boolean, isWriteable: boolean, isRemoveableMember: boolean }): Observable<any> {
    return this.http.put(`${environment.apiUrl}/ClubMembers/update-role`, payload);
  }

  createClub(payload: { name: string, description: string, presidentId: number }): Observable<number> {
    return this.http.post<number>(this.apiUrl, payload);
  }
}