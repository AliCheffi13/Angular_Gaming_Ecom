import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CartService } from '../cart.service';
import { CartComponent } from '../cart/cart.component';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule,CommonModule,CartComponent, HttpClientModule,],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit{
  @Input() cart: any[] = []; // Reçoit le panier du composant parent
  isOpen: boolean = false; // Contrôle l'état d'ouverture du panier
  @Input() cartOpenFromButton: boolean = false;
  totalItemCount: number = 0;

  toggleCart() {
    if (!this.cartOpenFromButton) {
      this.isOpen = !this.isOpen; // Permet d'ouvrir ou fermer uniquement si le bouton n'a pas ouvert
    }
  }
  constructor(private cartService: CartService) {}
  
  ngOnInit() {
    this.cartService.cart$.subscribe((cart) => {
      this.cart = cart;
      this.totalItemCount = this.cartService.getTotalItemCount(); // Calculer le total
    });
  }
}
