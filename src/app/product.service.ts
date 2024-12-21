import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

export interface Product {
  id: string;
  name: string;
  brand:string;
  price: number;
  category: string;
  reference: string;
  description: string;
  image:string;
  images: string[];  // An array of image URLs
}


@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl = 'http://localhost:3000/products';

  constructor(private http: HttpClient) {}

  // Récupérer tous les produits
  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }

  // Ajouter un produit
  addProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, product);
  }

  // Mettre à jour un produit
  updateProduct(product: Product): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${product.id}`, product);
  }

  // Supprimer un produit
  deleteProduct(id: string): Observable<void> {
    const url = `${this.apiUrl}/${id}`;
    console.log('Suppression URL :', url);

    if (!id) {
      console.error('Erreur : ID non valide.');
      return throwError(() => new Error('ID non valide.'));
    }

    return this.http.delete<void>(url);
  }
}
