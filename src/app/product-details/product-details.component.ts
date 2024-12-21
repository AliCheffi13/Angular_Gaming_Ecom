import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartService } from '../cart.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule,HttpClientModule,FormsModule],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css'
})
export class ProductDetailsComponent implements OnInit {
  product: any;
  cartOpen: boolean = false;
  selectedImage!: string; 
  products: any[] = [];
  quantity: number = 1;

  constructor(private route: ActivatedRoute, private http: HttpClient,private cartService: CartService) {}

  ngOnInit(): void {
    // Charger les données des produits depuis le fichier JSON
    this.http.get<any[]>('http://localhost:3000/products').subscribe(data => {
      console.log(data);  // Vérifier les données récupérées
      this.products = data;
      const id = String(this.route.snapshot.paramMap.get('id')); // Convertir l'ID en chaîne de caractères
      this.product = this.products.find(p => String(p.id) === id); // Comparer avec l'ID en chaîne de caractères
      
      if (this.product) {
        this.selectedImage = this.product.image;  // Définir l'image principale par défaut
      }
    });
  }

  changeImage(newImage: string) {
    this.selectedImage = newImage;  // Changer l'image principale quand on clique sur une miniature
  }

  addToCart(product: any) {
    this.cartService.addToCart(product, this.quantity); // Passer la quantité saisie
  }

  toggleCart() {
    this.cartOpen = !this.cartOpen;
  }
}