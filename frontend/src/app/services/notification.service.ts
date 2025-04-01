import { Injectable } from '@angular/core';
import { io } from 'socket.io-client';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private socket = io(`${environment.apiUrl}`); 
  private notifications$ = new BehaviorSubject<string[]>([]);

  constructor() { }

  connect(userId: string) {
    this.socket.emit('join', userId);
    this.socket.on('newNotification', (notification: any) => {
      this.notifications$.next([...this.notifications$.value, notification.message]);
    });
  }

  getNotifications() {
    return this.notifications$.asObservable();
  }
}

