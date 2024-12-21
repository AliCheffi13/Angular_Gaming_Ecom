import { Component, OnInit } from '@angular/core';
import { Product, ProductService } from '../product.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CartService } from '../cart.service';

@Component({
  selector: 'app-category-detail',
  standalone: true,
  imports: [CommonModule,RouterLink],
  templateUrl: './category-detail.component.html',
  styleUrls: ['./category-detail.component.css']
})
export class CategoryDetailComponent implements OnInit {
  categoryName: string = '';
  productsByCategory: Product[] = [];

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    // Récupérer la catégorie depuis l'URL
    this.route.params.subscribe((params) => {
      this.categoryName = params['categoryName'];
      this.loadProductsByCategory();
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

  // Ajouter un produit au panier
  addToCart(product: Product): void {
    this.cartService.addToCart(product);
  }
}
