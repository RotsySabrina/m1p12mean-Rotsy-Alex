import { Component, OnInit } from '@angular/core';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {
  notifications: string[] = [];

  constructor(private notificationService: NotificationService) { }

  ngOnInit() {
    const userId = "ID_DU_MANAGER"; // Remplace par l'ID du manager
    this.notificationService.connect(userId);

    this.notificationService.getNotifications().subscribe((messages) => {
      this.notifications = messages;
    });
  }
}
