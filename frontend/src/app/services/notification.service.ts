import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
// import { environment } from 'src/environments/environment';
import { environment } from 'src/environments/environment.prod';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private apiUrl = `${environment.apiUrl}/api/notifications`;
  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  // Récupérer les notifications non lues
  getUnreadNotifications(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/unread`, { headers: this.getHeaders() })
      .pipe(
        tap(notifications => {
          console.log('Notifications non lues:', notifications);
        })
      );
  }

  // Marquer les notifications comme lues
  markNotificationsAsRead(): Observable<any> {
    return this.http.put(`${this.apiUrl}/mark-as-read`, {}, { headers: this.getHeaders() });
  }
}
