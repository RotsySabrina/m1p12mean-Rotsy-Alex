import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AlerteService {
  private messageSource = new BehaviorSubject<string | null>(null);
  message$ = this.messageSource.asObservable();
  private isSuccess = true;

  constructor(private http: HttpClient) { }

  showMessage(msg: string, success: boolean) {
    this.isSuccess = success;
    this.messageSource.next(msg);
    setTimeout(() => this.messageSource.next(null), 3000); // Cache après 3 secondes
  }

  getSuccessStatus(): boolean {
    return this.isSuccess;
  }
}
