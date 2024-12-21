import { Component, OnInit } from '@angular/core';
import { Product, ProductService } from '../product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {
  categories: { name: string, image: string }[] = [
    { name: 'Laptops', image: 'assets/pc.jpg' },
    { name: 'Souris', image: 'assets/Souris.jpg' },
    { name: 'Claviers', image: 'assets/clavier.jpg' },
    { name: 'Casques', image: 'assets/Casques.jpg' }
  ]; // Liste des catégories disponibles
  categoryName: string = '';
  productsByCategory: Product[] = [];

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Vérifier si une catégorie est définie dans l'URL
    this.route.params.subscribe((params) => {
      if (params['categoryName']) {
        this.categoryName = params['categoryName'];
        this.loadProductsByCategory();
      }
    });
  }

  // Charger les produits en fonction de la catégorie
  loadProductsByCategory(): void {
    this.productService.getProducts().subscribe((products) => {
      this.productsByCategory = products.filter(
        (product) => product.category === this.categoryName
      );
    });
  }

  // Fonction pour rediriger vers la page d'une catégorie spécifique
  navigateToCategory(category: string): void {
    this.router.navigate(['/category', category]);
  }
}
