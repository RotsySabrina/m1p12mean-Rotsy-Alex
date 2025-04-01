import { Component, OnInit } from '@angular/core';
import { CoreService } from 'src/app/services/core.service';
import { AuthentificationService } from '../../../services/authentification.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'src/app/material.module';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-side-register',
  standalone: true,
  imports: [RouterModule, MaterialModule, FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './side-register.component.html',
  styleUrls: ['./side-register.component.css'],
})
export class AppSideRegisterComponent implements OnInit {
  options = this.settings.getOptions();
  form!: FormGroup;

  constructor(
    private settings: CoreService,
    private authService: AuthentificationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      nom: new FormControl('', [Validators.required, Validators.minLength(3)]),
      prenom: new FormControl('', [Validators.required, Validators.minLength(3)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      mot_de_passe: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
      role: new FormControl('', [Validators.required]),
    });
  }

  get f() {
    return this.form.controls;
  }

  submit() {
    if (this.form.invalid) {
      console.log('Formulaire invalide');
      return;
    }

    this.authService.register(this.form.value).subscribe({
      next: (response) => {
        console.log('Inscription réussie:', response);
        this.router.navigate(['/authentication/login']); // Redirection après succès
      },
      error: (err) => {
        console.error("Erreur d'inscription:", err.error.message);
      },
    });
  }
}
