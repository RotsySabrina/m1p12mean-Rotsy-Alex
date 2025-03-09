import { Component, OnInit } from '@angular/core';
import { CategorieServiceService } from '../../services/categorie-service.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-categorie-service-list',
  imports: [CommonModule, FormsModule],
  templateUrl: './categorie-service-list.component.html',
  styleUrl: './categorie-service-list.component.css'
})
export class CategorieServiceListComponent implements OnInit {

  newCategorie = { description: '' };

  categories: any[] = [];
  constructor(private categorieService: CategorieServiceService) { }
  ngOnInit(): void {
    this.loadCategories();
  }
  loadCategories(): void {
    this.categorieService.getCategories().subscribe(data => this.categories =
      data);
  }

  addCategorie(): void {
    if (this.newCategorie.description) {
      this.categorieService.addCategorie(this.newCategorie).subscribe(() => {
        this.loadCategories(); // Recharge la liste après ajout
        this.newCategorie = { description: '' }; // Réinitialise le formulaire
      });
    }
  }


  // deleteArticle(id: string): void {
  //   this.articleService.deleteArticle(id).subscribe(() =>
  //     this.loadArticles());
  // }


}
