import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cart = new BehaviorSubject<any[]>(this.loadCartFromLocalStorage());
  cart$ = this.cart.asObservable();

  private productsUrl = 'http://localhost:3000'; // URL du serveur JSON

  constructor(private http: HttpClient) {}

  // Charger les produits depuis db.json
  getProducts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.productsUrl}/products`);
  }

  getTotalItemCount(): number {
    return this.cart.getValue().reduce((sum, item) => sum + item.quantity, 0);
  }

  // Charger le panier depuis db.json
  getCart(): Observable<any[]> {
    return this.http.get<any[]>(`${this.productsUrl}/cart`);
  }

  /**
   * Ajouter un produit au panier avec une quantité spécifique
   * @param product - Produit à ajouter
   * @param quantity - Quantité à ajouter
   */
  addToCart(product: any, quantity: number = 1) {
    const currentCart = this.cart.getValue();
    const existingProduct = currentCart.find((item) => item.id === product.id);

    if (existingProduct) {
      existingProduct.quantity += quantity; // Ajouter la quantité à l'existant
    } else {
      currentCart.push({ ...product, quantity }); // Ajouter avec la nouvelle quantité
    }

    this.cart.next(currentCart);
    this.saveCartToLocalStorage();
  }

  removeFromCart(index: number) {
    const currentCart = this.cart.getValue();
    currentCart.splice(index, 1);
    this.cart.next(currentCart);
    this.saveCartToLocalStorage();
  }

  clearCart() {
    this.cart.next([]);
    this.saveCartToLocalStorage();
  }

  private saveCartToLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(this.cart.getValue()));
  }

  private loadCartFromLocalStorage(): any[] {
    const storedCart = localStorage.getItem('cart');
    return storedCart ? JSON.parse(storedCart) : [];
  }
}
