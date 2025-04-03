import {
  Component,
  Output,
  EventEmitter,
  Input,
  ViewEncapsulation,
  ViewChild
} from '@angular/core';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MaterialModule } from 'src/app/material.module';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { MatBadgeModule } from '@angular/material/badge';
import { NotificationService } from 'src/app/services/notification.service';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatMenu } from '@angular/material/menu';
import { AuthentificationService } from 'src/app/services/authentification.service';
@Component({
  selector: 'app-header',
  imports: [
    RouterModule,
    CommonModule,
    NgScrollbarModule,
    TablerIconsModule,
    MaterialModule,
    MatBadgeModule,
    MatMenuModule,
    MatButtonModule,
    MatMenu
  ],
  templateUrl: './header.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class HeaderComponent {
  @Input() showToggle: boolean = true; // Propriété d'entrée attendue
  @Output() toggleMobileNav = new EventEmitter<void>(); // Événement de sortie
  notifications: any[] = [];

  constructor(private notificationService: NotificationService) { }

  ngOnInit(): void {
    this.fetchNotifications();
  }

  fetchNotifications(): void {
    this.notificationService.getUnreadNotifications().subscribe(
      data => {
        console.log('Données de notification reçues :', data);
        this.notifications = data;
      },
      error => {
        console.error('Erreur lors de la récupération des notifications:', error);
      }
    );

  }

  markAllAsRead(): void {
    this.notificationService.markNotificationsAsRead().subscribe(
      () => {
        this.notifications = [];
      },
      error => {
        console.error('Erreur lors de la mise à jour des notifications:', error);
      }
    );
  }
}