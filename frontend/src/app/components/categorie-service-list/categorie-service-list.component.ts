import { Component, OnInit } from '@angular/core';
import { CategorieServiceService } from '../../services/categorie-service.service';

@Component({
  selector: 'app-categorie-service-list',
  imports: [],
  templateUrl: './categorie-service-list.component.html',
  styleUrl: './categorie-service-list.component.css'
})
export class CategorieServiceListComponent implements OnInit {

  categories: any[] = [];
  constructor(private categorieService: CategorieServiceService) { }
  ngOnInit(): void {
    this.loadCategories();
  }
  loadCategories(): void {
    this.categorieService.getCategories().subscribe(data => this.categories =
      data);
  }
  // deleteArticle(id: string): void {
  //   this.articleService.deleteArticle(id).subscribe(() =>
  //     this.loadArticles());
  // }


}
