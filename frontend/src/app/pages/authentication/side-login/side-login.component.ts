import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthentificationService } from '../../../services/authentification.service';
import { MaterialModule } from 'src/app/material.module';


@Component({
  selector: 'app-side-login',
  standalone: true, // Ajout de `standalone: true`
  templateUrl: './side-login.component.html',
  // styleUrls: ['./side-login.component.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MaterialModule
  ]
})
export class AppSideLoginComponent implements OnInit {

  loginForm!: FormGroup;

  constructor(private authService: AuthentificationService, private router: Router) { }

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      mot_de_passe: new FormControl('', [Validators.required, Validators.minLength(6)])
    });
  }

  login(): void {
    if (this.loginForm.invalid) {
      console.log("Formulaire invalide");
      return;
    }

    this.authService.login(this.loginForm.value).subscribe({
      next: (response) => {
        this.authService.saveToken(response.token);
        console.log('Connexion réussie');
        this.router.navigate(['/dashboard']); // Redirection après connexion
      },
      error: (err) => {
        console.error('Erreur de connexion:', err.error.message);
      }
    });
  }
}
